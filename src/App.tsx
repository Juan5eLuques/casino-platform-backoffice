import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from './store';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { OperatorsPage } from './pages/OperatorsPage';
import { PlayersPage } from './pages/PlayersPage';
import { UsersPage } from './pages/UsersPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BrandsPage } from './pages/BrandsPage';
import { GamesPage } from './pages/GamesPage';
import { AuditPage } from './pages/AuditPage';
import { SettingsPage } from './pages/SettingsPage';
import BannersPage from './pages/BannersPage';
import ColorsPage from './pages/ColorsPage';
import PublicPage from './pages/PublicPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
   const isAuthenticated = useAuthStore(state => state.isAuthenticated);

   if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
   }

   return <>{children}</>;
}

// Public Route Component (redirects if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
   const isAuthenticated = useAuthStore(state => state.isAuthenticated);

   if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
   }

   return <>{children}</>;
}

function App() {
   const { darkMode, setDarkMode } = useUIStore();
   const { checkSession } = useAuthStore();

   // Initialize auth state and dark mode on app start
   useEffect(() => {
      // Set initial dark mode from localStorage
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);

      // Verificar si hay una sesión válida al cargar la app
      checkSession().catch((error) => {
         console.error('Failed to check session on app start:', error);
      });
   }, [setDarkMode, checkSession]);

   // Apply dark mode class to document
   useEffect(() => {
      if (darkMode) {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
   }, [darkMode]);

   return (
      <div className="h-full">
         <Routes>
            {/* Public Routes */}
            <Route
               path="/login"
               element={
                  <PublicRoute>
                     <LoginPage />
                  </PublicRoute>
               }
            />

            {/* Protected Routes */}
            <Route
               path="/"
               element={
                  <ProtectedRoute>
                     <DashboardLayout />
                  </ProtectedRoute>
               }
            >
               <Route index element={<Navigate to="/dashboard" replace />} />
               <Route path="dashboard" element={<DashboardPage />} />
               <Route path="operators" element={<OperatorsPage />} />
               <Route path="players" element={<PlayersPage />} />
               <Route path="users" element={<UsersPage />} />
               <Route path="users/:userId" element={<UserDetailPage />} />
               <Route path="transactions" element={<TransactionsPage />} />
               <Route path="brands" element={<BrandsPage />} />
               <Route path="games" element={<GamesPage />} />
               <Route path="public" element={<PublicPage />} />
               <Route path="banners" element={<BannersPage />} />
               <Route path="colors" element={<ColorsPage />} />
               <Route path="audit" element={<AuditPage />} />
               <Route path="audit/:userId" element={<AuditPage />} />
               <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
         </Routes>
      </div>
   );
} export default App;