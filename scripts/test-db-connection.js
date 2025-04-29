const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('Database connection successful')
    
    // Test query
    const users = await prisma.user.findMany({
      take: 1
    })
    console.log('Test query successful:', users)
    
  } catch (error) {
    console.error('Database connection error:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 