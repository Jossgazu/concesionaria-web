import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, DollarSign, FileText, CheckCircle, User, Image as ImageIcon } from 'lucide-react';
import { vehicleService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const STEPS = [
  { id: 1, title: 'Vehículo', icon: Car },
  { id: 2, title: 'Precio', icon: DollarSign },
  { id: 3, title: 'Detalles', icon: FileText },
  { id: 4, title: 'Publicado', icon: CheckCircle },
];

const BODY_TYPES = [
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedán' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'pickup', label: 'Pick Up' },
  { value: 'van', label: 'Van' },
  { value: 'coupe', label: 'Coupé' },
  { value: 'convertible', label: 'Convertible' },
];

const FUEL_TYPES = [
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'diesel', label: 'Diésel' },
  { value: 'electric', label: 'Eléctrico' },
  { value: 'hybrid', label: 'Híbrido' },
];

const TRANSMISSIONS = [
  { value: 'automatic', label: 'Automático' },
  { value: 'manual', label: 'Manual' },
  { value: 'cvt', label: 'CVT' },
];

export default function SellPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    price: 0,
    negotiable: false,
    body_type: '',
    fuel_type: '',
    transmission: '',
    color: '',
    description: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.brand && formData.model && formData.year && formData.mileage && formData.body_type;
      case 2:
        return formData.price > 0;
      case 3:
        return formData.fuel_type && formData.transmission;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.create(formData);
      setResult(response.data.data || response.data);
      setStep(4);
    } catch (error) {
      console.error('Failed to create vehicle', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Publica tu vehículo
          </h1>
          <p className="text-gray-600">
            Completa los datos y tu anuncio estará visible para miles de compradores
          </p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center">
            {STEPS.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${step >= s.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}
                  ${step > s.id ? 'ring-4 ring-primary/20' : ''}
                `}>
                  <s.icon className="w-6 h-6" />
                </div>
                <span className={`ml-3 font-medium hidden sm:inline ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.title}
                </span>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-16 h-1 mx-2 sm:mx-4 ${step > s.id ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Información del vehículo</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => updateForm('brand', e.target.value)}
                    placeholder="Ej: Toyota"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => updateForm('model', e.target.value)}
                    placeholder="Ej: Corolla"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Año *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => updateForm('year', parseInt(e.target.value))}
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kilometraje *</label>
                  <input
                    type="number"
                    value={formData.mileage || ''}
                    onChange={(e) => updateForm('mileage', parseInt(e.target.value) || 0)}
                    placeholder="Ej: 50000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de vehículo *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {BODY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateForm('body_type', type.value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        formData.body_type === type.value
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => updateForm('color', e.target.value)}
                  placeholder="Ej: Blanco"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Precio de venta</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tu precio (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold">$</span>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => updateForm('price', parseInt(e.target.value) || 0)}
                    placeholder="25,000"
                    min={0}
                    className="w-full pl-10 pr-4 py-4 text-2xl font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Establece el precio al que deseas vender tu vehículo
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={formData.negotiable}
                  onChange={(e) => updateForm('negotiable', e.target.checked)}
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="negotiable" className="text-gray-700">
                  <span className="font-medium">Precio negociable</span>
                  <p className="text-sm text-gray-500">Los compradores sabrán que estás abierto a ofertas</p>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Detalles adicionales</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Combustible *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FUEL_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateForm('fuel_type', type.value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        formData.fuel_type === type.value
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmisión *</label>
                <div className="grid grid-cols-3 gap-3">
                  {TRANSMISSIONS.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => updateForm('transmission', type.value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        formData.transmission === type.value
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  rows={4}
                  placeholder="Describe tu vehículo: estado general, extras, mantenimiento reciente..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Vehículo publicado!
              </h2>
              <p className="text-gray-600 mb-8">
                Tu anuncio ya está visible para miles de compradores potenciales.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-500 mb-1">{result.brand} {result.model}</p>
                <p className="text-4xl font-bold text-primary">
                  USD {result.price?.toLocaleString()}
                </p>
                {result.negotiable && (
                  <p className="text-sm text-green-600 mt-1">Precio negociable</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate(`/vehiculos/${result.id}`)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Ver mi anuncio
                </button>
                <button
                  onClick={() => navigate('/dashboard/vehicles')}
                  className="border border-gray-300 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Mis vehículos
                </button>
              </div>
            </div>
          )}

          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Anterior
                </button>
              ) : (
                <div />
              )}
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                >
                  {loading ? 'Publicando...' : 'Publicar vehículo'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
