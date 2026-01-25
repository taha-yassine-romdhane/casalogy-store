import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const featuredProducts = await prisma.featuredProduct.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        product: {
          include: {
            category: true,
            colors: {
              include: {
                images: {
                  select: { url: true, isMain: true, sortOrder: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            },
            variants: true
          }
        }
      }
    })

    return NextResponse.json(featuredProducts)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const featuredProduct = await prisma.featuredProduct.create({
      data: {
        productId: data.productId,
        title: data.title,
        description: data.description,
        badge: data.badge,
        isActive: true,
        sortOrder: data.sortOrder || 0
      },
      include: {
        product: {
          include: {
            category: true,
            colors: {
              include: {
                images: {
                  select: { url: true, isMain: true, sortOrder: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            },
            variants: true
          }
        }
      }
    })

    return NextResponse.json(featuredProduct)
  } catch (error) {
    console.error('Error creating featured product:', error)
    return NextResponse.json({ error: 'Failed to create featured product' }, { status: 500 })
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

    const featuredProduct = await prisma.featuredProduct.update({
      where: { id },
      data: {
        productId: data.productId,
        title: data.title,
        description: data.description,
        badge: data.badge,
        isActive: data.isActive,
        sortOrder: data.sortOrder
      },
      include: {
        product: {
          include: {
            category: true,
            colors: {
              include: {
                images: {
                  select: { url: true, isMain: true, sortOrder: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            },
            variants: true
          }
        }
      }
    })

    return NextResponse.json(featuredProduct)
  } catch (error) {
    console.error('Error updating featured product:', error)
    return NextResponse.json({ error: 'Failed to update featured product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.featuredProduct.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting featured product:', error)
    return NextResponse.json({ error: 'Failed to delete featured product' }, { status: 500 })
  }
}