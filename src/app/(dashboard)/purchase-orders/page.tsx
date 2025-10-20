// app/(dashboard)/purchase-orders/page.tsx
// Purchase Orders list page

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Eye } from 'lucide-react';

type PurchaseOrder = {
  id: string;
  poNumber: string;
  date: string;
  status: string;
  totalAmount: number;
  supplier: { id: string; name: string };
  company: { id: string; name: string };
  createdBy: { id: string; name: string };
  createdAt: string;
  submittedAt?: string | null;
  approvedAt?: string | null;
};

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  DRAFT: 'secondary',
  PENDING_APPROVAL: 'default',
  APPROVED: 'default',
  REJECTED: 'destructive',
  CANCELLED: 'outline',
  CHANGE_REQUESTED: 'outline',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'טיוטה',
  PENDING_APPROVAL: 'ממתין לאישור',
  APPROVED: 'מאושר',
  REJECTED: 'נדחה',
  CANCELLED: 'בוטל',
  CHANGE_REQUESTED: 'דורש שינויים',
};

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const res = await fetch('/api/purchase-orders');
      const data = await res.json();
      setPurchaseOrders(data.purchaseOrders);
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">הזמנות רכש</h1>
          <p className="text-gray-600">נהל וצור הזמנות רכש חדשות</p>
        </div>
        <Button onClick={() => router.push('/purchase-orders/new')}>
          <Plus className="h-4 w-4 ml-2" />
          הזמנה חדשה
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת הזמנות רכש</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>טוען...</p>
          ) : purchaseOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">אין הזמנות רכש עדיין</p>
              <Button onClick={() => router.push('/purchase-orders/new')}>
                <Plus className="h-4 w-4 ml-2" />
                צור הזמנה ראשונה
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>מספר הזמנה</TableHead>
                  <TableHead>תאריך</TableHead>
                  <TableHead>ספק</TableHead>
                  <TableHead>חברה</TableHead>
                  <TableHead>סכום כולל</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>נוצר על ידי</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>
                      {new Date(po.date).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell>{po.supplier.name}</TableCell>
                    <TableCell>{po.company.name}</TableCell>
                    <TableCell>{po.totalAmount.toLocaleString()} ₪</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[po.status] || 'default'}>
                        {STATUS_LABELS[po.status] || po.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{po.createdBy.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/purchase-orders/${po.id}`)}
                      >
                        <Eye className="h-4 w-4 ml-1" />
                        צפה
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
