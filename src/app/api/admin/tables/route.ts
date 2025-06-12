import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/utils/auth'

export async function GET() {
  try {
    // Ensure user is admin
    await requireAdmin()

    const tables = await prisma.table.findMany({
      include: {
        orders: {
          where: {
            status: {
              in: ['PENDING', 'UNDER_PROCESS', 'SERVED']
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })

    // Transform the data to include current order status
    const transformedTables = tables.map(table => ({
      id: table.id,
      floorNumber: table.floorNumber,
      tableNumber: table.tableNumber,
      status: table.status,
      currentOrder: table.orders[0] ? {
        id: table.orders[0].id,
        status: table.orders[0].status,
        totalAmount: table.orders[0].totalAmount
      } : undefined
    }))

    return NextResponse.json(transformedTables)
  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 