import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenEdge } from '@/lib/auth'


// GET /api/user/address - Get user's single address
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user's address (should be only one)
    const address = await prisma.address.findFirst({
      where: { userId: payload.userId }
    })

    return NextResponse.json({ address })

  } catch (error) {
    console.error('Error fetching address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
  }
}

// POST /api/user/address - Create user's address
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, address, region } = body

    // Validate required fields
    if (!firstName || !lastName || !phone || !address || !region) {
      return NextResponse.json(
        { error: 'First name, last name, phone, address, and region are required' },
        { status: 400 }
      )
    }

    // Check if user already has an address
    const existingAddress = await prisma.address.findFirst({
      where: { userId: payload.userId }
    })

    if (existingAddress) {
      return NextResponse.json(
        { error: 'User already has an address. Use PUT to update it.' },
        { status: 400 }
      )
    }

    // Create new address
    const newAddress = await prisma.address.create({
      data: {
        userId: payload.userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        region: region.trim(),
        isDefault: true // Since it's the only address, it's the default
      }
    })

    return NextResponse.json({
      message: 'Address created successfully',
      address: newAddress
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
  }
}

// PUT /api/user/address - Update user's address
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, address, region } = body

    // Validate required fields
    if (!firstName || !lastName || !phone || !address || !region) {
      return NextResponse.json(
        { error: 'First name, last name, phone, address, and region are required' },
        { status: 400 }
      )
    }

    // Find user's existing address
    const existingAddress = await prisma.address.findFirst({
      where: { userId: payload.userId }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'No address found to update. Use POST to create one.' },
        { status: 404 }
      )
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: existingAddress.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        region: region.trim()
      }
    })

    return NextResponse.json({
      message: 'Address updated successfully',
      address: updatedAddress
    })

  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
  }
}