import React from 'react';
import type { Vehicle } from '../../types';

interface VehicleSpecsTableProps {
  vehicle: Vehicle;
}

export function VehicleSpecsTable({ vehicle }: VehicleSpecsTableProps) {
  const fuelLabels: Record<string, string> = {
    gasoline: 'Gasolina',
    diesel: 'Diésel',
    electric: 'Eléctrico',
    hybrid: 'Híbrido',
  };

  const transmissionLabels: Record<string, string> = {
    automatic: 'Automático',
    manual: 'Manual',
    cvt: 'CVT',
  };

  const bodyType = (vehicle as any).body_type || vehicle.bodyType || 'N/A';
  const fuelType = (vehicle as any).fuel_type || vehicle.fuelType || 'N/A';
  const transmission = (vehicle as any).transmission || 'N/A';

  const specs = [
    { label: 'Marca', value: vehicle.brand || 'N/A' },
    { label: 'Modelo', value: vehicle.model || 'N/A' },
    { label: 'Año', value: vehicle.year?.toString() || 'N/A' },
    { label: 'Kilometraje', value: `${vehicle.mileage?.toLocaleString() || '0'} km` },
    { label: 'Tipo de Carrocería', value: bodyType },
    { label: 'Combustible', value: fuelLabels[fuelType] || fuelType || 'N/A' },
    { label: 'Transmisión', value: transmissionLabels[transmission] || transmission || 'N/A' },
    { label: 'Color', value: vehicle.color || 'N/A' },
  ];

  return (
    <div className="bg-[#ffffff] rounded-lg shadow-[0_8px_16px_rgba(25,28,30,0.04)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e8e8ea]">
        <h3 className="font-semibold text-[#1a1c1e]">Especificaciones</h3>
      </div>
      <div className="divide-y divide-[#e8e8ea]">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-[#444749]">{spec.label}</span>
            <span className="font-medium text-[#1a1c1e]">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
