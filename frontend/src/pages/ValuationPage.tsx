import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Car, CheckCircle, ArrowRight, Shield, Clock, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function ValuationPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
            <TrendingUp className="w-4 h-4" />
            Valuación gratuita e instantánea
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Conoce el valor real de tu vehículo
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Nuestro algoritmo analiza miles de datos del mercado para darte una estimación precisa del valor de tu auto.
          </p>
          <Link
            to="/vender"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Comenzar valuación
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-on-surface text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-[0_8px_16px_rgba(25,28,30,0.04)]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-3">1. Ingresa los datos</h3>
              <p className="text-on-surface-variant">
                Marca, modelo, año, kilometraje y estado de tu vehículo.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-[0_8px_16px_rgba(25,28,30,0.04)]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-3">2. Calculamos el valor</h3>
              <p className="text-on-surface-variant">
                Nuestro algoritmo analiza el mercado en tiempo real para darte una estimación precisa.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center shadow-[0_8px_16px_rgba(25,28,30,0.04)]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-on-surface mb-3">3. Recibe tu valuación</h3>
              <p className="text-on-surface-variant">
                Obtén el valor estimado al instante. Si estás registrado, se guarda en tu historial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-on-surface text-center mb-12">
            ¿Por qué usar nuestra valuación?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 bg-surface-container-low rounded-xl">
              <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface mb-1">Basada en datos reales</h3>
                <p className="text-on-surface-variant text-sm">
                  Analizamos precios de mercado, depreciación y demanda actual.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-surface-container-low rounded-xl">
              <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface mb-1">Resultado instantáneo</h3>
                <p className="text-on-surface-variant text-sm">
                  Sin esperas ni formularios largos. Tu valuación en segundos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-surface-container-low rounded-xl">
              <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface mb-1">100% gratuita</h3>
                <p className="text-on-surface-variant text-sm">
                  Sin costos ocultos ni compromisos. Usa la herramienta cuando quieras.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-surface-container-low rounded-xl">
              <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface mb-1">Todas las marcas</h3>
                <p className="text-on-surface-variant text-sm">
                  Toyota, Honda, Ford, Chevrolet, Nissan, BMW, Mercedes-Benz y más.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para conocer el valor de tu vehículo?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            {isAuthenticated
              ? 'Inicia tu valuación ahora y guarda el resultado en tu historial.'
              : 'Inicia tu valuación ahora. Crea una cuenta para guardar el resultado.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vender"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Comenzar valuación
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2 transition-colors"
              >
                Crear cuenta gratis
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
