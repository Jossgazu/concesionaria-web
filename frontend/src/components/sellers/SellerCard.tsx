import { Link } from 'react-router-dom';
import { Star, CheckCircle, MessageCircle } from 'lucide-react';
import RatingStars from './RatingStars';

interface SellerCardProps {
  seller: {
    id: string;
    name: string;
    avatar_url?: string;
    phone?: string;
    rating_summary?: {
      average: number;
      total: number;
    };
  };
  vehicleId?: string;
}

export default function SellerCard({ seller, vehicleId }: SellerCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {seller.avatar_url ? (
            <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-gray-400">
              {seller.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{seller.name}</h3>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          {seller.rating_summary && (
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={seller.rating_summary.average} size="sm" />
              <span className="text-sm text-gray-500">
                ({seller.rating_summary.total} valoraciones)
              </span>
            </div>
          )}
        </div>
      </div>

      <Link
        to={`/users/${seller.id}`}
        className="block w-full text-center py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
      >
        Ver perfil del vendedor
      </Link>

      <button className="w-full mt-2 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg flex items-center justify-center gap-2">
        <MessageCircle className="w-4 h-4" />
        Enviar mensaje
      </button>
    </div>
  );
}
