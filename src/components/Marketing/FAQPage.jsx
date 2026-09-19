import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqData = [
  {
    category: 'Acheteurs',
    questions: [
      {
        q: 'Comment creer un compte ?',
        a: 'Cliquez sur "S\'inscrire" en haut a droite, puis remplissez le formulaire avec votre email et mot de passe. Vous pouvez aussi vous connecter avec Google. Par defaut, vous creerez un compte acheteur.'
      },
      {
        q: 'Comment passer une commande ?',
        a: 'Parcourez les boutiques et produits, ajoutez vos articles au panier, puis cliquez sur "Passer la commande". Renseignez votre adresse de livraison et choisissez votre mode de paiement (Mobile Money ou carte bancaire).'
      },
      {
        q: 'Quels sont les modes de paiement acceptes ?',
        a: 'Nous acceptons le Mobile Money (MTN MoMo, Moov Money, Celtis) ainsi que les cartes bancaires (Visa, Mastercard) via notre partenaire securise Fedapay, adapte au marche africain.'
      },
      {
        q: 'Comment confirmer la livraison ?',
        a: 'Lorsque votre commande est expediee, vous recevrez une notification. Une fois livre, cliquez sur "Confirmer la livraison" dans vos commandes. Vous pourrez alors laisser un avis sur le produit et le vendeur.'
      },
      {
        q: 'Comment laisser un avis ?',
        a: 'Apres avoir confirme la livraison d\'une commande, un formulaire d\'avis s\'affiche. Vous pouvez attribuer une note de 1 a 5 et laisser un commentaire. Seuls les acheteurs ayant recu leur commande peuvent laisser un avis.'
      },
      {
        q: 'Qu\'est-ce que le recu numerique ?',
        a: 'Apres chaque achat, vous recevez un recu numerique avec un QR code. Ce QR code vous redirige directement vers la boutique du vendeur pour vos prochains achats.'
      },
      {
        q: 'Comment retourner un produit ?',
        a: 'Vous disposez de 30 jours pour retourner un produit. Contactez le vendeur depuis votre espace client ou directement via la messagerie de la plateforme.'
      },
      {
        q: 'Les paiements sont-ils securises ?',
        a: 'Oui, tous les paiements sont securises par Fedapay, un prestataire certifie adapte au marche africain. Nous ne stockons jamais vos donnees bancaires.'
      }
    ]
  },
  {
    category: 'Vendeurs',
    questions: [
      {
        q: 'Comment devenir vendeur ?',
        a: 'Inscrivez-vous en tant qu\'acheteur, puis connectez-vous a votre dashboard. Dans le menu deroulant de votre profil, cliquez sur "Devenir vendeur". Suivez les 5 etapes pour creer votre boutique (nom, photos, description, localisation, certification optionnelle).'
      },
      {
        q: 'Ma boutique est-elle visible immediatement ?',
        a: 'Non. Apres la creation, votre boutique est soumise a l\'approbation d\'un administrateur. Celui-ci verifie la conformite de vos informations. Une fois approuvee, votre boutique devient visible et vous pouvez commencer a vendre.'
      },
      {
        q: 'Combien coute la vente sur Drawcaf ?',
        a: 'L\'inscription et la creation de boutique sont gratuites. Nous prenons une commission de 5% sur chaque vente realisee.'
      },
      {
        q: 'Qu\'est-ce que la certification ?',
        a: 'La certification est optionnelle. Elle vous donne le badge "Boutique Verifiee" qui inspire davantage confiance aux acheteurs. Vous devez soumettre des documents (piece d\'identite, registre de commerce) et un admin examinera votre demande.'
      },
      {
        q: 'Comment gerer mes produits ?',
        a: 'Depuis votre dashboard vendeur, rendez-vous dans "Produits" pour ajouter, modifier ou supprimer des produits. Vous pouvez ajouter plusieurs photos, variantes (taille, couleur) et gerer votre stock.'
      },
      {
        q: 'Comment gerer les commandes ?',
        a: 'Dans "Commandes", vous voyez toutes les commandes recues. Changez le statut : Confirmeee → En preparation → Expediee. L\'acheteur confirme ensuite la livraison.'
      },
      {
        q: 'Puis-je personnaliser ma boutique ?',
        a: 'Oui. Personnalisez votre boutique avec votre logo, une banniere, une description et une categorie d\'activite. Vous pouvez modifier ces elements depuis les parametres de votre dashboard.'
      },
      {
        q: 'Comment recevoir mes paiements ?',
        a: 'Les paiements sont directement collectes par Fedapay (Mobile Money ou carte bancaire) lors de chaque vente. Vous recevez les fonds sur votre compte Fedapay.'
      }
    ]
  },
  {
    category: 'General',
    questions: [
      {
        q: 'Qu\'est-ce que Drawcaf ?',
        a: 'Drawcaf est une marketplace e-commerce qui connecte les vendeurs creatifs d\'Afrique avec les acheteurs a la recherche de produits uniques et de qualite.'
      },
      {
        q: 'Comment fonctionne Drawcaf ?',
        a: 'Les vendeurs creent leurs boutiques et y proposent leurs produits. Les acheteurs parcourent, commandent et paient en toute securite. Apres livraison, ils confirment et laissent un avis.'
      },
      {
        q: 'Comment contacter le support ?',
        a: 'Envoyez-nous un email a support@drawcaf.com ou utilisez le formulaire de contact sur notre site.'
      },
      {
        q: 'Drawcaf est-il disponible sur mobile ?',
        a: 'Oui, Drawcaf est entierement responsive et fonctionne parfaitement sur mobile, tablette et ordinateur.'
      },
      {
        q: 'Dans quels pays Drawcaf est-il disponible ?',
        a: 'Drawcaf est disponible dans tous les pays d\'Afrique. Nos vendeurs et acheteurs sont actifs dans plusieurs pays du continent.'
      }
    ]
  }
]

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-gray-600">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary-100 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-head mb-4">
            Questions frequentes
          </h1>
          <p className="text-lg text-primary-200">
            Trouvez rapidement les reponses a vos questions
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {faqData.map((category) => (
          <div key={category.category} className="mb-12">
            <h2 className="text-2xl font-bold font-head mb-6">
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((item, index) => (
                <FAQItem key={index} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">Vous n'avez pas trouve votre reponse ?</h2>
          <p className="text-gray-500 mb-6">
            Notre equipe est la pour vous aider
          </p>
          <Link
            to="/contact"
            className="inline-block bg-primary-100 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-300 transition-colors"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  )
}
