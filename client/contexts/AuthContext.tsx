import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, authRequest, ApiError, ApiTimeoutError, ApiNetworkError } from '@/lib/api';
import { authNotify } from '@/lib/notifications';

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

        try {
          // Verify token with server using reliable API
          const user = await authRequest('/api/auth/verify', {
            timeout: 10000,
            retries: 2, // Reduced retries for auth verification
          });

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Handle different types of errors appropriately
          if (error instanceof ApiError && error.status === 401) {
            console.warn('Token verification failed: invalid token');
          } else if (error instanceof ApiTimeoutError) {
            console.error('Auth verification timed out');
          } else if (error instanceof ApiNetworkError) {
            console.error('Network error during auth verification');
          } else {
            console.error('Auth verification failed:', error);
          }

          // Check if this might be a demo user token and allow offline mode
          const storedToken = localStorage.getItem('auth_token');
          if (storedToken && this.isDemoUserToken(storedToken)) {
            // Allow demo user to work offline
            setAuthState({
              user: {
                id: 'demo-user-123',
                name: 'Demo User',
                email: 'demo@aiscraper.com'
              },
              isAuthenticated: true,
              isLoading: false,
            });
            console.info('Running in offline mode for demo user');
          } else {
            // On any error, remove token and set unauthenticated
            localStorage.removeItem('auth_token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
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
    try {
      const data = await api.post('/api/auth/login', { email, password }, {
        timeout: 15000,
        retries: 2,
      });

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

      // Show welcome notification on successful login
      authNotify.loginSuccess();
    } catch (error) {
      if (error instanceof ApiTimeoutError) {
        throw new Error('Login request timed out. Please try again.');
      } else if (error instanceof ApiNetworkError) {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error instanceof ApiError) {
        throw new Error(error.message);
      } else {
        console.error('Login error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await api.post('/api/auth/register', { name, email, password }, {
        timeout: 15000,
        retries: 2,
      });

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

      // Show welcome notification on successful registration
      authNotify.registrationSuccess();
    } catch (error) {
      if (error instanceof ApiTimeoutError) {
        throw new Error('Registration request timed out. Please try again.');
      } else if (error instanceof ApiNetworkError) {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error instanceof ApiError) {
        throw new Error(error.message);
      } else {
        console.error('Registration error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Show logout notification
    authNotify.logoutSuccess();
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
