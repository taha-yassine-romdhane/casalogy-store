import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const heroSection = await prisma.heroSection.findFirst({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    if (!heroSection) {
      return NextResponse.json({
        title: "Premium Medical Wear for Healthcare Professionals",
        subtitle: "Comfortable, durable, and stylish scrubs designed for medical students and healthcare workers in Tunisia",
        buttonText: "Shop Now",
        buttonLink: "/products",
        mediaType: 'image',
        mediaUrl: "/hero-bg.jpg",
        isActive: true
      })
    }

    return NextResponse.json(heroSection)
  } catch (error) {
    console.error('Error fetching hero section:', error)
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    await prisma.heroSection.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    const heroSection = await prisma.heroSection.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        mediaType: data.mediaType || 'image',
        mediaUrl: data.mediaUrl,
        mediaUrls: data.mediaUrls || null,
        isActive: true,
        sortOrder: 0
      }
    })

    return NextResponse.json(heroSection)
  } catch (error) {
    console.error('Error saving hero section:', error)
    return NextResponse.json({ error: 'Failed to save hero section' }, { status: 500 })
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

    const heroSection = await prisma.heroSection.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        mediaUrls: data.mediaUrls || null,
        isActive: data.isActive
      }
    })

    return NextResponse.json(heroSection)
  } catch (error) {
    console.error('Error updating hero section:', error)
    return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 })
  }
}