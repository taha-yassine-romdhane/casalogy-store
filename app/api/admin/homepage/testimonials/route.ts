import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        content: data.content,
        rating: data.rating || 5,
        socialMediaSource: data.socialMediaSource,
        isActive: true,
        sortOrder: data.sortOrder || 0
      }
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
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

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        content: data.content,
        rating: data.rating,
        socialMediaSource: data.socialMediaSource,
        isActive: data.isActive,
        sortOrder: data.sortOrder
      }
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.testimonial.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}