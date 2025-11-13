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

  