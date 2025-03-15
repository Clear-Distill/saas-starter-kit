const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearSessions() {
  try {
    // Delete all sessions
    const deletedSessions = await prisma.session.deleteMany({});
    console.log(`Deleted ${deletedSessions.count} sessions`);
    
    console.log('All sessions have been cleared. Please log in again to create a new session.');
  } catch (error) {
    console.error('Error clearing sessions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearSessions();
