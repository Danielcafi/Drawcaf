import { Link, Outlet } from 'react-router-dom'
import { useCartStore, useAuthStore } from '../../store'
import { ShoppingCart, Search, User, Heart, Package } from 'lucide-react'
import { useState } from 'react'

export default function StoreLayout() {
  const [searchQuery, setSearchQuery] = useState('')
  const location = window.location.pathname
  const itemCount = useCartStore(state => state.getItemCount())
  const { user } = useAuthStore()
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery)}`
    }
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img className="h-8" src="/logo-full.svg" alt="Drawcaf" />
            </Link>
            
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:ring-2 focus:ring-primary-100 focus:bg-white outline-none transition-colors"
                  placeholder="Rechercher des produits..."
                />
              </div>
            </form>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              {user && (
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-600 hover:text-primary-100 hidden sm:flex"
                >
                  <Heart className="w-5 h-5" />
                </Link>
              )}
              
              {user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <Link to="/commandes" className="text-sm text-gray-600 hover:text-primary-100">
                    Commandes
                  </Link>
                  <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary-100">
                    Dashboard
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-primary-100"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Connexion</span>
                </Link>
              )}
              
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-primary-100"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-100 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="block mb-4">
                <img className="h-8" src="/logo-full-white.svg" alt="Drawcaf" />
              </Link>
              <p className="text-sm text-gray-400">
                La place de marché pour les créatifs
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Acheteur</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/recherche" className="hover:text-white">Rechercher</Link></li>
                <li><Link to="/cart" className="hover:text-white">Panier</Link></li>
                <li><Link to="/commandes" className="hover:text-white">Mes commandes</Link></li>
                <li><Link to="/wishlist" className="hover:text-white">Ma liste</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Vendeur</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/register" className="hover:text-white">Ouvrir une boutique</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white">À propos</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2026 Drawcaf. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
