import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Boxes } from "./components/ui/background-boxes";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Boxes className="fixed inset-0 z-0" />
      <BrowserRouter>
        <Navbar />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

export default App;
