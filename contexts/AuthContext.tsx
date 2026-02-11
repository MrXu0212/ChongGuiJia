import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, saveSession, clearSession } from '../services/api';

interface User {
    id: string;
    email: string;
    nickname: string;
    avatar_url: string;
    phone: string;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, nickname?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            const data = await authApi.getMe();
            setUser(data.user);
        } catch {
            setUser(null);
            clearSession();
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        const data = await authApi.login(email, password);
        saveSession(data.session);
        localStorage.setItem('isLoggedIn', 'true');
        // 直接加载完整的用户资料，避免设置不完整的临时 user 对象
        await refreshUser();
    };

    const register = async (email: string, password: string, nickname?: string) => {
        const data = await authApi.register(email, password, nickname);
        if (data.session) {
            saveSession(data.session);
            localStorage.setItem('isLoggedIn', 'true');
            await refreshUser();
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            // 即使 API 失败也要清理本地
        }
        clearSession();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isLoggedIn: !!user,
            login,
            register,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth 必须在 AuthProvider 内使用');
    }
    return context;
}

export default AuthContext;
