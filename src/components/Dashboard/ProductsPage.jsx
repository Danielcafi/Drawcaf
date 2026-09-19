import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoreStore, useProductStore } from '../../store'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Package, 
  Edit2, 
  Trash2,
  Eye,
  EyeOff,
  Star
} from 'lucide-react'

export default function ProductsPage() {
  const { currentStore } = useStoreStore()
  const { products, fetchStoreProducts, deleteProduct } = useProductStore()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (currentStore) {
      loadProducts()
    }
  }, [currentStore])
  
  const loadProducts = async () => {
    setLoading(true)
    await fetchStoreProducts(currentStore.id)
    setLoading(false)
  }
  
  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct(id)
    }
  }
  
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase())
  )
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-head">Produits</h1>
          <p className="text-gray-500">{products.length} produit(s)</p>
        </div>
        <Link
          to="/dashboard/products/new"
          className="flex items-center justify-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un produit
        </Link>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
          placeholder="Rechercher un produit..."
        />
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold mb-2">Aucun produit</h3>
          <p className="text-gray-500 mb-6">
            {search ? 'Aucun produit trouvé pour cette recherche' : 'Commencez par ajouter votre premier produit'}
          </p>
          {!search && (
            <Link
              to="/dashboard/products/new"
              className="inline-flex items-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4"
            >
              {/* Image */}
              <div className="w-full sm:w-24 h-24 rounded-lg bg-gray-100 overflow-hidden shrink-0">
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
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold truncate">{product.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-lg">{product.price.toLocaleString('fr-FR')} XOF</p>
                    {product.compare_at_price && (
                      <p className="text-sm text-gray-400 line-through">
                        {product.compare_at_price.toLocaleString('fr-FR')} XOF
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    {product.is_active ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    {product.is_active ? 'Visible' : 'Masqué'}
                  </span>
                  <span>Stock: {product.stock_quantity}</span>
                  {product.total_sales > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {product.total_sales} ventes
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Link
                  to={`/dashboard/products/${product.id}/edit`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
