import React, { createContext, useContext, useState, useEffect} from 'react';
import type { User } from '../auth.types';
import { authApi } from '@/api/auth.api';


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize auth on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    try {
                        const userInfo = await authApi.getCurrentUser();
                        setUser(userInfo);
                        setIsAuthenticated(true);
                    } catch (error) {
                        // Token không hợp lệ, clear storage
                        console.error('Token validation failed:', error);
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        setIsAuthenticated(false);
                    }
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const logout = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                await authApi.logout(token);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const getCurrentUser = async () => {
        try {
            const userInfo = await authApi.getCurrentUser();
            setUser(userInfo);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            console.error('Failed to get current user:', error);
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                logout,
                getCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
