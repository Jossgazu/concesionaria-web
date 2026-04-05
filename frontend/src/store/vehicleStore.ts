import { create } from 'zustand';
import type { Vehicle, VehicleFilters } from '../types';

interface VehicleState {
  vehicles: Vehicle[];
  featuredVehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  filters: VehicleFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  setVehicles: (vehicles: Vehicle[]) => void;
  setFeaturedVehicles: (vehicles: Vehicle[]) => void;
  setCurrentVehicle: (vehicle: Vehicle | null) => void;
  setFilters: (filters: VehicleFilters) => void;
  clearFilters: () => void;
  setPagination: (pagination: VehicleState['pagination']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  featuredVehicles: [],
  currentVehicle: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  setVehicles: (vehicles) => set({ vehicles }),
  setFeaturedVehicles: (featuredVehicles) => set({ featuredVehicles }),
  setCurrentVehicle: (currentVehicle) => set({ currentVehicle }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),
  setPagination: (pagination) => set({ pagination }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
