import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Car } from 'lucide-react';
import { favoriteService } from '../services/api';
import VehicleCard from '../components/vehicles/VehicleCard';

export default function DashboardFavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getAll();
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Failed to load favorites', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (vehicleId: string) => {
    try {
      await favoriteService.remove(vehicleId);
      setFavorites(prev => prev.filter(f => f.vehicle?.id !== vehicleId));
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis favoritos</h1>
        <p className="text-gray-500 mt-1">Vehículos que has guardado</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white h-80 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin favoritos</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
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
          {favorites.map((favorite) => (
            <div key={favorite.id} className="relative">
              <VehicleCard vehicle={favorite.vehicle} showFavoriteButton={false} />
              <button
                onClick={() => handleRemove(favorite.vehicle?.id)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-colors"
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