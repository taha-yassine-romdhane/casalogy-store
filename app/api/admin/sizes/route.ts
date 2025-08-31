import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenEdge } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/admin/sizes - List all sizes
export async function GET(request: NextRequest) {
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

    const sizes = await prisma.size.findMany({
      include: {
        _count: {
          select: {
            productVariants: true
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    // Transform data to match frontend expectations
    const transformedSizes = sizes.map(size => ({
      id: size.id,
      name: size.name,
      label: size.label,
      category: size.category,
      isActive: size.isActive,
      sortOrder: size.sortOrder,
      productCount: size._count.productVariants,
      createdAt: size.createdAt.toISOString()
    }))

    return NextResponse.json(transformedSizes)
  } catch (error) {
    console.error('Error fetching sizes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/sizes - Create new size
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, label, category, sortOrder } = body

    // Validate required fields
    if (!name || !label) {
      return NextResponse.json(
        { error: 'Name and label are required' },
        { status: 400 }
      )
    }

    // Check if size with same name and category exists
    const existingSize = await prisma.size.findFirst({
      where: { 
        name: name.trim().toUpperCase(),
        category: category || 'UNISEX'
      }
    })
    if (existingSize) {
      return NextResponse.json(
        { error: 'Size with this name already exists in this category' },
        { status: 400 }
      )
    }

    // Get the next sort order if not provided
    const maxSortOrder = await prisma.size.aggregate({
      where: { category: category || 'UNISEX' },
      _max: { sortOrder: true }
    })

    const size = await prisma.size.create({
      data: {
        name: name.trim().toUpperCase(),
        label: label.trim(),
        category: category || 'UNISEX',
        sortOrder: sortOrder || (maxSortOrder._max.sortOrder || 0) + 1,
        isActive: true
      }
    })

    return NextResponse.json(size, { status: 201 })
  } catch (error) {
    console.error('Error creating size:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}