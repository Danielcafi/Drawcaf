import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: "/mois",
    description: "Pour commencer à vendre",
    features: [
      "1 Boutique",
      "25 Produits",
      "Commission 5% par vente",
      "Support par email",
      "SSL inclus"
    ],
    cta: "Commencer gratuitement",
    primary: false
  },
  {
    name: "Pro",
    price: "29",
    period: "/mois",
    description: "Pour les vendeurs ambitieux",
    features: [
      "5 Boutiques",
      "500 Produits",
      "Commission 3% par vente",
      "Support prioritaire",
      "SSL personnalisé",
      "Domaine personnalisé",
      "Analytics avancés"
    ],
    cta: "Passer au Pro",
    primary: true
  },
  {
    name: "Enterprise",
    price: "99",
    period: "/mois",
    description: "Pour les grandes opérations",
    features: [
      "Boutiques illimitées",
      "Produits illimités",
      "Commission 1% par vente",
      "Support 24/7",
      "SSL personnalisé",
      "Domaine personnalisé",
      "Analytics enterprise",
      "API access",
      "Manager dédié"
    ],
    cta: "Contacter l'équipe",
    primary: false
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-head mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Commencez gratuitement, évoluez quand vous êtes prêt
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-8 border-2 ${
                plan.primary
                  ? 'border-primary-100 shadow-xl scale-105'
                  : 'border-gray-200'
              }`}
            >
              {plan.primary && (
                <span className="inline-block bg-primary-100 text-white text-sm font-bold px-3 py-1 rounded-full mb-4">
                  Populaire
                </span>
              )}
              <h2 className="text-2xl font-bold font-head mb-2">{plan.name}</h2>
              <p className="text-gray-500 mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold">{plan.price} XOF</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.primary ? 'text-primary-100' : 'text-green-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`block w-full py-3 rounded-lg font-bold text-center transition-colors ${
                  plan.primary
                    ? 'bg-primary-100 text-white hover:bg-primary-300'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold font-head mb-8">
            Questions fréquentes sur les tarifs
          </h2>
          <div className="max-w-3xl mx-auto text-left space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="font-bold mb-2">Puis-je changer de plan à tout moment ?</h3>
              <p className="text-gray-600">Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre dashboard.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="font-bold mb-2">Y a-t-il des frais cachés ?</h3>
              <p className="text-gray-600">Non, nos tarifs sont 100% transparents. La seule commission est prélevée sur vos ventes.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="font-bold mb-2">Comment fonctionne la commission ?</h3>
              <p className="text-gray-600">Nous prenons un petit pourcentage sur chaque vente. Vous ne payez rien tant que vous ne vendez pas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
