export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
  ratingSummary?: {
    average: number;
    total: number;
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  currency: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  color: string;
  description?: string;
  primaryImage?: string;
  images?: string[];
  verified?: boolean;
  sellerId: string;
  seller?: Seller;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  rating?: number;
  totalSales?: number;
  verified?: boolean;
  createdAt?: string;
  rating_summary?: {
    average: number;
    total: number;
  };
}

export interface VehicleFilters {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Valuation {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  estimatedValue: number;
  currency: string;
  createdAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  vehicleId?: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants?: User[];
  lastMessage?: Message;
  vehicle?: Vehicle;
  updatedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
