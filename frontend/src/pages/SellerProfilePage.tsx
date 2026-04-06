import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Car, MessageSquare, CheckCircle } from 'lucide-react';
import { ratingService } from '../services/api';
import RatingStars from '../components/sellers/RatingStars';
import VehicleCard from '../components/vehicles/VehicleCard';

export default function SellerProfilePage() {
  const { id } = useParams();
  const [seller, setSeller] = useState<any>(null);
  const [ratingSummary, setRatingSummary] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [profileRes, summaryRes, ratingsRes, vehiclesRes] = await Promise.allSettled([
        fetch(`http://localhost:3000/api/v1/users/${id}`).then(r => r.json()),
        ratingService.getUserSummary(id!),
        ratingService.getUserRatings(id!, { limit: 5 }),
        fetch(`http://localhost:3000/api/v1/vehicles?seller_id=${id}`).then(r => r.json()),
      ]);

      if (profileRes.status === 'fulfilled') setSeller(profileRes.value.profile || profileRes.value);
      if (summaryRes.status === 'fulfilled') setRatingSummary(summaryRes.value.data.data || summaryRes.value.data);
      if (ratingsRes.status === 'fulfilled') setRatings(ratingsRes.value.data.data || []);
      if (vehiclesRes.status === 'fulfilled') setVehicles(vehiclesRes.value.data || []);
    } catch (error) {
      console.error('Failed to load seller profile', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Vendedor no encontrado</h2>
          <Link to="/vehiculos" className="text-primary hover:text-primary/80">
            Volver a vehículos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_16px_rgba(25,28,30,0.04)] p-8 mb-6 border border-outline-variant/10">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center overflow-hidden shrink-0 border-2 border-white">
              {seller.avatar_url ? (
                <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-on-surface-variant">
                  {seller.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold font-['Manrope'] text-primary">{seller.name}</h1>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-secondary mb-4">{seller.email}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-secondary">
                {seller.phone && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {seller.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Miembro desde {seller.created_at ? new Date(seller.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'N/A'}
                </span>
              </div>

              {ratingSummary && ratingSummary.total > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold font-['Manrope'] text-primary">{ratingSummary.average?.toFixed(1) || '0.0'}</span>
                    <RatingStars rating={ratingSummary.average || 0} size="md" />
                  </div>
                  <span className="text-secondary">({ratingSummary.total} valoraciones)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        {ratingSummary && ratingSummary.total > 0 && (
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_16px_rgba(25,28,30,0.04)] p-6 mb-6 border border-outline-variant/10">
            <h2 className="text-lg font-semibold font-['Manrope'] text-primary mb-4">Distribución de valoraciones</h2>
            <div className="max-w-md">
              {[5, 4, 3, 2, 1].map((star) => {
                const key = `${['one', 'two', 'three', 'four', 'five'][star - 1]}_star` as keyof typeof ratingSummary;
                const count = ratingSummary[key] || 0;
                const pct = ratingSummary.total > 0 ? (count / ratingSummary.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-secondary w-8">{star} ★</span>
                    <div className="flex-1 h-3 bg-surface-container-low rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-secondary w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vehicles */}
        {vehicles.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-['Manrope'] font-bold text-primary mb-4">Vehículos de {seller.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v: any) => (
                <VehicleCard key={v.id} vehicle={v} showFavoriteButton={false} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Ratings */}
        {ratings.length > 0 && (
          <div>
            <h2 className="text-xl font-['Manrope'] font-bold text-primary mb-4">Valoraciones recientes</h2>
            <div className="space-y-4">
              {ratings.map((rating: any) => (
                <div key={rating.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_16px_rgba(25,28,30,0.04)] border border-outline-variant/10">
                  <div className="flex items-start gap-3">
                    <RatingStars rating={rating.score} size="sm" />
                    <span className="text-sm text-secondary">
                      {rating.rater?.name || 'Usuario'} · {new Date(rating.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-secondary mt-2">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
