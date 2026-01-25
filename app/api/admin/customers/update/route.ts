import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')

export async function PUT(request: NextRequest) {
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
    const {
      customerId,
      firstName,
      lastName,
      email,
      phone,
      address,
      region,
      isVerified
    } = body

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Basic validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if customer exists and is not an admin
    const existingCustomer = await prisma.user.findUnique({
      where: { id: customerId },
      select: { role: true, email: true }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    if (existingCustomer.role === 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Cannot edit admin users' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    if (existingCustomer.email !== email) {
      const emailTaken = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          id: { not: customerId }
        }
      })

      if (emailTaken) {
        return NextResponse.json(
          { success: false, error: 'Email address is already taken by another user' },
          { status: 409 }
        )
      }
    }

    // Update customer
    await prisma.user.update({
      where: { id: customerId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        region: region || null,
        isVerified: Boolean(isVerified)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Customer updated successfully'
    })

  } catch (error) {
    console.error('Customer update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    )
  } finally {
  }
}