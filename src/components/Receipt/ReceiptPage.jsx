import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { Receipt, Store, ArrowLeft, Download, Loader2, AlertCircle } from 'lucide-react'

export default function ReceiptPage() {
  const { id } = useParams()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReceipt()
  }, [id])

  const fetchReceipt = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('receipts')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      setReceipt(data)
    } catch (err) {
      setError('Recu non trouve')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-100" />
      </div>
    )
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || 'Recu introuvable'}</p>
          <Link to="/" className="text-primary-100 hover:underline">
            Retour a l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const storeUrl = `${window.location.origin}/boutique/${receipt.store_slug}`
  const items = receipt.items || []

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Back Link */}
        <Link
          to="/compte/commandes"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux commandes
        </Link>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary-100 text-white p-6 text-center">
            <Receipt className="w-8 h-8 mx-auto mb-2" />
            <h1 className="text-lg font-bold">Recu de paiement</h1>
            <p className="text-sm opacity-90">{receipt.receipt_number}</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Store Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{receipt.store_name}</p>
                <p className="text-sm text-gray-500">Vendeur Drawcaf</p>
              </div>
            </div>

            {/* Buyer Info */}
            <div className="pb-4 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase mb-1">Client</p>
              <p className="font-medium text-gray-900">{receipt.buyer_name}</p>
              <p className="text-sm text-gray-500">{receipt.buyer_email}</p>
            </div>

            {/* Items */}
            <div className="pb-4 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase mb-2">Articles</p>
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{item.title} x{item.quantity}</span>
                  <span className="font-medium">{item.subtotal?.toFixed(2) || (item.price * item.quantity).toFixed(2)} XOF</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span>{receipt.subtotal?.toFixed(2)} XOF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Livraison</span>
                <span>{receipt.shipping_cost?.toFixed(2)} XOF</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total paye</span>
                <span className="text-primary-100">{receipt.total?.toFixed(2)} XOF</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase mb-3">Scannez pour revoir la boutique</p>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <QRCodeSVG
                  value={storeUrl}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#1E3A8B"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                drawcaf.com/boutique/{receipt.store_slug}
              </p>
            </div>

            {/* Date */}
            <div className="text-center text-xs text-gray-400 pt-2">
              {receipt.created_at
                ? new Date(receipt.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : ''}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            to="/compte/commandes"
            className="flex-1 text-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
          >
            Mes commandes
          </Link>
          <Link
            to={`/boutique/${receipt.store_slug}`}
            className="flex-1 text-center bg-primary-100 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
          >
            Visiter la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}
