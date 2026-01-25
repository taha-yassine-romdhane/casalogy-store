import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// PUT /api/admin/orders/[id] - Update order status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, paymentStatus } = body

    // Get current order to check status change
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: true
          }
        }
      }
    })

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is being confirmed (status changes from PENDING to CONFIRMED)
    const isBeingConfirmed = currentOrder.status === 'PENDING' && status === 'CONFIRMED'

    // Check if confirmed order is being cancelled (status changes from CONFIRMED to CANCELLED)
    const isBeingCancelled = currentOrder.status === 'CONFIRMED' && status === 'CANCELLED'

    console.log(`🔍 Order status check:`, {
      orderId: id,
      currentStatus: currentOrder.status,
      newStatus: status,
      isBeingConfirmed,
      isBeingCancelled,
      itemCount: currentOrder.items.length
    })

    // If order is being confirmed, decrement stock quantities
    if (isBeingConfirmed) {
      console.log(`🔄 Order ${id} is being confirmed, decrementing stock...`)

      for (const item of currentOrder.items) {
        console.log(`📦 Processing item:`, {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          colorName: item.colorName,
          sizeName: item.sizeName
        })

        if (item.variantId) {
          const variant = await prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: {
              color: { select: { colorName: true } },
              size: { select: { name: true } }
            }
          })

          console.log(`📋 Found variant:`, {
            variantId: item.variantId,
            currentStock: variant?.quantity,
            variantExists: !!variant
          })

          if (variant) {
            // Check if there's enough stock
            if (variant.quantity < item.quantity) {
              console.log(`❌ Insufficient stock for variant ${item.variantId}: available=${variant.quantity}, required=${item.quantity}`)
              return NextResponse.json(
                {
                  error: `Insufficient stock for product variant. Available: ${variant.quantity}, Required: ${item.quantity}`,
                  productId: item.productId,
                  variantId: item.variantId
                },
                { status: 400 }
              )
            }

            // Decrement stock
            const updatedVariant = await prisma.productVariant.update({
              where: { id: item.variantId },
              data: {
                quantity: {
                  decrement: item.quantity
                }
              }
            })

            console.log(`✅ Decremented stock for variant ${item.variantId}: ${variant.quantity} -> ${updatedVariant.quantity} (-${item.quantity})`)
          } else {
            console.log(`⚠️  Variant not found: ${item.variantId}`)
          }
        } else {
          console.log(`⚠️  Item has no variantId: productId=${item.productId}`)
        }
      }
    }
    
    // If confirmed order is being cancelled, restore stock quantities
    if (isBeingCancelled) {
      console.log(`Order ${id} is being cancelled, restoring stock...`)
      
      for (const item of currentOrder.items) {
        if (item.variantId) {
          // Increment stock back
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              quantity: {
                increment: item.quantity
              }
            }
          })
          
          console.log(`Restored stock for variant ${item.variantId}: +${item.quantity}`)
        }
      }
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        updatedAt: new Date()
      },
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
      }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/orders/[id] - Delete order
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Delete order (cascade will handle order items)
    await prisma.order.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}