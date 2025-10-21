// app/(dashboard)/reports/page.tsx
// Reports and analytics page

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Building2,
  Users,
  Package,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type DateRange = {
  from: string;
  to: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: '',
    to: '',
  });
  const [selectedReport, setSelectedReport] = useState<string>('spending');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    {
      id: 'spending',
      title: 'דוח הוצאות',
      description: 'ניתוח הוצאות לפי תקופה, ספק וחברה',
      icon: TrendingUp,
    },
    {
      id: 'suppliers',
      title: 'דוח ספקים',
      description: 'ביצועי ספקים והזמנות',
      icon: Building2,
    },
    {
      id: 'users',
      title: 'דוח משתמשים',
      description: 'פעילות משתמשים והזמנות שיצרו',
      icon: Users,
    },
    {
      id: 'items',
      title: 'דוח פריטים',
      description: 'ניתוח רכישות לפי פריט',
      icon: Package,
    },
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: selectedReport,
      });
      if (dateRange.from) params.append('from', dateRange.from);
      if (dateRange.to) params.append('to', dateRange.to);

      const res = await fetch(`/api/reports?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setReportData(data);
      } else {
        console.error('Failed to generate report:', data);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!reportData) {
      alert('אנא הפק דוח תחילה');
      return;
    }

    if (format === 'excel' || format === 'csv') {
      // For now, download as JSON (Excel export would require xlsx library)
      const dataStr = JSON.stringify(reportData.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${selectedReport}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // PDF export would require integrating with pdf-generator
      alert('PDF export coming soon');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">דוחות וניתוח</h1>
        <p className="text-gray-600">צפייה בדוחות ויצוא נתונים</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selectedReport === report.id && 'border-primary border-2'
              )}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות דוח</CardTitle>
          <CardDescription>בחר פרמטרים לדוח</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range Picker */}
          <div className="space-y-2">
            <Label>טווח תאריכים</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="fromDate" className="text-sm text-muted-foreground">
                  מתאריך
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="toDate" className="text-sm text-muted-foreground">
                  עד תאריך
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="space-y-2">
            <Label>טווחי זמן מוגדרים מראש</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                  setDateRange({
                    from: firstDayOfMonth.toISOString().split('T')[0],
                    to: now.toISOString().split('T')[0]
                  });
                }}
              >
                החודש הנוכחי
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                  setDateRange({
                    from: lastMonth.toISOString().split('T')[0],
                    to: lastDayOfLastMonth.toISOString().split('T')[0]
                  });
                }}
              >
                החודש הקודם
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
                  setDateRange({
                    from: firstDayOfYear.toISOString().split('T')[0],
                    to: now.toISOString().split('T')[0]
                  });
                }}
              >
                השנה הנוכחית
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const lastYear = new Date(now.getFullYear() - 1, 0, 1);
                  const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
                  setDateRange({
                    from: lastYear.toISOString().split('T')[0],
                    to: endOfLastYear.toISOString().split('T')[0]
                  });
                }}
              >
                שנה שעברה
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleGenerateReport} className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  מפיק דוח...
                </>
              ) : (
                <>
                  <BarChart3 className="ml-2 h-4 w-4" />
                  הפק דוח
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportReport('pdf')}
            >
              <Download className="ml-2 h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportReport('excel')}
            >
              <Download className="ml-2 h-4 w-4" />
              Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportReport('csv')}
            >
              <Download className="ml-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Area */}
      <Card>
        <CardHeader>
          <CardTitle>תצוגה מקדימה של הדוח</CardTitle>
          <CardDescription>
            {reportData ? `דוח ${reportTypes.find(r => r.id === selectedReport)?.title}` : 'הדוח יוצג כאן לאחר בחירת פרמטרים והפקה'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!reportData ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">טרם נוצר דוח</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                בחר סוג דוח, טווח תאריכים ולחץ על &quot;הפק דוח&quot; כדי לראות את התוצאות כאן.
                לאחר מכן תוכל לייצא את הדוח לפורמט המועדף עליך.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              {reportData.data.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  {Object.entries(reportData.data.summary).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-sm text-gray-600">{key}</p>
                      <p className="text-2xl font-bold">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                        {key.includes('Spending') || key.includes('Amount') ? ' ₪' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Spending Report */}
              {selectedReport === 'spending' && reportData.data.byCompany && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">הוצאות לפי חברה</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>חברה</TableHead>
                        <TableHead>סה&quot;כ הזמנות</TableHead>
                        <TableHead>סה&quot;כ הוצאות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.data.byCompany.map((company: any) => (
                        <TableRow key={company.companyId}>
                          <TableCell>{company.companyName}</TableCell>
                          <TableCell>{company.poCount}</TableCell>
                          <TableCell>{company.totalSpent.toLocaleString()} ₪</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <h3 className="text-lg font-semibold mt-6">הוצאות לפי ספק</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ספק</TableHead>
                        <TableHead>סה&quot;כ הזמנות</TableHead>
                        <TableHead>סה&quot;כ הוצאות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.data.bySupplier.map((supplier: any) => (
                        <TableRow key={supplier.supplierId}>
                          <TableCell>{supplier.supplierName}</TableCell>
                          <TableCell>{supplier.poCount}</TableCell>
                          <TableCell>{supplier.totalSpent.toLocaleString()} ₪</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Suppliers Report */}
              {selectedReport === 'suppliers' && reportData.data.suppliers && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">פירוט ספקים</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>שם ספק</TableHead>
                        <TableHead>אימייל</TableHead>
                        <TableHead>טלפון</TableHead>
                        <TableHead>הזמנות</TableHead>
                        <TableHead>סה&quot;כ</TableHead>
                        <TableHead>ממוצע</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.data.suppliers.map((supplier: any) => (
                        <TableRow key={supplier.supplierId}>
                          <TableCell>{supplier.supplierName}</TableCell>
                          <TableCell>{supplier.supplierEmail || '-'}</TableCell>
                          <TableCell>{supplier.supplierPhone || '-'}</TableCell>
                          <TableCell>{supplier.poCount}</TableCell>
                          <TableCell>{supplier.totalSpent.toLocaleString()} ₪</TableCell>
                          <TableCell>{supplier.avgPOAmount.toLocaleString()} ₪</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Users Report */}
              {selectedReport === 'users' && reportData.data.users && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">פעילות משתמשים</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>שם משתמש</TableHead>
                        <TableHead>אימייל</TableHead>
                        <TableHead>הזמנות</TableHead>
                        <TableHead>סה&quot;כ</TableHead>
                        <TableHead>ממוצע</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.data.users.map((user: any) => (
                        <TableRow key={user.userId}>
                          <TableCell>{user.userName}</TableCell>
                          <TableCell>{user.userEmail}</TableCell>
                          <TableCell>{user.poCount}</TableCell>
                          <TableCell>{user.totalSpent.toLocaleString()} ₪</TableCell>
                          <TableCell>{user.avgPOAmount.toLocaleString()} ₪</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Items Report */}
              {selectedReport === 'items' && reportData.data.items && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">ניתוח פריטים</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>שם פריט</TableHead>
                        <TableHead>כמות</TableHead>
                        <TableHead>סה&quot;כ</TableHead>
                        <TableHead>מחיר ממוצע</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.data.items.slice(0, 20).map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.itemSku || '-'}</TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.totalQuantity}</TableCell>
                          <TableCell>{item.totalSpent.toLocaleString()} ₪</TableCell>
                          <TableCell>{item.avgPrice.toLocaleString()} ₪</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
