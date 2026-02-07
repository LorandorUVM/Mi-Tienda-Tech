import { createContext, useState, useEffect } from 'react';
import clienteAxios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            
            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
                // Configurar el token globalmente en Axios al cargar la app
                clienteAxios.defaults.headers.common['x-auth-token'] = token;
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await clienteAxios.post('/auth/login', { email, password });
        
        const { token, user } = res.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configurar el token globalmente para futuras peticiones
        clienteAxios.defaults.headers.common['x-auth-token'] = token;
        
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete clienteAxios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};