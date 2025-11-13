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
          {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>
                   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="font-medium text-blue-600">{post.author}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(post)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                   <button
                      onClick={() => deletePost(post.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPost ? 'Post Edit Karein' : 'Naya Post Banayein'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Apne post ka title likhen..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  rows="8"
                  placeholder="Apni kahani likhen..."
                />
              </div>
  <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Aapka naam..."
                />
              </div>

           
            
           