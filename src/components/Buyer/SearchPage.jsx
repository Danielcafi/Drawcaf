import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Search, Filter, Package, Store, Star, X } from 'lucide-react'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
    performSearch(q)
  }, [searchParams])
  
  const performSearch = async (searchQuery) => {
    setLoading(true)
    const q = searchQuery.toLowerCase().trim()
    
    // Base queries
    let productsQuery = supabase
      .from('products')
      .select('*, product_images(url), stores(name, slug)')
      .eq('is_active', true)
      .limit(20)
      
    let storesQuery = supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .limit(20)
      
    if (q) {
      productsQuery = productsQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      storesQuery = storesQuery.or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    }
    
    const [ { data: productsData }, { data: storesData } ] = await Promise.all([
      productsQuery,
      storesQuery
    ])
    
    setProducts(productsData || [])
    setStores(storesData || [])
    setLoading(false)
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ q: query })
    // performSearch is triggered by useEffect on searchParams change
  }
  
  const clearSearch = () => {
    setQuery('')
    setSearchParams({})
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher des produits ou boutiques..."
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-primary-100 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-300 transition-colors"
            >
              Rechercher
            </button>
          </form>
          
          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setTab('products')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                tab === 'products'
                  ? 'border-primary-100 text-primary-100 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4" />
              Produits ({products.length})
            </button>
            <button
              onClick={() => setTab('stores')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                tab === 'stores'
                  ? 'border-primary-100 text-primary-100 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Store className="w-4 h-4" />
              Boutiques ({stores.length})
            </button>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
          </div>
        ) : products.length === 0 && stores.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucun résultat</h2>
            <p className="text-gray-500">
              Essayez une autre recherche
            </p>
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {tab === 'products' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produit/${product.id}`}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100">
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
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">
                        {product.title}
                      </h3>
                      <p className="font-bold text-primary-100">
                        {product.price.toFixed(2)} €
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.stores?.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Stores Tab */}
            {tab === 'stores' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => (
                  <Link
                    key={store.id}
                    to={`/boutique/${store.slug}`}
                    className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {store.logo_url ? (
                        <img src={store.logo_url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {store.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold">{store.name}</h3>
                        <p className="text-sm text-gray-500">
                          {store.total_sales || 0} vente(s)
                        </p>
                      </div>
                    </div>
                    {store.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {store.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
