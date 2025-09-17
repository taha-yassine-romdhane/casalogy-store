import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { jwtVerify } from 'jose'

const prisma = new PrismaClient()
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')

// GET /api/user/orders - Get current user's orders
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Fetch user's orders
    const orders = await prisma.order.findMany({
      where: {
        userId: userId
      },
      include: {
        address: true,
        items: {
          include: {
            product: {
              include: {
                colors: {
                  include: {
                    images: {
                      where: {
                        isMain: true
                      },
                      take: 1
                    }
                  },
                  take: 1
                }
              }
            },
            variant: {
              include: {
                color: {
                  select: {
                    colorName: true,
                    colorCode: true
                  }
                },
                size: {
                  select: {
                    name: true,
                    label: true
                  }
                }
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
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}