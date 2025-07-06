import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/blogs')
      .then(response => setBlogs(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const addBlog = () => {
    if (editId) {
      axios.put(`http://localhost:5000/blogs/${editId}`, { title, content })
        .then(response => {
          setBlogs(blogs.map(blog => blog._id === editId ? response.data : blog));
          setEditId(null);
          setTitle('');
          setContent('');
        })
        .catch(error => console.error('Error updating blog:', error));
    } else {
      axios.post('http://localhost:5000/blogs', { title, content })
        .then(response => setBlogs([...blogs, response.data]))
        .catch(error => console.error('Error adding blog:', error));
    }
  };

  const editBlog = (id, blogTitle, blogContent) => {
    setEditId(id);
    setTitle(blogTitle);
    setContent(blogContent);
  };

  const deleteBlog = id => {
    axios.delete(`http://localhost:5000/blogs/${id}`)
      .then(() => setBlogs(blogs.filter(blog => blog._id !== id)))
      .catch(error => console.error('Error deleting blog:', error));
  };

  return (
    <div className="App">
      <h1>Micro Blogging Application</h1>
      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button onClick={addBlog}>
        {editId ? 'Update Blog' : 'Add Blog'}
      </button>
      <ul>
        {blogs.map(blog => (
          <li key={blog._id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <button onClick={() => editBlog(blog._id, blog.title, blog.content)}>Edit</button>
            <button onClick={() => deleteBlog(blog._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;   