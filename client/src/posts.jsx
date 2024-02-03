import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/posts.css';
import { useNavigate } from 'react-router-dom';
import PostsHeader from './postsheader';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from './authcontext';


const Post = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('https://blog3-backend.onrender.com/posts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDeletePost = async (postID, event) => {
        event.stopPropagation();
        if (!isAdmin) {
            alert("You don't have permission to delete this post.");
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`https://blog3-backend.onrender.com//posts/delete-post/${postID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setPosts(posts.filter((post) => post._id !== postID));
            }
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    const handlePostClick = (postID) => {
        navigate(`/posts/${postID}`);
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <PostsHeader />
            <div className="posts-grid">
                {posts.map(post => (
                    <div key={post._id} className="post-card" onClick={() => handlePostClick(post._id)}>
                        <h2>{post.title}</h2>
                        {isAdmin && (
                            <button
                                onClick={(event) => handleDeletePost(post._id, event)}
                                className="delete-button"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

};

export default Post;
