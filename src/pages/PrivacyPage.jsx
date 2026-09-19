import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-tertiary-300">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <img className="h-8" src="/logo-full.svg" alt="Drawcaf" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <h1 className="text-4xl font-bold font-head text-primary-100 mb-8">
          Politique de confidentialité
        </h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : Septembre 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">1. Données collectées</h2>
            <p className="text-gray-700 leading-relaxed">
              Drawcaf collecte les données suivantes lors de votre utilisation de la Plateforme :
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li><strong>Données d'inscription :</strong> nom, prénom, adresse email, mot de passe (chiffré)</li>
              <li><strong>Données de profil :</strong> photo de profil, numéro de téléphone, adresse de livraison</li>
              <li><strong>Données de commande :</strong> historique des achats, adresses de livraison, moyens de paiement utilisés</li>
              <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, durée de la session</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">2. Utilisation des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li>L'exécution de vos commandes et la gestion de votre compte</li>
              <li>La communication concernant vos commandes (confirmations, livraisons)</li>
              <li>L'amélioration de nos services et de votre expérience utilisateur</li>
              <li>L'envoi de newsletters et offres promotionnelles (avec votre consentement)</li>
              <li>La prévention de la fraude et la sécurité de la Plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">3. Partage des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Vos données peuvent être partagées avec :
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li><strong>Les vendeurs :</strong> informations de commande nécessaires à la livraison</li>
              <li><strong>Les prestataires de paiement :</strong> pour le traitement sécurisé des transactions</li>
              <li><strong>Les services de livraison :</strong> pour l'acheminement de vos commandes</li>
              <li><strong>Les autorités compétentes :</strong> en cas d'obligation légale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">4. Sécurité des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Drawcaf met en œuvre des mesures techniques et organisationnelles pour protéger vos données :
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li>Chiffrement SSL/TLS pour toutes les communications</li>
              <li>Chiffrement des mots de passe et des données sensibles</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Surveillance continue des accès non autorisés</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">5. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Drawcaf utilise des cookies pour :
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li>Assurer le bon fonctionnement de la Plateforme</li>
              <li>Mémoriser vos préférences et votre panier</li>
              <li>Analyser le trafic et améliorer nos services</li>
              <li>Personnaliser votre expérience d'achat</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">6. Vos droits</h2>
            <p className="text-gray-700 leading-relaxed">
              Conformément à la réglementation en vigueur, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
              <li><strong>Droit de suppression :</strong> demander la suppression de vos données</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">7. Conservation des données</h2>
            <p className="text-gray-700 leading-relaxed">
              Vos données personnelles sont conservées pendant la durée d'utilisation de votre compte et pendant 3 ans après sa fermeture, sauf obligation légale contraire.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">8. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question relative à cette politique de confidentialité ou pour exercer vos droits, contactez-nous à :
            </p>
            <p className="text-primary-100 font-medium mt-2">
              Email : privacy@drawcaf.com
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
