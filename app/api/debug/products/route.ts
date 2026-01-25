import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// GET /api/debug/products - Get all product IDs for debugging
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        gender: true,
        isActive: true
      },
      take: 10 // Limit to first 10 for debugging
    })

    // Get unique gender values
    const genderValues = [...new Set(products.map(p => p.gender).filter(Boolean))]

    return NextResponse.json({
      count: products.length,
      genderValues: genderValues,
      products: products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}