import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStoreStore, useProductStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X,
  Plus,
  GripVertical
} from 'lucide-react'

export default function ProductFormPage() {
  const { id } = useParams()
  const isEditing = !!id
  
  const { currentStore } = useStoreStore()
  const { currentProduct, fetchProductBySlug, createProduct, updateProduct } = useProductStore()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [sku, setSku] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [weight, setWeight] = useState('')
  const [category, setCategory] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [images, setImages] = useState([])
  const [deletedImages, setDeletedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  
  useEffect(() => {
    if (isEditing && id) {
      loadProduct()
    }
  }, [id])
  
  const loadProduct = async () => {
    await fetchProductBySlug(id)
  }
  
  useEffect(() => {
    if (isEditing && currentProduct) {
      setTitle(currentProduct.title)
      setDescription(currentProduct.description || '')
      setPrice(currentProduct.price.toString())
      setCompareAtPrice(currentProduct.compare_at_price?.toString() || '')
      setSku(currentProduct.sku || '')
      setStockQuantity(currentProduct.stock_quantity.toString())
      setWeight(currentProduct.weight?.toString() || '')
      setCategory(currentProduct.category || '')
      setIsActive(currentProduct.is_active)
      setIsFeatured(currentProduct.is_featured)
      setImages(currentProduct.product_images || [])
    }
  }, [currentProduct])
  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    setUploading(true)
    
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `products/${currentStore.id}/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('drawcaf')
          .upload(filePath, file)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('drawcaf')
          .getPublicUrl(filePath)
        
        setImages(prev => [...prev, {
          url: publicUrl,
          alt: file.name,
          position: prev.length
        }])
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }
  
  const removeImage = (index) => {
    const imageToRemove = images[index]
    if (imageToRemove.id) {
      setDeletedImages(prev => [...prev, imageToRemove])
    }
    setImages(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const productData = {
        store_id: currentStore.id,
        title,
        description,
        price: parseFloat(price),
        compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
        sku,
        stock_quantity: parseInt(stockQuantity) || 0,
        weight: weight ? parseFloat(weight) : null,
        category,
        is_active: isActive,
        is_featured: isFeatured
      }
      
      let product
      if (isEditing) {
        product = await updateProduct(id, productData)
      } else {
        product = await createProduct(productData)
      }
      
      // Save images
      for (const image of images) {
        if (!image.id) {
          await supabase.from('product_images').insert({
            product_id: product.id,
            url: image.url,
            alt: image.alt,
            position: image.position
          })
        }
      }
      
      // Delete removed images
      if (deletedImages.length > 0) {
        const imageIds = deletedImages.map(img => img.id)
        
        // Remove from DB
        await supabase.from('product_images').delete().in('id', imageIds)
        
        // Remove from storage
        const paths = deletedImages.map(img => {
          const urlParts = img.url.split('/')
          return `products/${currentStore.id}/${urlParts[urlParts.length - 1]}`
        })
        
        if (paths.length > 0) {
          await supabase.storage.from('drawcaf').remove(paths)
        }
      }
      
      navigate('/dashboard/products')
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard/products')}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-head">
            {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
          </h1>
          <p className="text-gray-500">
            {isEditing ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit à votre boutique'}
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold font-head mb-4">Photos du produit</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={image.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {images.length < 10 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-100 hover:bg-primary-50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {uploading ? 'Upload...' : 'Ajouter'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Maximum 10 photos. Première photo = photo principale.
          </p>
        </div>
        
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold font-head">Informations</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du produit *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              placeholder="Ex: T-shirt Premium Coton"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none resize-none"
              rows={4}
              placeholder="Décrivez votre produit en détail..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              placeholder="Ex: Vêtements, Électronique..."
            />
          </div>
        </div>
        
        {/* Pricing & Stock */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold font-head">Prix & Stock</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix de vente *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">XOF</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix barré (optionnel)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">XOF</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Référence (SKU)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                placeholder="Ex: TSHIRT-001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantité en stock *
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poids (kg) - optionnel
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        
        {/* Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold font-head">Paramètres</h2>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-100 focus:ring-primary-100"
            />
            <div>
              <p className="font-medium">Produit visible</p>
              <p className="text-sm text-gray-500">Le produit est visible dans votre boutique</p>
            </div>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-100 focus:ring-primary-100"
            />
            <div>
              <p className="font-medium">Produit en vedette</p>
              <p className="text-sm text-gray-500">Apparaît en première position</p>
            </div>
          </label>
        </div>
        
        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  )
}
