import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Send
} from 'lucide-react'

export default function BuyerOrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filter, setFilter] = useState('all')

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
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelivery = (order) => {
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

      // Create reviews for each product in the order
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

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
        <h1 className="text-2xl font-bold text-gray-900">Mes commandes</h1>
        <p className="text-gray-500">Suivez l'etat de vos commandes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Toutes' },
          { value: 'pending', label: 'En attente' },
          { value: 'confirmed', label: 'Confirmees' },
          { value: 'shipped', label: 'Expediees' },
          { value: 'delivered', label: 'Livrees' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary-100 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Aucune commande trouvee</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-bold text-gray-900">
                        Commande #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-900">{order.total?.toFixed(2)} EUR</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    {selectedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <AnimatePresence>
                {selectedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-4 space-y-4">
                      {/* Order Items */}
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Articles commandes</p>
                        <div className="space-y-2">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.title}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity} x {item.price?.toFixed(2)} EUR
                                </p>
                              </div>
                              <p className="font-medium text-sm text-gray-900">
                                {(item.quantity * item.price)?.toFixed(2)} EUR
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div>
                          <p className="font-medium text-gray-900 mb-2">Adresse de livraison</p>
                          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                            <p>{order.shipping_address.fullName}</p>
                            <p>{order.shipping_address.address}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.country}</p>
                            {order.shipping_address.phone && (
                              <p>Tel: {order.shipping_address.phone}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Sous-total</span>
                          <span>{order.subtotal?.toFixed(2)} EUR</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Livraison</span>
                          <span>{order.shipping_cost?.toFixed(2) || '0.00'} EUR</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2">
                          <span>Total</span>
                          <span>{order.total?.toFixed(2)} EUR</span>
                        </div>
                      </div>

                      {/* Confirm Delivery Button */}
                      {(order.status === 'shipped' || order.status === 'delivered') && (
                        <div className="border-t border-gray-100 pt-4">
                          {order.status === 'shipped' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                confirmDelivery(order)
                              }}
                              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Confirmer la livraison et laisser un avis
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-green-600 justify-center py-3">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Livraison confirmee</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
