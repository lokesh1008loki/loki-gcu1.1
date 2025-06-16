/**
 * Environment variable validation utility
 * This file helps validate required environment variables and provides fallbacks
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

/**
 * Get an environment variable with validation
 * @param key - The environment variable key
 * @param fallback - Optional fallback value for production
 * @returns The environment variable value
 * @throws Error in development if the variable is not set
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key]

  if (!value) {
    if (isBuild) {
      // During build, use fallback or empty string
      console.warn(`Warning: ${key} not set during build, using fallback`)
      return fallback || ''
    }

    if (isDevelopment) {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
        `Please add it to your .env.local file:\n` +
        `${key}=your-value-here`
      )
    }
    
    if (fallback) {
      console.warn(`Warning: ${key} not set, using fallback value`)
      return fallback
    }
    
    throw new Error(`Required environment variable ${key} is not set`)
  }

  return value
}

/**
 * Get JWT secret with validation
 * @returns The JWT secret
 */
export function getJwtSecret(): string {
  return getEnvVar('JWT_SECRET', isDevelopment ? 'dev-jwt-secret' : undefined)
}

/**
 * Get NextAuth secret with validation
 * @returns The NextAuth secret
 */
export function getNextAuthSecret(): string {
  return getEnvVar('NEXTAUTH_SECRET', isDevelopment ? 'dev-nextauth-secret' : undefined)
}

/**
 * Get database URL with validation
 * @returns The database URL
 */
export function getDatabaseUrl(): string {
  return getEnvVar('DATABASE_URL', isBuild ? 'file:./dev.db' : undefined)
}

/**
 * Get NextAuth URL with validation
 * @returns The NextAuth URL
 */
export function getNextAuthUrl(): string {
  return getEnvVar('NEXTAUTH_URL', isDevelopment ? 'http://localhost:3000' : undefined)
} 