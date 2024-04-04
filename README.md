
# Blog Website

A basic CRUD Web application where we can sign up and create blog posts. We can also read and comment on posts made by other users. 



## Tech Stack

**Client:** React, Context API, CSS

**Server:** Node, Express, MongoDB


## Features

- Register and write blogs.
- Read and comment on other blogs.
- The admin of the web application delete posts and can edit & delete comments of each post


## Screenshots

![App Screenshot](https://i.ibb.co/Mf4dNgB/browse-posts.png)

![App Screenshot](https://i.ibb.co/PGH72P1/home.png)

![App Screenshot](https://i.ibb.co/mX8m9G3/login.png)

![App Screenshot](https://i.ibb.co/ys32Bcv/post.png)



## Installation

Prerequisites:Node.js, npm or Yarn, MongoDB (if using a local database)

Setting up a directory for the project 

```bash
  mkdir blog
```

Setting up the server using Express-generator 

```bash
  npm install -g express-generator
  cd vidyalai
  express server
```
now we have the server side setup, lets create the client side

```bash
  cd blog
  mkdir client
  cd client
  npm create vite@latest
```
Select React from the given options and you have both the server side folder and client side folder setup.
## Dependencies

### Client-Side Dependencies
The client side of the application, built using React, uses several important libraries:

- React Ecosystem: `react`, `react-dom`, `react-router-dom`
- Utilities: `axios`
- Development Tools:  `eslint`, `@vitejs/plugin-react`, `vite`
- Scripts: `dev`, `build`, `lint`, `preview`

### Server-Side Dependencies
The server side, powered by Express.js, incorporates:

- Core Framework: `express`, `mongoose`, `jsonwebtoken`, `bcrypt`, `bcryptjs`
- Middleware and Utilities: `cors`, `morgan`, `dotenv` `cookie-parser`, `debug`, `http-errors`
- Scripts: `start`



## Usage/Examples

Below is an example code snippet, where the Post component is responsible for fetching, displaying, and managing a list of posts, including admin-level actions like deleting posts, and navigating to detailed views of each post.

```javascript
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
                const response = await axios.get('http://localhost:3000/posts', {
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
            const response = await axios.delete(`http://localhost:3000/posts/delete-post/${postID}`, {
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

```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET` = hello

`MONGO_URI` = mongodb+srv://user-name:user-name@cluster0.xq01nz7.mongodb.net/database-name?retryWrites=true&w=majority


## Run Locally

Clone the project

```bash
  git clone git@github.com:arunsankarcm/blog2.git
```

Go to the project directory

```bash
  cd blog2
```

Install dependencies

```bash
  npm install
```

Start the server for server-side

```bash
  npm  start
```

Start the server for client-side

```bash
  npm run dev  
```

