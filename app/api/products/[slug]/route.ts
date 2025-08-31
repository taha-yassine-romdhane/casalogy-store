import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params

    // Fetch product by slug
    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
        isActive: true
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        colors: {
          include: {
            color: true,
            images: {
              orderBy: {
                sortOrder: 'asc'
              }
            }
          }
        },
        variants: {
          include: {
            size: true,
            color: {
              include: {
                color: true
              }
            }
          },
          where: {
            isActive: true
          },
          orderBy: [
            { color: { sortOrder: 'asc' } },
            { size: { sortOrder: 'asc' } }
          ]
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    // Group variants by color
    const colorVariants = product.colors.map(productColor => {
      const variants = product.variants.filter(v => v.colorId === productColor.id)
      const sizes = variants.map(v => ({
        id: v.id,
        sizeId: v.sizeId,
        sizeName: v.size.name,
        sizeLabel: v.size.label,
        sku: v.sku,
        price: v.price ? Number(v.price) : Number(product.price),
        quantity: v.quantity,
        isActive: v.isActive
      }))

      return {
        id: productColor.id,
        colorName: productColor.colorName,
        colorCode: productColor.colorCode,
        pantoneCode: productColor.pantoneCode,
        images: productColor.images.map(img => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          isMain: img.isMain
        })),
        sizes,
        totalStock: variants.reduce((sum, v) => sum + v.quantity, 0)
      }
    })

    // Get all unique sizes
    const allSizes = [...new Set(product.variants.map(v => ({
      id: v.size.id,
      name: v.size.name,
      label: v.size.label,
      category: v.size.category
    })))]

    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      sku: product.sku,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      costPrice: product.costPrice ? Number(product.costPrice) : undefined,
      trackQuantity: product.trackQuantity,
      isFeatured: product.isFeatured,
      fabricType: product.fabricType,
      pocketCount: product.pocketCount,
      gender: product.gender,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      category: product.category,
      rating: Number(avgRating.toFixed(1)),
      reviewCount: product.reviews.length,
      reviews: product.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerified: review.isVerified,
        createdAt: review.createdAt,
        user: {
          name: `${review.user.firstName} ${review.user.lastName}`
        }
      })),
      colorVariants,
      allSizes,
      totalStock: colorVariants.reduce((sum, cv) => sum + cv.totalStock, 0),
      isOnSale: product.comparePrice && Number(product.comparePrice) > Number(product.price),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    return NextResponse.json({ product: transformedProduct })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}