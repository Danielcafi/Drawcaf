import { motion } from 'framer-motion'
import { useAudience } from '../../context/AudienceContext'
import { Store, ShoppingBag } from 'lucide-react'

export default function AudienceToggle() {
  const { audience, setAudience } = useAudience()

  return (
    <div className="flex justify-center py-4">
      <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex gap-1 border border-white/20">
        <button
          onClick={() => setAudience('seller')}
          className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold font-head transition-colors ${
            audience === 'seller' ? 'text-white' : 'text-white/60 hover:text-white/80'
          }`}
        >
          {audience === 'seller' && (
            <motion.div
              layoutId="audience-pill"
              className="absolute inset-0 bg-primary-100 rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Store className="w-4 h-4" />
            Vendeur
          </span>
        </button>
        <button
          onClick={() => setAudience('buyer')}
          className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold font-head transition-colors ${
            audience === 'buyer' ? 'text-white' : 'text-white/60 hover:text-white/80'
          }`}
        >
          {audience === 'buyer' && (
            <motion.div
              layoutId="audience-pill"
              className="absolute inset-0 bg-primary-100 rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Acheteur
          </span>
        </button>
      </div>
    </div>
  )
}
