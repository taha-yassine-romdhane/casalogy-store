import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get students pending verification
    const pendingStudents = await prisma.user.findMany({
      where: {
        isStudent: true,
        studentVerified: false,
        OR: [
          { studentIdFront: { not: null } },
          { studentIdBack: { not: null } }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        faculty: true,
        studentIdFront: true,
        studentIdBack: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get verified students (for reference)
    const verifiedStudents = await prisma.user.findMany({
      where: {
        isStudent: true,
        studentVerified: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        faculty: true,
        studentVerifiedAt: true
      },
      orderBy: {
        studentVerifiedAt: 'desc'
      },
      take: 10 // Last 10 verified students
    })

    return NextResponse.json({
      success: true,
      pending: pendingStudents,
      verified: verifiedStudents
    })

  } catch (error) {
    console.error('Student verification fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student verification data' },
      { status: 500 }
    )
  } finally {
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const adminUserId = payload.userId as string

    if (!adminUserId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: { role: true }
    })

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { studentId, action } = body

    if (!studentId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Approve student verification
      await prisma.user.update({
        where: { id: studentId },
        data: {
          studentVerified: true,
          studentVerifiedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Student verification approved successfully'
      })
    } else {
      // Reject student verification (remove uploaded documents and reset student status)
      await prisma.user.update({
        where: { id: studentId },
        data: {
          studentVerified: false,
          studentIdFront: null,
          studentIdBack: null,
          isStudent: false,
          faculty: null
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Student verification rejected'
      })
    }

  } catch (error) {
    console.error('Student verification action error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process student verification' },
      { status: 500 }
    )
  } finally {
  }
}