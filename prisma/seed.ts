import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'admin',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@example.com',
      password: await bcrypt.hash('User@123', 10),
      role: 'user',
    },
  });

  const guestUser = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      name: 'Guest User',
      email: 'guest@example.com',
      password: await bcrypt.hash('Guest@123', 10),
      role: 'guest',
    },
  });

  // Create products
  const product1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Product 1',
      description: 'Description for product 1',
      price: 19.99,
      stock: 100,
      createdBy: adminUser.id,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Product 2',
      description: 'Description for product 2',
      price: 29.99,
      stock: 50,
      createdBy: adminUser.id,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Product 3',
      description: 'Description for product 3',
      price: 39.99,
      stock: 25,
      createdBy: regularUser.id,
    },
  });

  console.log({ adminUser, regularUser, guestUser, product1, product2, product3 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
