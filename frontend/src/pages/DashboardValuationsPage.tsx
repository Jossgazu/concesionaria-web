import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Car, Plus } from 'lucide-react';
import { valuationService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function DashboardValuationsPage() {
  const { isAuthenticated } = useAuthStore();
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValuations();
  }, []);

  const loadValuations = async () => {
    try {
      const response = await valuationService.getAll();
      setValuations(response.data.data || []);
    } catch (error) {
      console.error('Failed to load valuations', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processed: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    processed: 'Procesada',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_16px_rgba(25,28,30,0.04)] p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Mis valuaciones</h1>
              <p className="text-on-surface-variant mt-1">Conoce el valor de mercado de tus vehículos</p>
            </div>
            <Link
              to="/vender"
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nueva valuación
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest h-32 rounded-2xl animate-pulse shadow-[0_8px_16px_rgba(25,28,30,0.04)]" />
            ))}
          </div>
        ) : valuations.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-12 text-center shadow-[0_8px_16px_rgba(25,28,30,0.04)]">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-on-surface mb-2">Sin valuaciones</h2>
            <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
              Aún no tienes valuaciones solicitadas. Solicita tu primera valuación para conocer el valor de mercado de tu vehículo.
            </p>
            <Link
              to="/vender"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Solicitar primera valuación
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {valuations.map((valuation: any) => (
              <div key={valuation.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_16px_rgba(25,28,30,0.04)] hover:shadow-[0_8px_16px_rgba(25,28,30,0.04)] transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0">
                      <Car className="w-8 h-8 text-on-surface-variant" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-on-surface text-lg">
                        {valuation.brand} {valuation.model}
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        {valuation.year} · {valuation.mileage?.toLocaleString() ?? '0'} km
                      </p>
                      <p className="text-sm text-on-surface-variant mt-1 capitalize">
                        Estado: {valuation.condition}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-primary">
                      USD {valuation.estimated_price?.toLocaleString() ?? '0'}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${statusColors[valuation.status] || 'bg-surface-container-low text-on-surface'}`}>
                      {statusLabels[valuation.status] || valuation.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-surface-container-low flex items-center gap-4 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {valuation.created_at ? new Date(valuation.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-8 bg-surface-container-lowest rounded-2xl p-8 text-center shadow-[0_8px_16px_rgba(25,28,30,0.04)]">
            <h3 className="text-lg font-semibold text-on-surface mb-2">¿Quieres saber el valor de tu vehículo?</h3>
            <p className="text-on-surface-variant mb-6">Inicia sesión para solicitar una valuación profesional</p>
            <Link to="/login" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}