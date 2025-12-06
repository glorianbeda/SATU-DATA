const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

module.exports = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role is MEMBER (id: 3)
    const DEFAULT_MEMBER_ROLE_ID = 3;

    // Create user with PENDING status
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: DEFAULT_MEMBER_ROLE_ID,
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Registration successful. Your account is pending approval.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
