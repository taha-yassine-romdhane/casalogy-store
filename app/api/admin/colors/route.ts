import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenEdge } from '@/lib/auth'


// GET /api/admin/colors - List all colors
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

    const colors = await prisma.color.findMany({
      include: {
        _count: {
          select: {
            productColors: true
          }
        }
      },
      orderBy: [
        { isSystem: 'desc' }, // System colors first
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    // Transform data to match frontend expectations
    const transformedColors = colors.map(color => ({
      id: color.id,
      name: color.name,
      hexCode: color.hexCode,
      pantoneCode: color.pantoneCode,
      isActive: color.isActive,
      isSystem: color.isSystem,
      sortOrder: color.sortOrder,
      productCount: color._count.productColors,
      createdAt: color.createdAt.toISOString()
    }))

    return NextResponse.json(transformedColors)
  } catch (error) {
    console.error('Error fetching colors:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/colors - Create new color
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
    const { name, hexCode, pantoneCode, sortOrder } = body

    // Validate required fields
    if (!name || !hexCode) {
      return NextResponse.json(
        { error: 'Name and hex code are required' },
        { status: 400 }
      )
    }

    // Check if color with same hex code exists
    const existingColor = await prisma.color.findFirst({
      where: { hexCode: hexCode.toLowerCase() }
    })
    if (existingColor) {
      return NextResponse.json(
        { error: 'Color with this hex code already exists' },
        { status: 400 }
      )
    }

    // Get the next sort order if not provided
    const maxSortOrder = await prisma.color.aggregate({
      _max: { sortOrder: true }
    })

    const color = await prisma.color.create({
      data: {
        name: name.trim(),
        hexCode: hexCode.toLowerCase(),
        pantoneCode: pantoneCode?.trim() || null,
        sortOrder: sortOrder || (maxSortOrder._max.sortOrder || 0) + 1,
        isActive: true,
        isSystem: false // Custom colors are not system colors
      }
    })

    return NextResponse.json(color, { status: 201 })
  } catch (error) {
    console.error('Error creating color:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}