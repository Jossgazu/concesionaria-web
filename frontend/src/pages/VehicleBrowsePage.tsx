import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { vehicleService, favoriteService } from '../services/api';
import VehicleCard from '../components/vehicles/VehicleCard';
import FilterSidebar from '../components/vehicles/FilterSidebar';
import { useToast } from '../hooks/useToast';
import { useAuthStore } from '../store/authStore';

const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'year-desc', label: 'Año: más nuevo' },
  { value: 'mileage-asc', label: 'Kilometraje: menor' },
];

const DEBOUNCED_KEYS = ['min_price', 'max_price', 'year_from', 'year_to'];

export default function VehicleBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pendingDebounce, setPendingDebounce] = useState<Record<string, string>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();

  const filters = {
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    body_type: searchParams.get('body_type') || '',
    fuel_type: searchParams.get('fuel_type') || '',
    transmission: searchParams.get('transmission') || '',
    min_mileage: searchParams.get('min_mileage') || '',
    max_mileage: searchParams.get('max_mileage') || '',
    search: searchParams.get('search') || '',
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_order: searchParams.get('sort_order') || 'desc',
  };

  const DEBOUNCE_KEYS = ['min_price', 'max_price', 'year_from', 'year_to'];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(pendingDebounce).length > 0) {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(pendingDebounce).forEach(([key, value]) => {
          if (value) {
            newParams.set(key, value);
          } else {
            newParams.delete(key);
          }
        });
        setSearchParams(newParams);
        setPage(1);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [pendingDebounce]);

  useEffect(() => {
    loadVehicles();
  }, [searchParams, page]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      const res = await favoriteService.getAll();
      const data = res.data?.data || res.data || [];
      const ids = data.map((f: any) => f.vehicle_id || f.vehicle?.id || f.id);
      setFavorites(ids.filter(Boolean));
    } catch (err: any) {
      if (err.response?.status === 401) {
        setFavorites([]);
      } else {
        console.error('Failed to load favorites', err);
      }
    }
  };

  const handleFavorite = async (vehicleId: string) => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar a favoritos');
      return;
    }
    try {
      if (favorites.includes(vehicleId)) {
        await favoriteService.remove(vehicleId);
        setFavorites(prev => prev.filter(id => id !== vehicleId));
        toast.success('Eliminado de favoritos');
      } else {
        await favoriteService.add(vehicleId);
        setFavorites(prev => [...prev, vehicleId]);
        toast.success('Agregado a favoritos');
      }
    } catch (err) {
      toast.error('Error al actualizar favoritos');
    }
  };

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const params: any = { ...filters, ...pendingDebounce, page, limit: 20 };
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });
      
      const response = await vehicleService.getAll(params);
      setVehicles(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to load vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    if (DEBOUNCE_KEYS.includes(key)) {
      setPendingDebounce(prev => ({ ...prev, [key]: value }));
    } else {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams);
      setPage(1);
    }
  };

  const clearFilters = () => {
    setSearchParams({});
    setPage(1);
    setPendingDebounce({});
  };

  const handleSortChange = (value: string) => {
    const [sort_by, sort_order] = value.split('-');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort_by', sort_by);
    newParams.set('sort_order', sort_order);
    setSearchParams(newParams);
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v) ||
    Object.values(pendingDebounce).some(v => v);
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-on-surface mb-2">
            {filters.search 
              ? `Resultados para "${filters.search}"` 
              : 'Todos los vehículos'}
          </h1>
          <p className="text-on-surface-variant">
            {total} vehículos encontrados
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-surface-container-lowest p-4 rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {Object.entries(filters).map(([key, value]) => {
                if (value && !['sort_by', 'sort_order', 'page'].includes(key)) {
                  return (
                    <span
                      key={key}
                      className="bg-tertiary-fixed text-tertiary px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium"
                    >
                      {value}
                      <button
                        onClick={() => updateFilter(key, '')}
                        className="hover:text-on-tertiary-container"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                }
                return null;
              })}
              {Object.entries(pendingDebounce).map(([key, value]) => {
                if (value) {
                  return (
                    <span
                      key={key}
                      className="bg-tertiary-fixed text-tertiary px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium"
                    >
                      {value}
                      <button
                        onClick={() => updateFilter(key, '')}
                        className="hover:text-on-tertiary-container"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                }
                return null;
              })}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-secondary hover:text-on-surface text-sm font-medium"
                >
                  Limpiar todo
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-on-surface-variant text-sm">
              Ordenar por:
            </span>
            <select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            updateFilter={updateFilter}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-surface-container-low rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest rounded-xl">
                <p className="text-secondary mb-4">No se encontraron vehículos</p>
                <button
                  onClick={clearFilters}
                  className="text-accent hover:text-on-tertiary-container font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle: any) => (
                    <VehicleCard 
                      key={vehicle.id} 
                      vehicle={vehicle} 
                      onFavorite={handleFavorite}
                      isFavorite={favorites.includes(vehicle.id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-surface-container-lowest rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="px-4 py-2 text-on-surface-variant">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-surface-container-lowest rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}