import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Car } from 'lucide-react';
import { valuationService } from '../services/api';

export default function DashboardValuationsPage() {
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
    processed: 'bg-green-100 text-green-700',
    accepted: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mis valuaciones</h1>
        <Link
          to="/sell"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Nueva valuación
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-32 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : valuations.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin valuaciones</h2>
          <p className="text-gray-500 mb-6">Aún no tienes valuaciones solicitadas</p>
          <Link
            to="/sell"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
          >
            Solicitar primera valuación
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {valuations.map((valuation: any) => (
            <div key={valuation.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Car className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {valuation.brand} {valuation.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {valuation.year} • {valuation.mileage?.toLocaleString()} km
                    </p>
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      Estado: {valuation.condition}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    USD {valuation.estimated_price?.toLocaleString()}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${statusColors[valuation.status]}`}>
                    {valuation.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(valuation.created_at).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}