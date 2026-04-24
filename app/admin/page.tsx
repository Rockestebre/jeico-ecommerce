import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [productsCount, categoriesCount, usersCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
  ])

  const stats = [
    { title: 'Productos', value: productsCount, icon: Package, color: 'text-primary' },
    { title: 'Categorías', value: categoriesCount, icon: ShoppingCart, color: 'text-blue-500' },
    { title: 'Usuarios', value: usersCount, icon: Users, color: 'text-green-500' },
    { title: 'Pedidos', value: 0, icon: DollarSign, color: 'text-amber-500' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold tracking-tight">Panel de control</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
