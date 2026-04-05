import { create } from 'zustand';
import type { VehicleFilters } from '../types';

interface FilterState {
  brands: string[];
  models: string[];
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  selectedFilters: VehicleFilters;
  isFilterOpen: boolean;
  setBrands: (brands: string[]) => void;
  setModels: (models: string[]) => void;
  setBodyTypes: (bodyTypes: string[]) => void;
  setFuelTypes: (fuelTypes: string[]) => void;
  setTransmissions: (transmissions: string[]) => void;
  setSelectedFilters: (filters: VehicleFilters) => void;
  toggleFilter: (key: keyof VehicleFilters, value: string) => void;
  setPriceRange: (min: number | undefined, max: number | undefined) => void;
  setYearRange: (min: number | undefined, max: number | undefined) => void;
  setMileageRange: (min: number | undefined, max: number | undefined) => void;
  clearAllFilters: () => void;
  setIsFilterOpen: (open: boolean) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  brands: [],
  models: [],
  bodyTypes: ['Sedán', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Minivan', 'Station Wagon', 'Convertible'],
  fuelTypes: ['Gasolina', 'Diésel', 'Eléctrico', 'Híbrido'],
  transmissions: ['Manual', 'Automático'],
  selectedFilters: {},
  isFilterOpen: false,
  setBrands: (brands) => set({ brands }),
  setModels: (models) => set({ models }),
  setBodyTypes: (bodyTypes) => set({ bodyTypes }),
  setFuelTypes: (fuelTypes) => set({ fuelTypes }),
  setTransmissions: (transmissions) => set({ transmissions }),
  setSelectedFilters: (selectedFilters) => set({ selectedFilters }),
  toggleFilter: (key, value) =>
    set((state) => {
      const current = state.selectedFilters[key];
      if (Array.isArray(current)) {
        const newValue = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { selectedFilters: { ...state.selectedFilters, [key]: newValue } };
      }
      return { selectedFilters: { ...state.selectedFilters, [key]: value } };
    }),
  setPriceRange: (min, max) =>
    set((state) => ({
      selectedFilters: { ...state.selectedFilters, minPrice: min, maxPrice: max },
    })),
  setYearRange: (min, max) =>
    set((state) => ({
      selectedFilters: { ...state.selectedFilters, minYear: min, maxYear: max },
    })),
  setMileageRange: (min, max) =>
    set((state) => ({
      selectedFilters: { ...state.selectedFilters, minMileage: min, maxMileage: max },
    })),
  clearAllFilters: () => set({ selectedFilters: {} }),
  setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
}));
