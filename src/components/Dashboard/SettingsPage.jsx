import { useState, useEffect, useRef } from 'react'
import { useStoreStore, useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { storageUpload } from '../../lib/storage'
import { Settings, Save, Store, User, Mail, Phone, MapPin, AlertCircle, Camera, X } from 'lucide-react'

export default function SettingsPage() {
  const { currentStore, updateStore } = useStoreStore()
  const { profile, updateProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [storeData, setStoreData] = useState({
    name: '',
    description: '',
    category: '',
    city: '',
    country: ''
  })

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: ''
  })

  const [avatarFile, setAvatarFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)

  const [storeLogoFile, setStoreLogoFile] = useState(null)
  const [storeBannerFile, setStoreBannerFile] = useState(null)
  const [storeLogoPreview, setStoreLogoPreview] = useState(null)
  const [storeBannerPreview, setStoreBannerPreview] = useState(null)

  const avatarInputRef = useRef(null)
  const bannerInputRef = useRef(null)
  const storeLogoInputRef = useRef(null)
  const storeBannerInputRef = useRef(null)

  useEffect(() => {
    if (currentStore) {
      setStoreData({
        name: currentStore.name || '',
        description: currentStore.description || '',
        category: currentStore.category || '',
        city: currentStore.city || '',
        country: currentStore.country || ''
      })
    }
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      })
    }
  }, [currentStore, profile])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("L'image ne doit pas depasser 2 Mo")
        return
      }
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas depasser 5 Mo")
        return
      }
      setBannerFile(file)
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const handleStoreLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("L'image ne doit pas depasser 2 Mo")
        return
      }
      setStoreLogoFile(file)
      setStoreLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleStoreBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas depasser 5 Mo")
        return
      }
      setStoreBannerFile(file)
      setStoreBannerPreview(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (file, folder) => {
    const fileExt = file.name.split('.').pop()
    const filePath = `profiles/${profile.id}/${folder}.${fileExt}`
    const timestamp = Date.now()

    const publicUrl = await storageUpload(filePath, file)

    return `${publicUrl}?t=${timestamp}`
  }

  const uploadStoreImage = async (file, folder) => {
    const fileExt = file.name.split('.').pop()
    const filePath = `stores/${currentStore.id}/${folder}.${fileExt}`
    const timestamp = Date.now()

    const publicUrl = await storageUpload(filePath, file)

    return `${publicUrl}?t=${timestamp}`
  }

  const handleStoreSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let updates = { ...storeData }

      if (storeLogoFile) {
        const logoUrl = await uploadStoreImage(storeLogoFile, 'logo')
        updates.logo_url = logoUrl
      }

      if (storeBannerFile) {
        const storeBannerUrl = await uploadStoreImage(storeBannerFile, 'banner')
        updates.banner_url = storeBannerUrl
      }

      await updateStore(currentStore.id, updates)
      setSuccess('Boutique mise a jour avec succes')
      setStoreLogoFile(null)
      setStoreBannerFile(null)
      setStoreLogoPreview(null)
      setStoreBannerPreview(null)
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise a jour')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let updates = { id: profile.id, full_name: profileData.full_name, phone: profileData.phone }

      if (avatarFile) {
        const avatarUrl = await uploadImage(avatarFile, 'avatar')
        updates.avatar_url = avatarUrl
        console.log('Avatar URL:', avatarUrl)
      }

      if (bannerFile) {
        const bannerUrl = await uploadImage(bannerFile, 'banner')
        updates.banner_url = bannerUrl
        console.log('Banner URL:', bannerUrl)
      }

      console.log('Updates envoyes:', updates)
      const result = await updateProfile(updates)
      console.log('Resultat updateProfile:', result)
      setSuccess('Profil mis a jour avec succes')
      setAvatarFile(null)
      setBannerFile(null)
    } catch (err) {
      console.error('Erreur upload:', err)
      setError(err.message || 'Erreur lors de la mise a jour')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'Mode & Accessoires',
    'Maison & Décoration',
    'Beauté & Soins',
    'Électronique & Tech',
    'Alimentation & Boissons',
    'Art & Craft',
    'Sport & Outdoor',
    'Bébé & Enfant',
    'Animaux',
    'Autre'
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-head">Paramètres</h1>

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Store Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold">Informations de la boutique</h2>
        </div>

        <form onSubmit={handleStoreSubmit} className="space-y-6">
          {/* Store Banner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banniere de la boutique
            </label>
            <div className="relative">
              <div
                className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-primary-100 transition-colors"
                onClick={() => storeBannerInputRef.current?.click()}
              >
                {storeBannerPreview || currentStore?.banner_url ? (
                  <>
                    <img
                      src={storeBannerPreview || currentStore?.banner_url}
                      alt="Banniere boutique"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setStoreBannerFile(null)
                        setStoreBannerPreview(null)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cliquez pour ajouter une banniere</p>
                    <p className="text-xs text-gray-400">1200 x 400px recommande, 5 Mo max</p>
                  </div>
                )}
              </div>
              <input
                ref={storeBannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleStoreBannerChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Store Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de la boutique
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-primary-100 transition-colors"
                  onClick={() => storeLogoInputRef.current?.click()}
                >
                  {storeLogoPreview || currentStore?.logo_url ? (
                    <img
                      src={storeLogoPreview || currentStore?.logo_url}
                      alt="Logo boutique"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {(storeLogoPreview || currentStore?.logo_url) && (
                  <button
                    type="button"
                    onClick={() => {
                      setStoreLogoFile(null)
                      setStoreLogoPreview(null)
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <input
                  ref={storeLogoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleStoreLogoChange}
                  className="hidden"
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>Cliquez pour changer le logo</p>
                <p className="text-xs text-gray-400">Carre recommande, 2 Mo max.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la boutique
            </label>
            <input
              type="text"
              value={storeData.name}
              onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={storeData.description}
              onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={storeData.category}
              onChange={(e) => setStoreData({ ...storeData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                value={storeData.city}
                onChange={(e) => setStoreData({ ...storeData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <input
                type="text"
                value={storeData.country}
                onChange={(e) => setStoreData({ ...storeData, country: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-300 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold">Informations personnelles</h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banniere du profil
            </label>
            <div className="relative">
              <div
                className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-primary-100 transition-colors"
                onClick={() => bannerInputRef.current?.click()}
              >
                {bannerPreview || profile?.banner_url ? (
                  <>
                    <img
                      src={bannerPreview || profile?.banner_url}
                      alt="Banniere"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setBannerFile(null)
                        setBannerPreview(null)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cliquez pour ajouter une banniere</p>
                    <p className="text-xs text-gray-400">1200 x 400px recommande, 5 Mo max</p>
                  </div>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de profil
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-primary-100 transition-colors"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarPreview || profile?.avatar_url ? (
                    <img
                      src={avatarPreview || profile?.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {(avatarPreview || profile?.avatar_url) && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null)
                      setAvatarPreview(null)
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>Cliquez pour changer votre photo</p>
                <p className="text-xs text-gray-400">JPG, PNG. 2 Mo max.</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                required
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                placeholder="+221 77 123 45 67"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-300 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}