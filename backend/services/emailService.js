const { Resend } = require("resend");

// Singleton Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory rate limiter (for production, use Redis)
const emailRateLimiter = new Map();

// Rate limit configuration
const RATE_LIMIT = {
  maxEmailsPerUser: 3, // Max emails per user per time window
  windowMs: 60 * 60 * 1000, // 1 hour window
  cooldownMs: 5 * 60 * 1000, // 5 minute cooldown between same email type
};

/**
 * Clean up old rate limit entries
 */
const cleanupRateLimiter = () => {
  const now = Date.now();
  for (const [key, value] of emailRateLimiter.entries()) {
    if (now - value.windowStart > RATE_LIMIT.windowMs) {
      emailRateLimiter.delete(key);
    }
  }
};

// Cleanup every 10 minutes
setInterval(cleanupRateLimiter, 10 * 60 * 1000);

/**
 * Check if email can be sent (rate limit check)
 * @param {string} email - Recipient email
 * @param {string} type - Email type (verification, notification, etc.)
 * @returns {{ allowed: boolean, error?: string, retryAfter?: number }}
 */
const canSendEmail = (email, type = "general") => {
  const key = `${email}:${type}`;
  const now = Date.now();
  const record = emailRateLimiter.get(key);

  if (!record) {
    return { allowed: true };
  }

  // Check cooldown between same email type
  if (now - record.lastSent < RATE_LIMIT.cooldownMs) {
    const retryAfter = Math.ceil(
      (RATE_LIMIT.cooldownMs - (now - record.lastSent)) / 1000
    );
    return {
      allowed: false,
      error: `Please wait ${retryAfter} seconds before requesting another email`,
      retryAfter,
    };
  }

  // Check rate limit window
  if (now - record.windowStart > RATE_LIMIT.windowMs) {
    // Window expired, allow
    return { allowed: true };
  }

  // Check if within limit
  if (record.count >= RATE_LIMIT.maxEmailsPerUser) {
    const retryAfter = Math.ceil(
      (RATE_LIMIT.windowMs - (now - record.windowStart)) / 1000
    );
    return {
      allowed: false,
      error: `Email rate limit exceeded. Please try again later.`,
      retryAfter,
    };
  }

  return { allowed: true };
};

/**
 * Record that an email was sent
 * @param {string} email - Recipient email
 * @param {string} type - Email type
 */
const recordEmailSent = (email, type = "general") => {
  const key = `${email}:${type}`;
  const now = Date.now();
  const record = emailRateLimiter.get(key);

  if (!record || now - record.windowStart > RATE_LIMIT.windowMs) {
    emailRateLimiter.set(key, {
      count: 1,
      windowStart: now,
      lastSent: now,
    });
  } else {
    record.count++;
    record.lastSent = now;
    emailRateLimiter.set(key, record);
  }
};

/**
 * Send email with anti-spam protection
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} options.type - Email type for rate limiting (default: "general")
 * @param {string} options.from - Sender email (default: onboarding@resend.dev)
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
const sendEmail = async ({
  to,
  subject,
  html,
  type = "general",
  from = "onboarding@resend.dev",
}) => {
  // Check rate limit
  const rateCheck = canSendEmail(to, type);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: rateCheck.error,
      rateLimited: true,
      retryAfter: rateCheck.retryAfter,
    };
  }

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    // Record successful send
    recordEmailSent(to, type);

    return { success: true, data: result };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};

/**
 * Send verification email
 * @param {string} email - Recipient email
 * @param {string} name - User name
 * @param {string} verificationToken - Verification token
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
const sendVerificationEmail = async (email, name, verificationToken) => {
  const verificationUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5174"
  }/verify-email?token=${verificationToken}`;

  return sendEmail({
    to: email,
    subject: "Verify your email - Satu Data+",
    type: "verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Satu Data+!</h1>
        <p>Hi ${name},</p>
        <p>Your account has been approved. Please verify your email by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Verify Email</a>
        <p>Or copy and paste this link:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">This link will expire in 24 hours. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

/**
 * Send loan status change notification email
 * @param {string} email - Recipient email
 * @param {string} name - User name
 * @param {string} assetName - Asset name
 * @param {string} status - New loan status
 * @param {string} type - Notification type (loan_status)
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
const sendLoanNotificationEmail = async (
  email,
  name,
  assetName,
  status,
  type = "loan_status"
) => {
  const statusMessages = {
    APPROVED: "Your loan request has been approved",
    REJECTED: "Your loan request has been rejected",
    BORROWED: "You have successfully borrowed the asset",
    RETURNED: "Your loan has been completed and asset returned",
    OVERDUE:
      "Your loan is overdue. Please return the asset as soon as possible",
  };

  const subject = `Loan Status Update: ${status}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Loan Status Update</h1>
      <p>Hi ${name},</p>
      <p>${
        statusMessages[status] ||
        `Your loan status has been updated to: ${status}`
      }</p>
      <p><strong>Asset:</strong> ${assetName}</p>
      <p><strong>Status:</strong> ${status}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">This is an automated notification from Satu Data+ Inventory System.</p>
      <p style="color: #999; font-size: 12px;">If you have any questions, please contact your administrator.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    type,
  });
};

module.exports = {
  resend,
  sendEmail,
  sendVerificationEmail,
  sendLoanNotificationEmail,
  canSendEmail,
};
