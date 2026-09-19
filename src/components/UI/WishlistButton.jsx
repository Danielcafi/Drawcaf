import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WishlistButton({ productId, size = 'md' }) {
  const { user } = useAuthStore()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (user) checkWishlist()
  }, [user, productId])
  
  const checkWishlist = async () => {
    const { data } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle()
    
    setIsInWishlist(!!data)
  }
  
  const toggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      window.location.href = '/login'
      return
    }
    
    setLoading(true)
    
    if (isInWishlist) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      
      if (!error) setIsInWishlist(false)
    } else {
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: productId })
      
      if (!error) setIsInWishlist(true)
    }
    
    setLoading(false)
  }
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleWishlist}
      disabled={loading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-colors ${
        isInWishlist
          ? 'bg-red-50 text-red-500'
          : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50'
      }`}
    >
      <Heart
        className={iconSizes[size]}
        fill={isInWishlist ? 'currentColor' : 'none'}
      />
    </motion.button>
  )
}
