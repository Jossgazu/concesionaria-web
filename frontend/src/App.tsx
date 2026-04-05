import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import HomePage from './pages/HomePage';
import VehicleBrowsePage from './pages/VehicleBrowsePage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DashboardOverview from './pages/DashboardOverview';
import DashboardProfilePage from './pages/DashboardProfilePage';
import { DashboardVehiclesPage } from './pages/DashboardVehiclesPage';
import DashboardFavoritesPage from './pages/DashboardFavoritesPage';
import DashboardMessagesPage from './pages/DashboardMessagesPage';
import DashboardValuationsPage from './pages/DashboardValuationsPage';
import SellPage from './pages/SellPage';
import NotFoundPage from './pages/NotFoundPage';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Header />
        <main>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vehiculos" element={<VehicleBrowsePage />} />
        <Route path="/vehiculos/:id" element={<VehicleDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="vehicles" element={<DashboardVehiclesPage />} />
          <Route path="vehicles/new" element={<DashboardVehiclesPage />} />
          <Route path="vehicles/:id/edit" element={<DashboardVehiclesPage />} />
          <Route path="favorites" element={<DashboardFavoritesPage />} />
          <Route path="messages" element={<DashboardMessagesPage />} />
          <Route path="ratings" element={<DashboardMessagesPage />} />
          <Route path="profile" element={<DashboardProfilePage />} />
        </Route>
        
        <Route path="/favoritos" element={<DashboardFavoritesPage />} />
        <Route path="/mensajes" element={<DashboardMessagesPage />} />
        <Route path="/valuacion" element={<DashboardValuationsPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toast />
        </main>
        <Footer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
