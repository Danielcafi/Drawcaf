import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProductStore, useCartStore, useAuthStore } from '../../store'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  ChevronLeft,
  Store,
  MessageSquare
} from 'lucide-react'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentProduct, fetchProductBySlug } = useProductStore()
  const { addItem } = useCartStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  
  useEffect(() => {
    loadProduct()
  }, [id])
  
  const loadProduct = async () => {
    setLoading(true)
    try {
      await fetchProductBySlug(id)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setAddingToCart(true)
    addItem(currentProduct, quantity, selectedVariant)
    setTimeout(() => setAddingToCart(false), 1000)
  }
  
  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (currentProduct?.stock_quantity || 10)) {
      setQuantity(newQuantity)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    )
  }
  
  if (!currentProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold mb-2">Produit introuvable</h2>
        <Link to="/" className="text-primary-100 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    )
  }
  
  const store = currentProduct.stores
  const reviews = currentProduct.reviews || []
  const images = currentProduct.product_images || []
  const variants = currentProduct.product_variants || []
  
  // Group variants by name
  const variantGroups = variants.reduce((acc, v) => {
    if (!acc[v.name]) acc[v.name] = []
    acc[v.name].push(v)
    return acc
  }, {})
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-100">Accueil</Link>
        <span>/</span>
        {store && (
          <>
            <Link to={`/boutique/${store.slug}`} className="hover:text-primary-100">
              {store.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800 truncate">{currentProduct.title}</span>
      </nav>
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {images[selectedImage] ? (
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[selectedImage].url}
                alt={currentProduct.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary-100'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Price */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-head mb-4">
              {currentProduct.title}
            </h1>
            
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary-100">
                {currentProduct.price.toFixed(2)} €
              </span>
              {currentProduct.compare_at_price && (
                <span className="text-xl text-gray-400 line-through">
                  {currentProduct.compare_at_price.toFixed(2)} €
                </span>
              )}
            </div>
            
            {/* Rating */}
            {currentProduct.total_reviews > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(currentProduct.avg_rating)
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({currentProduct.total_reviews} avis)
                </span>
              </div>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {currentProduct.stock_quantity > 0 ? (
              <>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600 font-medium">
                  En stock ({currentProduct.stock_quantity} disponible{currentProduct.stock_quantity > 1 ? 's' : ''})
                </span>
              </>
            ) : (
              <>
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-red-600 font-medium">Rupture de stock</span>
              </>
            )}
          </div>
          
          {/* Variants */}
          {Object.keys(variantGroups).length > 0 && (
            <div className="space-y-4">
              {Object.entries(variantGroups).map(([groupName, groupVariants]) => (
                <div key={groupName}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {groupName}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {groupVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-primary-100 bg-primary-50 text-primary-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {variant.value}
                        {variant.price && (
                          <span className="ml-2 text-sm text-gray-500">
                            +{variant.price.toFixed(2)} €
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Quantity */}
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-6 py-3 font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= currentProduct.stock_quantity}
                className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stock_quantity === 0 || addingToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-100 text-white py-3 px-6 rounded-lg font-bold hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              {addingToCart ? 'Ajouté !' : 'Ajouter au panier'}
            </button>
          </div>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">Livraison rapide</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">Paiement sécurisé</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">Retour 30 jours</span>
            </div>
          </div>
          
          {/* Seller Info */}
          {store && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <Link
                to={`/boutique/${store.slug}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-lg bg-white overflow-hidden">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {store.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{store.name}</p>
                  <p className="text-sm text-gray-500">{store.total_sales} vente(s)</p>
                </div>
              </Link>
              <Link
                to={`/boutique/${store.slug}`}
                className="text-sm text-primary-100 hover:underline"
              >
                Voir la boutique
              </Link>
            </div>
          )}
          
          {/* Description */}
          {currentProduct.description && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold mb-3">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {currentProduct.description}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-xl font-bold font-head mb-6">
          Avis clients ({reviews.length})
        </h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun avis pour ce produit</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=User&background=1E3A8B&color=fff`}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{review.profiles?.full_name || 'Anonyme'}</p>
                    <div className="flex items-center gap-1">
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
                  </div>
                  {review.is_verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Achat vérifié
                    </span>
                  )}
                </div>
                {review.title && (
                  <p className="font-medium mb-1">{review.title}</p>
                )}
                {review.comment && (
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
