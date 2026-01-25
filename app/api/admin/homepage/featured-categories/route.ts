import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const featuredCategories = await prisma.featuredCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true
      }
    })

    return NextResponse.json(featuredCategories)
  } catch (error) {
    console.error('Error fetching featured categories:', error)
    return NextResponse.json({ error: 'Failed to fetch featured categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Check if category is already featured
    const existing = await prisma.featuredCategory.findFirst({
      where: { categoryId: data.categoryId }
    })
    
    if (existing) {
      return NextResponse.json({ error: 'Category is already featured' }, { status: 400 })
    }
    
    const featuredCategory = await prisma.featuredCategory.create({
      data: {
        categoryId: data.categoryId,
        title: data.title || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder || 0
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(featuredCategory)
  } catch (error) {
    console.error('Error creating featured category:', error)
    return NextResponse.json({ error: 'Failed to create featured category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const featuredCategory = await prisma.featuredCategory.update({
      where: { id },
      data: {
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        sortOrder: data.sortOrder
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(featuredCategory)
  } catch (error) {
    console.error('Error updating featured category:', error)
    return NextResponse.json({ error: 'Failed to update featured category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.featuredCategory.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting featured category:', error)
    return NextResponse.json({ error: 'Failed to delete featured category' }, { status: 500 })
  }
}