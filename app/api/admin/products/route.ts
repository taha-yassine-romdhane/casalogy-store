import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenEdge } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/admin/products - List all products
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      where.categoryId = category
    }
    
    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true }
          },
          colors: {
            include: {
              variants: {
                select: { quantity: true }
              },
              images: {
                select: { url: true, isMain: true, sortOrder: true },
                orderBy: { sortOrder: 'asc' }
              }
            }
          },
          _count: {
            select: { variants: true, colors: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Add calculated fields
    const productsWithStock = products.map(product => {
      const totalStock = product.colors.reduce((sum, color) => 
        sum + color.variants.reduce((colorSum, variant) => colorSum + variant.quantity, 0), 0
      )
      
      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        comparePrice: product.comparePrice,
        category: product.category,
        colors: product.colors, // Include colors data with images
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        totalStock,
        variantCount: product._count.variants,
        colorCount: product._count.colors,
        createdAt: product.createdAt
      }
    })

    return NextResponse.json({
      products: productsWithStock,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/products - Create new product
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
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    // Generate SKU if not provided
    let finalSku = sku
    if (!finalSku || finalSku.trim() === '') {
      // Generate SKU based on category and timestamp
      const timestamp = Date.now().toString(36).toUpperCase()
      const categoryPrefix = (await prisma.category.findUnique({ 
        where: { id: categoryId } 
      }))?.name.substring(0, 3).toUpperCase() || 'PRD'
      finalSku = `${categoryPrefix}-${timestamp}`
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku: finalSku }
    })
    if (existingSku) {
      // If auto-generated SKU exists (unlikely), add random suffix
      if (!sku || sku.trim() === '') {
        finalSku = `${finalSku}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      } else {
        return NextResponse.json(
          { error: 'Product with this SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Generate unique slug
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    let slug = baseSlug
    let counter = 1
    
    // Check if slug exists and add number suffix if needed
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create product with colors first
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        sku: finalSku,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        categoryId,
        fabricType,
        gender,
        pocketCount,
        isActive: isActive !== false,
        isFeatured: isFeatured === true,
        metaTitle,
        metaDescription,
        colors: {
          create: colors?.map((color: any) => ({
            colorName: color.colorName,
            colorCode: color.colorCode,
            pantoneCode: color.pantoneCode,
            sortOrder: color.sortOrder || 0
          })) || []
        }
      },
      include: {
        colors: true
      }
    })

    // Create variants separately with proper product and color references
    if (variants && variants.length > 0) {
      for (const color of product.colors) {
        const colorVariants = variants.filter((v: any) => 
          v.colorName === color.colorName || v.colorId === colors?.find((c: any) => c.colorName === color.colorName)?.id
        )
        
        if (colorVariants.length > 0) {
          await prisma.productVariant.createMany({
            data: colorVariants.map((variant: any) => ({
              productId: product.id,
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

    // Create images for each color
    if (colors && colors.length > 0) {
      for (const color of product.colors) {
        const colorData = colors.find((c: any) => c.colorName === color.colorName)
        if (colorData && colorData.images && colorData.images.length > 0) {
          await prisma.productImage.createMany({
            data: colorData.images.map((image: any, index: number) => ({
              productId: product.id,
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

    // Fetch the complete product with all relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        colors: {
          include: {
            variants: true,
            images: {
              orderBy: {
                sortOrder: 'asc'
              }
            }
          }
        }
      }
    })

    return NextResponse.json(completeProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}