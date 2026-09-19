import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const imageUrl = product.product_images?.[0]?.url || '/chair.png'
  const storeName = product.stores?.name || 'Boutique'

  return (
    <Link
      to={`/produit/${product.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.compare_at_price && product.compare_at_price > product.price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-3 right-3 bg-primary-100 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Vedette
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{storeName}</p>
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-100 transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-100">
            {product.price?.toLocaleString('fr-FR')} XOF
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {product.compare_at_price?.toLocaleString('fr-FR')} XOF
            </span>
          )}
        </div>
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(product.avg_rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.total_reviews})</span>
          </div>
        )}
      </div>
    </Link>
  )
}
