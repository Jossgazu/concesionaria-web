import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService, favoriteService, messageService, authService, ratingService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Vehicle } from '../types';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await vehicleService.getDashboardStats();
      return response.data.data || response.data;
    },
  });
}

export function useMyVehicles() {
  return useQuery({
    queryKey: ['vehicles', 'my'],
    queryFn: async () => {
      const response = await vehicleService.getMyVehicles();
      return response.data.data || response.data;
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => vehicleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => vehicleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await favoriteService.getAll();
      return response.data.data || response.data;
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicleId: string) => favoriteService.add(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicleId: string) => favoriteService.remove(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ['messages', 'conversations'],
    queryFn: async () => {
      const response = await messageService.getConversations();
      return response.data.data || response.data;
    },
    refetchInterval: 30000,
  });
}

export function useMessages(userId: string | null) {
  return useQuery({
    queryKey: ['messages', 'conversation', userId],
    queryFn: async () => {
      if (!userId) return { data: [] };
      const response = await messageService.getWithUser(userId);
      return response.data.data || response.data;
    },
    enabled: !!userId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ receiverId, content, vehicleId }: { receiverId: string; content: string; vehicleId?: string }) =>
      messageService.send(receiverId, content, vehicleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversation', variables.receiverId] });
    },
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => messageService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversations'] });
    },
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authService.me();
      return response.data.data || response.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => authService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUserRatings(userId: string | null) {
  return useQuery({
    queryKey: ['ratings', 'user', userId],
    queryFn: async () => {
      if (!userId) return { data: [] };
      const response = await ratingService.getUserRatings(userId);
      return response.data.data || response.data;
    },
    enabled: !!userId,
  });
}

export function useUserRatingSummary(userId: string | null) {
  return useQuery({
    queryKey: ['ratings', 'summary', userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await ratingService.getUserRatingSummary(userId);
      return response.data.data || response.data;
    },
    enabled: !!userId,
  });
}

export function useCreateRating() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => ratingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    },
  });
}
