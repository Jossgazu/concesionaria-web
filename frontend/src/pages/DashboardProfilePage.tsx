import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Camera, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/api';

export default function DashboardProfilePage() {
  const { user } = useAuthStore();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      bio: (user as any)?.bio || '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await authService.updateProfile(data);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await authService.uploadAvatar(formData);
    } catch (error) {
      console.error('Failed to upload avatar', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-400">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadingAvatar}
              />
            </label>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Miembro desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
            <textarea
              rows={4}
              {...register('bio')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Valoraciones recibidas</h2>
        {(user as any)?.ratingSummary ? (
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {(user as any).ratingSummary.average?.toFixed(1) || '0.0'}
              </p>
              <p className="text-sm text-gray-500">de 5</p>
            </div>
            <div className="flex-1">
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-8">{star}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ 
                          width: (user as any).ratingSummary.total > 0 
                            ? `${((user as any).ratingSummary[`${star}Star`] / (user as any).ratingSummary.total) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">{(user as any).ratingSummary[`${star}Star`] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Aún no tienes valoraciones</p>
        )}
      </div>
    </div>
  );
}
