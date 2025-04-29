const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    const testUser = {
      name: 'Test User 2',
      email: 'test2@example.com',
      password: await hash('test123', 12),
      role: 'user'
    }

    console.log('User data:', { ...testUser, password: '[HASHED]' })

    const user = await prisma.user.create({
      data: testUser
    })

    console.log('User created successfully:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    })

  } catch (error) {
    console.error('Error creating user:', error)
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

createTestUser() 