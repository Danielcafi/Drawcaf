import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  TrendingUp,
  Package,
  Star,
  DollarSign,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react'

const COLORS = ['#1E3A8B', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE']

export default function BuyerAnalyticsPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    totalReviews: 0,
    avgOrderValue: 0,
  })
  const [monthlyData, setMonthlyData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchAnalytics()
  }, [user])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: true })

      const { count: reviewCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('buyer_id', user.id)

      if (orders) {
        const totalSpent = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
        const totalOrders = orders.length
        const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

        setStats({
          totalSpent,
          totalOrders,
          totalReviews: reviewCount || 0,
          avgOrderValue,
        })

        // Monthly data
        const monthlyMap = {}
        orders.forEach(order => {
          const date = new Date(order.created_at)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const monthLabel = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
          if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { name: monthLabel, montant: 0, commandes: 0 }
          }
          monthlyMap[monthKey].montant += parseFloat(order.total) || 0
          monthlyMap[monthKey].commandes += 1
        })
        const monthlyArr = Object.values(monthlyMap)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(-6)
        setMonthlyData(monthlyArr)

        // Status distribution
        const statusMap = {}
        orders.forEach(order => {
          const status = order.status || 'pending'
          statusMap[status] = (statusMap[status] || 0) + 1
        })
        const statusLabels = {
          pending: 'En attente',
          confirmed: 'Confirmee',
          preparing: 'En preparation',
          shipped: 'Expediee',
          delivered: 'Livree',
          cancelled: 'Annulee',
        }
        const statusArr = Object.entries(statusMap).map(([key, value]) => ({
          name: statusLabels[key] || key,
          value,
        }))
        setStatusData(statusArr)

        // Top products
        const productMap = {}
        orders.forEach(order => {
          order.order_items?.forEach(item => {
            if (!productMap[item.product_id]) {
              productMap[item.product_id] = {
                name: item.title,
                quantite: 0,
                montant: 0,
              }
            }
            productMap[item.product_id].quantite += item.quantity
            productMap[item.product_id].montant += (item.price * item.quantity)
          })
        })
        const topArr = Object.values(productMap)
          .sort((a, b) => b.montant - a.montant)
          .slice(0, 5)
        setTopProducts(topArr)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En attente': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'Confirmee': return <Package className="w-4 h-4 text-blue-500" />
      case 'En preparation': return <Package className="w-4 h-4 text-blue-500" />
      case 'Expediee': return <Truck className="w-4 h-4 text-purple-500" />
      case 'Livree': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes achats</h1>
        <p className="text-gray-500">Analyse de vos achats et depenses</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total depense',
            value: `${stats.totalSpent.toFixed(2)} EUR`,
            icon: DollarSign,
            color: 'bg-green-100 text-green-600'
          },
          {
            label: 'Commandes',
            value: stats.totalOrders,
            icon: Package,
            color: 'bg-blue-100 text-blue-600'
          },
          {
            label: 'Panier moyen',
            value: `${stats.avgOrderValue.toFixed(2)} EUR`,
            icon: TrendingUp,
            color: 'bg-purple-100 text-purple-600'
          },
          {
            label: 'Avis laisses',
            value: stats.totalReviews,
            icon: Star,
            color: 'bg-yellow-100 text-yellow-600'
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="font-bold text-gray-900 mb-4">Depenses mensuelles</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value.toFixed(2)} EUR`, 'Montant']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="montant" fill="#1E3A8B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              Aucune donnee pour le moment
            </div>
          )}
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="font-bold text-gray-900 mb-4">Repartition des commandes</h3>
          {statusData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600 flex-1">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              Aucune donnee pour le moment
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Produits les plus achetes</h3>
        </div>
        {topProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun achat pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {topProducts.map((product, index) => (
              <div key={index} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.quantite} article(s)</p>
                </div>
                <p className="font-bold text-gray-900">{product.montant.toFixed(2)} EUR</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
