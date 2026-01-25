import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')

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

    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Check if customer exists and is not an admin
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: { role: true, isActive: true }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    if (customer.role === 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate admin users' },
        { status: 400 }
      )
    }

    // Toggle account activation status
    const newActiveStatus = !customer.isActive
    
    await prisma.user.update({
      where: { id: customerId },
      data: {
        isActive: newActiveStatus
      }
    })

    return NextResponse.json({
      success: true,
      message: newActiveStatus ? 'Customer account activated successfully' : 'Customer account deactivated successfully',
      isActive: newActiveStatus
    })

  } catch (error) {
    console.error('Customer deactivation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update customer status' },
      { status: 500 }
    )
  } finally {
  }
}