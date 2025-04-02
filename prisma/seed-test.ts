import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const testAdmin = await prisma.user.upsert({
    where: { email: 'test-admin@example.com' },
    update: {},
    create: {
      name: 'Test Admin',
      email: 'test-admin@example.com',
      password: await bcrypt.hash('TestAdmin@123', 10),
      role: 'admin',
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'test-user@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test-user@example.com',
      password: await bcrypt.hash('TestUser@123', 10),
      role: 'user',
    },
  });

  // Create test products
  const testProduct1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test Product 1',
      description: 'Test description for product 1',
      price: 19.99,
      stock: 100,
      createdBy: testAdmin.id,
    },
  });

  const testProduct2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Test Product 2',
      description: 'Test description for product 2',
      price: 29.99,
      stock: 50,
      createdBy: testUser.id,
    },
  });

  console.log({ testAdmin, testUser, testProduct1, testProduct2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
