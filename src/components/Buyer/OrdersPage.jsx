import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { Package, Eye, Star, ArrowRight, CheckCircle, X, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Review modal state
  const [reviewModal, setReviewModal] = useState(false)
  const [reviewOrder, setReviewOrder] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*, stores(name, slug, logo_url), order_items(*, product_images(url))')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setOrders(data)
    setLoading(false)
  }

  const openReviewModal = (order) => {
    setReviewOrder(order)
    setReviewRating(5)
    setReviewTitle('')
    setReviewComment('')
    setReviewModal(true)
  }

  const submitReview = async () => {
    if (!reviewOrder) return
    setReviewSubmitting(true)

    try {
      // Update order status to delivered
      await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', reviewOrder.id)

      // Create reviews for each product
      const reviewPromises = reviewOrder.order_items
        ?.filter(item => item.product_id)
        .map(item =>
          supabase.from('reviews').insert({
            product_id: item.product_id,
            buyer_id: user.id,
            order_id: reviewOrder.id,
            rating: reviewRating,
            title: reviewTitle || `Avis sur ${item.title}`,
            comment: reviewComment,
            is_verified: true,
          })
        ) || []

      await Promise.all(reviewPromises)

      // Update local state
      setOrders(prev =>
        prev.map(o =>
          o.id === reviewOrder.id ? { ...o, status: 'delivered' } : o
        )
      )

      setReviewModal(false)
      setReviewOrder(null)
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setReviewSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmee',
      shipped: 'Expediee',
      delivered: 'Livree',
      cancelled: 'Annulee'
    }
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold font-head mb-8">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Aucune commande</h2>
          <p className="text-gray-500 mb-6">
            Vous n'avez pas encore passe de commande
          </p>
          <Link
            to="/recherche"
            className="inline-flex items-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
          >
            Decouvrir les produits
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Commande</p>
                    <p className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <div className="text-right">
                    <p className="font-bold">{order.total.toFixed(2)} EUR</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {order.stores?.logo_url ? (
                    <img src={order.stores.logo_url} alt="" className="w-8 h-8 rounded-lg" />
                  ) : (
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {order.stores?.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <Link
                    to={`/boutique/${order.stores?.slug}`}
                    className="font-medium hover:text-primary-100 transition-colors"
                  >
                    {order.stores?.name}
                  </Link>
                </div>

                <div className="space-y-2">
                  {order.order_items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product_images?.[0]?.url ? (
                          <img src={item.product_images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">Qte: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} EUR</p>
                    </div>
                  ))}
                  {order.order_items?.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{order.order_items.length - 3} autre(s) article(s)
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/boutique/${order.stores?.slug}`}
                    className="text-sm text-primary-100 hover:underline"
                  >
                    Voir la boutique
                  </Link>

                  {order.status === 'shipped' && (
                    <button
                      onClick={() => openReviewModal(order)}
                      className="flex items-center gap-1 text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmer livraison
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Livraison confirmee
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal && reviewOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !reviewSubmitting && setReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Laisser un avis</h2>
                  <button
                    onClick={() => setReviewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={reviewSubmitting}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Commande #{reviewOrder.id.slice(-8).toUpperCase()}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Rating Stars */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Votre note
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || reviewRating)
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                          fill={star <= (hoverRating || reviewRating) ? 'currentColor' : 'none'}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {reviewRating}/5
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'avis
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Resumez votre experience..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre commentaire
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Decrivez votre experience avec ce produit..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setReviewModal(false)}
                  disabled={reviewSubmitting}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={submitReview}
                  disabled={reviewSubmitting || reviewRating === 0}
                  className="flex-1 py-3 bg-primary-100 text-white rounded-lg font-bold hover:bg-primary-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {reviewSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
