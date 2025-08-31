import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const aboutSection = await prisma.aboutSection.findFirst({
      where: { isActive: true },
      include: {
        features: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!aboutSection) {
      return NextResponse.json({
        title: "Why Choose Our Medical Wear?",
        description: "Designed with healthcare professionals in mind",
        features: [
          {
            icon: "Shield",
            title: "Premium Quality",
            description: "High-quality fabrics that withstand frequent washing"
          },
          {
            icon: "Heart",
            title: "Comfortable Fit",
            description: "Designed for long shifts with maximum comfort"
          },
          {
            icon: "Award",
            title: "Professional Look",
            description: "Modern, professional appearance that inspires confidence"
          },
          {
            icon: "Truck",
            title: "Fast Delivery",
            description: "Quick delivery across Tunisia with tracking"
          }
        ],
        isActive: true
      })
    }

    return NextResponse.json(aboutSection)
  } catch (error) {
    console.error('Error fetching about section:', error)
    return NextResponse.json({ error: 'Failed to fetch about section' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    await prisma.aboutSection.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    const aboutSection = await prisma.aboutSection.create({
      data: {
        title: data.title,
        description: data.description,
        isActive: true,
        features: {
          create: data.features?.map((feature: any, index: number) => ({
            icon: feature.icon,
            title: feature.title,
            description: feature.description,
            sortOrder: index
          })) || []
        }
      },
      include: {
        features: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return NextResponse.json(aboutSection)
  } catch (error) {
    console.error('Error saving about section:', error)
    return NextResponse.json({ error: 'Failed to save about section' }, { status: 500 })
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

    await prisma.aboutFeature.deleteMany({
      where: { sectionId: id }
    })

    const aboutSection = await prisma.aboutSection.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        isActive: data.isActive,
        features: {
          create: data.features?.map((feature: any, index: number) => ({
            icon: feature.icon,
            title: feature.title,
            description: feature.description,
            sortOrder: index
          })) || []
        }
      },
      include: {
        features: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return NextResponse.json(aboutSection)
  } catch (error) {
    console.error('Error updating about section:', error)
    return NextResponse.json({ error: 'Failed to update about section' }, { status: 500 })
  }
}