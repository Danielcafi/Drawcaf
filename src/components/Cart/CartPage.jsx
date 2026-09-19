import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store'
import { motion } from 'framer-motion'
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight,
  Package
} from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const navigate = useNavigate()
  
  const subtotal = getTotal()
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping
  
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold font-head mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">
          Découvrez nos produits et ajoutez-en à votre panier
        </p>
        <Link
          to="/"
          className="bg-primary-100 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
        >
          Continuer mes achats
        </Link>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold font-head mb-8">Mon panier</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={`${item.product.id}-${JSON.stringify(item.variant)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100"
            >
              {/* Image */}
              <Link
                to={`/produit/${item.product.id}`}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0"
              >
                {item.product.product_images?.[0] ? (
                  <img
                    src={item.product.product_images[0].url}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </Link>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/produit/${item.product.id}`}
                      className="font-bold hover:text-primary-100 transition-colors line-clamp-2"
                    >
                      {item.product.title}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.variant.name}: {item.variant.value}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.variant)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Price */}
                  <p className="font-bold text-lg">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Vider le panier
          </button>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Résumé de la commande</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span>{shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)} €`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-green-600">
                  Livraison gratuite à partir de 50 € d'achat
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-primary-100 text-white py-4 rounded-lg font-bold mt-6 hover:bg-primary-300 transition-colors"
            >
              Passer la commande
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <Link
              to="/"
              className="block text-center text-sm text-primary-100 mt-4 hover:underline"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
