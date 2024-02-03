import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const adminStatus = localStorage.getItem('isAdmin') === 'true'; 
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(adminStatus); 
        }
    }, []);

    const login = (token, adminStatus) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('isAdmin', adminStatus); 
        setIsLoggedIn(true);
        setIsAdmin(adminStatus); 
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAdmin'); 
        setIsLoggedIn(false);
        setIsAdmin(false); 
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
