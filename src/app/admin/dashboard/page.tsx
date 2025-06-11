'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data')
        }

        // Check if user is admin
        if (data.user.role !== 'ADMIN') {
          router.push('/dashboard')
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
        router.push('/login')
      }
    }

    fetchUser()
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome, {user.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for admin dashboard content */}
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-red-900">
                  Orders Management
                </h3>
                <p className="mt-2 text-red-700">
                  Manage and track all orders
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900">
                  Menu Management
                </h3>
                <p className="mt-2 text-blue-700">
                  Update menu items and categories
                </p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900">
                  User Management
                </h3>
                <p className="mt-2 text-yellow-700">
                  Manage user accounts and roles
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 