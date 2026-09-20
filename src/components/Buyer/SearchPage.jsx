import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Search, Filter, Package, Store, Star, X, SlidersHorizontal } from 'lucide-react'

const DEFAULT_PAGE_SIZE = 24

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [tab, setTab] = useState(searchParams.get('tab') || 'products')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    verifiedStore: searchParams.get('verifiedStore') === 'true',
    sort: searchParams.get('sort') || 'relevance',
  })
  const [activePage, setActivePage] = useState(Number(searchParams.get('page') || 1))
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalStores, setTotalStores] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
    setTab(searchParams.get('tab') || 'products')

    setFilters({
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      verifiedStore: searchParams.get('verifiedStore') === 'true',
      sort: searchParams.get('sort') || 'relevance',
    })

    const nextPage = Number(searchParams.get('page') || 1)
    setPage(nextPage)

    performSearch(q, nextPage)
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const { data: allProducts } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true)

      if (!allProducts) return
      const uniqueCategories = Array.from(
        new Set(allProducts.map((p) => p.category).filter(Boolean))
      ).sort()
      setCategories(uniqueCategories)
    } catch (e) {
      console.error('Erreur chargement categories', e)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const performSearch = async (searchQuery, currentPage) => {
    setLoading(true)
    const q = searchQuery.toLowerCase().trim()
    const offset = (currentPage - 1) * DEFAULT_PAGE_SIZE

    try {
      let productsQuery = supabase
        .from('products')
        .select('*, product_images(url), stores(name, slug, is_verified, is_certified)', {
          count: 'exact',
        })
        .eq('is_active', true)
        .order('id', { ascending: true })
        .range(offset, offset + DEFAULT_PAGE_SIZE - 1)

      if (q) {
        productsQuery = productsQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      }

      if (filters.category) {
        productsQuery = productsQuery.eq('category', filters.category)
      }

      if (filters.minPrice) {
        productsQuery = productsQuery.gte('price', filters.minPrice)
      }

      if (filters.maxPrice) {
        productsQuery = productsQuery.lte('price', filters.maxPrice)
      }

      if (filters.verifiedStore) {
        productsQuery = productsQuery.filter('stores.is_verified', 'eq', true)
      }

      if (filters.sort === 'price_asc') {
        productsQuery = productsQuery.order('price', { ascending: true })
      } else if (filters.sort === 'price_desc') {
        productsQuery = productsQuery.order('price', { ascending: false })
      } else if (filters.sort === 'popular') {
        productsQuery = productsQuery.order('total_sales', { ascending: false })
      } else if (filters.sort === 'rating') {
        productsQuery = productsQuery.order('avg_rating', { ascending: false, nullsFirst: false })
      }

      let storesQuery = supabase
        .from('stores')
        .select('*, products(count)', {
          count: 'exact',
        })
        .eq('is_active', true)
        .limit(20)

      if (q) {
        storesQuery = storesQuery.or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      }

      if (filters.category) {
        storesQuery = storesQuery.filter('products.category', 'eq', filters.category)
      }

      if (filters.verifiedStore) {
        storesQuery = storesQuery.eq('is_verified', true)
      }

      if (filters.sort === 'price_asc') {
        storesQuery = storesQuery.order('total_sales', { ascending: true })
      } else if (filters.sort === 'price_desc') {
        storesQuery = storesQuery.order('total_sales', { ascending: false })
      } else {
        storesQuery = storesQuery.order('total_sales', { ascending: false })
      }

      const [productsRes, storesRes] = await Promise.all([
        productsQuery,
        storesQuery,
      ])

      if (productsRes.error) {
        let fallback = supabase
          .from('products')
          .select('*, product_images(url)', { count: 'exact' })
          .eq('is_active', true)
          .order('id', { ascending: true })
          .range(offset, offset + DEFAULT_PAGE_SIZE - 1)
        if (q) {
          fallback = fallback.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        }
        if (filters.category) {
          fallback = fallback.eq('category', filters.category)
        }
        if (filters.minPrice) {
          fallback = fallback.gte('price', filters.minPrice)
        }
        if (filters.maxPrice) {
          fallback = fallback.lte('price', filters.maxPrice)
        }
        if (filters.sort === 'price_asc') {
          fallback = fallback.order('price', { ascending: true })
        } else if (filters.sort === 'price_desc') {
          fallback = fallback.order('price', { ascending: false })
        } else if (filters.sort === 'popular') {
          fallback = fallback.order('total_sales', { ascending: false })
        } else if (filters.sort === 'rating') {
          fallback = fallback.order('avg_rating', { ascending: false, nullsFirst: false })
        }
        const fallbackRes = await fallback
        setProducts(fallbackRes.data || [])
        if (fallbackRes.count !== undefined) {
          setTotalProducts(fallbackRes.count)
          setHasMore((currentPage * DEFAULT_PAGE_SIZE) < fallbackRes.count)
        }
      } else {
        setProducts(productsRes.data || [])
        if (productsRes.count !== undefined) {
          setTotalProducts(productsRes.count)
          setHasMore((currentPage * DEFAULT_PAGE_SIZE) < productsRes.count)
        }
      }

      setStores(storesRes.data || [])
      if (storesRes.count !== undefined) {
        setTotalStores(storesRes.count)
      }
    } catch (err) {
      setProducts([])
      setStores([])
    } finally {
      setLoading(false)
    }
  }

  const updateParam = (key, value, resetPage = true) => {
    const current = {
      q: query,
      tab,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      verifiedStore: filters.verifiedStore ? 'true' : '',
      sort: filters.sort,
    }

    if (resetPage) {
      delete current.page
    } else {
      current.page = value
    }

    if (key === 'tab') {
      current.tab = value
    } else if (key === 'q') {
      current.q = value
    } else if (key === 'category') {
      current.category = value
    } else if (key === 'minPrice') {
      current.minPrice = value
    } else if (key === 'maxPrice') {
      current.maxPrice = value
    } else if (key === 'verifiedStore') {
      current.verifiedStore = value ? 'true' : ''
    } else if (key === 'sort') {
      current.sort = value
    } else if (key === 'page') {
      current.page = value
    }

    // Clean up empty values
    const cleanedParams = Object.fromEntries(
      Object.entries(current).filter(([_, v]) => v !== '' && v !== undefined)
    )

    if (cleanedParams.tab !== 'products' && cleanedParams.tab !== 'stores') {
      cleanedParams.tab = 'products'
    }

    setSearchParams(cleanedParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateParam('q', query)
  }

  const clearSearch = () => {
    setQuery('')
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      verifiedStore: false,
      sort: 'relevance',
    })
    setSearchParams({ tab })
  }

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value }
    setFilters(updatedFilters)
    updateParam(field, value)
  }

  const handleSortChange = (value) => {
    setFilters({ ...filters, sort: value })
    updateParam('sort', value)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    updateParam('page', nextPage, false)
  }

  const handlePage = (newPage) => {
    setPage(newPage)
    updateParam('page', newPage, false)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      verifiedStore: false,
      sort: 'relevance',
    })
    setSearchParams({ q: query, tab })
  }

  const isAnyFilterActive =
    filters.category || filters.minPrice || filters.maxPrice || filters.verifiedStore || filters.sort !== 'relevance'

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
              onClick={() => handleFilterChange('tab', 'products')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                tab === 'products'
                  ? 'border-primary-100 text-primary-100 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4" />
              Produits ({totalProducts > 0 ? totalProducts : products.length})
            </button>
            <button
              onClick={() => handleFilterChange('tab', 'stores')}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                tab === 'stores'
                  ? 'border-primary-100 text-primary-100 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Store className="w-4 h-4" />
              Boutiques ({totalStores > 0 ? totalStores : stores.length})
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </h3>
                {isAnyFilterActive && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-100 hover:text-primary-300 font-medium"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Trier par</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="popular">Popularité</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Catégorie</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Prix (FCFA)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                  />
                  <span className="text-gray-400 text-xs">à</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Verified store */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedStore}
                    onChange={(e) => handleFilterChange('verifiedStore', e.target.checked)}
                    className="w-4 h-4 text-primary-100 focus:ring-primary-100 border-gray-300 rounded"
                  />
                  Vendeurs vérifiés uniquement
                </label>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
              </div>
            ) : products.length === 0 && stores.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Aucun résultat</h2>
                <p className="text-gray-500">Essayez une autre recherche ou filtrez différemment</p>
              </div>
            ) : (
              <>
                {/* Products Tab */}
                {tab === 'products' && (
                  <div className="space-y-4">
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
                            <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h3>
                            <p className="font-bold text-primary-100">
                              {product.price.toLocaleString('fr-FR')} XOF
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{product.stores?.name}</span>
                              {product.stores?.is_verified && (
                                <span className="text-green-500 font-medium">✓ Vérifié</span>
                              )}
                              {product.stores?.is_certified && (
                                <span className="text-blue-500 font-medium">Certifié</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Pagination */}
                    {hasMore && (
                      <div className="text-center py-4">
                        <button
                          onClick={loadMore}
                          className="px-6 py-3 bg-primary-100 text-white rounded-xl font-bold hover:bg-primary-300 transition-colors"
                        >
                          Charger plus
                        </button>
                      </div>
                    )}
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
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">{store.name}</h3>
                              {store.is_verified && (
                                <span className="text-xs text-green-500 font-medium">✓ Vérifié</span>
                              )}
                              {store.is_certified && (
                                <span className="text-xs text-blue-500 font-medium">Certifié</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {store.total_sales || 0} vente(s)
                            </p>
                          </div>
                        </div>
                        {store.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
