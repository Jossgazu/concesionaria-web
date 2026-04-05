import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Heart, Share2, 
  MapPin, Calendar, Gauge, Fuel, Settings2,
  MessageCircle, Shield, Phone
} from 'lucide-react';
import { vehicleService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { VehicleSpecsTable } from '../components/vehicles/VehicleSpecsTable';
import SellerCard from '../components/sellers/SellerCard';
import RatingStars from '../components/sellers/RatingStars';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs');

  useEffect(() => {
    loadVehicle();
  }, [id]);

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehículo no encontrado</h2>
          <Link to="/vehicles" className="text-primary hover:text-primary/80">
            Volver a vehículos
          </Link>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Calendar, label: 'Año', value: vehicle.year },
    { icon: Gauge, label: 'Kilometraje', value: `${vehicle.mileage?.toLocaleString()} km` },
    { icon: Settings2, label: 'Transmisión', value: vehicle.transmission || 'No especificado' },
    { icon: Fuel, label: 'Combustible', value: vehicle.fuel_type || 'No especificado' },
    { icon: MapPin, label: 'Ubicación', value: 'Lima, Perú' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/vehicles">Vehículos</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{vehicle.brand} {vehicle.model}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="relative aspect-video">
                {vehicle.images?.length > 0 ? (
                  <img
                    src={typeof vehicle.images[currentImage] === 'string' ? vehicle.images[currentImage] : vehicle.images[currentImage].image_url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sin imágenes</span>
                  </div>
                )}
                
                {vehicle.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {vehicle.verified && (
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Verificado
                  </div>
                )}

                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full shadow-lg ${
                      isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-white/90 rounded-full shadow-lg text-gray-700 hover:bg-white">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {vehicle.images?.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {vehicle.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                        currentImage === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-gray-500">
                    {vehicle.year} • {vehicle.mileage?.toLocaleString()} km • {vehicle.body_type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {vehicle.currency || 'USD'} {vehicle.price?.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Precio de venta</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Especificaciones</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <spec.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{spec.label}</p>
                      <p className="font-medium text-gray-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-6 py-4 font-medium border-b-2 ${
                    activeTab === 'specs'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ficha Técnica
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-4 font-medium border-b-2 ${
                    activeTab === 'description'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Descripción
                </button>
              </div>
              
              <div className="p-6">
                {activeTab === 'specs' ? (
                  <VehicleSpecsTable vehicle={vehicle} />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {vehicle.description || 'No hay descripción disponible.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {vehicle.seller && (
              <SellerCard seller={vehicle.seller} />
            )}

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Contactar al vendedor</h3>
              
              {isAuthenticated ? (
                <div className="space-y-3">
                  <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Enviar mensaje
                  </button>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Ver teléfono
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Inicia sesión para contactar al vendedor
                  </p>
                  <Link
                    to="/login"
                    className="block w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">Consejos de seguridad</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Noenvíes dinero antes de ver el vehículo</li>
                <li>• Verifica la documentación del vehículo</li>
                <li>• Realiza la transacción en un lugar público</li>
                <li>• desconfía de precios demasiado bajos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}