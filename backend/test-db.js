import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com'
      }
    });
    console.log('✅ Test user created:', testUser);
    
    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
