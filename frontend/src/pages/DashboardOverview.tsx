import { useOutletContext, Link } from 'react-router-dom';
import { Car, Eye, Heart, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import { useFavorites } from '../hooks/useDashboard';

export default function DashboardOverview() {
  const { stats } = useOutletContext<any>();
  const { data: favorites = [] } = useFavorites();

  const statCards = [
    { 
      label: 'Vehículos activos', 
      value: stats?.stats?.ActiveVehicles || 0, 
      icon: Car, 
      color: 'bg-accent',
      href: '/dashboard/vehicles'
    },
    { 
      label: 'Total vistas', 
      value: stats?.stats?.TotalViews || 0, 
      icon: Eye, 
      color: 'bg-tertiary',
      href: '/dashboard/vehicles'
    },
    { 
      label: 'Favoritos', 
      value: favorites.length, 
      icon: Heart, 
      color: 'bg-red-500',
      href: '/dashboard/favorites'
    },
    { 
      label: 'Mensajes nuevos', 
      value: stats?.unread_messages || 0, 
      icon: MessageSquare, 
      color: 'bg-emerald-500',
      href: '/dashboard/messages'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-on-surface">Resumen</h1>
        <Link
          to="/dashboard/vehicles/new"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Publicar vehículo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.href}
            className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-headline font-bold text-primary mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="font-semibold text-on-surface mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link
              to="/dashboard/vehicles/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container transition-colors"
            >
              <div className="w-10 h-10 bg-tertiary-fixed rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <p className="font-medium text-on-surface">Publicar nuevo vehículo</p>
                <p className="text-sm text-on-surface-variant">Crea un anuncio para vender</p>
              </div>
            </Link>
            <Link
              to="/dashboard/valuations"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container transition-colors"
            >
              <div className="w-10 h-10 bg-tertiary-fixed rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <p className="font-medium text-on-surface">Ver valuaciones</p>
                <p className="text-sm text-on-surface-variant">Revisa las solicitudes de tasación</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-on-surface">Vehículos recientes</h2>
            <Link to="/dashboard/vehicles" className="text-sm text-accent hover:text-on-tertiary-container">
              Ver todos
            </Link>
          </div>
          {stats?.recent_vehicles?.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_vehicles.slice(0, 4).map((vehicle: any) => (
                <Link
                  key={vehicle.id}
                  to={`/vehiculos/${vehicle.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <img
                    src={vehicle.images?.[0]?.image_url || vehicle.images?.[0] || '/placeholder-car.jpg'}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-on-surface truncate">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {vehicle.price?.toLocaleString()} USD
                    </p>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${vehicle.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-container text-on-surface-variant'}
                  `}>
                    {vehicle.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tienes vehículos publicados</p>
              <Link to="/dashboard/vehicles/new" className="text-accent hover:text-on-tertiary-container text-sm">
                Publica tu primer vehículo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
