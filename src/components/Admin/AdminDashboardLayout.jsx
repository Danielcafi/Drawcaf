import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { getImageUrl } from '../../utils/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home
} from 'lucide-react'

const sidebarItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
  { path: '/admin/stores', icon: Store, label: 'Boutiques' },
  { path: '/admin/certifications', icon: Shield, label: 'Certifications' },
  { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
]

export default function AdminDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { profile, signOut } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-3">
              <img className="h-8" src="/logo-full.svg" alt="Drawcaf" />
            </Link>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{profile?.full_name || 'Admin'}</p>
                <p className="text-xs text-red-600 font-medium">Administrateur</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <img src={getImageUrl(profile?.avatar_url, profile?.updated_at) || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=DC2626&color=fff`}
                  alt="" className="w-10 h-10 rounded-full" />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-sm truncate">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                      <Home className="w-5 h-5" /> Accueil
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50">
                      <LogOut className="w-5 h-5" /> Deconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Link to="/" className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-red-500">
                <Home className="w-4 h-4" /> Accueil
              </Link>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
