import { useEffect, useState } from 'react'
import { useStoreStore, useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { BadgeCheck, FileCheck2, Clock, XCircle, Upload, Trash2, ExternalLink } from 'lucide-react'

const DOCUMENT_TYPES = [
  { value: 'business_license', label: 'Licence de commerce' },
  { value: 'id_card', label: 'Carte d\'identité' },
  { value: 'tax_id', label: 'Identifiant fiscal' },
  { value: 'other', label: 'Autre document' },
]

const STATUS_STYLES = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-700',
}

const STATUS_LABELS = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Rejeté',
}

export default function CertificationsPage() {
  const { currentStore, updateStore } = useStoreStore()
  const { profile } = useAuthStore()
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newDocs, setNewDocs] = useState([])

  useEffect(() => {
    if (currentStore?.id) {
      fetchCertifications()
    }
  }, [currentStore?.id])

  const fetchCertifications = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error: queryError } = await supabase
        .from('store_certifications')
        .select('*')
        .eq('store_id', currentStore.id)
        .order('created_at', { ascending: false })

      if (queryError) throw queryError
      setCertifications(data || [])
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des certifications')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const nextDocs = files.map((file) => {
      const type = DOCUMENT_TYPES.find((item) => item.value === (file?.type || ''))?.value || 'other'
      return {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        type,
      }
    })

    setNewDocs((prev) => [...prev, ...nextDocs])
    e.target.value = ''
  }

  const updateDocType = (docId, type) => {
    setNewDocs((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, type } : doc)))
  }

  const removeDoc = (docId) => {
    setNewDocs((prev) => prev.filter((doc) => doc.id !== docId))
  }

  const submitCertification = async () => {
    if (newDocs.length === 0) {
      setError('Veuillez sélectionner au moins un document à transmettre.')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      for (const doc of newDocs) {
        const fileExt = doc.file.name.split('.').pop() || 'bin'
        const fileName = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
        const filePath = `certifications/${profile?.id || currentStore.owner_id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('drawcaf')
          .upload(filePath, doc.file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('drawcaf')
          .getPublicUrl(filePath)

        const { error: insertError } = await supabase
          .from('store_certifications')
          .insert({
            store_id: currentStore.id,
            document_type: doc.type,
            document_url: publicUrl,
            status: 'pending',
          })

        if (insertError) throw insertError
      }

      await updateStore(currentStore.id, { certification_fee_paid: true })
      setNewDocs([])
      setSuccess('Documents envoyés avec succès pour validation.')
      fetchCertifications()
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi des documents')
    } finally {
      setUploading(false)
    }
  }

  const rejectReason = certifications.find((item) => item.status === 'rejected')?.rejection_reason

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-head">Ma certification</h1>
          <p className="text-sm text-gray-500 mt-1">Envoyez vos documents pour obtenir le badge de confiance</p>
        </div>
        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border ${
            currentStore?.is_certified
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {currentStore?.is_certified ? <BadgeCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {currentStore?.is_certified ? 'Certifiée' : 'Non certifiée'}
        </span>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm">{success}</div>}

      {rejectReason && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
          <XCircle className="w-4 h-4 mt-0.5" />
          <span>{rejectReason}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary-100" />
            Nouveau document
          </h2>

          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-3"
          />

          {newDocs.length > 0 && (
            <div className="mt-4 space-y-3">
              {newDocs.map((doc) => (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file.name}</p>
                    <select
                      value={doc.type}
                      onChange={(e) => updateDocType(doc.id, e.target.value)}
                      className="mt-2 w-full sm:w-56 text-sm border border-gray-300 rounded-lg p-2"
                    >
                      {DOCUMENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDoc(doc.id)}
                    className="sm:self-center p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={submitCertification}
            disabled={uploading || newDocs.length === 0}
            className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-100 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            <FileCheck2 className="w-4 h-4" />
            {uploading ? 'Envoi en cours…' : 'Envoyer pour validation'}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary-100" />
            Historique des documents
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100" />
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">Aucun document envoyé pour le moment.</div>
          ) : (
            <div className="space-y-3">
              {certifications.map((cert) => {
                const docLabel = DOCUMENT_TYPES.find((type) => type.value === cert.document_type)?.label || cert.document_type
                return (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-medium text-sm">{docLabel}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[cert.status] || 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[cert.status] || cert.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
                      <span>{new Date(cert.created_at).toLocaleDateString('fr-FR')}</span>
                      <a href={cert.document_url} target="_blank" rel="noreferrer" className="text-primary-100 hover:underline">
                        Voir le document
                      </a>
                    </div>
                    {cert.rejection_reason && <p className="mt-2 text-sm text-red-600">{cert.rejection_reason}</p>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
