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

  const bodyTypeLabels: Record<string, string> = {
    suv: 'SUV',
    sedan: 'Sedán',
    hatchback: 'Hatchback',
    pickup: 'Pick Up',
    van: 'Van',
    coupe: 'Coupé',
    convertible: 'Convertible',
  };

  const fuelTypeLabels: Record<string, string> = {
    gasoline: 'Gasolina',
    diesel: 'Diiesel',
    electric: 'Eléctrico',
    hybrid: 'Híbrido',
  };

  return (
    <Link
      to={`/vehiculos/${vehicle.id}`}
      className="bg-surface-container-lowest rounded-xl overflow-hidden group transition-all duration-500 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {vehicle.verified && (
          <div className="absolute top-3 left-3 bg-white/90 glass-effect text-[#007AFF] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1">
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
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 active:scale-[0.98] ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 glass-effect text-on-surface-variant hover:bg-surface-container-lowest'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-headline font-bold text-lg text-on-surface mb-1 tracking-tight">
          {vehicle.brand} {vehicle.model}
        </h3>
        
        <p className="text-on-surface-variant text-sm mb-3">
          {vehicle.year ?? 'N/A'} • {vehicle.mileage?.toLocaleString() ?? '0'} km
        </p>

        <p className="text-xl font-headline font-black text-primary mb-3 tracking-tight">
          {vehicle.currency || 'USD'} {vehicle.price?.toLocaleString() ?? '0'}
        </p>

        <div className="flex flex-wrap gap-2">
          {vehicle.body_type && (
            <span className="bg-tertiary-fixed text-tertiary text-xs px-2 py-1 rounded-full font-medium">
              {bodyTypeLabels[vehicle.body_type] || vehicle.body_type}
            </span>
          )}
          {vehicle.fuel_type && (
            <span className="bg-tertiary-fixed text-tertiary text-xs px-2 py-1 rounded-full font-medium">
              {fuelTypeLabels[vehicle.fuel_type] || vehicle.fuel_type}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default VehicleCard;