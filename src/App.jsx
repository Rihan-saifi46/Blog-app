import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, Save } from 'lucide-react';

export default function BlogWebsite() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

const loadPosts = async () => {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('post:'));
    const loadedPosts = keys.map(key => JSON.parse(localStorage.getItem(key)));
    setPosts(loadedPosts.sort((a, b) => b.id - a.id));
  } catch (error) {
    console.log('No posts yet');
  }
};


  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author
      });
    } else {
      setEditingPost(null);
      setFormData({ title: '', content: '', author: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', author: '' });
  };

 const handleSubmit = async () => {
  if (!formData.title || !formData.content || !formData.author) {
    alert('Sabhi fields zaruri hain!');
    return;
  }

  try {
    if (editingPost) {
      const updatedPost = {
        ...editingPost,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`post:${updatedPost.id}`, JSON.stringify(updatedPost));
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    } else {
      const newPost = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`post:${newPost.id}`, JSON.stringify(newPost));
      setPosts([newPost, ...posts]);
    }
    closeModal();
  } catch (error) {
    console.error('Error saving post:', error);
    alert('Post save karne mein error aaya!');
  }
};


