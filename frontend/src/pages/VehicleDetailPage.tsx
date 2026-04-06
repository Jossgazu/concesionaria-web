import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Heart, Share2, 
  MapPin, Calendar, Gauge, Fuel, Settings2,
  MessageCircle, Shield, Phone, Star
} from 'lucide-react';
import { vehicleService, ratingService, messageService, favoriteService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';
import { VehicleSpecsTable } from '../components/vehicles/VehicleSpecsTable';
import SellerCard from '../components/sellers/SellerCard';
import RatingStars from '../components/sellers/RatingStars';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs');
  const [sellerRating, setSellerRating] = useState<any>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const toast = useToast();

  const isOwnListing = user?.id === vehicle?.seller_id || user?.id === vehicle?.seller?.id;

  useEffect(() => {
    loadVehicle();
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [id, isAuthenticated]);

  const loadFavorites = async () => {
    try {
      const res = await favoriteService.getAll();
      const data = res.data?.data || res.data || [];
      const ids = data.map((f: any) => f.vehicle_id || f.vehicle?.id || f.id);
      setIsFavorite(ids.includes(id));
    } catch (err) {
      console.error('Failed to load favorites', err);
    }
  };

  useEffect(() => {
    if (vehicle?.seller?.id) {
      ratingService.getUserRatingSummary(vehicle.seller.id)
        .then((res) => setSellerRating(res.data || null))
        .catch(() => setSellerRating(null));
    }
  }, [vehicle?.seller?.id]);

  const loadVehicle = async () => {
    try {
      const response = await vehicleService.getById(id!);
      setVehicle(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to load vehicle', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar a favoritos');
      return;
    }
    try {
      if (isFavorite) {
        await favoriteService.remove(id!);
        setIsFavorite(false);
        toast.success('Eliminado de favoritos');
      } else {
        await favoriteService.add(id!);
        setIsFavorite(true);
        toast.success('Agregado a favoritos');
      }
    } catch (err) {
      toast.error('Error al actualizar favoritos');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Enlace copiado al portapapeles');
    } catch (err) {
      toast.error('Error al copiar el enlace');
    }
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated) return;
    if (!messageContent.trim()) return;
    try {
      setSendingMessage(true);
      await messageService.send(vehicle.seller.id, messageContent, vehicle.id);
      setMessageModalOpen(false);
      setMessageContent('');
      alert('Mensaje enviado correctamente');
    } catch (error) {
      console.error('Failed to send message', error);
      alert('Error al enviar mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleShowPhone = () => {
    if (!isAuthenticated) return;
    setShowPhone(true);
  };

  const nextImage = () => {
    if (vehicle?.images?.length) {
      setCurrentImage((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevImage = () => {
    if (vehicle?.images?.length) {
      setCurrentImage((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Vehículo no encontrado</h2>
          <Link to="/vehicles" className="text-primary hover:text-primary/80">
            Volver a vehículos
          </Link>
        </div>
      </div>
    );
  }

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

  const specs = [
    { icon: Calendar, label: 'Año', value: vehicle.year ?? 'N/A' },
    { icon: Gauge, label: 'Kilometraje', value: `${vehicle.mileage?.toLocaleString() ?? '0'} km` },
    { icon: Settings2, label: 'Transmisión', value: transmissionLabels[vehicle.transmission] || vehicle.transmission || 'No especificado' },
    { icon: Fuel, label: 'Combustible', value: fuelLabels[vehicle.fuel_type] || vehicle.fuel_type || 'No especificado' },
    { icon: MapPin, label: 'Ubicación', value: 'Lima, Perú' },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link to="/">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/vehiculos">Vehículos</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-on-surface">{vehicle.brand} {vehicle.model}</span>
        </div>

          <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg mb-6">
              <div className="relative aspect-[16/9]">
                {vehicle.images?.length > 0 ? (
                  <img
                    src={typeof vehicle.images[currentImage] === 'string' ? vehicle.images[currentImage] : vehicle.images[currentImage].image_url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container flex items-center justify-center">
                    <span className="text-on-surface-variant">Sin imágenes</span>
                  </div>
                )}
                
                {vehicle.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {vehicle.verified && (
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Verificado
                  </div>
                )}

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full shadow-lg backdrop-blur-md ${
                      isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-on-surface-variant'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={handleShare} className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-on-surface-variant hover:bg-white">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {vehicle.images?.length > 1 && (
                <div className="p-4 flex gap-4 overflow-x-auto">
                  {vehicle.images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`shrink-0 w-32 aspect-square rounded-lg overflow-hidden border-2 ${
                        currentImage === index ? 'border-on-tertiary-container' : 'border-transparent'
                      }`}
                    >
                      <img src={typeof img === 'string' ? img : img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_16px_rgba(25,28,30,0.04)] mb-6 border border-outline-variant/10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="bg-primary text-on-primary px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">Nuevo</span>
                    {vehicle.verified && (
                      <span className="bg-on-tertiary-container/10 text-on-tertiary-container px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest">
                        <Shield className="w-3 h-3" />
                        Verificado
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold font-['Manrope'] tracking-tighter text-primary mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-secondary font-medium">
                    {vehicle.year ?? 'N/A'} • {vehicle.mileage?.toLocaleString() ?? '0'} km • {vehicle.body_type ?? 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_16px_rgba(25,28,30,0.04)] mb-6 border border-outline-variant/10">
              <h2 className="font-semibold font-['Manrope'] text-primary mb-4">Especificaciones</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec, index) => (
                  <div key={index} className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 hover:bg-surface-container-highest transition-colors">
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-tertiary-container">
                      <spec.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{spec.label}</p>
                      <p className="font-bold text-primary">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden border border-surface-container-high">
              <div className="border-b border-outline-variant/30">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-6 py-4 font-bold border-b-2 ${
                    activeTab === 'specs'
                      ? 'border-on-tertiary-container text-primary'
                      : 'border-transparent text-secondary hover:text-primary'
                  }`}
                >
                  Ficha Técnica
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-4 font-medium border-b-2 ${
                    activeTab === 'description'
                      ? 'border-on-tertiary-container text-primary'
                      : 'border-transparent text-secondary hover:text-primary'
                  }`}
                >
                  Descripción
                </button>
              </div>
              
              <div className="p-6">
                {activeTab === 'specs' ? (
                  <VehicleSpecsTable vehicle={vehicle} />
                ) : (
                  <p className="text-on-surface whitespace-pre-wrap">
                    {vehicle.description || 'No hay descripción disponible.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {vehicle.seller && (
              <SellerCard seller={vehicle.seller} vehicleId={vehicle.id} />
            )}

            {sellerRating && sellerRating.total > 0 && (
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_16px_rgba(25,28,30,0.04)] border border-outline-variant/10">
                <h3 className="font-semibold font-['Manrope'] text-primary mb-4">Valoración del vendedor</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold font-['Manrope'] text-primary">
                      {sellerRating.average?.toFixed(1) || '0.0'}
                    </p>
                    <RatingStars rating={sellerRating.average || 0} size="md" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary mb-2">{sellerRating.total} valoraciones</p>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const key = `${['one', 'two', 'three', 'four', 'five'][star - 1]}_star` as keyof typeof sellerRating;
                      const count = sellerRating[key] || 0;
                      const pct = sellerRating.total > 0 ? (count / sellerRating.total) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-secondary w-3">{star}</span>
                          <div className="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-secondary w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10">
              <div className="mb-6">
                <p className="text-xs font-black text-on-tertiary-container uppercase tracking-widest mb-1">Precio de Venta</p>
                <h2 className="text-5xl font-black font-['Manrope'] tracking-tighter text-primary">
                  {vehicle.currency || 'USD'} {vehicle.price?.toLocaleString() ?? '0'}
                </h2>
              </div>
              
              {isOwnListing ? (
                <div className="text-center py-4">
                  <p className="text-secondary text-sm">Este es tu anuncio</p>
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-3">
                  <button
                    onClick={() => setMessageModalOpen(true)}
                    className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold font-['Manrope'] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar mensaje
                  </button>
                  <button
                    onClick={handleShowPhone}
                    className="w-full border border-primary text-primary py-4 rounded-xl font-bold font-['Manrope'] flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {showPhone && vehicle.seller?.phone ? vehicle.seller.phone : 'Ver teléfono'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-secondary mb-4">
                    Inicia sesión para contactar al vendedor
                  </p>
                  <Link
                    to="/login"
                    className="block w-full bg-primary text-on-primary py-4 rounded-xl font-bold font-['Manrope'] hover:opacity-90 transition-opacity"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              )}
              <p className="text-center text-[10px] text-secondary mt-6 font-medium leading-relaxed uppercase tracking-tighter">Respuesta promedio en menos de 2 horas</p>
            </div>

            {messageModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-surface-container-lowest rounded-xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold font-['Manrope'] mb-4">Enviar mensaje a {vehicle.seller?.name}</h3>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full border border-surface-container-high rounded-lg p-3 mb-4 h-32 resize-none bg-surface-container-low"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setMessageModalOpen(false)}
                      className="flex-1 py-2 border border-surface-container-high rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !messageContent.trim()}
                      className="flex-1 bg-primary text-white py-2 rounded-lg disabled:opacity-50"
                    >
                      {sendingMessage ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-secondary-container/30 p-6 rounded-2xl border border-outline-variant/5">
              <h4 className="font-medium text-on-tertiary-container mb-2 font-['Manrope'] uppercase tracking-widest text-sm">Consejos de seguridad</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li className="flex gap-2">• Noenvíes dinero antes de ver el vehículo</li>
                <li className="flex gap-2">• Verifica la documentación del vehículo</li>
                <li className="flex gap-2">• Realiza la transacción en un lugar público</li>
                <li className="flex gap-2">• Desconfía de precios demasiado bajos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}