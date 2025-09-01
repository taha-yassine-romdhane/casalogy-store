import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '30days'

    // Calculate date ranges
    const now = new Date()
    const periods = getDatePeriods(dateRange, now)

    // Get analytics data in parallel
    const [
      currentRevenue,
      previousRevenue,
      currentOrders,
      previousOrders,
      currentCustomers,
      previousCustomers,
      topProducts,
      customerSegments,
      categoryStats,
      regionStats
    ] = await Promise.all([
      // Current period revenue
      prisma.order.aggregate({
        _sum: { total: true },
        _count: true,
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: periods.current.start,
            lte: periods.current.end
          }
        }
      }),
      
      // Previous period revenue
      prisma.order.aggregate({
        _sum: { total: true },
        _count: true,
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: periods.previous.start,
            lte: periods.previous.end
          }
        }
      }),

      // Current period orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: periods.current.start,
            lte: periods.current.end
          }
        }
      }),

      // Previous period orders  
      prisma.order.count({
        where: {
          createdAt: {
            gte: periods.previous.start,
            lte: periods.previous.end
          }
        }
      }),

      // Current period new customers
      prisma.user.count({
        where: {
          role: 'CLIENT',
          createdAt: {
            gte: periods.current.start,
            lte: periods.current.end
          }
        }
      }),

      // Previous period new customers
      prisma.user.count({
        where: {
          role: 'CLIENT',
          createdAt: {
            gte: periods.previous.start,
            lte: periods.previous.end
          }
        }
      }),

      // Top products by revenue
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          price: true
        },
        _count: true,
        where: {
          order: {
            paymentStatus: 'PAID',
            createdAt: {
              gte: periods.current.start,
              lte: periods.current.end
            }
          }
        },
        orderBy: {
          _sum: {
            price: 'desc'
          }
        },
        take: 5
      }),

      // Customer segments (students vs professionals)
      prisma.user.groupBy({
        by: ['isStudent'],
        _count: true,
        where: {
          role: 'CLIENT'
        }
      }),

      // Category performance
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          price: true
        },
        where: {
          order: {
            paymentStatus: 'PAID',
            createdAt: {
              gte: periods.current.start,
              lte: periods.current.end
            }
          }
        }
      }),

      // Region stats
      prisma.user.groupBy({
        by: ['region'],
        _count: true,
        where: {
          role: 'CLIENT',
          region: {
            not: null
          }
        },
        orderBy: {
          _count: {
            region: 'desc'
          }
        },
        take: 1
      })
    ])

    // Get detailed product information for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: true }
        })
        
        // Calculate trend (simplified - compare with previous period)
        const previousPeriodSales = await prisma.orderItem.aggregate({
          _sum: { price: true, quantity: true },
          where: {
            productId: item.productId,
            order: {
              paymentStatus: 'PAID',
              createdAt: {
                gte: periods.previous.start,
                lte: periods.previous.end
              }
            }
          }
        })

        const currentRevenue = Number(item._sum.price || 0)
        const previousRevenue = Number(previousPeriodSales._sum.price || 0)
        const trend = previousRevenue > 0 
          ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
          : currentRevenue > 0 ? 100 : 0

        return {
          id: product?.id || item.productId,
          name: product?.name || 'Unknown Product',
          category: product?.category.name || 'Unknown Category',
          sales: item._sum.quantity || 0,
          revenue: currentRevenue,
          trend: Number(trend.toFixed(1))
        }
      })
    )

    // Calculate metrics
    const currentPeriodRevenue = Number(currentRevenue._sum.total || 0)
    const previousPeriodRevenue = Number(previousRevenue._sum.total || 0)
    const revenueChange = previousPeriodRevenue > 0 
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
      : currentPeriodRevenue > 0 ? 100 : 0

    const ordersChange = previousOrders > 0 
      ? ((currentOrders - previousOrders) / previousOrders) * 100 
      : currentOrders > 0 ? 100 : 0

    const customersChange = previousCustomers > 0 
      ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 
      : currentCustomers > 0 ? 100 : 0

    const avgOrderValue = currentOrders > 0 ? currentPeriodRevenue / currentOrders : 0
    const prevAvgOrderValue = previousOrders > 0 ? previousPeriodRevenue / previousOrders : 0
    const avgOrderChange = prevAvgOrderValue > 0 
      ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100 
      : avgOrderValue > 0 ? 100 : 0

    // Process customer segments
    const totalUsers = customerSegments.reduce((sum, seg) => sum + seg._count, 0)
    const processedSegments = customerSegments.map(segment => ({
      type: segment.isStudent ? 'Medical Students' : 'Medical Professionals',
      count: segment._count,
      percentage: totalUsers > 0 ? (segment._count / totalUsers) * 100 : 0,
      revenue: 0 // Would need additional query to get revenue by segment
    }))

    // Add institutional customers if we have any
    if (processedSegments.length < 3) {
      processedSegments.push({
        type: 'Healthcare Institutions',
        count: 0,
        percentage: 0,
        revenue: 0
      })
    }

    const analytics = {
      revenue: {
        current: currentPeriodRevenue,
        previous: previousPeriodRevenue,
        change: Number(revenueChange.toFixed(1))
      },
      orders: {
        current: currentOrders,
        previous: previousOrders,
        change: Number(ordersChange.toFixed(1))
      },
      customers: {
        current: currentCustomers,
        previous: previousCustomers,
        change: Number(customersChange.toFixed(1))
      },
      avgOrderValue: {
        current: avgOrderValue,
        previous: prevAvgOrderValue,
        change: Number(avgOrderChange.toFixed(1))
      },
      topProducts: topProductDetails,
      customerSegments: processedSegments,
      insights: {
        topRegion: regionStats[0] ? regionStats[0].region : 'Tunisia',
        topRegionPercentage: regionStats[0] && totalUsers > 0 ? (regionStats[0]._count / totalUsers * 100).toFixed(1) : '0',
        conversionRate: 3.2, // Placeholder - would need visitor tracking
        bestCategory: 'Medical Scrubs' // Simplified
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

function getDatePeriods(dateRange: string, now: Date) {
  const periods = {
    current: { start: new Date(), end: now },
    previous: { start: new Date(), end: new Date() }
  }

  switch (dateRange) {
    case '7days':
      periods.current.start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      periods.previous.start = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      periods.previous.end = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30days':
      periods.current.start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      periods.previous.start = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
      periods.previous.end = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '3months':
      periods.current.start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      periods.previous.start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      periods.previous.end = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '6months':
      periods.current.start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      periods.previous.start = new Date(now.getTime() - 360 * 24 * 60 * 60 * 1000)
      periods.previous.end = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      break
    case '1year':
      periods.current.start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      periods.previous.start = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000)
      periods.previous.end = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
  }

  return periods
}