'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface Table {
  id: string
  floorNumber: number
  tableNumber: number
  status: string
  currentOrder?: {
    id: string
    status: string
    totalAmount: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFloor, setSelectedFloor] = useState<number>(1)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/admin/tables')
      if (!response.ok) throw new Error('Failed to fetch tables')
      const data = await response.json()
      setTables(data)
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update order status')
      fetchTables() // Refresh tables after update
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VACANT':
        return 'bg-green-100 text-green-800'
      case 'ORDER_PLACED':
        return 'bg-yellow-100 text-yellow-800'
      case 'UNDER_PROCESS':
        return 'bg-blue-100 text-blue-800'
      case 'SERVED':
        return 'bg-purple-100 text-purple-800'
      case 'AWAITING_PAYMENT':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTables = tables.filter(table => table.floorNumber === selectedFloor)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Button onClick={() => router.push('/admin/menu')}>
            Manage Menu
          </Button>
          <Button onClick={() => router.push('/admin/orders')}>
            View All Orders
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        {[1, 2, 3].map((floor) => (
          <Button
            key={floor}
            variant={selectedFloor === floor ? 'default' : 'outline'}
            onClick={() => setSelectedFloor(floor)}
          >
            Floor {floor}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className="p-6 bg-white rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Table {table.tableNumber}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(table.status)}`}>
                  {table.status.replace('_', ' ')}
                </span>
              </div>

              {table.currentOrder && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Order #{table.currentOrder.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Amount: ${table.currentOrder.totalAmount}
                  </p>
                  <div className="space-x-2">
                    {table.currentOrder.status === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(table.currentOrder!.id, 'UNDER_PROCESS')}
                      >
                        Start Processing
                      </Button>
                    )}
                    {table.currentOrder.status === 'UNDER_PROCESS' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(table.currentOrder!.id, 'SERVED')}
                      >
                        Mark as Served
                      </Button>
                    )}
                    {table.currentOrder.status === 'SERVED' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(table.currentOrder!.id, 'COMPLETED')}
                      >
                        Complete Order
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 