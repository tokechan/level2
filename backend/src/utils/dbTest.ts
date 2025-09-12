import { prisma } from '../lib/prisma.js';

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if users table is empty and seed with sample data
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      console.log('🌱 Seeding database with sample data...');
      
      await prisma.user.createMany({
        data: [
          {
            name: 'John Doe',
            email: 'john.doe@example.com'
          },
          {
            name: 'Jane Smith',
            email: 'jane.smith@example.com'
          }
        ]
      });
      
      console.log('✅ Database seeded successfully');
    } else {
      console.log('📊 Database already contains data');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};
