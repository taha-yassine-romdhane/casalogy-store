import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gender = searchParams.get('gender')
    const newArrivals = searchParams.get('newArrivals')
    
    let whereClause: any = {
      isActive: true
    }
    
    // Filter by gender if provided (case-insensitive)
    if (gender && gender !== 'all') {
      whereClause.gender = {
        equals: gender,
        mode: 'insensitive'
      }
    }
    
    // Filter by new arrivals (last 5 months) if requested
    if (newArrivals === 'true') {
      const fiveMonthsAgo = new Date()
      fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5)
      whereClause.createdAt = {
        gte: fiveMonthsAgo
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        colors: {
          include: {
            color: true,
            images: {
              where: {
                isMain: true
              },
              take: 1
            }
          }
        },
        variants: {
          include: {
            size: true,
            color: true
          },
          where: {
            isActive: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the frontend interface
    const transformedProducts = products.map(product => {
      // Calculate average rating
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      // Get unique colors and sizes
      const colors = product.colors.map(pc => pc.colorName)
      const sizes = [...new Set(product.variants.map(v => v.size.name))]

      // Get main image URL
      const mainImage = product.colors.find(pc => pc.images.length > 0)?.images[0]?.url || null

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
        rating: Number(avgRating.toFixed(1)),
        reviews: product.reviews.length,
        colors,
        sizes,
        mainImage,
        isNew: false,
        isOnSale: product.comparePrice && Number(product.comparePrice) > Number(product.price),
        isFeatured: product.isFeatured,
        fabricType: product.fabricType,
        pocketCount: product.pocketCount,
        gender: product.gender,
        category: product.category
      }
    })

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length
    })

  } catch (error) {
    console.error('Error fetching filtered products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
  }
}