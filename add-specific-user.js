const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const prisma = new PrismaClient();

async function addSpecificUser() {
  try {
    const userId = '68eae8fb-baa2-44c4-b961-b324f7ad1168';
    const email = 'specific-user@example.com';
    const password = await hash('password123', 12);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    
    if (existingUser) {
      console.log(`User with ID ${userId} already exists.`);
      return;
    }
    
    // Create user with specific ID
    const user = await prisma.user.create({
      data: {
        id: userId,
        name: 'Specific User',
        email,
        password,
        emailVerified: new Date(),
      },
    });
    
    console.log(`Created user with ID: ${user.id}, Email: ${user.email}`);
    console.log('You can now use this user to create teams.');
    
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSpecificUser();
