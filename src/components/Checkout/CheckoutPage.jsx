import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCartStore, useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { 
  CreditCard, 
  Lock, 
  Truck, 
  CheckCircle,
  ArrowLeft,
  Smartphone,
  Loader2,
  Download,
  Store,
  Receipt
} from 'lucide-react'
import { AFRICAN_COUNTRIES, getCitiesForCountry } from '../../data/africanCountries'
import PaymentMethodSelector from './PaymentMethodSelector'
import useFedapayPayment from '../../hooks/useFedapayPayment'

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Shipping Info
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  
  // Payment Info
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  
  // Fedapay Hook
  const { processPayment, loading: paymentLoading, error: paymentError } = useFedapayPayment()
  
  // Receipt state
  const [receiptData, setReceiptData] = useState(null)
  
  const subtotal = getTotal()
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  const availableCities = getCitiesForCountry(country)
  const resolvedCity = city === 'Autre' ? (customCity.trim() || 'Autre') : city
  
  const handleSubmitShipping = (e) => {
    e.preventDefault()
    setStep(2)
  }
  
  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      setError("Vous devez être connecté pour effectuer un achat. Veuillez vous connecter d'abord.")
      return
    }
    
    // Vérifier la méthode de paiement sélectionnée
    if (!selectedPaymentMethod) {
      setError("Veuillez sélectionner une méthode de paiement.")
      return
    }
    
    // Pour la carte bancaire, vérifier les champs
    if (selectedPaymentMethod.id === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        setError("Veuillez remplir toutes les informations de carte bancaire.")
        return
      }
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Pour les paiements mobile, traiter via Fedapay
      if (selectedPaymentMethod.id !== 'card') {
        const paymentData = {
          amount: total,
          currency: 'XOF',
          description: `Commande Drawcafshop - ${items.length} article(s)`,
          buyerEmail: email,
          buyerName: fullName,
          orderId: `ORD-${Date.now()}`,
          callbackUrl: `${window.location.origin}/payment/callback`,
        }
        
        // processPayment retourne une promise qui se résout quand le callback Fedapay est appelé
        await processPayment(paymentData)
        
        // Si on arrive ici, le paiement est réussi
        console.log('✅ Paiement confirmé, création de la commande...')
      }
      
      // Group items by store
      const itemsByStore = items.reduce((acc, item) => {
        const storeId = item.product.store_id
        if (!acc[storeId]) acc[storeId] = []
        acc[storeId].push(item)
        return acc
      }, {})
      
      const allCreatedOrders = []
      
      // Create orders for each store
      for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
        const storeSubtotal = storeItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity, 0
        )
        
        // Fetch store info for receipt
        const { data: storeInfo } = await supabase
          .from('stores')
          .select('name, slug')
          .eq('id', storeId)
          .single()
        
        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            buyer_id: user?.id,
            store_id: storeId,
            subtotal: storeSubtotal,
            shipping_cost: shipping,
            total: storeSubtotal + (storeItems === items ? shipping : 0),
            shipping_address: {
              fullName,
              email,
              phone,
              address,
              city: resolvedCity,
              postalCode,
              country
            },
            payment_method: selectedPaymentMethod.id,
            payment_status: 'paid',
            status: 'confirmed'
          })
          .select()
          .single()
        
        if (orderError) throw orderError
        
        // Create order items
        const orderItems = storeItems.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          variant_id: item.variant?.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image_url: item.product.product_images?.[0]?.url
        }))
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)
        
        if (itemsError) throw itemsError
        
        // Generate receipt number
        const receiptNumber = `REC-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        
        // Create receipt
        const receiptItems = storeItems.map(item => ({
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity
        }))
        
        const { data: receipt } = await supabase
          .from('receipts')
          .insert({
            order_id: order.id,
            buyer_id: user?.id,
            store_id: storeId,
            receipt_number: receiptNumber,
            subtotal: storeSubtotal,
            shipping_cost: storeItems === items ? shipping : 0,
            total: storeSubtotal + (storeItems === items ? shipping : 0),
            currency: 'XOF',
            payment_method: selectedPaymentMethod.name || selectedPaymentMethod.id,
            items: receiptItems,
            buyer_name: fullName,
            buyer_email: email,
            store_name: storeInfo?.name || 'Boutique',
            store_slug: storeInfo?.slug || '',
          })
          .select()
          .single()
        
        // Update order with receipt URL
        if (receipt) {
          await supabase
            .from('orders')
            .update({ receipt_url: `${window.location.origin}/receipt/${receipt.id}` })
            .eq('id', order.id)
        }
        
        allCreatedOrders.push({ ...order, receipt, store_name: storeInfo?.name, store_slug: storeInfo?.slug })
        
        // Update product stock
        await Promise.all(storeItems.map(item => 
          supabase
            .from('products')
            .update({
              stock_quantity: Math.max(0, item.product.stock_quantity - item.quantity),
              total_sales: (item.product.total_sales || 0) + item.quantity
            })
            .eq('id', item.product.id)
        ))
        
        // Update store total sales
        await supabase
          .from('stores')
          .update({
            total_sales: supabase.rpc('increment', { x: storeItems.length })
          })
          .eq('id', storeId)
      }
      
      // Save receipt data for display
      setReceiptData({
        orders: allCreatedOrders,
        receiptNumber: allCreatedOrders[0]?.receipt?.receipt_number || `REC-${Date.now().toString().slice(-8)}`,
        items: items.map(i => ({ title: i.product.title, price: i.product.price, quantity: i.quantity })),
        subtotal,
        shipping,
        total,
        buyerName: fullName,
        buyerEmail: email,
        storeName: allCreatedOrders[0]?.store_name || 'Boutique',
        storeSlug: allCreatedOrders[0]?.store_slug || '',
      })
      
      clearCart()
      setStep(3)
    } catch (err) {
      setError(err.message || 'Erreur lors du paiement')
    } finally {
      setLoading(false)
    }
  }
  
  if (items.length === 0 && step !== 3) {
    navigate('/cart')
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {step > 1 && step < 3 && (
              <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-bold font-head">Checkout</h1>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { num: 1, label: 'Livraison' },
              { num: 2, label: 'Paiement' },
              { num: 3, label: 'Confirmation' }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${step >= s.num ? 'text-primary-100' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > s.num ? 'bg-green-500 text-white' :
                    step === s.num ? 'bg-primary-100 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-1 mx-2 ${step > s.num ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <p>{error}</p>
            {error.includes('connecté') && (
              <Link to="/login" className="mt-2 inline-block text-primary-100 underline">
                Se connecter
              </Link>
            )}
          </div>
        )}
        
        {/* Step 1: Shipping */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-primary-100" />
                <h2 className="text-lg font-bold">Adresse de livraison</h2>
              </div>
              
              <form onSubmit={handleSubmitShipping} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                    placeholder="Numéro et nom de rue"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pays (Afrique) *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value)
                        setCity('')
                        setCustomCity('')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none bg-white cursor-pointer"
                      required
                    >
                      <option value="">Sélectionnez un pays</option>
                      {AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!country}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">
                        {country ? "Sélectionnez une ville" : "Sélectionnez d'abord un pays"}
                      </option>
                      {availableCities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>

                    {city === 'Autre' && (
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="Précisez le nom de votre ville"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                        required
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal / Boîte postale (optionnel)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                    placeholder="BP ou code postal"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-100 text-white py-4 rounded-lg font-bold hover:bg-primary-300 transition-colors"
                >
                  Continuer vers le paiement
                </button>
              </form>
            </div>
          </motion.div>
        )}
        
        {/* Step 2: Payment */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-primary-100" />
                <h2 className="text-lg font-bold">Paiement</h2>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3">Résumé</h3>
                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.product.title} x{item.quantity}
                      </span>
                      <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison</span>
                      <span>{shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)} €`}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Method Selector */}
              <div className="mb-6">
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onSelect={setSelectedPaymentMethod}
                  country={country}
                />
              </div>
              
              {/* Payment Form */}
              <form onSubmit={handlePayment} className="space-y-4 mb-6">
                {/* Carte bancaire uniquement */}
                {selectedPaymentMethod?.id === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {/* Mobile Money */}
                {(selectedPaymentMethod?.id === 'mtn_momo' || 
                  selectedPaymentMethod?.id === 'moov_money' || 
                  selectedPaymentMethod?.id === 'celtis') && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Smartphone className="w-5 h-5 text-primary-100" />
                      <span className="font-medium">Paiement Mobile</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Vous allez recevoir une demande de paiement sur votre téléphone. 
                      Confirmez le paiement depuis votre application {selectedPaymentMethod.name}.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>Paiement sécurisé via {selectedPaymentMethod.name}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 mb-6">
                  <Lock className="w-4 h-4" />
                  <span>Paiement sécurisé et crypté</span>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || paymentLoading || !selectedPaymentMethod}
                  className="w-full bg-primary-100 text-white py-4 rounded-lg font-bold hover:bg-primary-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(loading || paymentLoading) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    `Payer ${total.toFixed(2)} €`
                  )}
                </button>
              </form>
              
              {paymentError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                  {paymentError}
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Confirmation with Receipt */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold font-head mb-4">Commande confirmee !</h2>
              <p className="text-gray-500">Merci pour votre achat. Votre commande a ete enregistree.</p>
            </div>

            {/* Receipt Card */}
            {receiptData && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md mx-auto">
                {/* Receipt Header */}
                <div className="bg-primary-100 text-white p-6 text-center">
                  <Receipt className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="text-lg font-bold">Recu de paiement</h3>
                  <p className="text-sm opacity-90">{receiptData.receiptNumber}</p>
                </div>

                {/* Receipt Body */}
                <div className="p-6 space-y-4">
                  {/* Store Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{receiptData.storeName}</p>
                      <p className="text-sm text-gray-500">Vendeur Drawcaf</p>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-400 uppercase mb-1">Client</p>
                    <p className="font-medium text-gray-900">{receiptData.buyerName}</p>
                    <p className="text-sm text-gray-500">{receiptData.buyerEmail}</p>
                  </div>

                  {/* Items */}
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-400 uppercase mb-2">Articles</p>
                    {receiptData.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">{item.title} x{item.quantity}</span>
                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)} XOF</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sous-total</span>
                      <span>{receiptData.subtotal.toFixed(2)} XOF</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Livraison</span>
                      <span>{receiptData.shipping.toFixed(2)} XOF</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                      <span>Total paye</span>
                      <span className="text-primary-100">{receiptData.total.toFixed(2)} XOF</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 uppercase mb-3">Scannez pour revoir la boutique</p>
                    <div className="bg-white p-3 rounded-xl border border-gray-200">
                      <QRCodeSVG
                        value={`${window.location.origin}/boutique/${receiptData.storeSlug}`}
                        size={120}
                        bgColor="#ffffff"
                        fgColor="#1E3A8B"
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      drawcaf.com/boutique/{receiptData.storeSlug}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="text-center text-xs text-gray-400 pt-2">
                    {new Date().toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/compte/commandes"
                className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors text-center"
              >
                Mes commandes
              </Link>
              <Link
                to="/"
                className="bg-primary-100 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors text-center"
              >
                Retour a l'accueil
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
