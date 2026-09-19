import { useState, useEffect } from 'react'
import { useStoreStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { Star, User, MessageSquare } from 'lucide-react'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ average: 0, total: 0 })
  const { currentStore } = useStoreStore()

  useEffect(() => {
    if (currentStore) {
      fetchReviews()
    }
  }, [currentStore])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(*)')
        .eq('store_id', currentStore.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])

      if (data && data.length > 0) {
        const total = data.reduce((sum, r) => sum + r.rating, 0)
        setStats({
          average: (total / data.length).toFixed(1),
          total: data.length
        })
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-head">Avis</h1>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-100">{stats.average}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {renderStars(Math.round(stats.average))}
            </div>
            <p className="text-sm text-gray-500 mt-1">{stats.total} avis</p>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500 w-4">{star}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun avis pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {review.profiles?.avatar_url ? (
                      <img
                        src={review.profiles.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{review.profiles?.full_name || 'Anonyme'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              {review.comment && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}