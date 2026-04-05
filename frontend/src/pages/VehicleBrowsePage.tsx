import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { vehicleService } from '../services/api';
import VehicleCard from '../components/vehicles/VehicleCard';
import FilterSidebar from '../components/vehicles/FilterSidebar';

const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'year-desc', label: 'Año: más nuevo' },
  { value: 'mileage-asc', label: 'Kilometraje: menor' },
];

export default function VehicleBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const filters = {
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    body_type: searchParams.get('body_type') || '',
    fuel_type: searchParams.get('fuel_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    year_from: searchParams.get('year_from') || '',
    year_to: searchParams.get('year_to') || '',
    search: searchParams.get('search') || '',
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_order: searchParams.get('sort_order') || 'desc',
  };

  useEffect(() => {
    loadVehicles();
  }, [searchParams, page]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const params: any = { ...filters, page, limit: 20 };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
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
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const [sort_by, sort_order] = value.split('-');
    updateFilter('sort_by', sort_by);
    updateFilter('sort_order', sort_order);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.search 
              ? `Resultados para "${filters.search}"` 
              : 'Todos los vehículos'}
          </h1>
          <p className="text-gray-600">
            {total} vehículos encontrados
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
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
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {value}
                      <button
                        onClick={() => updateFilter(key, '')}
                        className="hover:text-primary/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                }
                return null;
              })}
              {Object.values(filters).some(v => v && !['sort_by', 'sort_order', 'page'].includes('')) && (
                <button
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Limpiar todo
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">
              Ordenar por:
            </span>
            <select
              value={`${filters.sort_by}-${filters.sort_order}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">No se encontraron vehículos</p>
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary/80"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle: any) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="px-4 py-2">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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