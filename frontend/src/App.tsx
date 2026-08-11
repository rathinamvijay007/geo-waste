import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import ToastContainer from './components/common/Toast';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const WasteGuidePage = lazy(() => import('./pages/WasteGuidePage'));
const CenterDetailsPage = lazy(() => import('./pages/CenterDetailsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const UserReviewsPage = lazy(() => import('./pages/UserReviewsPage'));
const UserReportsPage = lazy(() => import('./pages/UserReportsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCenters = lazy(() => import('./pages/admin/AdminCenters'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner text="Loading page..." size="lg" />
    </div>
  );
}

function MainAppShell() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[#06170d] text-[#edf7ee]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/waste-guide" element={<WasteGuidePage />} />
            <Route path="/waste-guide/:category" element={<WasteGuidePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/impact" element={<ImpactPage />} />

            {/* Dedicated User Feature Routes */}
            <Route path="/center/:id" element={<CenterDetailsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/reviews" element={<UserReviewsPage />} />
            <Route path="/reports" element={<UserReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Dedicated Admin Portal Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/centers" element={<AdminCenters />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <FavoritesProvider>
            <MainAppShell />
          </FavoritesProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
