// app/(dashboard)/dashboard/page.tsx
// Dashboard home page

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Building2, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">לוח בקרה</h1>
        <p className="text-gray-600">ברוכים הבאים למערכת הרכש</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות פעילות</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-600">אין הזמנות פעילות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">פריטים בקטלוג</CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-gray-600">פריט אחד זמין</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ספקים</CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600">ספקים פעילים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הזמנות מאושרות</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-600">החודש</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>התחלה מהירה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              מערכת הרכש מוכנה לשימוש! להלן הצעדים הבאים:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>צור הזמנת רכש חדשה דרך תפריט &ldquo;הזמנות רכש&rdquo;</li>
              <li>נהל פריטים בקטלוג דרך תפריט &ldquo;קטלוג פריטים&rdquo;</li>
              <li>הוסף ספקים חדשים דרך תפריט &ldquo;ספקים&rdquo;</li>
              <li>צפה בדוחות ואנליטיקה דרך תפריט &ldquo;דוחות&rdquo;</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
