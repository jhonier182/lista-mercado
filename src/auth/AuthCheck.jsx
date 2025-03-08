import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AuthCheck = ({ children, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error('Debes iniciar sesión para acceder a esta funcionalidad');
        navigate(redirectTo);
      } else {
        console.log("Usuario autenticado:", user.uid);
        setAuthChecked(true);
      }
    }
  }, [user, loading, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">Verificando autenticación...</p>
      </div>
    );
  }

  return children;
}; 