import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/promo-codes/validate - Validate and calculate discount
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, subtotal, userId } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      )
    }

    // Find the promo code
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Invalid promo code', valid: false },
        { status: 400 }
      )
    }

    // Check if code is active
    if (!promoCode.isActive) {
      return NextResponse.json(
        { error: 'This promo code is no longer active', valid: false },
        { status: 400 }
      )
    }

    // Check date validity
    const now = new Date()
    if (promoCode.startDate && now < promoCode.startDate) {
      return NextResponse.json(
        { error: 'This promo code is not yet active', valid: false },
        { status: 400 }
      )
    }

    if (promoCode.endDate && now > promoCode.endDate) {
      return NextResponse.json(
        { error: 'This promo code has expired', valid: false },
        { status: 400 }
      )
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return NextResponse.json(
        { error: 'This promo code has reached its usage limit', valid: false },
        { status: 400 }
      )
    }

    // Check per-user limit if user is logged in
    if (userId && promoCode.perUserLimit) {
      const userUsageCount = await prisma.order.count({
        where: {
          userId,
          promoCodeId: promoCode.id
        }
      })

      if (userUsageCount >= promoCode.perUserLimit) {
        return NextResponse.json(
          { error: 'You have already used this promo code the maximum number of times', valid: false },
          { status: 400 }
        )
      }
    }

    // Check minimum order amount
    const orderSubtotal = parseFloat(subtotal) || 0
    if (promoCode.minOrderAmount && orderSubtotal < parseFloat(promoCode.minOrderAmount.toString())) {
      return NextResponse.json(
        {
          error: `Minimum order amount of ${promoCode.minOrderAmount} TND required`,
          valid: false,
          minOrderAmount: parseFloat(promoCode.minOrderAmount.toString())
        },
        { status: 400 }
      )
    }

    // Calculate discount
    let discountAmount: number
    const discountValue = parseFloat(promoCode.discountValue.toString())

    if (promoCode.discountType === 'PERCENTAGE') {
      discountAmount = (orderSubtotal * discountValue) / 100

      // Apply max discount cap if set
      if (promoCode.maxDiscount) {
        const maxDiscount = parseFloat(promoCode.maxDiscount.toString())
        discountAmount = Math.min(discountAmount, maxDiscount)
      }
    } else {
      // Fixed amount discount
      discountAmount = Math.min(discountValue, orderSubtotal)
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100

    return NextResponse.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: discountValue,
        description: promoCode.description
      },
      discountAmount,
      newTotal: Math.round((orderSubtotal - discountAmount) * 100) / 100
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json(
      { error: 'Failed to validate promo code', valid: false },
      { status: 500 }
    )
  }
}
