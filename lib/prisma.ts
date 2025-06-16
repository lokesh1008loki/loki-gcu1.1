import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  // Skip database connection during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new PrismaClient({
      log: ['error'],
      datasources: {
        db: {
          url: 'file:./dev.db' // Dummy URL for build
        }
      }
    })
  }

  // Normal initialization for runtime
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

// Only attempt connection if not in build phase
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  prisma.$connect().catch((error: Error) => {
    console.error('Failed to connect to database:', error)
    // Don't exit process during build
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
      process.exit(1)
    }
  })
} 