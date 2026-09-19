import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useStoreStore } from '../../store'
import { Star, CheckCircle, Package, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function SellerReviewsPage() {
  const { slug } = useParams()
  const { currentStore, fetchStoreBySlug } = useStoreStore()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ avg: 0, total: 0, distribution: {} })
  
  useEffect(() => {
    loadData()
  }, [slug])
  
  const loadData = async () => {
    setLoading(true)
    try {
      const store = await fetchStoreBySlug(slug)
      
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url), products(title, product_images(url))')
        .in('product_id', 
          supabase.from('products').select('id').eq('store_id', store.id)
        )
        .order('created_at', { ascending: false })
      
      if (reviewsData) {
        setReviews(reviewsData)
        
        const total = reviewsData.length
        const avg = total > 0 
          ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / total 
          : 0
        
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        reviewsData.forEach(r => {
          distribution[r.rating] = (distribution[r.rating] || 0) + 1
        })
        
        setStats({ avg, total, distribution })
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    }
    setLoading(false)
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
      <h1 className="text-2xl font-bold font-head mb-8">
        Avis de {currentStore?.name}
      </h1>
      
      {/* Stats Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Rating Overview */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-primary-100 mb-2">
              {stats.avg.toFixed(1)}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(stats.avg) ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                />
              ))}
            </div>
            <p className="text-gray-500">
              Basé sur {stats.total} avis
            </p>
          </div>
          
          {/* Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Aucun avis</h2>
          <p className="text-gray-500">
            Cette boutique n'a pas encore reçu d'avis
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <img
                  src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=User&background=1E3A8B&color=fff`}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold">{review.profiles?.full_name || 'Anonyme'}</p>
                    {review.is_verified && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Achat vérifié
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  
                  {/* Product Info */}
                  {review.products && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                        {review.products.product_images?.[0]?.url ? (
                          <img src={review.products.product_images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 truncate">
                        {review.products.title}
                      </span>
                    </div>
                  )}
                  
                  {review.title && (
                    <p className="font-medium mb-1">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-gray-600">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(review.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
