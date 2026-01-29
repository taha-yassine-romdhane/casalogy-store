import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenEdge } from '@/lib/auth'
import { readdir, stat, unlink } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads')

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Read the uploads directory
    const files = await readdir(UPLOAD_DIR)

    // Filter out non-image files and hidden files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext) && !file.startsWith('.')
    })

    // Get file details
    const images = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(UPLOAD_DIR, filename)
        const stats = await stat(filePath)
        const ext = path.extname(filename).toLowerCase()

        // Determine MIME type
        const mimeTypes: Record<string, string> = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml'
        }

        return {
          id: filename,
          filename: filename,
          originalName: filename.replace(/^\d+_/, ''), // Remove timestamp prefix
          url: `/uploads/${filename}`,
          size: stats.size,
          type: mimeTypes[ext] || 'image/jpeg',
          uploadedAt: stats.mtime.toISOString()
        }
      })
    )

    // Sort by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error listing images:', error)
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyTokenEdge(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    // Prevent directory traversal attacks
    const sanitizedFilename = path.basename(filename)
    const filePath = path.join(UPLOAD_DIR, sanitizedFilename)

    // Check if file exists and is within uploads directory
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    await unlink(filePath)

    return NextResponse.json({ success: true, message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
