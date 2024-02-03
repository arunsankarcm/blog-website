import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login'; 
import Signup from './signup'; 
import HomePage from './homepage'; 
import { AuthProvider } from './authcontext';
import Post from './posts'; 
import PostDetails from './postdetail'; 
import ProtectedRoute from './protectedroute';
import CreatePost from './createpost'; 



const App = () => {
  return (
   <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:postID"
            element={
              <ProtectedRoute>
                <PostDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
            />
      </Routes>
    </Router>
   </AuthProvider>
  );
};

export default App;
