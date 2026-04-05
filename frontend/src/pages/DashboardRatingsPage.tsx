import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, MessageSquare } from 'lucide-react';
import { ratingService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';

export default function DashboardRatingsPage() {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const toast = useToast();
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    target_id: userId || '',
    score: 5,
    comment: '',
  });

  useEffect(() => {
    loadRatings();
  }, [userId]);

  const loadRatings = async () => {
    try {
      const targetUser = userId || user?.id;
      if (!targetUser) return;
      const response = await ratingService.getUserRatings(targetUser);
      setRatings(response.data.data || []);
    } catch (error) {
      console.error('Failed to load ratings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.target_id || !formData.score) return;

    try {
      await ratingService.create(formData);
      toast.success('Valoración enviada correctamente');
      setShowForm(false);
      setFormData({ target_id: userId || '', score: 5, comment: '' });
      loadRatings();
    } catch (error) {
      toast.error('Error al enviar la valoración');
    }
  };

  const getRatingLabel = (score: number) => {
    const labels: Record<number, string> = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente',
    };
    return labels[score] || '';
  };

  const getRatingColor = (score: number) => {
    const colors: Record<number, string> = {
      1: 'text-red-500',
      2: 'text-orange-500',
      3: 'text-yellow-500',
      4: 'text-blue-500',
      5: 'text-green-500',
    };
    return colors[score] || 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Valoraciones</h1>
          <p className="text-gray-500 mt-1">Opiniones y evaluaciones de usuarios</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Star className="w-4 h-4" />
          Nueva valoración
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Evaluar a un usuario</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!userId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID del usuario *</label>
                <input
                  type="text"
                  value={formData.target_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_id: e.target.value }))}
                  placeholder="ID del usuario a evaluar"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Puntuación *</label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, score: star }))}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                      formData.score >= star
                        ? 'bg-yellow-100 text-yellow-500 scale-110'
                        : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Star className={`w-7 h-7 ${formData.score >= star ? 'fill-current' : ''}`} />
                  </button>
                ))}
                <span className={`ml-2 font-medium ${getRatingColor(formData.score)}`}>
                  {getRatingLabel(formData.score)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comentario (opcional)</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
                placeholder="Cuéntanos tu experiencia con este usuario..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
              >
                Enviar valoración
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white h-32 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : ratings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin valoraciones</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {userId
              ? 'Este usuario aún no ha recibido valoraciones.'
              : 'Aún no hay valoraciones. Evalúa a un usuario después de una transacción.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {ratings.map((rating: any) => (
            <div key={rating.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-bold text-gray-500">
                      {rating.rater?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={rating.score} size="sm" />
                      <span className={`text-sm font-medium ${getRatingColor(rating.score)}`}>
                        {getRatingLabel(rating.score)}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-600 mt-2">{rating.comment}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      Por {rating.rater?.name || 'Usuario'} · {new Date(rating.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {rating.seller_response && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">Respuesta del vendedor:</p>
                        <p className="text-sm text-gray-600 mt-1">{rating.seller_response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingStars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const cls = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}
