import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          // Verify token with server
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const user = await response.json();
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Invalid token - clear it and set unauthenticated
            console.warn('Token verification failed:', response.status);
            localStorage.removeItem('auth_token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            console.error('Auth verification timed out');
          } else {
            console.error('Auth verification request failed:', fetchError);
          }

          // On network error or timeout, remove token and set unauthenticated
          localStorage.removeItem('auth_token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.user || !data.token) {
        throw new Error('Invalid response from server');
      }

      const { user, token } = data;

      localStorage.setItem('auth_token', token);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Login request timed out. Please try again.');
      }
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.user || !data.token) {
        throw new Error('Invalid response from server');
      }

      const { user, token } = data;

      localStorage.setItem('auth_token', token);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Registration request timed out. Please try again.');
      }
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
