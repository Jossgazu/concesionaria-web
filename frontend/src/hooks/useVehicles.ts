import { useVehicleStore } from '../store/vehicleStore';
import { vehicleService } from '../services/api';
import type { VehicleFilters } from '../types';

export function useVehicles() {
  const {
    vehicles,
    featuredVehicles,
    currentVehicle,
    filters,
    pagination,
    isLoading,
    error,
    setVehicles,
    setFeaturedVehicles,
    setCurrentVehicle,
    setFilters,
    clearFilters,
    setPagination,
    setLoading,
    setError,
  } = useVehicleStore();

  const fetchVehicles = async (params?: VehicleFilters) => {
    setLoading(true);
    setError(null);
    try {
      const mergedParams = { ...filters, ...params };
      const res = await vehicleService.getAll(mergedParams);
      setVehicles(res.data.data || res.data.vehicles || []);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedVehicles = async () => {
    try {
      const res = await vehicleService.getFeatured();
      setFeaturedVehicles(res.data.data || []);
    } catch (err: unknown) {
      console.error('Error al cargar vehículos destacados');
    }
  };

  const fetchVehicleById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await vehicleService.getById(id);
      setCurrentVehicle(res.data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar vehículo');
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (data: FormData) => {
    const res = await vehicleService.create(data);
    return res.data;
  };

  const updateVehicle = async (id: string, data: FormData) => {
    const res = await vehicleService.update(id, data);
    return res.data;
  };

  const deleteVehicle = async (id: string) => {
    await vehicleService.delete(id);
  };

  return {
    vehicles,
    featuredVehicles,
    currentVehicle,
    pagination,
    isLoading,
    error,
    filters,
    fetchVehicles,
    fetchFeaturedVehicles,
    fetchVehicleById,
    setFilters,
    clearFilters,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
