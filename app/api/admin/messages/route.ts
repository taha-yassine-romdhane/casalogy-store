import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
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

    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        isRead: data.isRead,
        isStarred: data.isStarred,
        priority: data.priority,
        status: data.status,
        respondedAt: data.respondedAt
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error updating contact message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.contactMessage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}