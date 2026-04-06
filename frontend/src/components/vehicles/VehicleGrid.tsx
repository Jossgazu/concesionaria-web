import React from 'react';
import { VehicleCard } from './VehicleCard';
import { Loader2 } from 'lucide-react';
import type { Vehicle } from '../../types';

interface VehicleGridProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  onFavorite?: (id: string) => void;
  favorites?: string[];
  emptyMessage?: string;
}

export function VehicleGrid({
  vehicles,
  isLoading,
  onFavorite,
  favorites = [],
  emptyMessage = 'No se encontraron vehículos',
}: VehicleGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onFavorite={onFavorite}
          isFavorite={favorites.includes(vehicle.id)}
        />
      ))}
    </div>
  );
}
