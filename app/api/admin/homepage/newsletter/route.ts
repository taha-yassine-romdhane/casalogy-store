import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const newsletterSection = await prisma.newsletterSection.findFirst({
      where: { isActive: true }
    })

    if (!newsletterSection) {
      return NextResponse.json({
        title: "Stay Updated",
        description: "Get exclusive offers and updates on new arrivals",
        placeholder: "Enter your email",
        buttonText: "Subscribe",
        isActive: true
      })
    }

    return NextResponse.json(newsletterSection)
  } catch (error) {
    console.error('Error fetching newsletter section:', error)
    return NextResponse.json({ error: 'Failed to fetch newsletter section' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    await prisma.newsletterSection.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    const newsletterSection = await prisma.newsletterSection.create({
      data: {
        title: data.title,
        description: data.description,
        placeholder: data.placeholder || "Enter your email",
        buttonText: data.buttonText || "Subscribe",
        isActive: true
      }
    })

    return NextResponse.json(newsletterSection)
  } catch (error) {
    console.error('Error saving newsletter section:', error)
    return NextResponse.json({ error: 'Failed to save newsletter section' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const newsletterSection = await prisma.newsletterSection.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        placeholder: data.placeholder,
        buttonText: data.buttonText,
        isActive: data.isActive
      }
    })

    return NextResponse.json(newsletterSection)
  } catch (error) {
    console.error('Error updating newsletter section:', error)
    return NextResponse.json({ error: 'Failed to update newsletter section' }, { status: 500 })
  }
}