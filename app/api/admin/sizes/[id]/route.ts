import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenEdge } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT /api/admin/sizes/[id] - Update size
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const { name, label, category } = body

    if (!name || !label) {
      return NextResponse.json(
        { error: 'Name and label are required' },
        { status: 400 }
      )
    }

    // Check if size exists
    const existingSize = await prisma.size.findUnique({ where: { id } })
    if (!existingSize) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 })
    }

    // Check if another size with same name and category exists
    const duplicateSize = await prisma.size.findFirst({
      where: { 
        name: name.trim().toUpperCase(),
        category: category || 'UNISEX',
        NOT: { id }
      }
    })
    if (duplicateSize) {
      return NextResponse.json(
        { error: 'Size with this name already exists in this category' },
        { status: 400 }
      )
    }

    const updatedSize = await prisma.size.update({
      where: { id },
      data: {
        name: name.trim().toUpperCase(),
        label: label.trim(),
        category: category || 'UNISEX'
      }
    })

    return NextResponse.json(updatedSize)
  } catch (error) {
    console.error('Error updating size:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/sizes/[id] - Delete size
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params

    // Check if size exists
    const existingSize = await prisma.size.findUnique({
      where: { id },
      include: {
        _count: {
          select: { productVariants: true }
        }
      }
    })
    
    if (!existingSize) {
      return NextResponse.json({ error: 'Size not found' }, { status: 404 })
    }

    // Check if size is used in products
    if (existingSize._count.productVariants > 0) {
      return NextResponse.json(
        { error: `Cannot delete size that is used in ${existingSize._count.productVariants} product variant(s)` },
        { status: 400 }
      )
    }

    await prisma.size.delete({ where: { id } })

    return NextResponse.json({ message: 'Size deleted successfully' })
  } catch (error) {
    console.error('Error deleting size:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}