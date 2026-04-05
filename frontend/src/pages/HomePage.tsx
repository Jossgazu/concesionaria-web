import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Car, Shield, Clock } from 'lucide-react';
import { vehicleService } from '../services/api';
import VehicleCard from '../components/vehicles/VehicleCard';

const BODY_TYPES = [
  { id: 'suv', name: 'SUV', icon: '🚙' },
  { id: 'sedan', name: 'Sedán', icon: '🚗' },
  { id: 'hatchback', name: 'Hatchback', icon: '🚘' },
  { id: 'pickup', name: 'Pick Up', icon: '🛻' },
  { id: 'van', name: 'Van', icon: '🚐' },
  { id: 'coupe', name: 'Coupé', icon: '🏎️' },
];

const BRANDS = [
  { id: 'toyota', name: 'Toyota' },
  { id: 'honda', name: 'Honda' },
  { id: 'ford', name: 'Ford' },
  { id: 'chevrolet', name: 'Chevrolet' },
  { id: 'nissan', name: 'Nissan' },
  { id: 'volkswagen', name: 'Volkswagen' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
];

export default function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedVehicles();
  }, []);

  const loadFeaturedVehicles = async () => {
    try {
      const response = await vehicleService.getFeatured();
      setFeaturedVehicles(response.data.data);
    } catch (error) {
      console.error('Failed to load featured vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/vehiculos?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary via-primary to-secondary text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Encuentra tu próximo vehículo
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Miles de vehículos verificados de vendedores de confianza
            </p>
            
            <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por marca, modelo o palabra clave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explora por tipo de vehículo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BODY_TYPES.map((type) => (
              <Link
                key={type.id}
                to={`/vehiculos?body_type=${type.id}`}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100"
              >
                <span className="text-4xl mb-3 block">{type.icon}</span>
                <span className="font-medium text-gray-800">{type.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Vehículos destacados
            </h2>
            <Link
              to="/vehiculos"
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {featuredVehicles.map((vehicle: any) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Marcas populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {BRANDS.map((brand) => (
              <Link
                key={brand.id}
                to={`/vehiculos?brand=${brand.id}`}
                className="bg-white rounded-xl p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <span className="font-semibold text-gray-700">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Busca tu vehículo</h3>
              <p className="text-gray-400">
                Filtra por marca, modelo, precio y más para encontrar exactamente lo que necesitas.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Contacta al vendedor</h3>
              <p className="text-gray-400">
                Comunícate directamente con el vendedor a través de nuestro sistema de mensajería.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Cierra el trato</h3>
              <p className="text-gray-400">
                Negocia y completa la compra de forma segura con vendedores verificados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Vehículos verificados</h3>
              <p className="text-gray-600 text-sm">
                Todos los vehículos son revisados para asegurar calidad y autenticidad.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Atención 24/7</h3>
              <p className="text-gray-600 text-sm">
                Estamos disponibles cuando tú nos necesites.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Miles de opciones</h3>
              <p className="text-gray-600 text-sm">
                Amplio catálogo de vehículos para todos los gustos y presupuestos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}