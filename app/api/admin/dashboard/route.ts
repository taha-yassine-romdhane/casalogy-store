import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get stats in parallel for better performance
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      revenueResult,
      pendingStudentVerifications,
      recentMessages
    ] = await Promise.all([
      prisma.product.count({
        where: { isActive: true }
      }),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          paymentStatus: 'PAID'
        }
      }),
      prisma.user.count({
        where: {
          isStudent: true,
          studentVerified: false
        }
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          subject: true,
          createdAt: true,
          isRead: true
        }
      })
    ])

    // Calculate monthly growth (comparing with last month)
    const currentMonth = new Date()
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

    const [
      currentMonthProducts,
      lastMonthProducts,
      currentMonthUsers,
      lastMonthUsers,
      currentMonthOrders,
      lastMonthOrders,
      currentMonthRevenue,
      lastMonthRevenue
    ] = await Promise.all([
      prisma.product.count({
        where: {
          isActive: true,
          createdAt: {
            gte: currentMonthStart
          }
        }
      }),
      prisma.product.count({
        where: {
          isActive: true,
          createdAt: {
            gte: lastMonth,
            lt: currentMonthStart
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: currentMonthStart
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonthStart
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: currentMonthStart
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonthStart
          }
        }
      }),
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: currentMonthStart
          }
        }
      }),
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: lastMonth,
            lt: currentMonthStart
          }
        }
      })
    ])

    const stats = {
      totalProducts,
      totalUsers,
      totalOrders,
      revenue: revenueResult._sum.total || 0,
      pendingStudentVerifications,
      growth: {
        products: currentMonthProducts - lastMonthProducts,
        users: currentMonthUsers - lastMonthUsers,
        orders: currentMonthOrders - lastMonthOrders,
        revenue: (currentMonthRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)
      },
      recentActivity: recentMessages.map(message => ({
        id: message.id,
        description: `New message from ${message.name}: ${message.subject}`,
        time: message.createdAt,
        type: message.isRead ? 'read' : 'unread'
      }))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}