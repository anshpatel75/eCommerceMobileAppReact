import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import CartPage from "./pages/CartPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import OrderHistory from "./pages/OrderHistory";
import OrderPlaced from "./pages/OrderPlaced";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/orders/history" element={<OrderHistory />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-placed" element={<OrderPlaced />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
