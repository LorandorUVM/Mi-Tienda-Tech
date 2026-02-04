import { createContext, useState, useEffect } from 'react';
import clienteAxios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Aquí podrías hacer una petición al backend para validar el token
                // Por ahora, simularemos que recuperamos el usuario del localStorage
                const savedUser = JSON.parse(localStorage.getItem('user'));
                setUser(savedUser);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await clienteAxios.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};