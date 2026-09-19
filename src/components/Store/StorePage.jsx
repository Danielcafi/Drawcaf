import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStoreStore, useProductStore, useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { getImageUrl } from '../../utils/image'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Star, 
  Shield, 
  Package, 
  Search,
  Filter,
  Grid,
  List,
  User,
  MessageSquare
} from 'lucide-react'

export default function StorePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { currentStore, fetchStoreBySlug } = useStoreStore()
  const { products, fetchPublicProducts } = useProductStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  
  useEffect(() => {
    loadStore()
  }, [slug])
  
  const loadStore = async () => {
    setLoading(true)
    try {
      const store = await fetchStoreBySlug(slug)
      await fetchPublicProducts(store.id)
    } catch (error) {
      console.error('Error loading store:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('store_id', currentStore.id)
        .single()

      if (existing) {
        navigate('/compte/messages')
        return
      }

      const { error } = await supabase.from('conversations').insert({
        buyer_id: user.id,
        seller_id: currentStore.owner_id,
        store_id: currentStore.id,
        last_message: '',
      })

      if (error) throw error
      navigate('/compte/messages')
    } catch (err) {
      console.error('Erreur création conversation:', err)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    )
  }
  
  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Boutique introuvable</h2>
        <p className="text-gray-500">Cette boutique n'existe pas ou n'est plus active.</p>
        <Link to="/" className="mt-4 text-primary-100 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    )
  }
  
  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary-100 to-primary-300">
        {currentStore.banner_url && (
          <img
            src={currentStore.banner_url}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Store Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-8">
          {/* Logo */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-white">
            {currentStore.logo_url ? (
              <img
                src={currentStore.logo_url}
                alt={currentStore.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {currentStore.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold font-head">
                {currentStore.name}
              </h1>
              {currentStore.is_verified && (
                <Shield className="w-6 h-6 text-blue-500" title="Boutique vérifiée" />
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {currentStore.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentStore.city}, {currentStore.country}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                {currentStore.rating > 0 ? currentStore.rating.toFixed(1) : 'Nouveau'}
              </span>
              <span>{currentStore.total_sales} vente(s)</span>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {currentStore.description && (
          <div className="mb-8">
            <p className="text-gray-600 max-w-3xl">{currentStore.description}</p>
          </div>
        )}

        {/* Vendeur */}
        {currentStore.owner && (
          <div className="mb-8 p-4 bg-white rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                {currentStore.owner.avatar_url ? (
                  <img
                    src={getImageUrl(currentStore.owner.avatar_url, currentStore.owner.updated_at)}
                    alt={currentStore.owner.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Vendeur</p>
                <p className="font-bold text-gray-900">{currentStore.owner.full_name}</p>
              </div>
            </div>
            <button
              onClick={handleContactSeller}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-primary-100 text-primary-100 rounded-lg hover:bg-primary-100 hover:text-white transition-colors text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              Contacter le vendeur
            </button>
          </div>
        )}
        
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              placeholder="Rechercher dans cette boutique..."
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold mb-2">Aucun produit</h3>
            <p className="text-gray-500">
              {search ? 'Aucun produit trouvé pour cette recherche' : 'Cette boutique n\'a pas encore de produits.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-12">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/produit/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                    {product.product_images?.[0] ? (
                      <img
                        src={product.product_images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm sm:text-base truncate group-hover:text-primary-100 transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-primary-100">
                        {product.price.toLocaleString('fr-FR')} XOF
                      </span>
                      {product.compare_at_price && (
                        <span className="text-sm text-gray-400 line-through">
                          {product.compare_at_price.toLocaleString('fr-FR')} XOF
                        </span>
                      )}
                    </div>
                    {product.total_sales > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {product.total_sales} vendu(s)
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 pb-12">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/produit/${product.id}`}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 transition-colors"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {product.product_images?.[0] ? (
                      <img
                        src={product.product_images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{product.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="font-bold text-xl text-primary-100">
                        {product.price.toLocaleString('fr-FR')} XOF
                      </span>
                      {product.compare_at_price && (
                        <span className="text-gray-400 line-through">
                          {product.compare_at_price.toLocaleString('fr-FR')} XOF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
