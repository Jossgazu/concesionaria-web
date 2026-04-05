import { Link } from 'react-router-dom';
import { Heart, CheckCircle } from 'lucide-react';

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    currency: string;
    body_type?: string;
    fuel_type?: string;
    images?: string[];
    verified?: boolean;
  };
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
}

export function VehicleCard({ vehicle, onFavorite, isFavorite, showFavoriteButton = true }: VehicleCardProps) {
  const primaryImage = vehicle.images?.[0] ?? '/placeholder-car.jpg';

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {vehicle.verified && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verificado
          </div>
        )}
        
        {showFavoriteButton && onFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavorite(vehicle.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {vehicle.brand} {vehicle.model}
        </h3>
        
        <p className="text-gray-500 text-sm mb-3">
          {vehicle.year} • {vehicle.mileage.toLocaleString()} km
        </p>

        <p className="text-xl font-bold text-primary mb-3">
          {vehicle.currency || 'USD'} {vehicle.price.toLocaleString()}
        </p>

        <div className="flex flex-wrap gap-2">
          {vehicle.body_type && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {vehicle.body_type}
            </span>
          )}
          {vehicle.fuel_type && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {vehicle.fuel_type}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default VehicleCard;