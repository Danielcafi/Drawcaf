import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, useStoreStore } from '../../store'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, MapPin, Tag, ArrowRight, ArrowLeft, Check, Image as ImageIcon, Shield, Upload } from 'lucide-react'
import { AFRICAN_COUNTRIES, getCitiesForCountry } from '../../data/africanCountries'
import { supabase } from '../../lib/supabase'

const categories = [
  'Mode & Accessoires',
  'Maison & Decoration',
  'Beaute & Soins',
  'Electronique & Tech',
  'Alimentation & Boissons',
  'Art & Craft',
  'Sport & Outdoor',
  'Bebe & Enfant',
  'Animaux',
  'Autre'
]

const steps = [
  { id: 1, title: 'Nom', icon: Store },
  { id: 2, title: 'Photos', icon: ImageIcon },
  { id: 3, title: 'Description', icon: Tag },
  { id: 4, title: 'Localisation', icon: MapPin },
  { id: 5, title: 'Certification', icon: Shield },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState('')
  const [wantCertification, setWantCertification] = useState(false)
  const [certificationDocs, setCertificationDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { profile } = useAuthStore()
  const { createStore } = useStoreStore()
  const navigate = useNavigate()

  const generateSlug = (name) => {
    const base = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const suffix = Math.random().toString(36).substring(2, 7)
    return `${base}-${suffix}`
  }

  const availableCities = getCitiesForCountry(country)
  const resolvedCity = city === 'Autre' ? (customCity.trim() || 'Autre') : city

  const handleCertificationDoc = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length + certificationDocs.length > 3) {
      setError('Maximum 3 documents de certification')
      return
    }
    const newDocs = files.map(file => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      type: 'other'
    }))
    setCertificationDocs(prev => [...prev, ...newDocs])
  }

  const removeCertificationDoc = (index) => {
    setCertificationDocs(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      if (!profile || !profile.id) {
        throw new Error("Profil utilisateur non trouve. Veuillez vous reconnecter.")
      }

      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', profile.id)
        .limit(1)
        .maybeSingle()

      if (existingStore) {
        throw new Error("Vous avez deja une boutique.")
      }

      const slug = generateSlug(storeName)

      let logoUrl = ''
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `logo_${Date.now()}.${fileExt}`
        const filePath = `stores/${profile.id}/${fileName}`
        const { error: uploadError } = await supabase.storage.from('Drawcaf').upload(filePath, logoFile)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('Drawcaf').getPublicUrl(filePath)
        logoUrl = publicUrl
      }

      let bannerUrl = ''
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop()
        const fileName = `banner_${Date.now()}.${fileExt}`
        const filePath = `stores/${profile.id}/${fileName}`
        const { error: uploadError } = await supabase.storage.from('Drawcaf').upload(filePath, bannerFile)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('Drawcaf').getPublicUrl(filePath)
        bannerUrl = publicUrl
      }

      const { data: newStore } = await createStore({
        owner_id: profile.id,
        name: storeName,
        slug,
        description,
        category,
        city: resolvedCity,
        country,
        logo_url: logoUrl || null,
        banner_url: bannerUrl || null,
        is_active: false,
        approval_status: 'pending',
        is_certified: false,
        certification_fee_paid: false,
      })

      if (wantCertification && certificationDocs.length > 0 && newStore) {
        for (const doc of certificationDocs) {
          const fileExt = doc.file.name.split('.').pop()
          const fileName = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
          const filePath = `certifications/${profile.id}/${fileName}`
          const { error: uploadError } = await supabase.storage.from('Drawcaf').upload(filePath, doc.file)
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('Drawcaf').getPublicUrl(filePath)
            await supabase.from('store_certifications').insert({
              store_id: newStore.id,
              document_type: doc.type,
              document_url: publicUrl,
              status: 'pending',
            })
          }
        }
        await supabase.from('stores').update({ certification_fee_paid: true }).eq('id', newStore.id)
      }

      if (profile.role !== 'seller') {
        const { updateProfile } = useAuthStore.getState()
        if (updateProfile) {
          await updateProfile({ id: profile.id, role: 'seller' })
        }
      }

      navigate('/dashboard')
    } catch (err) {
      console.error("Erreur creation boutique:", err)
      if (err?.code === '23505') {
        setError('Ce nom de boutique est deja pris.')
      } else {
        setError(err.message || 'Erreur lors de la creation.')
      }
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return storeName.length >= 3
      case 2: return true
      case 3: return description.length >= 10
      case 4: return category && country && (city && (city !== 'Autre' || customCity.trim().length > 0))
      case 5: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-tertiary-300 flex items-center justify-center px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-head mb-2">Creez votre boutique</h1>
          <p className="text-gray-500">Configurez votre espace vendeur en quelques etapes</p>
        </div>

        <div className="flex items-center justify-center gap-1 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                step > s.id ? 'bg-green-500 text-white' : step === s.id ? 'bg-primary-100 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-1 ${step > s.id ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary-100" />
                  </div>
                  <div>
                    <h2 className="font-bold font-head">Nom de la boutique</h2>
                    <p className="text-sm text-gray-500">Choisissez un nom unique</p>
                  </div>
                </div>
                <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none text-lg"
                  placeholder="Ma Super Boutique" autoFocus />
                {storeName && (
                  <p className="text-sm text-gray-500">
                    URL : drawcaf.com/boutique/<span className="font-medium text-primary-100">{generateSlug(storeName)}</span>
                  </p>
                )}
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Photo / Logo de la boutique</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group cursor-pointer hover:border-primary-100 transition-colors">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-primary-100 transition-colors" />
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => { const file = e.target.files[0]; if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)) } }} />
                    </div>
                    <div className="text-sm text-gray-500">
                      <p className="font-medium text-gray-700 mb-1">Image de profil</p>
                      <p>Format : Carré, JPG ou PNG</p>
                      <p>Taille max : 5 Mo</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100/10 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-primary-100" />
                  </div>
                  <div>
                    <h2 className="font-bold font-head">Photos & Banniere</h2>
                    <p className="text-sm text-gray-500">Donnez vie a votre boutique</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banniere de la boutique</label>
                  <div className="relative w-full h-40 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 group cursor-pointer hover:border-primary-100 transition-colors">
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banniere" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary-100 transition-colors mb-2" />
                        <p className="text-sm text-gray-500">Cliquez pour ajouter une banniere</p>
                        <p className="text-xs text-gray-400">1200x400px recommande</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => { const file = e.target.files[0]; if (file) { setBannerFile(file); setBannerPreview(URL.createObjectURL(file)) } }} />
                  </div>
                </div>

                {logoPreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apercu</label>
                    <div className="relative rounded-xl overflow-hidden bg-gray-100">
                      <div className="h-32 bg-gradient-to-r from-primary-100 to-primary-300">
                        <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3 flex items-center gap-3 bg-white">
                        <img src={logoPreview} alt="" className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-bold text-sm">{storeName || 'Votre Boutique'}</p>
                          <p className="text-xs text-gray-500">{category || 'Categorie'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100/10 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-primary-100" />
                  </div>
                  <div>
                    <h2 className="font-bold font-head">Description</h2>
                    <p className="text-sm text-gray-500">Presentez votre boutique</p>
                  </div>
                </div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none resize-none"
                  rows={4} placeholder="Decrivez votre boutique, vos produits, votre histoire..." autoFocus />
                <p className="text-sm text-gray-500">{description.length}/500 caracteres</p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-100" />
                  </div>
                  <div>
                    <h2 className="font-bold font-head">Categorie & Localisation</h2>
                    <p className="text-sm text-gray-500">Ou etes-vous situe ?</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categorie d'activite</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none">
                    <option value="">Selectionnez une categorie</option>
                    {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays (Afrique) *</label>
                    <select value={country} onChange={(e) => { setCountry(e.target.value); setCity(''); setCustomCity('') }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none bg-white cursor-pointer">
                      <option value="">Selectionnez un pays</option>
                      {AFRICAN_COUNTRIES.map((c) => (<option key={c.code} value={c.name}>{c.flag} {c.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!country}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none bg-white disabled:bg-gray-100 cursor-pointer">
                      <option value="">{country ? "Selectionnez une ville" : "Selectionnez d'abord un pays"}</option>
                      {availableCities.map((cityName) => (<option key={cityName} value={cityName}>{cityName}</option>))}
                    </select>
                    {city === 'Autre' && (
                      <input type="text" value={customCity} onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="Precisez le nom de votre ville"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none" />
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-100" />
                  </div>
                  <div>
                    <h2 className="font-bold font-head">Certification (optionnel)</h2>
                    <p className="text-sm text-gray-500">Obtenez le badge "Boutique Verifiee"</p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${wantCertification ? 'border-primary-100 bg-primary-100/5' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setWantCertification(!wantCertification)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${wantCertification ? 'bg-primary-100 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">Je veux ma boutique certifiee</p>
                      <p className="text-sm text-gray-500">Badge de confiance + visibilite accrue</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${wantCertification ? 'border-primary-100 bg-primary-100' : 'border-gray-300'}`}>
                      {wantCertification && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>

                {wantCertification && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-blue-800 font-medium mb-1">Comment ca marche ?</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>1. Soumettez vos documents (piece d'identite, registre de commerce)</li>
                        <li>2. Un admin examinera votre demande</li>
                        <li>3. Apres approbation, votre boutique recevra le badge "Verifiee"</li>
                      </ul>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Documents de certification</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-100 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Cliquez ou glissez vos documents</p>
                        <p className="text-xs text-gray-400">Piece d'identite, registre de commerce (max 3 fichiers)</p>
                        <input type="file" accept="image/*,.pdf" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleCertificationDoc} />
                      </div>
                    </div>

                    {certificationDocs.length > 0 && (
                      <div className="space-y-2">
                        {certificationDocs.map((doc, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                              {doc.preview && <img src={doc.preview} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doc.name}</p>
                            </div>
                            <button onClick={() => removeCertificationDoc(index)} className="text-red-500 hover:text-red-700 text-sm">
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {!wantCertification && (
                  <p className="text-sm text-gray-500 text-center">
                    Vous pourrez demander la certification plus tard depuis votre dashboard.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-5 h-5" /> Retour
              </button>
            ) : <div />}
            {step < 5 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
                className="flex items-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Suivant <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canProceed() || loading}
                className="flex items-center gap-2 bg-primary-100 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creation...' : 'Creer ma boutique'}
                {!loading && <Check className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Vous avez deja une boutique ?{' '}
          <Link to="/login" className="text-primary-100 font-medium hover:underline">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  )
}
