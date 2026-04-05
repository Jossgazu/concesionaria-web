import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Car, Eye, Heart, MessageSquare, TrendingUp, Plus } from 'lucide-react';

export default function DashboardOverview() {
  const { stats } = useOutletContext<any>();

  const statCards = [
    { 
      label: 'Vehículos activos', 
      value: stats?.stats?.activevehicles || 0, 
      icon: Car, 
      color: 'bg-blue-500',
      href: '/dashboard/vehicles'
    },
    { 
      label: 'Total vistas', 
      value: stats?.stats?.totalviews || 0, 
      icon: Eye, 
      color: 'bg-purple-500',
      href: '/dashboard/vehicles'
    },
    { 
      label: 'Favoritos', 
      value: '0', 
      icon: Heart, 
      color: 'bg-red-500',
      href: '/dashboard/favorites'
    },
    { 
      label: 'Mensajes nuevos', 
      value: '0', 
      icon: MessageSquare, 
      color: 'bg-green-500',
      href: '/dashboard/messages'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
        <Link
          to="/dashboard/vehicles/new"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link
              to="/dashboard/vehicles/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Publicar nuevo vehículo</p>
                <p className="text-sm text-gray-500">Crea un anuncio para vender</p>
              </div>
            </Link>
            <Link
              to="/dashboard/valuations"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ver valuaciones</p>
                <p className="text-sm text-gray-500">Revisa las solicitudes de tasación</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Vehículos recientes</h2>
            <Link to="/dashboard/vehicles" className="text-sm text-primary hover:text-primary/80">
              Ver todos
            </Link>
          </div>
          {stats?.recent_vehicles?.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_vehicles.slice(0, 4).map((vehicle: any) => (
                <Link
                  key={vehicle.id}
                  to={`/vehiculos/${vehicle.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={vehicle.images?.[0] || '/placeholder-car.jpg'}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {vehicle.price?.toLocaleString()} USD
                    </p>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${vehicle.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                  `}>
                    {vehicle.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tienes vehículos publicados</p>
              <Link to="/dashboard/vehicles/new" className="text-primary hover:text-primary/80 text-sm">
                Publica tu primer vehículo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
