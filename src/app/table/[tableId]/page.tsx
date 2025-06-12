'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  available: boolean
  category: string
}

interface CartItem extends MenuItem {
  quantity: number
}

export default function TablePage({ params }: { params: { tableId: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu')
      if (!response.ok) throw new Error('Failed to fetch menu items')
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error('Error fetching menu items:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: params.tableId,
          items: cart.map(item => ({
            itemId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }),
      })

      if (!response.ok) throw new Error('Failed to place order')
      
      setCart([])
      router.push('/orders')
    } catch (error) {
      console.error('Error placing order:', error)
    }
  }

  const categories = ['all', ...new Set(menuItems.map(item => item.category))]
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory)

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Menu</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <p className="text-gray-600">{item.description}</p>
              <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>

              <Button
                onClick={() => addToCart(item)}
                disabled={!item.available}
                className="w-full"
              >
                Add to Cart
              </Button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Cart</h3>
                <p className="text-gray-600">
                  {cart.length} items - Total: ${cartTotal.toFixed(2)}
                </p>
              </div>
              <Button onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 