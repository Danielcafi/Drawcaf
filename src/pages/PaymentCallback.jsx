import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import useFedapayPayment from '../hooks/useFedapayPayment'

const PaymentCallback = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [transaction, setTransaction] = useState(null)
  const { checkTransactionStatus, error } = useFedapayPayment()
  
  useEffect(() => {
    const transactionId = searchParams.get('transaction_id')
    
    if (transactionId) {
      checkTransactionStatus(transactionId)
        .then((txn) => {
          setTransaction(txn)
          setStatus(txn.status === 'completed' ? 'success' : 'failed')
        })
        .catch(() => {
          setStatus('failed')
        })
    } else {
      setStatus('failed')
    }
  }, [searchParams, checkTransactionStatus])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-primary-100 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold font-head mb-4">
              Vérification du paiement...
            </h2>
            <p className="text-gray-500">
              Nous vérifions le statut de votre paiement.
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold font-head mb-4">
              Paiement réussi !
            </h2>
            <p className="text-gray-500 mb-6">
              Votre paiement a été confirmé avec succès.
            </p>
            {transaction && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Transaction ID:</span> {transaction.id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Montant:</span> {transaction.amount} {transaction.currency}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Statut:</span> Complété
                </p>
              </div>
            )}
            <Link
              to="/"
              className="inline-block bg-primary-100 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold font-head mb-4">
              Paiement échoué
            </h2>
            <p className="text-gray-500 mb-6">
              {error || "Le paiement a échoué ou a été annulé."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cart"
                className="bg-primary-100 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
              >
                Réessayer
              </Link>
              <Link
                to="/"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default PaymentCallback
