// app/(dashboard)/reports/page.tsx
// Enhanced reports with BI dashboard and charts

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
  AlertTriangle,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer, Legend } from 'recharts';

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
  const [supplierMonitoring, setSupplierMonitoring] = useState<any>(null);
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

      const [reportRes, monitoringRes] = await Promise.all([
        fetch(`/api/reports?${params.toString()}`),
        fetch('/api/suppliers/monitoring'),
      ]);

      const reportDataJson = await reportRes.json();
      const monitoringDataJson = await monitoringRes.json();

      if (reportDataJson.success) {
        setReportData(reportDataJson);
      } else {
        console.error('Failed to generate report:', reportDataJson);
      }

      if (monitoringDataJson.success) {
        setSupplierMonitoring(monitoringDataJson);
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

    try {
      if (format === 'csv') {
        // Convert data to CSV
        let csvContent = '';

        if (selectedReport === 'spending' && reportData.data.byCompany) {
          csvContent = 'Company,PO Count,Total Spent\n';
          reportData.data.byCompany.forEach((company: any) => {
            csvContent += `"${company.companyName}",${company.poCount},${company.totalSpent}\n`;
          });
        } else if (selectedReport === 'suppliers' && reportData.data.suppliers) {
          csvContent = 'Supplier,Email,Phone,PO Count,Total Spent,Average PO\n';
          reportData.data.suppliers.forEach((supplier: any) => {
            csvContent += `"${supplier.supplierName}","${supplier.supplierEmail || ''}","${supplier.supplierPhone || ''}",${supplier.poCount},${supplier.totalSpent},${supplier.avgPOAmount}\n`;
          });
        } else if (selectedReport === 'users' && reportData.data.users) {
          csvContent = 'User,Email,PO Count,Total Spent,Average PO\n';
          reportData.data.users.forEach((user: any) => {
            csvContent += `"${user.userName}","${user.userEmail}",${user.poCount},${user.totalSpent},${user.avgPOAmount}\n`;
          });
        } else if (selectedReport === 'items' && reportData.data.items) {
          csvContent = 'SKU,Item Name,Quantity,Total Spent,Average Price\n';
          reportData.data.items.forEach((item: any) => {
            csvContent += `"${item.itemSku || ''}","${item.itemName}",${item.totalQuantity},${item.totalSpent},${item.avgPrice}\n`;
          });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${selectedReport}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'excel') {
        // For Excel, we'll use JSON for now (would need xlsx library for real Excel)
        const dataStr = JSON.stringify(reportData.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${selectedReport}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        alert('PDF export will be available soon - requires additional server-side processing');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('שגיאה ביצוא הדוח');
    }
  };

  // Chart colors
  const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">דוחות וניתוח</h1>
        <p className="text-gray-600">צפייה בדוחות, גרפים ויצוא נתונים</p>
      </div>

      {/* 100K Supplier Alert */}
      {supplierMonitoring && supplierMonitoring.summary.suppliersExceedingThreshold > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>אזהרה: ספקים חרגו מתקציב חודשי</AlertTitle>
          <AlertDescription>
            {supplierMonitoring.summary.suppliersExceedingThreshold} ספקים חרגו מתקציב של ₪100,000 בחודש{' '}
            {supplierMonitoring.summary.currentMonth}. נדרש אישור מנכ״ל להזמנות נוספות לספקים אלה.
            <div className="mt-2">
              <strong>ספקים חורגים:</strong>{' '}
              {supplierMonitoring.exceedingSuppliers.map((s: any) => (
                <span key={s.supplierId} className="mr-2">
                  {s.supplierName} (₪{s.totalSpent.toLocaleString()})
                </span>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

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
              disabled={!reportData}
            >
              <Download className="ml-2 h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportReport('csv')}
              disabled={!reportData}
            >
              <Download className="ml-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview with Charts */}
      {!reportData ? (
        <Card>
          <CardHeader>
            <CardTitle>תצוגה מקדימה של הדוח</CardTitle>
            <CardDescription>הדוח יוצג כאן לאחר בחירת פרמטרים והפקה</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">טרם נוצר דוח</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                בחר סוג דוח, טווח תאריכים ולחץ על &quot;הפק דוח&quot; כדי לראות את התוצאות כאן.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          {reportData.data.summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(reportData.data.summary).map(([key, value]) => (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {key === 'totalSpending' && 'סה"כ הוצאות'}
                      {key === 'totalPOs' && 'סה"כ הזמנות'}
                      {key === 'averagePOAmount' && 'ממוצע הזמנה'}
                      {key === 'totalSuppliers' && 'סה"כ ספקים'}
                      {key === 'totalUsers' && 'סה"כ משתמשים'}
                      {key === 'totalUniqueItems' && 'סה"כ פריטים'}
                      {key === 'totalQuantity' && 'סה"כ כמות'}
                      {!['totalSpending', 'totalPOs', 'averagePOAmount', 'totalSuppliers', 'totalUsers', 'totalUniqueItems', 'totalQuantity'].includes(key) && key}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {typeof value === 'number'
                        ? value.toLocaleString('he-IL')
                        : value != null ? String(value) : '0'}
                      {(key.includes('Spending') || key.includes('Amount')) && ' ₪'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Spending Report with Charts */}
          {selectedReport === 'spending' && reportData.data.byCompany && (
            <div className="space-y-6">
              {/* Bar Chart - Spending by Company */}
              <Card>
                <CardHeader>
                  <CardTitle>הוצאות לפי חברה</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.data.byCompany.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="companyName"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="totalSpent" fill="hsl(var(--chart-1))" name="סה״כ הוצאות" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Pie Chart - Spending by Supplier */}
              <Card>
                <CardHeader>
                  <CardTitle>התפלגות הוצאות לפי ספק (Top 5)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.data.bySupplier.slice(0, 5)}
                          dataKey="totalSpent"
                          nameKey="supplierName"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={(entry) => `${entry.supplierName}: ₪${entry.totalSpent.toLocaleString()}`}
                        >
                          {reportData.data.bySupplier.slice(0, 5).map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Table */}
              <Card>
                <CardHeader>
                  <CardTitle>פירוט הוצאות לפי חברה</CardTitle>
                </CardHeader>
                <CardContent>
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
                          <TableCell>₪{company.totalSpent.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Suppliers Report */}
          {selectedReport === 'suppliers' && reportData.data.suppliers && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ספקים מובילים</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.data.suppliers.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="supplierName"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="totalSpent" fill="hsl(var(--chart-2))" name="סה״כ הוצאות" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>פירוט ספקים</CardTitle>
                </CardHeader>
                <CardContent>
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
                          <TableCell>₪{supplier.totalSpent.toLocaleString()}</TableCell>
                          <TableCell>₪{supplier.avgPOAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Report */}
          {selectedReport === 'users' && reportData.data.users && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>פעילות משתמשים</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.data.users.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="userName"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="poCount" fill="hsl(var(--chart-3))" name="מספר הזמנות" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>פירוט משתמשים</CardTitle>
                </CardHeader>
                <CardContent>
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
                          <TableCell>₪{user.totalSpent.toLocaleString()}</TableCell>
                          <TableCell>₪{user.avgPOAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Items Report */}
          {selectedReport === 'items' && reportData.data.items && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>פריטים מובילים (Top 10)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.data.items.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="itemName"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="totalSpent" fill="hsl(var(--chart-4))" name="סה״כ הוצאות" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ניתוח פריטים</CardTitle>
                </CardHeader>
                <CardContent>
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
                          <TableCell>₪{item.totalSpent.toLocaleString()}</TableCell>
                          <TableCell>₪{item.avgPrice.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
