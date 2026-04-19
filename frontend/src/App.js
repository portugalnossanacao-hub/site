import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import useReveal from "./hooks/useReveal";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickQuote from "./components/QuickQuote";
import Services from "./components/Services";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Stable reference to avoid re-creating on every render
const TOAST_OPTIONS = {
  style: {
    background: "#18181b",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fafafa",
  },
};

function PublicSite() {
  useReveal();

  useEffect(() => {
    document.title = "Hardtek · Solutions informatiques rapides et fiables";
  }, []);

  return (
    <div className="App" data-testid="hardtek-app">
      <Header />
      <main>
        <Hero />
        <QuickQuote />
        <Services />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicSite />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={TOAST_OPTIONS}
          />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
