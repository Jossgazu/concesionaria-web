import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Car, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { vehicleService } from '../services/api';
import { useToast } from '../hooks/useToast';
import type { Vehicle } from '../types';

export function DashboardVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await vehicleService.getMyVehicles();
      setVehicles(response.data.data || []);
    } catch (err) {
      toast.error('Error al cargar tus vehículos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
    try {
      await vehicleService.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success('Vehículo eliminado');
    } catch (err) {
      toast.error('Error al eliminar el vehículo');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-500">Gestiona tus vehículos publicados</p>
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
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tienes vehículos publicados</h2>
          <p className="text-gray-500 mb-6">Comienza a vender publicando tu primer vehículo</p>
          <Link to="/vender">
            <Button>Publicar mi Primer Vehículo</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vehículo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle.primaryImage || '/placeholder-car.svg'}
                        alt={vehicle.model}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-sm text-gray-500">{vehicle.year ?? 'N/A'} • {vehicle.mileage?.toLocaleString() ?? '0'} km</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">
                    {vehicle.currency ?? 'USD'} {vehicle.price?.toLocaleString() ?? '0'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={vehicle.verified ? 'success' : 'warning'}>
                      {vehicle.verified ? 'Verificado' : 'Pendiente'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/vehiculos/${vehicle.id}`}
                        className="p-2 text-gray-500 hover:text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/vender?edit=${vehicle.id}`}
                        className="p-2 text-gray-500 hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
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
