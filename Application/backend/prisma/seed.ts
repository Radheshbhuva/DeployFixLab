import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DeployFix Lab database seed for RBAC...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const demoUsers = [
    {
      email: 'student@deployfix.lab',
      name: 'Student Engineer',
      role: Role.STUDENT,
    },
    {
      email: 'instructor@deployfix.lab',
      name: 'Lead Instructor SRE',
      role: Role.INSTRUCTOR,
    },
    {
      email: 'admin@deployfix.lab',
      name: 'Platform Commander',
      role: Role.ADMIN,
    },
  ];

  for (const user of demoUsers) {
    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
      },
    });

    console.log(`✅ Seeded user: ${upserted.name} (${upserted.email}) -> Role: [${upserted.role}]`);
  }

  // Seed sample audit log
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@deployfix.lab' } });
  if (adminUser) {
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: 'SYSTEM_INITIALIZATION',
        resource: 'PLATFORM',
        details: { message: 'Database seeded with default RBAC roles and users' },
      },
    });
  }

  console.log('✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
