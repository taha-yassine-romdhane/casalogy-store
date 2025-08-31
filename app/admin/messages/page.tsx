"use client"

import { useState, useEffect } from 'react'
import { 
  Search, 
  Mail, 
  MailOpen, 
  Trash2, 
  Eye,
  Star,
  Reply,
  Filter,
  MessageSquare,
  Clock,
  User,
  Phone,
  AlertCircle
} from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  isRead: boolean
  isStarred: boolean
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'in_progress' | 'resolved'
  createdAt: string
  respondedAt?: string
  tags?: string[]
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyText, setReplyText] = useState('')

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: ContactMessage[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+216 23 456 789',
        subject: 'Question about scrub sizing',
        message: 'Hi, I am interested in ordering scrubs but I am not sure about the sizing. Could you please provide more information about your size chart? I normally wear a size M but I want to make sure it fits properly.',
        isRead: false,
        isStarred: true,
        priority: 'high',
        status: 'new',
        createdAt: '2024-01-15T10:30:00Z',
        tags: ['sizing', 'scrubs']
      },
      {
        id: '2',
        name: 'Ahmed Ben Ali',
        email: 'ahmed.benali@hospital.tn',
        phone: '+216 98 765 432',
        subject: 'Bulk order inquiry',
        message: 'Hello, I am the procurement manager at Tunis Central Hospital. We are interested in placing a bulk order for medical scrubs for our nursing staff. Could you please send us a quote for 100 sets of scrubs in various sizes? We would also like to know about your delivery timeline.',
        isRead: true,
        isStarred: false,
        priority: 'high',
        status: 'in_progress',
        createdAt: '2024-01-14T14:20:00Z',
        respondedAt: '2024-01-14T16:45:00Z',
        tags: ['bulk-order', 'hospital', 'quote']
      },
      {
        id: '3',
        name: 'Fatima Trabelsi',
        email: 'fatima.trabelsi@gmail.com',
        subject: 'Student discount verification',
        message: 'I am a nursing student at the University of Monastir. I would like to apply for the student discount. I have uploaded my student ID but I have not received any confirmation. Could you please help me with this?',
        isRead: true,
        isStarred: false,
        priority: 'medium',
        status: 'resolved',
        createdAt: '2024-01-13T09:15:00Z',
        respondedAt: '2024-01-13T11:30:00Z',
        tags: ['student-discount', 'verification']
      },
      {
        id: '4',
        name: 'Mohamed Karray',
        email: 'mohamed.karray@clinic.tn',
        subject: 'Return request',
        message: 'I recently purchased a lab coat (Order #12345) but it does not fit properly. I would like to return it and get a refund. The item is still in its original packaging. Please let me know the return process.',
        isRead: false,
        isStarred: false,
        priority: 'medium',
        status: 'new',
        createdAt: '2024-01-12T16:45:00Z',
        tags: ['return', 'refund', 'lab-coat']
      },
      {
        id: '5',
        name: 'Leila Mansouri',
        email: 'leila.mansouri@email.com',
        subject: 'Payment issue',
        message: 'I tried to place an order but I am having trouble with the payment. The page keeps loading and does not complete the transaction. I tried multiple times with different cards. Please help.',
        isRead: true,
        isStarred: true,
        priority: 'high',
        status: 'in_progress',
        createdAt: '2024-01-11T13:20:00Z',
        tags: ['payment', 'technical-issue']
      },
      {
        id: '6',
        name: 'Youssef Hamdi',
        email: 'youssef.hamdi@email.com',
        subject: 'Product availability',
        message: 'Hello, I am looking for navy blue scrubs in size XL. I see they are out of stock on the website. When do you expect them to be available again?',
        isRead: false,
        isStarred: false,
        priority: 'low',
        status: 'new',
        createdAt: '2024-01-10T11:10:00Z',
        tags: ['stock', 'availability']
      }
    ]
    
    setTimeout(() => {
      setMessages(mockMessages)
      setLoading(false)
    }, 500)
  }, [])

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
  }

  const handleToggleStar = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
  }

  const handleUpdateStatus = (messageId: string, status: ContactMessage['status']) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ))
  }

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter(m => m.id !== messageId))
    setDeleteConfirm(null)
  }

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      handleMarkAsRead(message.id)
    }
  }

  const handleSendReply = () => {
    if (selectedMessage && replyText.trim()) {
      // In a real app, this would send an email
      const updatedMessage = {
        ...selectedMessage,
        status: 'in_progress' as const,
        respondedAt: new Date().toISOString()
      }
      setMessages(messages.map(msg => 
        msg.id === selectedMessage.id ? updatedMessage : msg
      ))
      setSelectedMessage(updatedMessage)
      setReplyText('')
      setShowReplyModal(false)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || message.status === statusFilter
    const matchesPriority = priorityFilter === '' || message.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: ContactMessage['status']) => {
    const badges = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800'
    }
    
    const labels = {
      new: 'New',
      in_progress: 'In Progress',
      resolved: 'Resolved'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getPriorityBadge = (priority: ContactMessage['priority']) => {
    const badges = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
          <p className="text-gray-600">Manage customer inquiries and support requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-800">{messages.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-800">
                {messages.filter(m => !m.isRead).length}
              </p>
            </div>
            <Mail className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-800">
                {messages.filter(m => m.priority === 'high').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-800">
                {messages.filter(m => m.status === 'resolved').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages by name, email, subject, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading messages...</p>
                  </td>
                </tr>
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No messages found</p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((message) => (
                  <tr key={message.id} className={`hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {message.isRead ? (
                            <MailOpen className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Mail className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${!message.isRead ? 'text-gray-900 font-semibold' : 'text-gray-800'}`}>
                              {message.subject}
                            </span>
                            {message.isStarred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600 truncate max-w-md">
                            {message.message}
                          </div>
                          {message.tags && (
                            <div className="flex gap-1 mt-1">
                              {message.tags.map((tag, index) => (
                                <span key={index} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{message.name}</div>
                        <div className="text-sm text-gray-600">{message.email}</div>
                        {message.phone && (
                          <div className="text-xs text-gray-500">{message.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getPriorityBadge(message.priority)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStar(message.id)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            message.isStarred ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                          title={message.isStarred ? 'Remove star' : 'Add star'}
                        >
                          <Star className={`w-4 h-4 ${message.isStarred ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="View message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(message.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedMessage.name}
                    </div>
                    <div>{selectedMessage.email}</div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedMessage.phone}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {getPriorityBadge(selectedMessage.priority)}
                    {getStatusBadge(selectedMessage.status)}
                    <span className="text-xs text-gray-500">
                      {formatDate(selectedMessage.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {selectedMessage.respondedAt && (
                <div className="text-sm text-green-600 mb-4">
                  ✓ Responded on {formatDate(selectedMessage.respondedAt)}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value as ContactMessage['status'])}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReplyModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Reply to {selectedMessage.name}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your reply here..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setReplyText('')
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Delete Message</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}