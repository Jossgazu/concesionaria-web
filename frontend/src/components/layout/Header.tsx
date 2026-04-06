import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, Car, Heart, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vehiculos?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass-effect backdrop-blur-xl sticky top-0 z-40 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Car className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-primary font-headline">Concesionaria</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/vehiculos"
              className={`pb-2 transition-all font-medium ${
                isActive('/vehiculos')
                  ? 'text-primary border-b-2 border-[#007AFF]'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Vehículos
            </Link>
            <Link
              to="/vender"
              className={`pb-2 transition-all font-medium ${
                isActive('/vender')
                  ? 'text-primary border-b-2 border-[#007AFF]'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Vender
            </Link>
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vehículos..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-on-surface placeholder:text-secondary"
              />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/favoritos" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/mensajes" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium text-on-surface">{user?.name}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(25,28,30,0.1)] py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/vehicles"
                        className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Car className="w-4 h-4" />
                        Mis Vehículos
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Mi Perfil
                      </Link>
                      <hr className="my-1 border-surface-container-high" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-surface-container transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors font-medium">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary active:scale-[0.98] transition-transform">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-on-surface-variant"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden glass-effect border-t border-white/20 py-4 px-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vehículos..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-on-surface placeholder:text-secondary"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-2">
            <Link
              to="/vehiculos"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/vehiculos')
                  ? 'bg-[#007AFF]/10 text-[#007AFF] font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Vehículos
            </Link>
            <Link
              to="/vender"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/vender')
                  ? 'bg-[#007AFF]/10 text-[#007AFF] font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Vender
            </Link>
            {isAuthenticated ? (
              <>
                <hr className="my-2 border-surface-container-high" />
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/favoritos"
                  className="px-4 py-2 text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favoritos
                </Link>
                <Link
                  to="/mensajes"
                  className="px-4 py-2 text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mensajes
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 text-left text-red-600 hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <hr className="my-2 border-surface-container-high" />
                <Link
                  to="/login"
                  className="px-4 py-2 text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-center active:scale-[0.98] transition-transform"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
