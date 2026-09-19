import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, useStoreStore } from './store'
import { supabase } from './lib/supabase'

// Landing Page
import Navbar from './components/Navbar'
import Main from './components/Main'
import Banner from './components/Banner'
import Stats from './components/Stats'
import Card from './components/Card'
import MultiChannel from './components/MultiChannel'
import GlobalReach from './components/GlobalReach'
import ForEveryone from './components/ForEveryone'
import FastReliable from './components/FastReliable'
import Integrations from './components/Integrations'
import Testimonial from './components/Testimonial'
import Pricing from './components/Pricing'
import Blog from './components/Blog'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

// Auth Pages
import LoginPage from './components/Auth/LoginPage'
import RegisterPage from './components/Auth/RegisterPage'
import OnboardingPage from './components/Auth/OnboardingPage'

// Dashboard Pages
import DashboardLayout from './components/Dashboard/DashboardLayout'
import DashboardOverview from './components/Dashboard/DashboardOverview'
import ProductsPage from './components/Dashboard/ProductsPage'
import ProductFormPage from './components/Dashboard/ProductFormPage'
import OrdersPage from './components/Dashboard/OrdersPage'
import MessagesPage from './components/Dashboard/MessagesPage'
import ReviewsPage from './components/Dashboard/ReviewsPage'
import SettingsPage from './components/Dashboard/SettingsPage'

// Buyer Pages
import StoreLayout from './components/Layout/StoreLayout'
import StorePage from './components/Store/StorePage'
import ProductPage from './components/Product/ProductPage'
import CartPage from './components/Cart/CartPage'
import CheckoutPage from './components/Checkout/CheckoutPage'
import BuyerOrdersPage from './components/Buyer/OrdersPage'
import SearchPage from './components/Buyer/SearchPage'
import WishlistPage from './components/Buyer/WishlistPage'
import SellerReviewsPage from './components/Buyer/SellerReviewsPage'

// Buyer Dashboard
import BuyerDashboardLayout from './components/Buyer/BuyerDashboardLayout'
import BuyerDashboardOverview from './components/Buyer/BuyerDashboardOverview'
import BuyerOrdersDashboard from './components/Buyer/BuyerOrdersPage'
import BuyerAnalyticsPage from './components/Buyer/BuyerAnalyticsPage'

// Admin Dashboard
import AdminDashboardLayout from './components/Admin/AdminDashboardLayout'
import AdminOverview from './components/Admin/AdminOverview'
import AdminStoresPage from './components/Admin/AdminStoresPage'
import AdminCertificationsPage from './components/Admin/AdminCertificationsPage'
import AdminUsersPage from './components/Admin/AdminUsersPage'

// Marketing Pages
import FAQPage from './components/Marketing/FAQPage'
import AboutPage from './components/Marketing/AboutPage'
import ContactPage from './components/Marketing/ContactPage'
import PricingPage from './components/Marketing/PricingPage'

// Receipt Page
import ReceiptPage from './components/Receipt/ReceiptPage'

// Demo Pages
import AdminDemo from './pages/AdminDemo'
import ShopDemo from './pages/ShopDemo'

// Payment Pages
import PaymentCallback from './pages/PaymentCallback'

// Landing Page Component
function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20">
        <Main />
        <Stats />
        <Banner />
        <Card />
        <MultiChannel />
        <GlobalReach />
        <ForEveryone />
        <FastReliable />
        <Integrations />
        <Testimonial />
        <Pricing />
        <Blog />
        <FinalCTA />
        <Footer />
      </div>
    </>
  )
}

// Guest Route (redirects to appropriate dashboard if already logged in)
function GuestRoute({ children }) {
  const { user, profile, loading } = useAuthStore()
  const { currentStore, loading: storeLoading } = useStoreStore()

  if (loading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    )
  }

  if (user) {
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />
    return <Navigate to={currentStore ? "/dashboard" : "/compte"} replace />
  }

  return children
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Admin Route Component
function AdminRoute({ children }) {
  const { user, profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

// Onboarding Required Route
function OnboardingRoute({ children }) {
  const { user, profile, loading } = useAuthStore()
  const { currentStore, loading: storeLoading } = useStoreStore()

  if (loading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (currentStore) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Dashboard Required Route (redirects to onboarding if no store)
function DashboardRoute({ children }) {
  const { user, loading } = useAuthStore()
  const { currentStore, loading: storeLoading, storeError } = useStoreStore()

  if (loading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!currentStore) {
    if (storeError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
            <p className="text-gray-600 mb-4">Impossible de charger votre boutique. Veuillez reessayer.</p>
            <button onClick={() => window.location.reload()} className="bg-primary-100 text-white px-6 py-2 rounded-lg hover:bg-primary-300">
              Reessayer
            </button>
          </div>
        </div>
      )
    }
    return <Navigate to="/onboarding" replace />
  }

  return children
}

function App() {
  const { setUser, setLoading, fetchProfile } = useAuthStore()
  const { fetchMyStore, setCurrentStore } = useStoreStore()

  useEffect(() => {
    let unsubscribe = null

    const initAuth = async () => {
      try {
        const { data: { session } = {} } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const profile = await fetchProfile(session.user.id)
            if (profile) {
              await fetchMyStore(profile.id)
            }
          } catch (err) {
            console.warn('Profile fetch notice:', err?.message || err)
          }
        }
      } catch (err) {
        console.warn('Auth getSession notice:', err?.message || err)
      } finally {
        setLoading(false)
      }
    }

    const handleAuthChange = async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user.id)
          if (profile) {
            await fetchMyStore(profile.id)
          } else {
            setCurrentStore(null)
          }
        } catch (err) {
          console.warn('Profile fetch notice:', err?.message || err)
        }
      } else {
        setCurrentStore(null)
      }
    }

    try {
      initAuth()
      const { data } = supabase.auth.onAuthStateChange(handleAuthChange)
      unsubscribe = data?.subscription?.unsubscribe
    } catch (err) {
      console.warn('Auth initialization notice:', err?.message || err)
      setLoading(false)
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Onboarding Route */}
        <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />

        {/* Protected Dashboard Routes (Vendeur) */}
        <Route path="/dashboard" element={<DashboardRoute><DashboardLayout /></DashboardRoute>}>
          <Route index element={<DashboardOverview />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Buyer Routes */}
        <Route element={<StoreLayout />}>
          <Route path="/boutique/:slug" element={<StorePage />} />
          <Route path="/boutique/:slug/avis" element={<SellerReviewsPage />} />
          <Route path="/produit/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/commandes" element={<ProtectedRoute><BuyerOrdersPage /></ProtectedRoute>} />
        </Route>
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Buyer Dashboard */}
        <Route path="/compte" element={<ProtectedRoute><BuyerDashboardLayout /></ProtectedRoute>}>
          <Route index element={<BuyerDashboardOverview />} />
          <Route path="commandes" element={<BuyerOrdersDashboard />} />
          <Route path="analytics" element={<BuyerAnalyticsPage />} />
          <Route path="favoris" element={<WishlistPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="parametres" element={<SettingsPage />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminRoute><AdminDashboardLayout /></AdminRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="stores" element={<AdminStoresPage />} />
          <Route path="certifications" element={<AdminCertificationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        {/* Marketing Routes */}
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Receipt Route */}
        <Route path="/receipt/:id" element={<ReceiptPage />} />

        {/* Payment Routes */}
        <Route path="/payment/callback" element={<PaymentCallback />} />

        {/* Interactive Demos */}
        <Route path="/demo/admin" element={<AdminDemo />} />
        <Route path="/demo/shop" element={<ShopDemo />} />
        <Route path="/admin-demo" element={<AdminDemo />} />
        <Route path="/shop-demo" element={<ShopDemo />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
