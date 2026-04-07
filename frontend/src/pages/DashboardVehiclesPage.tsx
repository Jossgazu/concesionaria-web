import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Car, Edit2, Trash2, Eye, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useMyVehicles, useDeleteVehicle, useUpdateVehicleStatus } from '../hooks/useDashboard';
import { useToast } from '../hooks/useToast';
import type { Vehicle } from '../types';

const VEHICLE_STATUSES = [
  { value: 'active', label: 'Activo', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'sold', label: 'Vendido', color: 'bg-gray-100 text-gray-700' },
];

export function DashboardVehiclesPage() {
  const { data: vehicles = [], isLoading } = useMyVehicles();
  const deleteVehicle = useDeleteVehicle();
  const updateStatus = useUpdateVehicleStatus();
  const toast = useToast();
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
    try {
      await deleteVehicle.mutateAsync(id);
      toast.success('Vehículo eliminado');
    } catch (err) {
      toast.error('Error al eliminar el vehículo');
    }
  };

  const handleStatusChange = async (vehicleId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: vehicleId, status: newStatus });
      toast.success('Estado actualizado');
    } catch (err) {
      toast.error('Error al actualizar el estado');
    }
  };

  const getStatusStyle = (status: string) => {
    const statusObj = VEHICLE_STATUSES.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const statusObj = VEHICLE_STATUSES.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-on-surface-variant">Gestiona tus vehículos publicados</p>
        </div>
        <Link to="/vender">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Publicar Vehículo
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm p-12 text-center border border-surface-container-high">
          <Car className="w-16 h-16 text-on-surface-variant mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-on-surface font-['Manrope']">No tienes vehículos publicados</h2>
          <p className="text-on-surface-variant mb-6">Comienza a vender publicando tu primer vehículo</p>
          <Link to="/vender">
            <Button>Publicar mi Primer Vehículo</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden border border-surface-container-high">
          <table className="w-full">
            <thead className="bg-surface-container-low border-b border-surface-container-high">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant">Vehículo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {vehicles.map((vehicle: any) => (
                <tr key={vehicle.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle.primaryImage || '/placeholder-car.svg'}
                        alt={vehicle.model}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium font-['Manrope']">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-sm text-on-surface-variant">{vehicle.year ?? 'N/A'} • {vehicle.mileage?.toLocaleString() ?? '0'} km</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-primary font-['Manrope']">
                    {vehicle.currency ?? 'USD'} {vehicle.price?.toLocaleString() ?? '0'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <select
                        value={vehicle.status || 'active'}
                        onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                        disabled={updateStatus.isPending}
                        className={`appearance-none px-3 py-1.5 pr-8 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusStyle(vehicle.status)}`}
                      >
                        {VEHICLE_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/vehiculos/${vehicle.id}`}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/vender?edit=${vehicle.id}`}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2 text-on-surface-variant hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}