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

  const koordinatorInventarisRole = await prisma.role.upsert({
    where: { name: "KOORDINATOR_INVENTARIS" },
    update: {},
    create: { name: "KOORDINATOR_INVENTARIS" },
  });

  console.log(
    "Roles created:",
    superAdminRole,
    adminRole,
    memberRole,
    koordinatorInventarisRole
  );

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

  // Create default Asset Categories
  const categories = [
    { name: "Elektronik", code: "ELEKTRONIK" },
    { name: "Furniture", code: "FURNITURE" },
    { name: "Kendaraan", code: "KENDARAAN" },
    { name: "Peralatan Kantor", code: "PERALATAN_KANTOR" },
    { name: "Perlengkapan Audio Visual", code: "AUDIO_VISUAL" },
    { name: "Lainnya", code: "LAINNYA" },
  ];

  for (const cat of categories) {
    await prisma.assetCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    });
  }

  console.log("Asset categories seeded:", categories.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
