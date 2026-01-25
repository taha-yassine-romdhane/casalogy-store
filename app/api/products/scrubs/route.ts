import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {
    // Find the scrubs category
    const scrubsCategory = await prisma.category.findFirst({
      where: {
        slug: 'scrubs'
      }
    })

    if (!scrubsCategory) {
      return NextResponse.json(
        { error: 'Scrubs category not found' },
        { status: 404 }
      )
    }

    // Fetch products in the scrubs category
    const products = await prisma.product.findMany({
      where: {
        categoryId: scrubsCategory.id,
        isActive: true
      },
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
        isNew: false, // You can add logic to determine if product is new
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
    console.error('Error fetching scrubs products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
  }
}