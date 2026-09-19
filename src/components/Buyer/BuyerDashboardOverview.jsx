import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  BarChart3,
  DollarSign
} from 'lucide-react'

export default function BuyerDashboardOverview() {
  const { user, profile } = useAuthStore()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    wishlistCount: 0,
    totalSpent: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBuyerStats()
    }
  }, [user])

  const fetchBuyerStats = async () => {
    try {
      setLoading(true)

      // Fetch orders
      const { data: orders, count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })

      // Fetch wishlist
      const { count: wishlistCount } = await supabase
        .from('wishlist')
        .select('*', { count: 'exact' })
        .eq('buyer_id', user.id)

      const pendingOrders = orders?.filter(o =>
        ['pending', 'confirmed', 'preparing'].includes(o.status)
      ).length || 0

      const deliveredOrders = orders?.filter(o =>
        o.status === 'delivered'
      ).length || 0

      const totalSpent = orders?.reduce((sum, o) =>
        sum + (parseFloat(o.total) || 0), 0
      ) || 0

      setStats({
        totalOrders: totalOrders || 0,
        pendingOrders,
        deliveredOrders,
        wishlistCount: wishlistCount || 0,
        totalSpent,
      })

      setRecentOrders(orders?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'confirmed':
      case 'preparing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmee',
      preparing: 'En preparation',
      shipped: 'Expediee',
      delivered: 'Livree',
      cancelled: 'Annulee',
      refunded: 'Remboursee'
    }
    return labels[status] || status
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
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {profile?.full_name?.split(' ')[0] || 'Acheteur'}
        </h1>
        <p className="text-gray-500">Bienvenue sur votre espace acheteur</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Total depense',
            value: `${stats.totalSpent.toFixed(2)} EUR`,
            icon: DollarSign,
            color: 'bg-green-100 text-green-600'
          },
          {
            label: 'Total commandes',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'bg-blue-100 text-blue-600'
          },
          {
            label: 'En cours',
            value: stats.pendingOrders,
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-600'
          },
          {
            label: 'Livrees',
            value: stats.deliveredOrders,
            icon: CheckCircle,
            color: 'bg-green-100 text-green-600'
          },
          {
            label: 'Favoris',
            value: stats.wishlistCount,
            icon: Heart,
            color: 'bg-pink-100 text-pink-600'
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

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Commandes recentes</h2>
          <Link
            to="/compte/commandes"
            className="text-sm text-primary-100 hover:text-primary-300"
          >
            Voir tout
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune commande pour le moment</p>
            <Link
              to="/recherche"
              className="mt-4 inline-block bg-primary-100 text-white px-6 py-2 rounded-lg hover:bg-primary-300 transition-colors"
            >
              Commencer vos achats
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium text-gray-900">
                        Commande #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{order.total?.toFixed(2)} EUR</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/compte/commandes"
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Mes commandes</p>
            <p className="text-sm text-gray-500">Suivre et gerer vos commandes</p>
          </div>
        </Link>

        <Link
          to="/compte/analytics"
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Mes achats</p>
            <p className="text-sm text-gray-500">Statistiques et depenses</p>
          </div>
        </Link>

        <Link
          to="/compte/favoris"
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Mes favoris</p>
            <p className="text-sm text-gray-500">Retrouvez vos produits aimes</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
