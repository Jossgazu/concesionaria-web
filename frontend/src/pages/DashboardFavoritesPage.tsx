import { Link } from 'react-router-dom';
import { Heart, Trash2, Car } from 'lucide-react';
import { useFavorites, useRemoveFavorite } from '../hooks/useDashboard';
import VehicleCard from '../components/vehicles/VehicleCard';
import { useToast } from '../hooks/useToast';
import type { Vehicle } from '../types';

export default function DashboardFavoritesPage() {
  const { data: favorites = [], isLoading } = useFavorites();
  const removeFavorite = useRemoveFavorite();
  const toast = useToast();

  const handleRemove = async (vehicleId: string) => {
    try {
      await removeFavorite.mutateAsync(vehicleId);
      toast.success('Eliminado de favoritos');
    } catch (error) {
      toast.error('Error al eliminar de favoritos');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Mis favoritos</h1>
        <p className="text-on-surface-variant mt-1">Vehículos que has guardado</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-container-lowest h-80 rounded-2xl animate-pulse shadow-[0_8px_16px_rgba(25,28,30,0.04)]" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center shadow-[0_8px_16px_rgba(25,28,30,0.04)]">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-on-surface mb-2">Sin favoritos</h2>
          <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
            Aún no tienes vehículos en favoritos. Explora nuestro catálogo y guarda los que más te gusten.
          </p>
          <Link
            to="/vehiculos"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
          >
            <Car className="w-5 h-5" />
            Explorar vehículos
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite: any) => (
            <div key={favorite.id} className="relative">
              <VehicleCard vehicle={favorite.vehicle} showFavoriteButton={false} />
              <button
                onClick={() => handleRemove(favorite.vehicle?.id)}
                className="absolute top-4 right-4 p-2 bg-surface-container-lowest rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}