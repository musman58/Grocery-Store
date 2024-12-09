import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
          } else {
            console.warn('Stored user data is not a valid object, resetting...');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    if (userData && typeof userData === 'object') {
      setUser(userData);
      try {
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Error storing user data:', error);
      }
    } else {
      console.error('Invalid user data provided to login function');
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

