import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/utils/auth'

// Update menu item
export async function PUT(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    await requireAdmin()
    const { itemId } = params
    const data = await req.json()

    const menuItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        available: data.available
      }
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete menu item
export async function DELETE(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    await requireAdmin()
    const { itemId } = params

    await prisma.menuItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'Menu item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 