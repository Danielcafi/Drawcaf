export const FEDAPAY_CONFIG = {
  publicKey: import.meta.env.VITE_FEDAPAY_PUBLIC_KEY,
  secretKey: import.meta.env.VITE_FEDAPAY_SECRET_KEY,
  baseUrl: 'https://api.fedapay.com/v1',
}

export const isFedapayConfigured = () => {
  return FEDAPAY_CONFIG.publicKey && FEDAPAY_CONFIG.secretKey
}

// Méthodes de paiement disponibles
export const PAYMENT_METHODS = [
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    description: 'Payez avec MTN MoMo',
    icon: '📱',
    color: '#FFCC00',
    availableCountries: ['Bénin', 'Côte d\'Ivoire', 'Cameroun', 'Ghana', 'Nigeria', 'Sénégal', 'Togo'],
    code: 'MTN',
  },
  {
    id: 'moov_money',
    name: 'Moov Money',
    description: 'Payez avec Moov Money',
    icon: '📱',
    color: '#0066CC',
    availableCountries: ['Bénin', 'Burkina Faso', 'Côte d\'Ivoire', 'Mali', 'Niger', 'Togo'],
    code: 'MOOV',
  },
  {
    id: 'celtis',
    name: 'Celtis',
    description: 'Payez avec Celtis',
    icon: '💳',
    color: '#00AA55',
    availableCountries: ['Bénin', 'Togo', 'Niger'],
    code: 'CELTIS',
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, etc.',
    icon: '💳',
    color: '#1A1F71',
    availableCountries: [],
    code: 'CARD',
  },
]

// Filtrer les méthodes de paiement disponibles par pays
export const getAvailablePaymentMethods = (country) => {
  if (!country) return PAYMENT_METHODS
  
  return PAYMENT_METHODS.filter(method => 
    method.availableCountries.length === 0 || 
    method.availableCountries.includes(country)
  )
}

// Obtenir une méthode par son ID
export const getPaymentMethodById = (id) => {
  return PAYMENT_METHODS.find(method => method.id === id)
}
