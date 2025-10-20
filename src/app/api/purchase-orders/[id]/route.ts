// app/api/purchase-orders/[id]/route.ts
// Individual purchase order API endpoints

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, ApiError } from '@/lib/api-error';

// GET /api/purchase-orders/[id] - Get purchase order by ID
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { id } = await params;
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      select: {
        id: true,
        poNumber: true,
        date: true,
        status: true,
        totalAmount: true,
        supplierId: true,
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        companyId: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        remarks: true,
        createdById: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lineItems: {
          select: {
            id: true,
            itemId: true,
            itemName: true,
            itemDescription: true,
            itemSku: true,
            character1: true,
            character2: true,
            character3: true,
            unitPrice: true,
            quantity: true,
            lineTotal: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        approvals: {
          select: {
            id: true,
            approverId: true,
            approver: {
              select: {
                id: true,
                name: true,
              },
            },
            level: true,
            status: true,
            comments: true,
            createdAt: true,
            respondedAt: true,
          },
          orderBy: {
            level: 'asc',
          },
        },
        createdAt: true,
        updatedAt: true,
        submittedAt: true,
        approvedAt: true,
      },
    });

    if (!purchaseOrder) {
      throw new ApiError(404, 'Purchase Order not found');
    }

    // Check permissions: users can only see their own POs
    if (
      session.user.role === 'USER' &&
      purchaseOrder.createdById !== session.user.id
    ) {
      throw new ApiError(403, 'Forbidden');
    }

    return NextResponse.json({ purchaseOrder });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/purchase-orders/[id] - Update purchase order
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { id } = await params;
    const body = await request.json();
    const { supplierId, companyId, remarks, lineItems, status } = body;

    // Get existing PO
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        createdById: true,
      },
    });

    if (!existingPO) {
      throw new ApiError(404, 'Purchase Order not found');
    }

    // Check permissions: only creator can edit DRAFT POs
    if (existingPO.createdById !== session.user.id) {
      throw new ApiError(403, 'Only the creator can edit this Purchase Order');
    }

    if (existingPO.status !== 'DRAFT' && !status) {
      throw new ApiError(400, 'Can only edit Purchase Orders in DRAFT status');
    }

    const updateData: Record<string, unknown> = {};

    if (supplierId !== undefined) updateData.supplierId = supplierId;
    if (companyId !== undefined) updateData.companyId = companyId;
    if (remarks !== undefined) updateData.remarks = remarks;

    // Handle status change from DRAFT to PENDING_APPROVAL
    if (status === 'PENDING_APPROVAL' && existingPO.status === 'DRAFT') {
      updateData.status = 'PENDING_APPROVAL';
      updateData.submittedAt = new Date();
    }

    // Handle status change to CANCELLED
    if (status === 'CANCELLED') {
      updateData.status = 'CANCELLED';
    }

    // If line items are provided, replace them
    if (lineItems && Array.isArray(lineItems)) {
      // Calculate new total
      const totalAmount = lineItems.reduce(
        (sum: number, item: { unitPrice: number; quantity: number }) =>
          sum + item.unitPrice * item.quantity,
        0
      );
      updateData.totalAmount = totalAmount;

      // Delete existing line items and create new ones
      await prisma.pOLineItem.deleteMany({
        where: { poId: id },
      });

      updateData.lineItems = {
        create: lineItems.map((item: {
          itemId?: string;
          itemName: string;
          itemDescription?: string;
          itemSku?: string;
          character1?: string;
          character2?: string;
          character3?: string;
          unitPrice: number;
          quantity: number;
        }) => ({
          itemId: item.itemId || null,
          itemName: item.itemName,
          itemDescription: item.itemDescription || null,
          itemSku: item.itemSku || null,
          character1: item.character1 || null,
          character2: item.character2 || null,
          character3: item.character3 || null,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.unitPrice * item.quantity,
        })),
      };
    }

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        poNumber: true,
        date: true,
        status: true,
        totalAmount: true,
        supplierId: true,
        companyId: true,
        remarks: true,
        createdById: true,
        updatedAt: true,
        submittedAt: true,
      },
    });

    return NextResponse.json({ purchaseOrder });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/purchase-orders/[id] - Delete purchase order (only DRAFT)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const { id } = await params;
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        createdById: true,
      },
    });

    if (!existingPO) {
      throw new ApiError(404, 'Purchase Order not found');
    }

    // Check permissions
    if (existingPO.createdById !== session.user.id) {
      throw new ApiError(403, 'Only the creator can delete this Purchase Order');
    }

    if (existingPO.status !== 'DRAFT') {
      throw new ApiError(400, 'Can only delete Purchase Orders in DRAFT status');
    }

    // Delete PO (cascade will delete line items)
    await prisma.purchaseOrder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
