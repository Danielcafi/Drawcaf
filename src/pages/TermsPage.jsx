import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
          Conditions d'utilisation
        </h1>
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : Septembre 2026</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-700 leading-relaxed">
              En accédant et en utilisant la plateforme Drawcaf (« la Plateforme »), vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la Plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">2. Description du service</h2>
            <p className="text-gray-700 leading-relaxed">
              Drawcaf est une marketplace en ligne qui met en relation des vendeurs (artisans, créateurs, commerçants) et des acheteurs en Afrique. La Plateforme permet aux vendeurs de créer des boutiques en ligne et aux acheteurs de découvrir et acheter des produits créatifs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">3. Compte utilisateur</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour utiliser certaines fonctionnalités de la Plateforme, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités qui se produisent sous votre compte.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              <li>Vous devez fournir des informations exactes et complètes</li>
              <li>Vous devez notifier Drawcaf de toute utilisation non autorisée de votre compte</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">4. Obligations des vendeurs</h2>
            <p className="text-gray-700 leading-relaxed">
              Les vendeurs qui créent une boutique sur Drawcaf s'engagent à :
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li>Fournir des descriptions exactes et complètes de leurs produits</li>
              <li>Honorer les commandes validées par les acheteurs</li>
              <li>Respecter les délais de livraison annoncés</li>
              <li>Assurer la qualité des produits vendus</li>
              <li>Respecter les lois en vigueur dans leur pays</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">5. Obligations des acheteurs</h2>
            <p className="text-gray-700 leading-relaxed">
              Les acheteurs s'engagent à :
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
              <li>Fournir des informations de livraison exactes</li>
              <li>Effectuer les paiements conformément aux modalités prévues</li>
              <li>Signaler tout problème de livraison ou de qualité dans les délais impartis</li>
              <li>Respecter les conditions de retour de chaque vendeur</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">6. Paiements</h2>
            <p className="text-gray-700 leading-relaxed">
              Les paiements sur Drawcaf sont traités via des prestataires de paiement sécurisés (MTN Mobile Money, Moov Money, cartes bancaires). Drawcaf ne stocke pas les informations bancaires des utilisateurs. Les prix sont affichés en XOF (Franc CFA).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">7. Livraison</h2>
            <p className="text-gray-700 leading-relaxed">
              Les conditions de livraison sont fixées par chaque vendeur. Drawcaf met à disposition les outils de suivi de commande mais n'est pas responsable des retards de livraison imputables aux vendeurs ou aux services de livraison tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">8. Propriété intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed">
              Tout le contenu de la Plateforme (logo, design, code source) est la propriété de Drawcaf ou de ses concédants. Les produits vendus par les vendeurs restent la propriété intellectuelle de ces derniers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">9. Limitation de responsabilité</h2>
            <p className="text-gray-700 leading-relaxed">
              Drawcaf agit en tant qu'intermédiaire entre vendeurs et acheteurs. Nous ne sommes pas responsables des litiges entre les parties, des défauts de produits ou des dommages résultant de l'utilisation de la Plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">10. Modification des conditions</h2>
            <p className="text-gray-700 leading-relaxed">
              Drawcaf se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront notifiés de tout changement substantiel par email ou via la Plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-head text-primary-100 mb-4">11. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant ces conditions d'utilisation, contactez-nous à :
            </p>
            <p className="text-primary-100 font-medium mt-2">
              Email : contact@drawcaf.com
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
