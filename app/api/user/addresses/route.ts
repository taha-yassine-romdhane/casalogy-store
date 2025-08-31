import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenEdge } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/user/addresses - Get user addresses
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

    // Get user addresses
    const addresses = await prisma.userAddress.findMany({
      where: { userId: payload.userId },
      orderBy: [
        { isDefault: 'desc' }, // Default addresses first
        { createdAt: 'desc' }   // Then by creation date
      ]
    })

    return NextResponse.json({ addresses })

  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/user/addresses - Create new address
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
    const { street, city, state, zipCode, country, isDefault } = body

    // Validate required fields
    if (!street || !city || !zipCode || !country) {
      return NextResponse.json(
        { error: 'Street, city, postal code, and country are required' },
        { status: 400 }
      )
    }

    // If this is being set as default, unset other default addresses
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { 
          userId: payload.userId,
          isDefault: true 
        },
        data: { isDefault: false }
      })
    }

    // Create new address
    const newAddress = await prisma.userAddress.create({
      data: {
        userId: payload.userId,
        street: street.trim(),
        city: city.trim(),
        state: state?.trim() || null,
        zipCode: zipCode.trim(),
        country: country.trim(),
        isDefault: isDefault || false
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
    await prisma.$disconnect()
  }
}