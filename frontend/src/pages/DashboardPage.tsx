import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Car, Heart, MessageSquare, 
  User, LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { vehicleService } from '../services/api';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/vehicles', label: 'Mis vehículos', icon: Car },
  { path: '/dashboard/favorites', label: 'Favoritos', icon: Heart },
  { path: '/dashboard/messages', label: 'Mensajes', icon: MessageSquare },
  { path: '/dashboard/profile', label: 'Mi perfil', icon: User },
];

export default function DashboardPage({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [stats, setStats] = useState<any>(null);

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
    <div className="min-h-screen bg-surface p-6">
      <div className="flex gap-6 max-w-7xl mx-auto">
        <aside className="w-64 bg-[#F9F9FC] border-r border-[#8E9196]/15 p-6 shrink-0">
          <div className="mb-10">
            <h1 className="font-['Manrope'] font-black text-[#2E3133] text-2xl tracking-tighter">Concesionaria</h1>
            <p className="text-[#8E9196] text-[10px] uppercase tracking-widest mt-1">Dashboard</p>
          </div>
          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-[#007AFF]/10 text-[#007AFF] font-bold border-r-4 border-[#007AFF]' 
                      : 'text-[#8E9196] hover:bg-[#8E9196]/5 hover:translate-x-1'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-6">
            <Link
              to="/vender"
              className="w-full bg-[#007AFF] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
            >
              Publicar Auto
            </Link>
          </div>
          <div className="pt-6 mt-6 border-t border-[#8E9196]/15">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {children || <Outlet context={{ stats, refreshStats: loadStats }} />}
        </div>
      </div>
    </div>
  );
}