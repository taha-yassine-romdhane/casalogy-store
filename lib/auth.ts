import jwt from 'jsonwebtoken'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'CLIENT' | 'ADMIN'
  isStudent: boolean
  studentVerified: boolean
}

export interface JWTPayload {
  userId: string
  email: string
  role: 'CLIENT' | 'ADMIN'
  iat?: number
  exp?: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  console.log('Generating token with secret:', JWT_SECRET ? 'SECRET_SET' : 'SECRET_MISSING')
  console.log('Token payload:', payload)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  console.log('Generated token:', token.substring(0, 50) + '...')
  return token
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log('Verifying token with secret:', JWT_SECRET ? 'SECRET_SET' : 'SECRET_MISSING')
    const result = jwt.verify(token, JWT_SECRET) as JWTPayload
    console.log('Token verification successful:', result)
    return result
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Edge-compatible version for middleware
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    console.log('Verifying token (Edge) with secret:', JWT_SECRET ? 'SECRET_SET' : 'SECRET_MISSING')
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    console.log('Edge token verification successful:', payload)
    return payload as JWTPayload
  } catch (error) {
    console.error('Edge token verification failed:', error)
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return null
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as 'CLIENT' | 'ADMIN',
      isStudent: user.isStudent,
      studentVerified: user.studentVerified
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  try {
    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as 'CLIENT' | 'ADMIN',
      isStudent: user.isStudent,
      studentVerified: user.studentVerified
    }
  } catch (error) {
    console.error('Token validation error:', error)
    return null
  }
}