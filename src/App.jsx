import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Support } from './pages/Support';
import { ProductList } from './components/Product/ProductList';
import { CategoryManagement } from './pages/CategoryManagement';
import { StoreManagement } from './pages/StoreManagement';
import { Comparison } from './pages/Comparison';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          
          <Navbar />
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/support" element={<Support />} />
              
              {/* Rutas protegidas */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <ProductList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <PrivateRoute>
                    <CategoryManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/stores"
                element={
                  <PrivateRoute>
                    <StoreManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              
              {/* Redirecciones */}
              <Route path="/comparison"
              element={<Comparison />}
              />
              
              {/* Ruta de fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 