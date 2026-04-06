import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-surface-container-high">404</h1>
        <h2 className="text-2xl font-bold text-on-surface mb-4">Página no encontrada</h2>
        <p className="text-on-surface-variant mb-8">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 border border-surface-container-high px-6 py-3 rounded-lg font-medium text-on-surface hover:bg-surface-container-low"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}