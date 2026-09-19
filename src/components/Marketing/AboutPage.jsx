import { Link } from 'react-router-dom'
import { Heart, Shield, Globe, Users, Zap, Star } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'Nous croyons en la créativité et en l\'artisanat de qualité.'
  },
  {
    icon: Shield,
    title: 'Confiance',
    description: 'Sécurité et transparence au cœur de chaque transaction.'
  },
  {
    icon: Globe,
    title: 'Accessibilité',
    description: 'Connecter les créateurs avec le monde entier.'
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Building a community of passionate creators and buyers.'
  }
]

const stats = [
  { value: '10K+', label: 'Vendeurs actifs' },
  { value: '100K+', label: 'Produits vendus' },
  { value: '50K+', label: 'Clients satisfaits' },
  { value: '25+', label: 'Pays couverts' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-primary-100 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-head mb-6">
                L'histoire de Drawcaf
              </h1>
              <p className="text-lg text-primary-200 mb-6">
                Née de la passion pour l'art et l'artisanat, Drawcaf est une plateforme 
                qui permet aux créateurs de partager leur talent avec le monde.
              </p>
              <p className="text-primary-200">
                Nous connectons les vendeurs indépendants avec des acheteurs à la recherche 
                de produits uniques et authentiques.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video bg-white/10 rounded-2xl flex items-center justify-center">
                <Zap className="w-24 h-24 text-white/30" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mission */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-head mb-4">Notre mission</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Rendre le commerce créatif accessible à tous, en offrant aux vendeurs 
              les outils pour réussir et aux acheteurs des produits qui racontent une histoire.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Team */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-head mb-4">Notre équipe</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Une équipe passionnée dédiée à la réussite de notre communauté.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Fundateur', role: 'CEO & Co-fondateur', avatar: 'F' },
              { name: 'Co-Fundateur', role: 'CTO & Co-fondateur', avatar: 'C' },
              { name: 'Équipe', role: 'Head of Community', avatar: 'E' }
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 text-center border border-gray-100">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">{member.avatar}</span>
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="py-20 bg-primary-100 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-head mb-4">
            Rejoignez l'aventure Drawcaf
          </h2>
          <p className="text-primary-200 mb-8">
            Que vous soyez créateur ou collectionneur, il y a une place pour vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-100 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Commencer à vendre
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Découvrir les produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
