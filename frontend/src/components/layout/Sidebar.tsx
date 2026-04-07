import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, DollarSign, Heart, MessageSquare, User, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/mis-vehiculos', icon: Car, label: 'Mis Vehículos' },
  { path: '/dashboard/valuaciones', icon: DollarSign, label: 'Tasaciones' },
  { path: '/favoritos', icon: Heart, label: 'Favoritos' },
  { path: '/mensajes', icon: MessageSquare, label: 'Mensajes' },
  { path: '/dashboard/perfil', icon: User, label: 'Perfil' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 bg-[#F9F9FC] border-r border-[#8E9196]/15 p-6 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="mb-10">
          <h1 className="font-['Manrope'] font-black text-[#2E3133] text-2xl tracking-tighter">
            Andina Motor
          </h1>
          <p className="text-[#8E9196] text-[10px] uppercase tracking-widest mt-1">Studio Digital</p>
        </div>
        <nav className="flex-1 space-y-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#007AFF]/10 text-[#007AFF] font-bold border-r-4 border-[#007AFF]'
                        : 'text-[#8E9196] hover:bg-[#8E9196]/5 hover:translate-x-1'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-6">
          <button className="w-full bg-[#007AFF] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95">
            Publicar Auto
          </button>
        </div>

        <div className="p-2 border-t border-[#8E9196]/15 mt-4">
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-full p-2 text-[#8E9196] hover:text-[#2E3133] transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
