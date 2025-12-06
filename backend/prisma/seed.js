const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: {},
    create: { name: "Super Admin" },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  console.log("Roles created:", superAdminRole, adminRole);

  // Create Super Admin User
  // Password should be hashed. Using 'password123' for now.
  const hashedPassword = await bcrypt.hash("password123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@satudata.com" },
    update: { status: "VERIFIED" },
    create: {
      email: "superadmin@satudata.com",
      password: hashedPassword,
      name: "Super Admin",
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
