// app/(dashboard)/reports/page.tsx
// Reports and analytics page

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Building2,
  Users,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DateRange = {
  from: string;
  to: string;
};

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: '',
    to: '',
  });
  const [selectedReport, setSelectedReport] = useState<string>('spending');

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

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log('Generating report:', {
      type: selectedReport,
      dateRange,
    });
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // TODO: Implement export functionality
    console.log('Exporting report as:', format);
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
            <Button onClick={handleGenerateReport} className="flex-1">
              <BarChart3 className="ml-2 h-4 w-4" />
              הפק דוח
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
            הדוח יוצג כאן לאחר בחירת פרמטרים והפקה
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">טרם נוצר דוח</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              בחר סוג דוח, טווח תאריכים ולחץ על &quot;הפק דוח&quot; כדי לראות את התוצאות כאן.
              לאחר מכן תוכל לייצא את הדוח לפורמט המועדף עליך.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
