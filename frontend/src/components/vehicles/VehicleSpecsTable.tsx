import React from 'react';
import type { Vehicle } from '../../types';

interface VehicleSpecsTableProps {
  vehicle: Vehicle;
}

export function VehicleSpecsTable({ vehicle }: VehicleSpecsTableProps) {
  const specs = [
    { label: 'Marca', value: vehicle.brand },
    { label: 'Modelo', value: vehicle.model },
    { label: 'Año', value: vehicle.year.toString() },
    { label: 'Kilometraje', value: `${vehicle.mileage.toLocaleString()} km` },
    { label: 'Tipo de Carrocería', value: vehicle.bodyType },
    { label: 'Combustible', value: vehicle.fuelType },
    { label: 'Transmisión', value: vehicle.transmission },
    { label: 'Color', value: vehicle.color },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Especificaciones</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-gray-500">{spec.label}</span>
            <span className="font-medium text-gray-800">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
