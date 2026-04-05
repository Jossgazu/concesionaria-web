import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Car, FileText, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { valuationService } from '../../services/api';
import { useToast } from '../../hooks/useToast';

interface ValuationFormData {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
}

const steps = [
  { id: 1, title: 'Datos del Vehículo', icon: Car },
  { id: 2, title: 'Detalles', icon: FileText },
  { id: 3, title: 'Resultado', icon: DollarSign },
];

export function ValuationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [valuationResult, setValuationResult] = useState<{ estimatedValue: number; currency: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ValuationFormData>();
  const { success, error } = useToast();

  const onSubmit = async (data: ValuationFormData) => {
    setIsLoading(true);
    try {
      const response = await valuationService.create(data);
      setValuationResult(response.data.data || response.data);
      setCurrentStep(3);
      success('Tasación completada exitosamente');
    } catch (err) {
      error('Error al realizar la tasación');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const brands = [
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' },
    { value: 'ford', label: 'Ford' },
    { value: 'chevrolet', label: 'Chevrolet' },
    { value: 'volkswagen', label: 'Volkswagen' },
    { value: 'bmw', label: 'BMW' },
    { value: 'mercedes', label: 'Mercedes-Benz' },
    { value: 'audi', label: 'Audi' },
    { value: 'nissan', label: 'Nissan' },
    { value: 'hyundai', label: 'Hyundai' },
  ];

  const conditions = [
    { value: 'excellent', label: 'Excelente' },
    { value: 'good', label: 'Bueno' },
    { value: 'fair', label: 'Regular' },
    { value: 'poor', label: 'Malo' },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex border-b border-gray-100">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex-1 flex items-center justify-center py-4 px-2 text-center ${
              currentStep >= step.id ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500'
            }`}
          >
            <step.icon className="w-5 h-5 mr-2 hidden sm:block" />
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Datos del Vehículo</h3>
            <Select
              label="Marca"
              options={brands}
              {...register('brand', { required: 'La marca es requerida' })}
              error={errors.brand?.message}
            />
            <Input
              label="Modelo"
              {...register('model', { required: 'El modelo es requerido' })}
              error={errors.model?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Año"
                type="number"
                {...register('year', { required: 'El año es requerido', min: { value: 1990, message: 'Año inválido' } })}
                error={errors.year?.message}
              />
              <Input
                label="Kilometraje"
                type="number"
                {...register('mileage', { required: 'El kilometraje es requerido' })}
                error={errors.mileage?.message}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button type="button" onClick={nextStep}>
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Condición del Vehículo</h3>
            <Select
              label="Estado General"
              options={conditions}
              {...register('condition', { required: 'La condición es requerida' })}
              error={errors.condition?.message}
            />
            <Textarea
              label="Descripción adicional (opcional)"
              rows={4}
              placeholder="Cuéntanos más sobre el estado de tu vehículo..."
            />
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                Anterior
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Realizar Tasación
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && valuationResult && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Valor Estimado</h3>
            <p className="text-4xl font-bold text-primary mb-2">
              {valuationResult.currency} {valuationResult.estimatedValue.toLocaleString()}
            </p>
            <p className="text-gray-500 mb-6">
              Basado en {getValues('year')} • {getValues('mileage').toLocaleString()} km • {getValues('condition')}
            </p>
            <div className="flex justify-center gap-4">
              <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                Nueva Tasación
              </Button>
              <Button type="button" onClick={() => window.location.href = '/vender'}>
                Vender mi Vehículo
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
