import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const firstName = formData.get('firstName')?.toString() || ''
    const lastName = formData.get('lastName')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const phone = formData.get('phone')?.toString() || ''
    const address = formData.get('address')?.toString() || ''
    const region = formData.get('region')?.toString() || ''
    const password = formData.get('password')?.toString() || ''
    const confirmPassword = formData.get('confirmPassword')?.toString() || ''
    const isStudent = formData.get('isStudent') === 'true'
    const faculty = formData.get('faculty')?.toString() || ''
    const agreeToTerms = formData.get('agreeToTerms') === 'true'
    
    // Extract image files
    const idFront = formData.get('idFront') as File | null
    const idBack = formData.get('idBack') as File | null

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !address || !region || !password || !agreeToTerms) {
      return NextResponse.json(
        { 
          success: false,
          error: 'All required fields must be filled' 
        },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Passwords do not match' 
        },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Password must be at least 8 characters long' 
        },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Please enter a valid email address' 
        },
        { status: 400 }
      )
    }

    if (isStudent && !faculty) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Please select your medical faculty' 
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'An account with this email already exists' 
        },
        { status: 409 }
      )
    }

    // Handle image uploads for student verification
    let studentIdFrontUrl: string | null = null
    let studentIdBackUrl: string | null = null
    
    if (isStudent && (idFront || idBack)) {
      try {
        // Create uploads directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'student-ids')
        await mkdir(uploadsDir, { recursive: true })
        
        // Generate unique filename prefix
        const timestamp = Date.now()
        const emailPrefix = email.split('@')[0].toLowerCase()
        
        if (idFront) {
          const extension = idFront.name.split('.').pop() || 'jpg'
          const filename = `${emailPrefix}_${timestamp}_front.${extension}`
          const filepath = path.join(uploadsDir, filename)
          
          const bytes = await idFront.arrayBuffer()
          await writeFile(filepath, new Uint8Array(bytes))
          studentIdFrontUrl = `/uploads/student-ids/${filename}`
        }
        
        if (idBack) {
          const extension = idBack.name.split('.').pop() || 'jpg'
          const filename = `${emailPrefix}_${timestamp}_back.${extension}`
          const filepath = path.join(uploadsDir, filename)
          
          const bytes = await idBack.arrayBuffer()
          await writeFile(filepath, new Uint8Array(bytes))
          studentIdBackUrl = `/uploads/student-ids/${filename}`
        }
      } catch (uploadError) {
        console.error('File upload error:', uploadError)
        return NextResponse.json(
          { 
            success: false,
            error: 'Error uploading verification documents. Please try again.' 
          },
          { status: 500 }
        )
      }
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: `${address.trim()}, ${region}`,
        region: region,
        password: hashedPassword,
        role: 'CLIENT',
        isStudent: isStudent || false,
        faculty: isStudent ? faculty : null,
        studentIdFront: studentIdFrontUrl,
        studentIdBack: studentIdBackUrl,
        studentVerified: false, // New students are not verified by default
        isVerified: false
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'An error occurred while creating your account. Please try again.' 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}