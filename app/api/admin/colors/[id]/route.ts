import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenEdge } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT /api/admin/colors/[id] - Update color
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, hexCode, pantoneCode, isActive, sortOrder } = body

    // Check if color exists
    const existingColor = await prisma.color.findUnique({
      where: { id }
    })
    if (!existingColor) {
      return NextResponse.json({ error: 'Color not found' }, { status: 404 })
    }

    // Validate required fields
    if (!name || !hexCode) {
      return NextResponse.json(
        { error: 'Name and hex code are required' },
        { status: 400 }
      )
    }

    // Check if another color with same hex code exists
    if (hexCode.toLowerCase() !== existingColor.hexCode) {
      const duplicateColor = await prisma.color.findFirst({
        where: { 
          hexCode: hexCode.toLowerCase(),
          id: { not: id }
        }
      })
      if (duplicateColor) {
        return NextResponse.json(
          { error: 'Color with this hex code already exists' },
          { status: 400 }
        )
      }
    }

    const updatedColor = await prisma.color.update({
      where: { id },
      data: {
        name: name.trim(),
        hexCode: hexCode.toLowerCase(),
        pantoneCode: pantoneCode?.trim() || null,
        isActive: isActive !== undefined ? isActive : existingColor.isActive,
        sortOrder: sortOrder !== undefined ? sortOrder : existingColor.sortOrder
      }
    })

    return NextResponse.json(updatedColor)
  } catch (error) {
    console.error('Error updating color:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/colors/[id] - Delete color
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    // Check if color exists
    const existingColor = await prisma.color.findUnique({
      where: { id }
    })
    if (!existingColor) {
      return NextResponse.json({ error: 'Color not found' }, { status: 404 })
    }

    // Prevent deletion of system colors
    if (existingColor.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system colors' },
        { status: 400 }
      )
    }

    // Check if color is used in any products
    const productCount = await prisma.productColor.count({
      where: { colorCode: existingColor.hexCode }
    })

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete color that is used in ${productCount} product(s)` },
        { status: 400 }
      )
    }

    await prisma.color.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Color deleted successfully' })
  } catch (error) {
    console.error('Error deleting color:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}