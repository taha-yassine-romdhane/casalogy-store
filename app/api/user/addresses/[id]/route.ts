import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenEdge } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT /api/user/addresses/[id] - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const { street, city, state, zipCode, country, isDefault } = body

    // Validate required fields
    if (!street || !city || !zipCode || !country) {
      return NextResponse.json(
        { error: 'Street, city, postal code, and country are required' },
        { status: 400 }
      )
    }

    // Check if address belongs to user
    const existingAddress = await prisma.userAddress.findFirst({
      where: { 
        id: id,
        userId: payload.userId 
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // If this is being set as default, unset other default addresses
    if (isDefault && !existingAddress.isDefault) {
      await prisma.userAddress.updateMany({
        where: { 
          userId: payload.userId,
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }

    // Update address
    const updatedAddress = await prisma.userAddress.update({
      where: { id: id },
      data: {
        street: street.trim(),
        city: city.trim(),
        state: state?.trim() || null,
        zipCode: zipCode.trim(),
        country: country.trim(),
        isDefault: isDefault || false
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
    await prisma.$disconnect()
  }
}

// DELETE /api/user/addresses/[id] - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check if address belongs to user
    const existingAddress = await prisma.userAddress.findFirst({
      where: { 
        id: id,
        userId: payload.userId 
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Delete address
    await prisma.userAddress.delete({
      where: { id: id }
    })

    return NextResponse.json({
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}