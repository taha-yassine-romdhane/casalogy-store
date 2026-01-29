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

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Product name is required', field: 'name' },
        { status: 400 }
      )
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return NextResponse.json(
        { error: 'Valid price is required', field: 'price' },
        { status: 400 }
      )
    }

    if (!categoryId || categoryId.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required', field: 'categoryId' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Validate and handle SKU
    let finalSku = sku?.trim() || existingProduct.sku
    if (finalSku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: finalSku }
      })
      if (existingSku && existingSku.id !== id) {
        return NextResponse.json(
          { error: 'Product with this SKU already exists', field: 'sku' },
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

    // Validate colors have required data
    if (colors && colors.length > 0) {
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i]
        if (!color.colorName || color.colorName.trim() === '') {
          return NextResponse.json(
            { error: `Color ${i + 1} is missing a name`, field: 'colors' },
            { status: 400 }
          )
        }
        if (!color.colorCode || color.colorCode.trim() === '') {
          return NextResponse.json(
            { error: `Color "${color.colorName}" is missing a color code`, field: 'colors' },
            { status: 400 }
          )
        }
      }

      // Check for duplicate color codes within the same product
      const colorCodes = colors.map((c: any) => c.colorCode.toLowerCase())
      const uniqueColorCodes = new Set(colorCodes)
      if (colorCodes.length !== uniqueColorCodes.size) {
        return NextResponse.json(
          { error: 'Duplicate colors detected. Each color must be unique.', field: 'colors' },
          { status: 400 }
        )
      }
    }

    // Validate variants have required data
    if (variants && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i]
        if (!variant.sizeId || variant.sizeId.trim() === '') {
          return NextResponse.json(
            { error: `Variant ${i + 1} is missing a size`, field: 'variants' },
            { status: 400 }
          )
        }
        if (!variant.colorName || variant.colorName.trim() === '') {
          return NextResponse.json(
            { error: `Variant ${i + 1} is missing a color reference`, field: 'variants' },
            { status: 400 }
          )
        }
      }
    }

    // Use transaction for atomic update
    const result = await prisma.$transaction(async (tx) => {
      // Update product basic info
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          slug: finalSlug,
          description,
          shortDescription,
          sku: finalSku,
          price: parseFloat(price),
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
      await tx.productImage.deleteMany({
        where: { productId: id }
      })
      await tx.productVariant.deleteMany({
        where: { productId: id }
      })
      await tx.productColor.deleteMany({
        where: { productId: id }
      })

      // Recreate colors
      if (colors && colors.length > 0) {
        await tx.productColor.createMany({
          data: colors.map((color: any, index: number) => ({
            productId: id,
            colorName: color.colorName,
            colorCode: color.colorCode,
            pantoneCode: color.pantoneCode || null,
            sortOrder: color.sortOrder || index
          }))
        })

        // Get created colors to link variants and images
        const productColors = await tx.productColor.findMany({
          where: { productId: id }
        })

        // Recreate variants with unique SKUs
        if (variants && variants.length > 0) {
          const timestamp = Date.now()
          let variantIndex = 0

          for (const color of productColors) {
            const colorVariants = variants.filter((v: any) =>
              v.colorName === color.colorName
            )

            if (colorVariants.length > 0) {
              await tx.productVariant.createMany({
                data: colorVariants.map((variant: any) => {
                  // Generate unique SKU with timestamp and index
                  const colorCode = color.colorName.substring(0, 2).toUpperCase()
                  const sizeName = variant.sizeName || 'VAR'
                  const uniqueSku = `${finalSku}-${colorCode}-${sizeName}-${timestamp}-${variantIndex++}`

                  return {
                    productId: id,
                    colorId: color.id,
                    sizeId: variant.sizeId,
                    sku: uniqueSku,
                    quantity: parseInt(variant.quantity) || 0,
                    price: variant.price ? parseFloat(variant.price) : null,
                    barcode: variant.barcode || null
                  }
                })
              })
            }
          }
        }

        // Recreate images
        for (const color of productColors) {
          const colorData = colors.find((c: any) => c.colorName === color.colorName)
          if (colorData && colorData.images && colorData.images.length > 0) {
            // Filter out images without URLs
            const validImages = colorData.images.filter((img: any) => img.url && img.url.trim() !== '')

            if (validImages.length > 0) {
              await tx.productImage.createMany({
                data: validImages.map((image: any, index: number) => ({
                  productId: id,
                  colorId: color.id,
                  url: image.url,
                  altText: `${product.name} - ${color.colorName}`,
                  sortOrder: image.order ?? index,
                  isMain: image.isMain ?? index === 0
                }))
              })
            }
          }
        }
      }

      return product
    })

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
  } catch (error: any) {
    console.error('Error updating product:', error)

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      // Unique constraint violation
      const field = error.meta?.target?.[0] || 'field'
      return NextResponse.json(
        { error: `A product with this ${field} already exists`, field, code: 'DUPLICATE' },
        { status: 400 }
      )
    }

    if (error.code === 'P2003') {
      // Foreign key constraint violation
      return NextResponse.json(
        { error: 'Invalid reference: Category or Size does not exist', code: 'INVALID_REFERENCE' },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      // Record not found
      return NextResponse.json(
        { error: 'Product not found or already deleted', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update product. Please try again.', details: error.message },
      { status: 500 }
    )
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