import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
            const parsedAdmin = JSON.parse(storedAdmin);
            setAdmin(parsedAdmin);
            setupAxiosInterceptors(parsedAdmin.token);
        }
        setLoading(false);
    }, []);

    const setupAxiosInterceptors = (token) => {
        axios.interceptors.request.use(
            config => {
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
    };

    const login = async (username, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, {
            username,
            password
        });
        const userData = res.data;
        setAdmin(userData);
        localStorage.setItem('admin', JSON.stringify(userData));
        setupAxiosInterceptors(userData.token);
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('admin');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
