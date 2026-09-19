import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ProductCard from './ProductCard'
import Subtitle from '../Atoms/subtitle'
import SubHead from '../Atoms/subhead'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(*), stores(name, slug)')
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('total_sales', { ascending: false })
          .limit(8)

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.warn('Erreur chargement produits vedettes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (loading || products.length === 0) return null

  return (
    <div className="container mx-auto max-w-[1344px]">
      <div className="px-5 py-16 sm:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center mb-12"
        >
          <Subtitle style="mb-2">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              SÉLECTION DU JOUR
            </span>
          </Subtitle>
          <SubHead style="mb-[18px] sm:w-8/12 md:w-9/12 lg:w-7/12">
            Des créations qui sortent de l'ordinaire
          </SubHead>
          <p className="text-sm text-gray-500 sm:w-3/5 md:w-7/12 lg:w-1/3">
            Découvrez les produits les plus populaires de nos artisans et créateurs africains.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/recherche"
            className="inline-flex items-center gap-2 bg-primary-100 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-primary-300 transition-colors"
          >
            Voir tous les produits
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
