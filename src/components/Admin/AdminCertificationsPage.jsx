import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle, XCircle, Eye, X, ExternalLink } from 'lucide-react'

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [selectedCert, setSelectedCert] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  useEffect(() => { fetchCertifications() }, [filter])

  const fetchCertifications = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('store_certifications')
        .select('*, stores(name, slug, owner_id, profiles(full_name, email))')
        .order('created_at', { ascending: false })
      if (filter !== 'all') query = query.eq('status', filter)
      const { data, error } = await query
      if (error) throw error
      setCertifications(data || [])
    } catch (error) {
      console.error('Error fetching certifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveCertification = async (cert) => {
    setActionLoading(true)
    try {
      await supabase.from('store_certifications').update({
        status: 'approved', reviewed_at: new Date().toISOString(),
      }).eq('id', cert.id)
      await supabase.from('stores').update({
        is_certified: true, is_verified: true,
        certification_date: new Date().toISOString(),
      }).eq('id', cert.store_id)
      setCertifications(prev => prev.filter(c => c.id !== cert.id))
      setSelectedCert(null)
    } catch (error) {
      console.error('Error approving certification:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const openRejectModal = (cert) => {
    setSelectedCert(cert)
    setRejectReason('')
    setShowRejectModal(true)
  }

  const rejectCertification = async () => {
    if (!selectedCert) return
    setActionLoading(true)
    try {
      await supabase.from('store_certifications').update({
        status: 'rejected', reviewed_at: new Date().toISOString(),
        rejection_reason: rejectReason || 'Documents non conformes.',
      }).eq('id', selectedCert.id)
      setCertifications(prev => prev.filter(c => c.id !== selectedCert.id))
      setShowRejectModal(false)
      setSelectedCert(null)
    } catch (error) {
      console.error('Error rejecting certification:', error)
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
    const labels = { pending: 'En attente', approved: 'Approuve', rejected: 'Rejete' }
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getDocTypeLabel = (type) => ({
    business_license: 'Registre de commerce',
    id_card: "Piece d'identite",
    tax_id: 'Numero fiscal',
    other: 'Autre document',
  }[type] || type)

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
        <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
        <p className="text-gray-500">Examiner les demandes de certification des boutiques</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[{ value: 'pending', label: 'En attente' }, { value: 'approved', label: 'Approuvees' },
          { value: 'rejected', label: 'Rejetees' }, { value: 'all', label: 'Toutes' }].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {certifications.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Aucune certification dans cette categorie</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{cert.stores?.name || 'Boutique'}</h3>
                    {getStatusBadge(cert.status)}
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{getDocTypeLabel(cert.document_type)}</p>
                  <p className="text-sm text-gray-500">Proprietaire: {cert.stores?.profiles?.full_name}</p>
                  {cert.rejection_reason && (
                    <p className="text-sm text-red-600 mt-1">Motif: {cert.rejection_reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <a href={cert.document_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <ExternalLink className="w-5 h-5 text-gray-600" />
                  </a>
                  {cert.status === 'pending' && (
                    <>
                      <button onClick={() => approveCertification(cert)} disabled={actionLoading}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm disabled:opacity-50">
                        <CheckCircle className="w-4 h-4" /> Approuver
                      </button>
                      <button onClick={() => openRejectModal(cert)} disabled={actionLoading}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm disabled:opacity-50">
                        <XCircle className="w-4 h-4" /> Rejeter
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showRejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !actionLoading && setShowRejectModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Rejeter la certification</h2>
                <button onClick={() => setShowRejectModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                rows={3} placeholder="Motif du rejet..." />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowRejectModal(false)} disabled={actionLoading}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50">
                  Annuler
                </button>
                <button onClick={rejectCertification} disabled={actionLoading}
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