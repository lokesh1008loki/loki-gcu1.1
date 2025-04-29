import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add error handling middleware
prisma.$use(async (params: any, next: any) => {
  try {
    return await next(params)
  } catch (error) {
    console.error('Prisma error:', {
      model: params.model,
      action: params.action,
      args: params.args,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    })
    throw error
  }
})

// Add connection error handling
prisma.$connect().catch((error: Error) => {
  console.error('Failed to connect to database:', error)
  process.exit(1)
}) 