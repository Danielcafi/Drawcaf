import { useState } from 'react'
import { useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { Star, CheckCircle } from 'lucide-react'

export default function ReviewSection({ productId, reviews = [], onReviewAdded }) {
  const { user } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Vous devez être connecté pour laisser un avis')
      return
    }
    
    setSubmitting(true)
    setError('')
    
    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          title,
          comment,
          is_verified: true
        })
      
      if (insertError) throw insertError
      
      setShowForm(false)
      setRating(5)
      setTitle('')
      setComment('')
      if (onReviewAdded) onReviewAdded()
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'avis')
    } finally {
      setSubmitting(false)
    }
  }
  
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0
  
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-head">
            Avis clients ({reviews.length})
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating) ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} sur 5
              </span>
            </div>
          )}
        </div>
        
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-primary-100 hover:underline font-medium"
          >
            {showForm ? 'Annuler' : 'Écrire un avis'}
          </button>
        )}
      </div>
      
      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre (optionnel)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              placeholder="Résumez votre expérience"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commentaire
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none resize-none"
              placeholder="Partagez votre expérience avec ce produit..."
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-100 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-300 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Envoi...' : 'Publier l\'avis'}
          </button>
        </form>
      )}
      
      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun avis pour ce produit</p>
          {!user && (
            <p className="text-sm text-gray-400 mt-2">
              Connectez-vous pour laisser un avis
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-white rounded-xl border border-gray-100">
              <div className="flex items-start gap-3">
                <img
                  src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=User&background=1E3A8B&color=fff`}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{review.profiles?.full_name || 'Anonyme'}</p>
                    {review.is_verified && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Achat vérifié
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
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
                  {review.title && (
                    <p className="font-medium mt-2">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
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
