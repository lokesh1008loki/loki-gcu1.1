const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testSession() {
  try {
    // Get all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    console.log('Users in database:', users)

    // Get the first user's session data
    if (users.length > 0) {
      const user = users[0]
      console.log('\nTesting session data for user:', user.email)
      
      // Verify the user exists
      const foundUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      
      console.log('User found in database:', foundUser ? 'Yes' : 'No')
    } else {
      console.log('No users found in the database')
    }
  } catch (error) {
    console.error('Error testing session:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSession() 