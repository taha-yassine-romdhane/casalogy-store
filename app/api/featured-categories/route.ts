import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const featuredCategories = await prisma.featuredCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(featuredCategories)
  } catch (error) {
    console.error('Error fetching featured categories:', error)
    return NextResponse.json({ error: 'Failed to fetch featured categories' }, { status: 500 })
  }
}