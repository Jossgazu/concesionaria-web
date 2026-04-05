import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, FileText, User, CheckCircle } from 'lucide-react';
import { valuationService } from '../services/api';

const STEPS = [
  { id: 1, title: 'Vehículo', icon: Car },
  { id: 2, title: 'Condición', icon: FileText },
  { id: 3, title: 'Contacto', icon: User },
  { id: 4, title: 'Resultado', icon: CheckCircle },
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

const CONDITIONS = [
  { value: 'excellent', label: 'Excelente', description: 'Sin daños visibles, mantenimientos al día' },
  { value: 'good', label: 'Bueno', description: 'Pequeños daños menores, funcionando bien' },
  { value: 'fair', label: 'Regular', description: 'Daños visibles pero funcional' },
  { value: 'poor', label: 'Malo', description: 'Necesita reparaciones significativas' },
];

export default function SellPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    body_type: '',
    condition: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.brand && formData.model && formData.year && formData.mileage && formData.body_type;
      case 2:
        return formData.condition;
      case 3:
        return formData.name && formData.email && formData.phone;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await valuationService.create(formData);
      setResult(response.data);
      setStep(4);
    } catch (error) {
      console.error('Failed to create valuation', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Conoce el valor de tu vehículo
          </h1>
          <p className="text-gray-600">
            Completa el formulario y te dareos una estimación gratuita
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
                <span className={`ml-3 font-medium ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.title}
                </span>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${step > s.id ? 'bg-primary' : 'bg-gray-200'}`} />
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
                    max={new Date().getFullYear()}
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
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Estado del vehículo</h2>
              
              <div className="space-y-3">
                {CONDITIONS.map((condition) => (
                  <button
                    key={condition.value}
                    onClick={() => updateForm('condition', condition.value)}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      formData.condition === condition.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{condition.label}</p>
                        <p className="text-sm text-gray-500">{condition.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.condition === condition.value
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {formData.condition === condition.value && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas adicionales</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  rows={3}
                  placeholder="¿Algo más que debamos saber sobre tu vehículo?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Datos de contacto</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="+51 999 999 999"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Valuación completada!
              </h2>
              <p className="text-gray-600 mb-8">
                Basado en la información proporcionada, estimamos que tu vehículo vale:
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-500 mb-1">{result.brand} {result.model}</p>
                <p className="text-4xl font-bold text-primary">
                  USD {result.estimated_price?.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Publicar mi vehículo
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="border border-gray-300 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Volver al inicio
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
                  {loading ? 'Calculando...' : 'Obtener valuación'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}