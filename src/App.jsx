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

const deletePost = async (id) => {
  if (window.confirm('Kya aap sure hain ki aap is post ko delete karna chahte hain?')) {
    try {
      localStorage.removeItem(`post:${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
};


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mera Blog
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={20} />
            Naya Post
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Koi post nahi hai
            </h2>
            <p className="text-gray-500 mb-6">
              Apna pehla blog post banaye!
            </p>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Shuru Karein
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          