import { X } from 'lucide-react';
import { useState } from 'react';

interface FilterSidebarProps {
  filters: Record<string, string>;
  updateFilter: (key: string, value: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const BODY_TYPES = [
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedán' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'pickup', label: 'Pick Up' },
  { value: 'van', label: 'Van' },
  { value: 'coupe', label: 'Coupé' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'wagon', label: 'Wagon' },
];

const FUEL_TYPES = [
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'diesel', label: 'Diiesel' },
  { value: 'electric', label: 'Eléctrico' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'lpg', label: 'GLP' },
  { value: 'cng', label: 'CNG' },
];

const TRANSMISSION_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automático' },
];

export default function FilterSidebar({ filters, updateFilter, isOpen, onClose }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    bodyType: true,
    fuelType: false,
    year: false,
    mileage: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside
      className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-surface-container-lowest lg:bg-transparent
        transform transition-transform duration-300 lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-xl lg:shadow-none h-full lg:h-auto overflow-y-auto
      `}
    >
      <div className="p-6 lg:p-0">
        <div className="flex justify-between items-center lg:hidden mb-6">
          <h2 className="text-xl font-bold text-on-surface">Filtros</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex justify-between items-center w-full font-semibold text-on-surface mb-3"
          >
            Precio
            <span className="text-secondary">{expandedSections.price ? '−' : '+'}</span>
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-secondary">Min</label>
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => updateFilter('min_price', e.target.value)}
                  placeholder="0"
                  className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-sm text-secondary">Max</label>
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => updateFilter('max_price', e.target.value)}
                  placeholder="Sin límite"
                  className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => toggleSection('bodyType')}
            className="flex justify-between items-center w-full font-semibold text-on-surface mb-3"
          >
            Tipo de vehículo
            <span className="text-secondary">{expandedSections.bodyType ? '−' : '+'}</span>
          </button>
          {expandedSections.bodyType && (
            <div className="space-y-2">
              {BODY_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="body_type"
                    value={type.value}
                    checked={filters.body_type === type.value}
                    onChange={(e) => updateFilter('body_type', e.target.value)}
                    className="text-accent focus:ring-accent"
                  />
                  <span className="text-on-surface-variant">{type.label}</span>
                </label>
              ))}
              {filters.body_type && (
                <button
                  onClick={() => updateFilter('body_type', '')}
                  className="text-sm text-accent hover:text-on-tertiary-container font-medium"
                >
                  Limpiar
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => toggleSection('fuelType')}
            className="flex justify-between items-center w-full font-semibold text-on-surface mb-3"
          >
            Combustible
            <span className="text-secondary">{expandedSections.fuelType ? '−' : '+'}</span>
          </button>
          {expandedSections.fuelType && (
            <div className="space-y-2">
              {FUEL_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fuel_type"
                    value={type.value}
                    checked={filters.fuel_type === type.value}
                    onChange={(e) => updateFilter('fuel_type', e.target.value)}
                    className="text-accent focus:ring-accent"
                  />
                  <span className="text-on-surface-variant">{type.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => toggleSection('year')}
            className="flex justify-between items-center w-full font-semibold text-on-surface mb-3"
          >
            Año
            <span className="text-secondary">{expandedSections.year ? '−' : '+'}</span>
          </button>
          {expandedSections.year && (
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.year_from}
                  onChange={(e) => updateFilter('year_from', e.target.value)}
                  placeholder="Desde"
                  className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.year_to}
                  onChange={(e) => updateFilter('year_to', e.target.value)}
                  placeholder="Hasta"
                  className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => toggleSection('mileage')}
            className="flex justify-between items-center w-full font-semibold text-on-surface mb-3"
          >
            Kilometraje
            <span className="text-secondary">{expandedSections.mileage ? '−' : '+'}</span>
          </button>
          {expandedSections.mileage && (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-secondary">Min (km)</label>
                <input
                  type="number"
                  value={filters.min_mileage}
                  onChange={(e) => updateFilter('min_mileage', e.target.value)}
                  placeholder="0"
                  className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-sm text-secondary">Max (km)</label>
                <input
                  type="number"
                  value={filters.max_mileage}
                  onChange={(e) => updateFilter('max_mileage', e.target.value)}
                  placeholder="Sin límite"
                  className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="lg:hidden w-full bg-primary text-white py-3 rounded-lg font-medium mt-4 uppercase tracking-wider"
        >
          Aplicar filtros
        </button>
      </div>
    </aside>
  );
}