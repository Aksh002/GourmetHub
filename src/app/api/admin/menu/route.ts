import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/utils/auth'

// Get all menu items
export async function GET() {
  try {
    await requireAdmin()
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { category: 'asc' }
    })
    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new menu item
export async function POST(req: Request) {
  try {
    await requireAdmin()
    const data = await req.json()

    const menuItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        available: data.available
      }
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 