"use client"

import { useState, useEffect } from "react"
import { Check, X, Eye, Calendar, GraduationCap, Mail, User } from "lucide-react"

interface PendingStudent {
  id: string
  firstName: string
  lastName: string
  email: string
  faculty: string
  studentIdFront: string | null
  studentIdBack: string | null
  createdAt: string
}

interface VerifiedStudent {
  id: string
  firstName: string
  lastName: string
  email: string
  faculty: string
  studentVerifiedAt: string
}

export default function StudentVerificationPage() {
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([])
  const [verifiedStudents, setVerifiedStudents] = useState<VerifiedStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<{studentId: string, front?: string, back?: string} | null>(null)

  useEffect(() => {
    fetchStudentVerifications()
  }, [])

  const fetchStudentVerifications = async () => {
    try {
      const response = await fetch('/api/admin/student-verification')
      const data = await response.json()
      
      if (data.success) {
        setPendingStudents(data.pending)
        setVerifiedStudents(data.verified)
      }
    } catch (error) {
      console.error('Error fetching student verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (studentId: string, action: 'approve' | 'reject') => {
    setProcessing(studentId)
    
    try {
      const response = await fetch('/api/admin/student-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, action }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh the data
        await fetchStudentVerifications()
        alert(data.message)
      } else {
        alert(data.error || 'Failed to process verification')
      }
    } catch (error) {
      console.error('Error processing verification:', error)
      alert('Network error occurred')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Verification</h1>
        <p className="text-gray-600">Review and approve student discount applications</p>
      </div>

      {/* Pending Verifications */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Pending Verifications ({pendingStudents.length})
          </h2>
        </div>
        
        {pendingStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No pending student verifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingStudents.map((student) => (
              <div key={student.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600 ml-8">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {student.faculty}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Applied {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* ID Images */}
                    <div className="flex gap-4 mt-4 ml-8">
                      {student.studentIdFront && (
                        <button
                          onClick={() => setSelectedImages({
                            studentId: student.id,
                            front: student.studentIdFront!,
                            back: student.studentIdBack || undefined
                          })}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View ID Front
                        </button>
                      )}
                      {student.studentIdBack && (
                        <button
                          onClick={() => setSelectedImages({
                            studentId: student.id,
                            front: student.studentIdFront || undefined,
                            back: student.studentIdBack!
                          })}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View ID Back
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerification(student.id, 'approve')}
                      disabled={processing === student.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerification(student.id, 'reject')}
                      disabled={processing === student.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Verified Students */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recently Verified Students</h2>
        </div>
        
        {verifiedStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No verified students yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {verifiedStudents.map((student) => (
              <div key={student.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-sm text-gray-600">{student.faculty}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(student.studentVerifiedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImages && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Student ID Documents</h3>
                <button
                  onClick={() => setSelectedImages(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {selectedImages.front && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Front Side</h4>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <img 
                        src={selectedImages.front} 
                        alt="Student ID Front"
                        className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                    </div>
                  </div>
                )}
                {selectedImages.back && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Back Side</h4>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <img 
                        src={selectedImages.back} 
                        alt="Student ID Back"
                        className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}