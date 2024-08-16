

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [updatedCommentText, setUpdatedCommentText] = useState('');
  const [updatedUsername, setUpdatedUsername] = useState('');


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
  const handlePostSubmit = async(event) => {
    event.preventDefault();

    const {title,content} = event.target;
    const postData = {
      title: title.value,
      content: content.value,
    };

    const response = await fetch('http://localhost:3000/view2/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    if(response.ok){
      const updatedPosts = await fetch('http://localhost:3000/view2posts?view=b');
      const json = await updatedPosts.json();
      setPosts(json.user.posts);
    }
  }

  const handleDeleteComment = async(commentId)=>{
    const url = 'http://localhost:3000/view2/comments/' + 'delete/' + commentId
    console.log('url',url)
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
    });
    console.log('res',response)
    if(response.ok){
      const updatedPosts = await fetch('http://localhost:3000/view2posts?view=b');
      const json = await updatedPosts.json();
      setPosts(json.user.posts);
    }
  }
  const handleTogglePublish = async (postId)=>{
    const url = 'http://localhost:3000/post/' + postId + '/toggle'
      const response = await fetch(`http://localhost:3000/post/${postId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
    });

    console.log('response',response)
      if(response.ok){
        const updatedPosts = await fetch('http://localhost:3000/view2posts?view=b');
        const json = await updatedPosts.json();
        setPosts(json.user.posts);
      }
  }
  async function handleEditComment(e,postId,commentId){
    event.preventDefault();
    // const formData = new FormData(event.target)
    // console.log('event target',event.target)
    // const data = Object.fromEntries(formData.entries());
    const url = 'http://localhost:3000/view2/comments/edit/' + postId + '/' + commentId;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text:updatedCommentText,username:updatedUsername})
    });
    if(response.ok){
        const updatedPosts = await fetch('http://localhost:3000/view2posts?view=b');
        const json = await updatedPosts.json();
        setPosts(json.user.posts);
        setEditingCommentId(null);

    }
  }
  const handleCommentTextChange = (e) => {
    setUpdatedCommentText(e.target.value);
  };
  const handleUsernameChange = (e) => {
    setUpdatedUsername(e.target.value);
  };

  const handleToggleEdit = (commentId, text,username) => {
    if (editingCommentId === commentId) {
      setEditingCommentId(null); // Exit edit mode
    } else {
      setEditingCommentId(commentId); // Enter edit mode
      setUpdatedCommentText(text); // Set current text in input field
      setUpdatedUsername(username)
    }
  };
  async function handleCommentSubmit(event){
    event.preventDefault();
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries());
    try{
      const response = await fetch('http://localhost:3000/view2/comments',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if(response.ok){
        const getData = await fetch('http://localhost:3000/view2posts?view=b');
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
      <form onSubmit={handlePostSubmit}>

       <h3>Create Post:</h3>

      <label>Enter a title here:
        <input type="text" name="title" id="title" />

      </label>
      <label>Enter content:
      <input type="text" name="content" id="content"/>

      </label>
      <input type="submit" />
      </form>
      <div id="posts">

        {posts.map((post) => (
          <div key={post.id}>
            <ul>
              <li>Title: {post.title}</li>
              <li>Content: {post.content}</li>
              <li>Published: {post.published?'Yes':'No'}</li>
              <li><button onClick={() => handleTogglePublish(post.id)}>Publish</button></li>
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
                    {editingCommentId === comment.id ? (
                      <form onSubmit={(e) => handleEditComment(e, post.id, comment.id,comment.username)}>
                        <input
                          type="text"
                          value={updatedCommentText}
                          onChange={handleCommentTextChange}
                        />
                        <input
                          type="text"
                          value={updatedUsername}
                          onChange={handleUsernameChange}
                        />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => handleToggleEdit(comment.id, comment.text,comment.username)}>Cancel</button>
                      </form>
                    ) : (
                      <>
                        <div>Username: {comment.username}</div>
                        <div>Text: {comment.text}</div>
                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                        <button onClick={() => handleToggleEdit(comment.id, comment.text,comment.username)}>Edit</button>
                      </>
                    )}
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
