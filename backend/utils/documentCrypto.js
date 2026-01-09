/**
 * Cryptographic utilities for document verification
 * Provides hash generation, HMAC signature creation, and verification
 */

const crypto = require("crypto");

// Get signing secret from environment
const SIGNING_SECRET =
  process.env.DOCUMENT_SIGNING_SECRET || "default-dev-secret-change-in-prod";

/**
 * Generate SHA-256 hash of a buffer
 * @param {Buffer} buffer - File buffer to hash
 * @returns {string} Hex-encoded SHA-256 hash
 */
function generateHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Create HMAC-SHA256 signature
 * @param {string} hash - Hash to sign
 * @param {string} secret - Secret key for HMAC (defaults to env variable)
 * @returns {string} Hex-encoded HMAC signature
 */
function createSignature(hash, secret = SIGNING_SECRET) {
  return crypto.createHmac("sha256", secret).update(hash).digest("hex");
}

/**
 * Verify HMAC signature using constant-time comparison
 * @param {string} hash - Original hash
 * @param {string} signature - Signature to verify
 * @param {string} secret - Secret key for HMAC (defaults to env variable)
 * @returns {boolean} True if signature is valid
 */
function verifySignature(hash, signature, secret = SIGNING_SECRET) {
  const expectedSignature = createSignature(hash, secret);

  // Constant-time comparison to prevent timing attacks
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

/**
 * Generate hash from file path
 * @param {string} filePath - Path to file
 * @returns {Promise<string>} Hex-encoded SHA-256 hash
 */
async function generateHashFromFile(filePath) {
  const fs = require("fs");
  const buffer = fs.readFileSync(filePath);
  return generateHash(buffer);
}

module.exports = {
  generateHash,
  createSignature,
  verifySignature,
  generateHashFromFile,
  SIGNING_SECRET,
};
