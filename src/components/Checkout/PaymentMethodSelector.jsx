import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Smartphone } from 'lucide-react'
import { PAYMENT_METHODS, getAvailablePaymentMethods } from '../../lib/fedapay'

const PaymentMethodSelector = ({ selectedMethod, onSelect, country }) => {
  const availableMethods = getAvailablePaymentMethods(country)
  
  const getMethodIcon = (method) => {
    switch (method.id) {
      case 'mtn_momo':
        return <img src="/mtn-logo.png" alt="MTN Mobile Money" className="w-full h-full object-contain" />
      case 'moov_money':
        return <img src="/moov-logo.png" alt="Moov Money" className="w-full h-full object-contain" />
      case 'celtis':
        return <img src="/celtis-logo.png" alt="Celtis Cash" className="w-full h-full object-contain" />
      case 'card':
        return <img src="/visa-logo.png" alt="Carte bancaire" className="w-full h-full object-contain" />
      default:
        return <Smartphone className="w-8 h-8 text-gray-600" />
    }
  }

  const handleSelect = (method) => {
    onSelect(method)
  }

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Choisir une méthode de paiement</h3>
      
      {/* Logos en horizontal - sans cartes, logos pleine taille */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {availableMethods.map((method) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative cursor-pointer transition-all flex items-center justify-center p-4 rounded-xl ${
              selectedMethod?.id === method.id
                ? 'bg-primary-50 ring-4 ring-primary-100 shadow-lg'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleSelect(method)}
          >
            {/* Check icon */}
            {selectedMethod?.id === method.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center shadow">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            
            {/* Logo pleine taille */}
            <div className="w-full h-20 sm:h-24">
              {getMethodIcon(method)}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Message contextuel */}
      {selectedMethod && selectedMethod.id !== 'card' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100"
        >
          <p className="text-sm text-blue-700">
            {selectedMethod.id === 'mtn_momo' && 'Vous allez recevoir une demande de paiement sur votre téléphone MTN Mobile Money.'}
            {selectedMethod.id === 'moov_money' && 'Vous allez recevoir une demande de paiement sur votre téléphone Moov Money.'}
            {selectedMethod.id === 'celtis' && 'Vous allez recevoir une demande de paiement sur votre compte Celtis.'}
          </p>
        </motion.div>
      )}
      
      {availableMethods.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune méthode de paiement disponible pour votre pays.</p>
        </div>
      )}
    </div>
  )
}

export default PaymentMethodSelector
