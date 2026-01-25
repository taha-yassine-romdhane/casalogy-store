import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        priority: data.priority || 'medium',
        status: 'new',
        isRead: false,
        isStarred: false
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      id: contactMessage.id 
    })
  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json(
      { error: 'Failed to save message' }, 
      { status: 500 }
    )
  }
}