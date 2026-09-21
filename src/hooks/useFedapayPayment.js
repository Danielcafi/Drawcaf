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
        let attempts = 0
        const checkLoaded = setInterval(() => {
          attempts++
          if (scriptLoaded && window.FedaPay) {
            clearInterval(checkLoaded)
            resolve(true)
          } else if (attempts >= 50) {
            clearInterval(checkLoaded)
            scriptLoading = false
            reject(new Error('Fedapay n\'a pas pu se charger (timeout)'))
          }
        }, 100)
        return
      }

      scriptLoading = true

      const script = document.createElement('script')
      script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7'
      script.setAttribute('data-environment', 'sandbox')
      script.setAttribute('data-public-key', FEDAPAY_CONFIG.publicKey)
      script.async = true

      script.onload = () => {
        scriptLoaded = true
        scriptLoading = false
        resolve(true)
      }

      script.onerror = () => {
        scriptLoading = false
        reject(new Error('Impossible de charger le script Fedapay'))
      }

      document.body.appendChild(script)
    })
  }

  const processPayment = useCallback(async (paymentData) => {
    setLoading(true)
    setError(null)

    try {
      if (!isFedapayConfigured()) {
        throw new Error('Fedapay n\'est pas configuré. Clé publique manquante.')
      }

      await loadScript()

      if (!window.FedaPay) {
        throw new Error('Fedapay n\'est pas disponible après chargement du script')
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

      // Initialiser Fedapay
      window.FedaPay.init('#fedapay-btn', {
        public_key: FEDAPAY_CONFIG.publicKey,
        environment: FEDAPAY_CONFIG.environment,
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
        onComplete: function({ reason, transaction }) {
          if (reason === 'CHECKOUT COMPLETE' || transaction?.status === 'approved' || transaction?.status === 'completed') {
            setTransaction(transaction)
            setLoading(false)

            if (resolveRef.current) {
              resolveRef.current(transaction)
              resolveRef.current = null
            }
          } else if (reason === 'DIALOG DISMISSED') {
            setError('Paiement annulé par l\'utilisateur')
            setLoading(false)
            if (rejectRef.current) {
              rejectRef.current(new Error('Paiement annulé'))
              rejectRef.current = null
            }
          } else {
            const msg = transaction?.status === 'failed'
              ? 'Le paiement a échoué. Vérifiez le numéro et réessayez.'
              : 'Paiement refusé. Veuillez réessayer.'
            setError(msg)
            setLoading(false)
            if (rejectRef.current) {
              rejectRef.current(new Error(msg))
              rejectRef.current = null
            }
          }
        }
      })

      // Retourner une promise avec timeout
      return new Promise((resolve, reject) => {
        resolveRef.current = resolve
        rejectRef.current = reject

        // Timeout de 60s pour éviter un blocage infini
        const timeout = setTimeout(() => {
          if (resolveRef.current) {
            setLoading(false)
            setError('Le paiement a pris trop de temps. Veuillez réessayer.')
            rejectRef.current = null
            resolveRef.current = null
            reject(new Error('Timeout paiement'))
          }
        }, 60000)

        // Ouvrir le popup Fedapay
        payBtn.click()

        // Nettoyer le timeout si le popup se ferme avant
        const origResolve = resolve
        const origReject = reject
        resolveRef.current = (val) => {
          clearTimeout(timeout)
          origResolve(val)
        }
        rejectRef.current = (err) => {
          clearTimeout(timeout)
          origReject(err)
        }
      })

    } catch (err) {
      setLoading(false)
      setError(err.message)
      throw err
    }
  }, [])

  const checkTransactionStatus = useCallback(async (transactionId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return null
      }

      const { data, error } = await supabase.functions.invoke('fedapay-verify', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: { transactionId },
      })

      if (error || !data?.transaction) {
        return null
      }

      setTransaction(data.transaction)
      return data.transaction
    } catch {
      return null
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
