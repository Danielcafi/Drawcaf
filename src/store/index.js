import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// Auth Store
export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },
  
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
    if (error) throw error
    return data
  },
  
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) throw error
    return data
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    set({ user: null, profile: null })
  },
  
  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error && error.code === 'PGRST116') {
      // Profile introuvable : création automatique à partir de l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: created, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Vendeur',
            avatar_url: user.user_metadata?.avatar_url || '',
            role: 'seller'
          })
          .select()
          .single()
        if (!insertError && created) {
          set({ profile: created })
          return created
        }
      }
    }
    if (error) throw error
    set({ profile: data })
    return data
  },
  
  updateProfile: async (updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', updates.id)
      .select()
      .single()
    if (error) throw error
    set({ profile: data })
    return data
  }
}))

// Store (Boutique) Store
export const useStoreStore = create((set, get) => ({
  currentStore: null,
  stores: [],
  loading: false,
  storeError: null,
  
  setCurrentStore: (store) => set({ currentStore: store, storeError: null }),
  
  fetchStoreBySlug: async (slug) => {
    set({ loading: true, storeError: null })
    const { data, error } = await supabase
      .from('stores')
      .select('*, owner:profiles!owner_id(id, full_name, avatar_url, banner_url)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    set({ loading: false })
    if (error) throw error
    set({ currentStore: data })
    return data
  },
  
  fetchMyStore: async (ownerId) => {
    set({ loading: true, storeError: null })
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', ownerId)
      .limit(1)
      .maybeSingle()
      
    set({ loading: false })
    if (error) {
      set({ storeError: error.message })
      throw error
    }
    set({ currentStore: data, storeError: null })
    return data
  },
  
  createStore: async (storeData) => {
    const { data, error } = await supabase
      .from('stores')
      .insert(storeData)
      .select()
      .single()
    if (error) throw error
    set({ currentStore: data, storeError: null })
    return data
  },
  
  updateStore: async (id, updates) => {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set({ currentStore: data })
    return data
  }
}))

// Products Store
export const useProductStore = create((set) => ({
  products: [],
  currentProduct: null,
  loading: false,
  
  fetchStoreProducts: async (storeId) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
    set({ loading: false })
    if (error) throw error
    set({ products: data })
    return data
  },
  
  fetchPublicProducts: async (storeId) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    set({ products: data })
    return data
  },
  
  fetchProductBySlug: async (productId) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), product_variants(*), stores(*), reviews(*, profiles(*))')
      .eq('id', productId)
      .single()
    if (error) throw error
    set({ currentProduct: data })
    return data
  },
  
  createProduct: async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()
    if (error) throw error
    set((state) => ({ products: [data, ...state.products] }))
    return data
  },
  
  updateProduct: async (id, updates) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    set((state) => ({
      products: state.products.map(p => p.id === id ? data : p)
    }))
    return data
  },
  
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
    set((state) => ({
      products: state.products.filter(p => p.id !== id)
    }))
  }
}))

// Helper safe localStorage parser
const getInitialCart = () => {
  try {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('cart')
    return stored ? JSON.parse(stored) : []
  } catch (err) {
    console.warn('Failed to parse cart from localStorage:', err)
    return []
  }
}

// Payment Store
export const usePaymentStore = create((set) => ({
  selectedMethod: null,
  paymentHistory: [],
  currentPayment: null,
  loading: false,
  error: null,
  
  setSelectedMethod: (method) => set({ selectedMethod: method }),
  
  setCurrentPayment: (payment) => set({ currentPayment: payment }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  addPaymentToHistory: (payment) => set((state) => ({
    paymentHistory: [payment, ...state.paymentHistory]
  })),
  
  clearPaymentHistory: () => set({ paymentHistory: [] }),
  
  clearError: () => set({ error: null }),
}))

// Cart Store
export const useCartStore = create((set, get) => ({
  items: getInitialCart(),
  
  addItem: (product, quantity = 1, variant = null) => {
    const items = get().items
    const existingIndex = items.findIndex(
      item => item.product.id === product.id && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    )
    
    let newItems
    if (existingIndex > -1) {
      newItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      newItems = [...items, { product, quantity, variant }]
    }
    
    localStorage.setItem('cart', JSON.stringify(newItems))
    set({ items: newItems })
  },
  
  removeItem: (productId, variant = null) => {
    const items = get().items.filter(
      item => !(item.product.id === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant))
    )
    localStorage.setItem('cart', JSON.stringify(items))
    set({ items })
  },
  
  updateQuantity: (productId, quantity, variant = null) => {
    const items = get().items.map(item =>
      item.product.id === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
        ? { ...item, quantity }
        : item
    )
    localStorage.setItem('cart', JSON.stringify(items))
    set({ items })
  },
  
  clearCart: () => {
    localStorage.removeItem('cart')
    set({ items: [] })
  },
  
  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    )
  },
  
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  }
}))
