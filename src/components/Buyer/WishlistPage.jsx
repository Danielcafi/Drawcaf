import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { Heart, Package, ShoppingCart, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WishlistPage() {
  const { user } = useAuthStore()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (user) fetchWishlist()
  }, [user])
  
  const fetchWishlist = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*, product_images(url), stores(name, slug))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (!error) setWishlist(data.map(w => ({ ...w, product: w.products })))
    setLoading(false)
  }
  
  const removeFromWishlist = async (productId) => {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
    
    if (!error) {
      setWishlist(prev => prev.filter(item => item.product_id !== productId))
    }
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
        Ma liste de souhaits ({wishlist.length})
      </h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Liste vide</h2>
          <p className="text-gray-500 mb-6">
            Ajoutez des produits à votre liste de souhaits pour les retrouver facilement
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
          >
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <Link to={`/produit/${item.product.id}`}>
                  <div className="aspect-square bg-gray-100 relative">
                    {item.product.product_images?.[0] ? (
                      <img
                        src={item.product.product_images[0].url}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {item.product.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">Rupture de stock</span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link to={`/produit/${item.product.id}`}>
                    <h3 className="font-medium line-clamp-2 mb-2 hover:text-primary-100 transition-colors">
                      {item.product.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {item.product.stores?.name}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-primary-100">
                      {item.product.price.toFixed(2)} €
                    </p>
                    
                    <div className="flex items-center gap-2">
                      {item.product.stock_quantity > 0 && (
                        <Link
                          to={`/produit/${item.product.id}`}
                          className="p-2 bg-primary-100 text-white rounded-lg hover:bg-primary-300 transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </Link>
                      )}
                      <button
                        onClick={() => removeFromWishlist(item.product_id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
