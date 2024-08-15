// src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchedPosts = async () => {
      const url = "http://localhost:3000/view2posts?view=b";
      const response = await fetch(url);
      const json = await response.json();
      console.log('json',json)
      setPosts(json.user.posts);
    }
    fetchedPosts();
  }, []);
  async function handleCommentSubmit(event){
    event.preventDefault();
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries());
    try{
      const response = await fetch('http://localhost:3000/comments',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if(response.ok){
        const getData = await fetch('http://localhost:3000');
        const json = await getData.json();
        if(json.user && json.user.posts){
          setPosts(json.user.posts);
        }

      }
    }catch(e){
      console.error('Error fetching posts:', e.message);
    }
  }
  return (
    <>
      <div id="posts">
        {posts.map((post) => (
          <div key={post.id}>
            <ul>
              <li>Title: {post.title}</li>
              <li>Content: {post.content}</li>
              <form onSubmit={(event)=>handleCommentSubmit(event)}>
                <input type="hidden" name="postId" value={post.id} />
                <label>
                  Name:
                  <input type="text" name="name" required />
                </label>
                <label>
                  Email:
                  <input type="email" name="email" />
                </label>
                <label>
                  Username:
                  <input type="text" name="username" />
                </label>
                <label>
                  Text:
                  <input type="text" name="text" />
                </label>
                <button type="submit">Add Comment</button>
              </form>
              <h3>Comments</h3>
              <ul>
                {post.comments && post.comments.map((comment, index) => (
                  <li key={index}>
                    <div>Username: {comment.username}</div>
                    <div>Text: {comment.text}</div>
                  </li>
                ))}
              </ul>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
