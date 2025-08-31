import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      orderNumber,
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      governorate,
      items,
      subtotal,
      shippingCost,
      total
    } = body

    console.log('Order items:', items)
    console.log('Product IDs being ordered:', items.map((item: any) => item.productId))

    // Verify all products exist
    const productIds = items.map((item: any) => item.productId)
    const uniqueProductIds = [...new Set(productIds)] // Get unique product IDs
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: uniqueProductIds
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    console.log('Existing products found:', existingProducts)
    
    if (existingProducts.length !== uniqueProductIds.length) {
      const foundIds = existingProducts.map(p => p.id)
      const missingIds = uniqueProductIds.filter(id => !foundIds.includes(id))
      console.log('Missing product IDs:', missingIds)
      return NextResponse.json(
        { 
          error: 'Some products not found',
          missingProductIds: missingIds
        },
        { status: 400 }
      )
    }

    // Create or find user
    console.log('Creating/finding user with email:', email)
    let user;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email: email }
      })
      console.log('Found existing user:', user ? user.id : 'none')
    }

    if (!user) {
      console.log('Creating new user...')
      // Create guest user (with or without email)
      user = await prisma.user.create({
        data: {
          email: email || null,
          password: 'guest_account', // This should be hashed in production
          firstName,
          lastName,
          phone,
          address: `${address}, ${city}, ${governorate}`,
          region: governorate,
          role: 'CLIENT'
        }
      })
      console.log('Created user with ID:', user.id)
    }

    // Create address
    console.log('Creating address...')
    const shippingAddress = await prisma.address.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        phone,
        address: `${address}, ${city}, ${governorate}`,
        region: governorate,
        isDefault: true
      }
    })
    console.log('Created address with ID:', shippingAddress.id)

    // Create order
    console.log('Creating order...')
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        addressId: shippingAddress.id,
        subtotal,
        shippingCost: shippingCost || 0,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'CASH_ON_DELIVERY',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
            colorName: item.color || null,
            sizeName: item.size || null
          }))
        }
      },
      include: {
        items: true,
        user: true,
        address: true
      }
    })
    console.log('Created order with ID:', order.id)

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    console.error('Error details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/orders - Get all orders (admin)
export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
            variant: {
              include: {
                color: true,
                size: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}