import React, { useState } from 'react';
import axios from 'axios'; 
import { useAuth } from './authcontext';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://blog-backend2-m3a3.onrender.com//users/login', { username, password });
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('isAdmin', response.data.isAdmin);
            login(response.data.token, response.data.isAdmin);
            navigate('/posts');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Incorrect username or password.');
                } else {
                    console.error('Login error:', error);
                }
            } else {
                console.error('Login error:', error);
            }
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
