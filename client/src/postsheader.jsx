import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authcontext'; 
import './css/header.css';

const PostsHeader = () => {
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

    return (
        <header className="header">
            <div className="logo">
                <h1>#theBlog</h1>
            </div>
            <nav className="navigation">
                <Link to="/create-post">Create a post</Link>
                <button onClick={handleLogout} className="button-style">Logout</button>
            </nav>
        </header>
    );
};

export default PostsHeader;
