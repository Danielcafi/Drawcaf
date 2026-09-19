import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { Store, Users, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalStores: 0,
    pendingStores: 0,
    approvedStores: 0,
    totalUsers: 0,
    pendingCertifications: 0,
  })
  const [pendingStores, setPendingStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

      const { count: totalStores } = await supabase.from('stores').select('*', { count: 'exact', head: true })
      const { count: pendingStores } = await supabase.from('stores').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending')
      const { count: approvedStores } = await supabase.from('stores').select('*', { count: 'exact', head: true }).eq('approval_status', 'approved')
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: pendingCertifications } = await supabase.from('store_certifications').select('*', { count: 'exact', head: true }).eq('status', 'pending')

      setStats({
        totalStores: totalStores || 0,
        pendingStores: pendingStores || 0,
        approvedStores: approvedStores || 0,
        totalUsers: totalUsers || 0,
        pendingCertifications: pendingCertifications || 0,
      })

      const { data: pending } = await supabase
        .from('stores')
        .select('*, profiles(full_name, email)')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5)

      setPendingStores(pending || [])
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord admin</h1>
        <p className="text-gray-500">Vue d'ensemble de la plateforme Drawcaf</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total boutiques', value: stats.totalStores, icon: Store, color: 'bg-blue-100 text-blue-600' },
          { label: 'En attente', value: stats.pendingStores, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
          { label: 'Approuvees', value: stats.approvedStores, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
          { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'bg-purple-100 text-purple-600' },
          { label: 'Certif. en attente', value: stats.pendingCertifications, icon: Shield, color: 'bg-orange-100 text-orange-600' },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }} className="bg-white rounded-xl p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Boutiques en attente</h2>
            <Link to="/admin/stores" className="text-sm text-red-500 hover:text-red-700">Voir tout</Link>
          </div>
          {pendingStores.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p>Aucune boutique en attente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingStores.map((store) => (
                <div key={store.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{store.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{store.name}</p>
                        <p className="text-sm text-gray-500">{store.profiles?.full_name} - {store.category}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">En attente</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Actions rapides</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link to="/admin/stores" className="block p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="font-bold text-gray-900">Approuver les boutiques</p>
                  <p className="text-sm text-gray-500">{stats.pendingStores} boutique(s) en attente</p>
                </div>
              </div>
            </Link>
            <Link to="/admin/certifications" className="block p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-bold text-gray-900">Examiner les certifications</p>
                  <p className="text-sm text-gray-500">{stats.pendingCertifications} demande(s) en attente</p>
                </div>
              </div>
            </Link>
            <Link to="/admin/users" className="block p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-bold text-gray-900">Gerer les utilisateurs</p>
                  <p className="text-sm text-gray-500">{stats.totalUsers} utilisateur(s) inscrits</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
