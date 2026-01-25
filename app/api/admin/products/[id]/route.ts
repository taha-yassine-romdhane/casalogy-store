import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenEdge } from '@/lib/auth'


// GET /api/admin/products/[id] - Get single product
export async function GET(
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

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        colors: {
          include: {
            variants: {
              include: {
                size: true
              },
              orderBy: { createdAt: 'asc' }
            },
            images: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/products/[id] - Update product
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
    const {
      name,
      sku,
      description,
      shortDescription,
      price,
      comparePrice,
      categoryId,
      fabricType,
      gender,
      pocketCount,
      isActive,
      isFeatured,
      metaTitle,
      metaDescription,
      colors,
      variants
    } = body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if SKU already exists for other products
    if (sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku }
      })
      if (existingSku && existingSku.id !== id) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Generate unique slug if name changed
    let finalSlug = name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    if (finalSlug && finalSlug !== existingProduct.slug) {
      let slug = finalSlug
      let counter = 1
      
      while (await prisma.product.findFirst({ 
        where: { 
          slug,
          id: { not: id }
        } 
      })) {
        slug = `${finalSlug}-${counter}`
        counter++
      }
      finalSlug = slug
    } else {
      finalSlug = existingProduct.slug
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: finalSlug,
        description,
        shortDescription,
        sku,
        price: price ? parseFloat(price) : undefined,
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        categoryId,
        fabricType,
        gender,
        pocketCount,
        isActive,
        isFeatured,
        metaTitle,
        metaDescription
      }
    })

    // Delete existing colors, variants, and images (they will be recreated)
    await prisma.productImage.deleteMany({
      where: { productId: id }
    })
    await prisma.productVariant.deleteMany({
      where: { productId: id }
    })
    await prisma.productColor.deleteMany({
      where: { productId: id }
    })

    // Recreate colors
    if (colors && colors.length > 0) {
      const createdColors = await prisma.productColor.createMany({
        data: colors.map((color: any) => ({
          productId: id,
          colorName: color.colorName,
          colorCode: color.colorCode,
          pantoneCode: color.pantoneCode,
          sortOrder: color.sortOrder || 0
        }))
      })

      // Get created colors to link variants and images
      const productColors = await prisma.productColor.findMany({
        where: { productId: id }
      })

      // Recreate variants
      if (variants && variants.length > 0) {
        for (const color of productColors) {
          const colorVariants = variants.filter((v: any) => 
            v.colorName === color.colorName
          )
          
          if (colorVariants.length > 0) {
            await prisma.productVariant.createMany({
              data: colorVariants.map((variant: any) => ({
                productId: id,
                colorId: color.id,
                sizeId: variant.sizeId,
                sku: variant.sku,
                quantity: parseInt(variant.quantity) || 0,
                price: variant.price ? parseFloat(variant.price) : null,
                barcode: variant.barcode || null
              }))
            })
          }
        }
      }

      // Recreate images
      for (const color of productColors) {
        const colorData = colors.find((c: any) => c.colorName === color.colorName)
        if (colorData && colorData.images && colorData.images.length > 0) {
          await prisma.productImage.createMany({
            data: colorData.images.map((image: any, index: number) => ({
              productId: id,
              colorId: color.id,
              url: image.url,
              altText: `${product.name} - ${color.colorName}`,
              sortOrder: image.order || index,
              isMain: image.isMain || index === 0
            }))
          })
        }
      }
    }

    // Fetch the complete updated product
    const completeProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        colors: {
          include: {
            variants: {
              include: {
                size: true
              }
            },
            images: {
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      }
    })

    return NextResponse.json(completeProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] - Delete product
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
    const { searchParams } = new URL(request.url)
    const confirm = searchParams.get('confirm') === 'true'

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true }
    })
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get all related data counts
    const [orderItemsCount, cartItemsCount, reviewsCount, variantsCount] = await Promise.all([
      prisma.orderItem.count({ where: { productId: id } }),
      prisma.cartItem.count({ where: { productId: id } }),
      prisma.review.count({ where: { productId: id } }),
      prisma.productVariant.count({ where: { productId: id } })
    ])

    const hasRelations = orderItemsCount > 0 || cartItemsCount > 0 || reviewsCount > 0

    // If there are relations and not confirmed, return warning
    if (hasRelations && !confirm) {
      return NextResponse.json({
        warning: true,
        productName: existingProduct.name,
        relations: {
          orderItems: orderItemsCount,
          cartItems: cartItemsCount,
          reviews: reviewsCount,
          variants: variantsCount
        },
        message: 'This product has related data that will be permanently deleted.'
      }, { status: 200 })
    }

    // Delete product (cascade will handle variants, images, order items, cart items, reviews)
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Product and all related data deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}