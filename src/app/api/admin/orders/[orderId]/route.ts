import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/utils/auth'

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Ensure user is admin
    await requireAdmin()

    const { orderId } = params
    const { status } = await req.json()

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        table: true
      }
    })

    // Update table status based on order status
    let tableStatus = 'VACANT'
    if (status === 'PENDING') tableStatus = 'ORDER_PLACED'
    else if (status === 'UNDER_PROCESS') tableStatus = 'UNDER_PROCESS'
    else if (status === 'SERVED') tableStatus = 'SERVED'
    else if (status === 'COMPLETED') tableStatus = 'AWAITING_PAYMENT'
    else if (status === 'PAID') tableStatus = 'VACANT'

    await prisma.table.update({
      where: { id: order.tableId },
      data: { status: tableStatus }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 