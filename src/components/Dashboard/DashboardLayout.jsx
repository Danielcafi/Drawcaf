import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore, useStoreStore } from '../../store'
import { getImageUrl } from '../../utils/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Star, 
  Settings,
  BadgeCheck,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Store,
  User
} from 'lucide-react'

const sidebarItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
  { path: '/dashboard/products', icon: Package, label: 'Produits' },
  { path: '/dashboard/orders', icon: ShoppingCart, label: 'Commandes' },
  { path: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/dashboard/reviews', icon: Star, label: 'Avis' },
  { path: '/dashboard/certifications', icon: BadgeCheck, label: 'Certification' },
  { path: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  
  const { profile, signOut } = useAuthStore()
  const { currentStore } = useStoreStore()
  const location = useLocation()
  const navigate = useNavigate()
  
  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-3">
              <img className="h-8" src="/logo-full.svg" alt="Drawcaf" />
            </Link>
          </div>
          
          {/* Store Info */}
          {currentStore && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{currentStore.name}</p>
                  <p className="text-xs text-gray-500 truncate">/boutique/{currentStore.slug}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={getImageUrl(profile?.avatar_url, profile?.updated_at) || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=1E3A8B&color=fff`}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-sm truncate">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <Link
                      to="/compte"
                      className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50"
                    >
                      <User className="w-5 h-5" />
                      Mon compte acheteur
                    </Link>
                    <Link
                      to={`/boutique/${currentStore?.slug}`}
                      className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50"
                    >
                      <Store className="w-5 h-5" />
                      Voir ma boutique
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5" />
                      Deconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-4">
              <Link
                to={`/boutique/${currentStore?.slug}`}
                target="_blank"
                className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-primary-100"
              >
                <Store className="w-4 h-4" />
                Voir ma boutique
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {!currentStore && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-yellow-800">Vous n'avez pas encore de boutique</p>
                <p className="text-sm text-yellow-600">Créez votre boutique pour commencer à vendre.</p>
              </div>
              <Link
                to="/onboarding"
                className="bg-primary-100 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-300 transition-colors whitespace-nowrap"
              >
                Créer ma boutique
              </Link>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
