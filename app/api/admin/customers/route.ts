import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const adminUserId = payload.userId as string

    if (!adminUserId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: { role: true }
    })

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all customers with order statistics
    const customers = await prisma.user.findMany({
      where: {
        role: 'CLIENT'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        region: true,
        isVerified: true,
        isActive: true,
        isStudent: true,
        studentVerified: true,
        faculty: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            createdAt: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics for each customer
    const customersWithStats = customers.map(customer => {
      const orders = customer.orders || []
      const totalOrders = orders.length
      const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)
      const lastOrder = orders.length > 0 ? orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0] : null

      return {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        region: customer.region || '',
        faculty: customer.faculty || '',
        isActive: customer.isActive,
        isVerified: customer.isVerified,
        isStudent: customer.isStudent,
        studentVerified: customer.studentVerified,
        totalOrders,
        totalSpent,
        lastOrderDate: lastOrder?.createdAt || null,
        registeredAt: customer.createdAt
      }
    })

    // Calculate totals for stats
    const totalCustomers = customersWithStats.length
    const activeCustomers = customersWithStats.filter(c => c.isActive).length
    const studentCustomers = customersWithStats.filter(c => c.isStudent).length
    const verifiedCustomers = customersWithStats.filter(c => c.isVerified).length

    return NextResponse.json({
      success: true,
      customers: customersWithStats,
      stats: {
        totalCustomers,
        activeCustomers,
        studentCustomers,
        verifiedCustomers
      }
    })

  } catch (error) {
    console.error('Customers fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers data' },
      { status: 500 }
    )
  } finally {
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const adminUserId = payload.userId as string

    if (!adminUserId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { id: adminUserId },
      select: { role: true }
    })

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Check if customer exists and is not an admin
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: { role: true }
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    if (customer.role === 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete admin users' },
        { status: 400 }
      )
    }

    // Delete customer (this will cascade delete related data due to Prisma relations)
    await prisma.user.delete({
      where: { id: customerId }
    })

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    })

  } catch (error) {
    console.error('Customer deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    )
  } finally {
  }
}