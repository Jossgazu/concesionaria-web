import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Car, Heart, MessageSquare, Star, 
  User, LogOut, Menu, X, Settings
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { vehicleService } from '../services/api';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/vehicles', label: 'Mis vehículos', icon: Car },
  { path: '/dashboard/favorites', label: 'Favoritos', icon: Heart },
  { path: '/dashboard/messages', label: 'Mensajes', icon: MessageSquare },
  { path: '/dashboard/valuations', label: 'Valuaciones', icon: Star },
  { path: '/dashboard/profile', label: 'Mi perfil', icon: User },
  { path: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

export default function DashboardPage({ children }: { children?: React.ReactNode }) {
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
      setStats(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 pt-20
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:static md:shadow-none md:pt-0 md:bg-transparent'}
          `}>
            <div className="md:hidden absolute top-4 right-4">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
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

              <div className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar sesión
                </button>
              </div>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {children || <Outlet context={{ stats, refreshStats: loadStats }} />}
          </main>
        </div>
      </div>
    </div>
  );
}
