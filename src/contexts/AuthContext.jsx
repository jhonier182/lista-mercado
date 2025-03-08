import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/authService';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  loginWithGoogle, 
  loginWithFacebook, 
  loginWithGithub 
} from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return loginWithEmail(email, password);
  };

  const register = async (email, password) => {
    return registerWithEmail(email, password);
  };

  const logout = async () => {
    return logoutUser();
  };

  const loginGoogle = async () => {
    return loginWithGoogle();
  };

  const loginFacebook = async () => {
    return loginWithFacebook();
  };

  const loginGithub = async () => {
    return loginWithGithub();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginGoogle,
    loginFacebook,
    loginGithub
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 