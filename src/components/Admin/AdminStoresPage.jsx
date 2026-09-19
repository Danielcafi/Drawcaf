import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, CheckCircle, XCircle, Clock, Eye, MapPin, Shield, X } from 'lucide-react'

export default function AdminStoresPage() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [selectedStore, setSelectedStore] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  useEffect(() => {
    fetchStores()
  }, [filter])

  const fetchStores = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('stores')
        .select('*, profiles(full_name, email, avatar_url)')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('approval_status', filter)
      }

      const { data, error } = await query
      if (error) throw error
      setStores(data || [])
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveStore = async (storeId) => {
    setActionLoading(true)
    try {
      await supabase.from('stores').update({
        approval_status: 'approved',
        is_active: true,
        approved_at: new Date().toISOString(),
      }).eq('id', storeId)
      setStores(prev => prev.filter(s => s.id !== storeId))
      setSelectedStore(null)
    } catch (error) {
      console.error('Error approving store:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const openRejectModal = (store) => {
    setSelectedStore(store)
    setRejectReason('')
    setShowRejectModal(true)
  }

  const rejectStore = async () => {
    if (!selectedStore) return
    setActionLoading(true)
    try {
      await supabase.from('stores').update({
        approval_status: 'rejected',
        is_active: false,
        rejection_reason: rejectReason || 'Non conforme aux guidelines.',
      }).eq('id', selectedStore.id)
      setStores(prev => prev.filter(s => s.id !== selectedStore.id))
      setShowRejectModal(false)
      setSelectedStore(null)
    } catch (error) {
      console.error('Error rejecting store:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    const labels = { pending: 'En attente', approved: 'Approuvee', rejected: 'Rejetee' }
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {labels[status] || status}
      </span>
    )
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des boutiques</h1>
        <p className="text-gray-500">Approuver ou rejeter les boutiques vendeurs</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: 'pending', label: 'En attente' },
          { value: 'approved', label: 'Approuvees' },
          { value: 'rejected', label: 'Rejetees' },
          { value: 'all', label: 'Toutes' },
        ].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {stores.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Store className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Aucune boutique dans cette categorie</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stores.map((store) => (
            <motion.div key={store.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {store.banner_url && (
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
                      <img src={store.banner_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-4">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{store.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{store.name}</h3>
                      {getStatusBadge(store.approval_status)}
                      {store.is_certified && (
                        <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          <Shield className="w-3 h-3" /> Certifiee
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{store.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{store.city}, {store.country}</span>
                      <span>Categorie: {store.category}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <span>Proprietaire: {store.profiles?.full_name}</span>
                      <span>({store.profiles?.email})</span>
                    </div>
                    {store.rejection_reason && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg text-sm text-red-700">
                        Motif du rejet: {store.rejection_reason}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {store.approval_status === 'pending' && (
                      <>
                        <button onClick={() => approveStore(store.id)} disabled={actionLoading}
                          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                          <CheckCircle className="w-4 h-4" /> Approuver
                        </button>
                        <button onClick={() => openRejectModal(store)} disabled={actionLoading}
                          className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                          <XCircle className="w-4 h-4" /> Rejeter
                        </button>
                      </>
                    )}
                    <button onClick={() => setSelectedStore(store)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !actionLoading && setShowRejectModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Rejeter la boutique</h2>
                <button onClick={() => setShowRejectModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Indiquez le motif du rejet pour <strong>{selectedStore?.name}</strong>
              </p>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                rows={3} placeholder="Motif du rejet..." />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowRejectModal(false)} disabled={actionLoading}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50">
                  Annuler
                </button>
                <button onClick={rejectStore} disabled={actionLoading}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50">
                  {actionLoading ? 'Rejet...' : 'Rejeter'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
