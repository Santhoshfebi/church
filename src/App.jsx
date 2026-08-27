import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import PrayerRequestsPage from "./pages/admin/PrayerRequestsPage";
import ContactMessagesPage from "./pages/admin/ContactMessagesPage";
import MinistriesManagementPage from "./pages/admin/MinistriesManagementPage";
import SermonsManagementPage from "./pages/admin/SermonsManagementPage";
import EventsManagementPage from "./pages/admin/EventsManagementPage";
import BooksManagementPage from "./pages/admin/BooksManagementPage";
import ChurchSettingsPage from "./pages/admin/ChurchSettingsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<HomePage />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* PRAYER REQUESTS */}
        <Route
          path="/admin/prayers"
          element={
            <ProtectedRoute>
              <PrayerRequestsPage />
            </ProtectedRoute>
          }
        />

        {/* CONTACT MESSAGES */}
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <ContactMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ministries"
          element={
            <ProtectedRoute>
              <MinistriesManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sermons"
          element={
            <ProtectedRoute>
              <SermonsManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <EventsManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute>
              <BooksManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <ChurchSettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
