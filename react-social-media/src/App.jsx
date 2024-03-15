import React, { useState } from 'react';
import './App.css'; // Import the CSS file for styling

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentTexts, setNewCommentTexts] = useState({});
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const handlePostSubmit = (event) => {
    event.preventDefault();
    if (newPostContent.trim() !== '') {
      const newPost = {
        id: posts.length + 1,
        username: loggedIn ? registerUsername : 'Anonymous',
        content: newPostContent,
        likes: 0,
        comments: []
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleCommentSubmit = (postId, event) => {
    event.preventDefault();
    const postIndex = posts.findIndex(post => post.id === postId);
    const commentText = newCommentTexts[postId];
    if (postIndex !== -1 && commentText && commentText.trim() !== '') {
      const updatedPosts = [...posts];
      updatedPosts[postIndex].comments.push({
        id: updatedPosts[postIndex].comments.length + 1,
        username: loggedIn ? registerUsername : 'Anonymous',
        text: commentText
      });
      setPosts(updatedPosts);
      setNewCommentTexts({ ...newCommentTexts, [postId]: '' });
    }
  };

  const handleCommentInputChange = (postId, event) => {
    const { value } = event.target;
    setNewCommentTexts({ ...newCommentTexts, [postId]: value });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const userExists = registeredUsers.some(user => user.username === registerUsername);
    if (userExists) {
      alert('Username already exists. Please choose a different username.');
    } else {
      setRegisteredUsers([...registeredUsers, { username: registerUsername, password: registerPassword }]);
      alert('Registration successful. You can now login.');
      setLoggedIn(true);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const user = registeredUsers.find(user => user.username === loginUsername && user.password === loginPassword);
    if (user) {
      setLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setLoginUsername('');
    setLoginPassword('');
    setRegisterUsername('');
    setRegisterPassword('');
    setPosts([]);
  };

  return (
    <div className="container">
      {loggedIn && <button onClick={handleLogout}>Logout</button>}
      {loggedIn ? (
        <div className="main-content">
          <div className="post-form">
            <form onSubmit={handlePostSubmit}>
              <textarea
                placeholder="Write your post..."
                value={newPostContent}
                onChange={(event) => setNewPostContent(event.target.value)}
                rows={4}
                cols={50}
              />
              <button type="submit">Post</button>
            </form>
          </div>
          <div className="posts-container">
            {posts.map(post => (
              <div key={post.id} className="post">
                <div className="post-header">
                  <span className="username">{post.username}</span>
                  <button onClick={() => handleLike(post.id)}>Like</button>
                </div>
                <div className="post-content">{post.content}</div>
                <div className="post-stats">
                  <span className="likes">Likes: {post.likes}</span>
                  <span className="comments">Comments: {post.comments.length}</span>
                </div>
                <div className="comments-section">
                  <ul>
                    {post.comments.map(comment => (
                      <li key={comment.id}>
                        <span className="comment-username">{comment.username}:</span> {comment.text}
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={(event) => handleCommentSubmit(post.id, event)}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newCommentTexts[post.id] || ''}
                      onChange={(event) => handleCommentInputChange(post.id, event)}
                    />
                    <button type="submit">Comment</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="auth-form">
          <div className="register-form">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button type="submit">Register</button>
            </form>
          </div>
          <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
