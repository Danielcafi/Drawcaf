import { useEffect, useState } from 'react'
import { useStoreStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function DashboardOverview() {
  const { currentStore } = useStoreStore()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    avgOrderValue: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (currentStore) {
      fetchStats()
    }
  }, [currentStore])
  
  const fetchStats = async () => {
    setLoading(true)
    
    try {
      // Fetch products
      const { data: allProducts, count: productsCount } = await supabase
        .from('products')
        .select('id, created_at', { count: 'exact' })
        .eq('store_id', currentStore.id)
        .eq('is_active', true)
      
      // Fetch orders
      const { data: allOrders, count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('store_id', currentStore.id)
        .order('created_at', { ascending: false })
      
      const orders = allOrders ? allOrders.slice(0, 5) : []
      
      // Calculate revenue
      const totalRevenue = allOrders?.reduce((sum, order) => 
        order.payment_status === 'paid' ? sum + order.total : sum, 0
      ) || 0
      
      const avgOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0
      
      // Generate real daily data (last 7 days)
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d.toISOString().split('T')[0]
      })
      
      const dailyMap = last7Days.reduce((acc, date) => {
        acc[date] = { 
          dateStr: date,
          date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }), 
          revenue: 0,
          orders: 0,
          products: 0
        }
        return acc
      }, {})
      
      if (allOrders) {
        allOrders.forEach(order => {
          if (order.payment_status === 'paid' && order.created_at) {
            const dateStr = order.created_at.split('T')[0]
            if (dailyMap[dateStr]) {
              dailyMap[dateStr].revenue += order.total
              dailyMap[dateStr].orders += 1
            }
          }
        })
      }
      
      if (allProducts) {
        allProducts.forEach(product => {
          if (product.created_at) {
            const dateStr = product.created_at.split('T')[0]
            if (dailyMap[dateStr]) {
              dailyMap[dateStr].products += 1
            }
          }
        })
      }
      
      const realDataArray = Object.values(dailyMap)
      
      setChartData(realDataArray)
      
      setStats({
        totalRevenue,
        totalOrders: ordersCount || 0,
        totalProducts: productsCount || 0,
        avgOrderValue,
        trends: {
          revenue: realDataArray.map(d => ({ value: d.revenue })),
          orders: realDataArray.map(d => ({ value: d.orders })),
          products: realDataArray.map(d => ({ value: d.products })),
          avgCart: realDataArray.map(d => ({ value: d.orders > 0 ? d.revenue / d.orders : 0 }))
        }
      })
      
      setRecentOrders(orders)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const statCards = [
    {
      title: 'Revenus totaux',
      value: `${stats.totalRevenue.toLocaleString('fr-FR')} XOF`,
      color: '#10B981', // green
      data: stats.trends?.revenue || []
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      color: '#3B82F6', // blue
      data: stats.trends?.orders || []
    },
    {
      title: 'Produits',
      value: stats.totalProducts,
      color: '#8B5CF6', // purple
      data: stats.trends?.products || []
    },
    {
      title: 'Panier moyen',
      value: `${stats.avgOrderValue.toLocaleString('fr-FR')} XOF`,
      color: '#F97316', // orange
      data: stats.trends?.avgCart || []
    }
  ]
  
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    }
    return labels[status] || status
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Approval Status Banner */}
      {currentStore?.approval_status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-yellow-800">Boutique en attente d'approbation</p>
              <p className="text-sm text-yellow-600">
                Votre boutique est en cours d'examen par un administrateur. Vous pourrez vendre une fois approuvee.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStore?.approval_status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-red-800">Boutique non approuvee</p>
              <p className="text-sm text-red-600">
                {currentStore.rejection_reason || "Votre boutique n'a pas ete approuvee. Veuillez contacter le support."}
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStore?.approval_status === 'approved' && !currentStore?.is_certified && currentStore?.certification_fee_paid && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-blue-800">Certification en cours</p>
              <p className="text-sm text-blue-600">
                Votre demande de certification est en cours d'examen par un administrateur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-head">Vue d'ensemble</h1>
        <p className="text-gray-500">Bienvenue dans votre espace vendeur</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col justify-between py-2"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold font-head mt-1">{stat.value}</p>
              </div>
            </div>
            <div className="h-16 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stat.data}>
                  <Bar 
                    dataKey="value" 
                    fill={stat.color} 
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    animationBegin={index * 200 + 400}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold font-head mb-6">Revenus (7 derniers jours)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `${value.toLocaleString('fr-FR')} XOF`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value.toLocaleString('fr-FR')} XOF`, 'Revenus']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4F46E5" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRevenue)"
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-out"
                animationBegin={200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold font-head">Commandes récentes</h2>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Commande</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Montant</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.shipping_address?.name || 'Client'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {order.total.toLocaleString('fr-FR')} XOF
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
