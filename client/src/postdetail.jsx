import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import './css/postdetail.css';
import { useAuth } from './authcontext';

const PostDetails = () => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { postID } = useParams();
    const { isAdmin } = useAuth(); 
    const [editCommentId, setEditCommentId] = useState(null); 
    const [editedComment, setEditedComment] = useState(""); 

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const postResponse = await axios.get(`https://blog-backend2-m3a3.onrender.com//posts/${postID}`, config);
                setPost(postResponse.data);

                const commentsResponse = await axios.get(`https://blog-backend2-m3a3.onrender.com//posts/${postID}/comments`, config);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [postID]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `https://blog-backend2-m3a3.onrender.com//posts/${postID}/add-comment`,
                { message: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (commentID) => {
        if (!isAdmin) {
            console.log('You are not authorized to delete this comment.');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`https://blog-backend2-m3a3.onrender.com//posts/${postID}/${commentID}/delete-comment`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(comments.filter((comment) => comment._id !== commentID));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditComment = (comment) => {
        setEditCommentId(comment._id);
        setEditedComment(comment.message);
    };

   const handleSaveEditedComment = async () => {
    if (!editCommentId) return;

    try {
        const token = localStorage.getItem('authToken');
        await axios.patch(`https://blog-backend2-m3a3.onrender.com//posts/${postID}/${editCommentId}/edit-comment`,
            { message: editedComment },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(comments.map(comment => comment._id === editCommentId ? { ...comment, message: editedComment } : comment));
        setEditCommentId(null); 
        setEditedComment(""); 
    } catch (error) {
        console.error('Error saving edited comment:', error);
    }
};

    if (!post) {
        return <div>Loading...</div>;
    }


    return (
        <div className="post-detail-container">
            <div className="post-content">
                <h1>{post.title}</h1>
                <p>{post.content}</p>
            </div>
            <div className="comments-section">
                <h3>Comments:</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id} className="comment">
                            {editCommentId === comment._id ? (
                                <input
                                    type="text"
                                    value={editedComment}
                                    onChange={(e) => setEditedComment(e.target.value)}
                                />
                            ) : (
                                comment.message
                            )}
                            {isAdmin && (
                                <div className="comment-actions">
                                    {editCommentId !== comment._id && (
                                        <FaEdit
                                            className="icon"
                                            onClick={() => handleEditComment(comment)}
                                        />
                                    )}
                                    {editCommentId === comment._id && (
                                        <button onClick={handleSaveEditedComment}>Save</button>
                                    )}
                                    <FaTrashAlt
                                        className="icon"
                                        onClick={() => handleDeleteComment(comment._id)}
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <form className="add-comment-form" onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button type="submit">Submit Comment</button>
                </form>
            </div>
        </div>
    );
};

export default PostDetails;
