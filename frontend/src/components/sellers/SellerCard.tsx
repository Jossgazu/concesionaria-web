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
    <div className="bg-[#ffffff] rounded-xl p-6 shadow-[0_8px_16px_rgba(25,28,30,0.04)]">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-[#e8e8ea] rounded-full flex items-center justify-center overflow-hidden">
          {seller.avatar_url ? (
            <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-[#444749]">
              {seller.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#1a1c1e]">{seller.name}</h3>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          {seller.rating_summary && seller.rating_summary.total > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={seller.rating_summary.average} size="sm" />
              <span className="text-sm text-[#444749]">
                ({seller.rating_summary.total})
              </span>
            </div>
          ) : (
            <p className="text-xs text-[#444749] mt-1">Sin valoraciones</p>
          )}
        </div>
      </div>

      <Link
        to={`/users/${seller.id}`}
        className="block w-full text-center py-2 border border-[#e8e8ea] rounded-lg text-[#1a1c1e] hover:bg-[#f3f3f6] transition-colors text-sm"
      >
        Ver perfil del vendedor
      </Link>
    </div>
  );
}
