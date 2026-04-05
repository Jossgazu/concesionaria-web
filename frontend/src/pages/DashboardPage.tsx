import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Car, Heart, MessageSquare, Star, 
  User, LogOut, Menu, X 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { vehicleService } from '../services/api';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/vehicles', label: 'Mis vehículos', icon: Car },
  { path: '/dashboard/favorites', label: 'Favoritos', icon: Heart },
  { path: '/dashboard/messages', label: 'Mensajes', icon: MessageSquare },
  { path: '/dashboard/ratings', label: 'Valoraciones', icon: Star },
  { path: '/dashboard/profile', label: 'Mi perfil', icon: User },
];

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await vehicleService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">Concesionaria</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 pt-20
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:static md:shadow-none'}
          `}>
            <nav className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <Outlet context={{ stats, refreshStats: loadStats }} />
          </main>
        </div>
      </div>
    </div>
  );
}
