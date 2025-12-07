const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create Roles with standardized uppercase snake_case names
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: { name: "SUPER_ADMIN" },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const memberRole = await prisma.role.upsert({
    where: { name: "MEMBER" },
    update: {},
    create: { name: "MEMBER" },
  });

  console.log("Roles created:", superAdminRole, adminRole, memberRole);

  // Create Super Admin User
  // Password should be hashed. Using 'password123' for now.
  const hashedPassword = await bcrypt.hash("password123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@satudata.com" },
    update: { status: "VERIFIED" },
    create: {
      email: "superadmin@satudata.com",
      password: hashedPassword,
      name: "SUPER_ADMIN",
      roleId: superAdminRole.id,
      status: "VERIFIED",
    },
  });

  console.log("Super Admin created:", superAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
