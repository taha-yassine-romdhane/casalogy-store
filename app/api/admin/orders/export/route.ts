import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    // Fetch all orders with related data
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

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // === Orders Summary Sheet ===
    const ordersData = orders.map(order => ({
      'Order Number': order.orderNumber,
      'Date': new Date(order.createdAt).toLocaleString('en-US'),
      'Customer Name': `${order.user.firstName} ${order.user.lastName}`,
      'Customer Email': order.user.email || 'N/A',
      'Customer Phone': order.user.phone || 'N/A',
      'Shipping Address': order.address.address,
      'Region': order.address.region,
      'Items Count': order.items.reduce((sum, item) => sum + item.quantity, 0),
      'Subtotal (TND)': parseFloat(order.subtotal.toString()).toFixed(2),
      'Shipping (TND)': parseFloat(order.shippingCost.toString()).toFixed(2),
      'Total (TND)': parseFloat(order.total.toString()).toFixed(2),
      'Order Status': order.status,
      'Payment Status': order.paymentStatus,
      'Payment Method': order.paymentMethod || 'N/A',
      'Student Discount': order.studentDiscount ? 'Yes' : 'No',
      'Notes': order.notes || ''
    }))

    const ordersSheet = XLSX.utils.json_to_sheet(ordersData)

    // Set column widths
    ordersSheet['!cols'] = [
      { wch: 18 }, // Order Number
      { wch: 20 }, // Date
      { wch: 25 }, // Customer Name
      { wch: 30 }, // Customer Email
      { wch: 15 }, // Customer Phone
      { wch: 40 }, // Shipping Address
      { wch: 15 }, // Region
      { wch: 12 }, // Items Count
      { wch: 15 }, // Subtotal
      { wch: 15 }, // Shipping
      { wch: 15 }, // Total
      { wch: 15 }, // Order Status
      { wch: 15 }, // Payment Status
      { wch: 18 }, // Payment Method
      { wch: 15 }, // Student Discount
      { wch: 30 }, // Notes
    ]

    XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Orders Summary')

    // === Order Items Sheet ===
    const itemsData: any[] = []
    orders.forEach(order => {
      order.items.forEach(item => {
        itemsData.push({
          'Order Number': order.orderNumber,
          'Order Date': new Date(order.createdAt).toLocaleString('en-US'),
          'Customer Name': `${order.user.firstName} ${order.user.lastName}`,
          'Product Name': item.product.name,
          'Product SKU': item.product.sku,
          'Color': item.variant?.color?.colorName || item.colorName || 'N/A',
          'Size': item.variant?.size?.name || item.sizeName || 'N/A',
          'Quantity': item.quantity,
          'Unit Price (TND)': parseFloat(item.price.toString()).toFixed(2),
          'Line Total (TND)': (item.quantity * parseFloat(item.price.toString())).toFixed(2),
          'Current Stock': item.variant?.quantity ?? 'N/A'
        })
      })
    })

    const itemsSheet = XLSX.utils.json_to_sheet(itemsData)

    // Set column widths for items sheet
    itemsSheet['!cols'] = [
      { wch: 18 }, // Order Number
      { wch: 20 }, // Order Date
      { wch: 25 }, // Customer Name
      { wch: 35 }, // Product Name
      { wch: 15 }, // Product SKU
      { wch: 20 }, // Color
      { wch: 10 }, // Size
      { wch: 10 }, // Quantity
      { wch: 18 }, // Unit Price
      { wch: 18 }, // Line Total
      { wch: 15 }, // Current Stock
    ]

    XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Order Items')

    // === Statistics Sheet ===
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total.toString()), 0)
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)

    const statusCounts: Record<string, number> = {}
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
    })

    const paymentStatusCounts: Record<string, number> = {}
    orders.forEach(o => {
      paymentStatusCounts[o.paymentStatus] = (paymentStatusCounts[o.paymentStatus] || 0) + 1
    })

    const statsData = [
      { 'Metric': 'Total Orders', 'Value': totalOrders },
      { 'Metric': 'Total Revenue (TND)', 'Value': totalRevenue.toFixed(2) },
      { 'Metric': 'Average Order Value (TND)', 'Value': avgOrderValue.toFixed(2) },
      { 'Metric': 'Total Items Sold', 'Value': totalItems },
      { 'Metric': '', 'Value': '' },
      { 'Metric': '--- Order Status Breakdown ---', 'Value': '' },
      ...Object.entries(statusCounts).map(([status, count]) => ({
        'Metric': status,
        'Value': count
      })),
      { 'Metric': '', 'Value': '' },
      { 'Metric': '--- Payment Status Breakdown ---', 'Value': '' },
      ...Object.entries(paymentStatusCounts).map(([status, count]) => ({
        'Metric': status,
        'Value': count
      }))
    ]

    const statsSheet = XLSX.utils.json_to_sheet(statsData)
    statsSheet['!cols'] = [
      { wch: 35 },
      { wch: 20 }
    ]
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics')

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0]
    const filename = `orders-export-${date}.xlsx`

    // Return the file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting orders:', error)
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    )
  }
}
