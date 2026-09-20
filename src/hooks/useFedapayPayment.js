import { useState, useCallback, useRef } from 'react'
import { FEDAPAY_CONFIG, isFedapayConfigured } from '../lib/fedapay'
import { supabase } from '../lib/supabase'

let scriptLoading = false
let scriptLoaded = false

const useFedapayPayment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [transaction, setTransaction] = useState(null)
  const resolveRef = useRef(null)
  const rejectRef = useRef(null)

  const loadScript = () => {
    return new Promise((resolve, reject) => {
      if (scriptLoaded && window.FedaPay) {
        resolve(true)
        return
      }

      if (scriptLoading) {
        const checkLoaded = setInterval(() => {
          if (scriptLoaded && window.FedaPay) {
            clearInterval(checkLoaded)
            resolve(true)
          }
        }, 100)
        setTimeout(() => clearInterval(checkLoaded), 15000)
        return
      }

      scriptLoading = true

      const script = document.createElement('script')
      script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7'
      script.async = true
      
      script.onload = () => {
        scriptLoaded = true
        scriptLoading = false
        console.log('Script Fedapay charge')
        resolve(true)
      }
      
      script.onerror = () => {
        scriptLoading = false
        reject(new Error('Impossible de charger Fedapay'))
      }

      document.body.appendChild(script)
    })
  }

  const processPayment = useCallback(async (paymentData) => {
    setLoading(true)
    setError(null)

    try {
      if (!isFedapayConfigured()) {
        throw new Error('Fedapay n\'est pas configure')
      }

      await loadScript()

      if (!window.FedaPay) {
        throw new Error('Fedapay n\'est pas disponible')
      }

      // Supprimer l'ancien bouton s'il existe
      const oldBtn = document.getElementById('fedapay-btn')
      if (oldBtn) oldBtn.remove()

      // Creer le bouton cache
      const payBtn = document.createElement('button')
      payBtn.id = 'fedapay-btn'
      payBtn.style.display = 'none'
      document.body.appendChild(payBtn)

      // Separer le nom en firstname/lastname
      const nameParts = (paymentData.buyerName || '').trim().split(' ')
      const firstname = nameParts[0] || ''
      const lastname = nameParts.slice(1).join(' ') || ''

      // Initialiser Fedapay selon la doc officielle
      window.FedaPay.init('#fedapay-btn', {
        public_key: FEDAPAY_CONFIG.publicKey,
        transaction: {
          amount: Math.round(paymentData.amount),
          description: paymentData.description || 'Paiement Drawcaf',
          currency: { iso: 'XOF' },
        },
        customer: {
          email: paymentData.buyerEmail || '',
          firstname,
          lastname,
        },
        onComplete: function(reason, resp) {
          console.log('Callback Fedapay:', { reason, resp })
          
          const FedaPay = window.FedaPay
          
          if (reason === FedaPay.CHECKOUT_COMPLETED) {
            console.log('Paiement reussi!', resp)
            setTransaction(resp)
            setLoading(false)
            
            if (resolveRef.current) {
              resolveRef.current(resp)
              resolveRef.current = null
            }
          } else if (reason === FedaPay.DIALOG_DISMISSED) {
            console.log('Dialog ferme par l\'utilisateur')
            setError('Paiement annule par l\'utilisateur')
            setLoading(false)
            if (rejectRef.current) {
              rejectRef.current(new Error('Paiement annule'))
              rejectRef.current = null
            }
          } else {
            console.log('Raison inconnue:', reason)
            setError('Statut de paiement inconnu')
            setLoading(false)
            if (rejectRef.current) {
              rejectRef.current(new Error('Statut inconnu'))
              rejectRef.current = null
            }
          }
        }
      })

      // Retourner une promise
      return new Promise((resolve, reject) => {
        resolveRef.current = resolve
        rejectRef.current = reject
        payBtn.click()
      })

    } catch (err) {
      console.error('Erreur Fedapay:', err)
      setLoading(false)
      setError(err.message)
      throw err
    }
  }, [])

  const checkTransactionStatus = useCallback(async (transactionId) => {
    setLoading(true)
    setError(null)

    try {
      // Vérifier que la session est valide pour obtenir le token d'accès
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Session non trouvée')
      }

      // Appeler l'Edge Function pour vérifier la transaction côté serveur
      // (la secretKey Fedapay n'est plus exposée au client)
      const { data, error } = await supabase.functions.invoke('fedapay-verify', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: { transactionId },
      })

      if (error) {
        throw new Error(error.message || 'Erreur lors de la vérification')
      }

      if (!data || !data.transaction) {
        throw new Error('Réponse de vérification invalide')
      }

      setTransaction(data.transaction)
      return data.transaction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    transaction,
    processPayment,
    checkTransactionStatus,
    clearError: () => setError(null),
  }
}

export default useFedapayPayment
