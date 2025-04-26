import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function CreatePost() {
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    image: null,
    caption: ''
  });
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('UserProfiles')
          .select('username')
          .eq('supabase_user_id', user.id) // Use supabase_user_id instead of id
          .single();
        if (error) {
          console.error('Error fetching username:', error);
        } else {
          setUsername(data.username);
        }
      }
    };
    fetchUsername();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') {
        alert('Please upload a valid image file');
        return;
      }
      setPostData((prevData) => ({
        ...prevData,
        image: file
      }));
    }
  };

  const uploadImage = async (file) => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image: ${error.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postData.image) {
      alert('Please upload an image');
      return;
    }

    setLoading(true);
    const imageUrl = await uploadImage(postData.image);
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from('Post').insert([
      {
        title: postData.title,
        caption: postData.caption,
        image_url: imageUrl,
        username: username // 👈 include username here
      }
    ]);

    if (error) {
      console.error('Error creating post:', error);
    } else {
      alert('Post created successfully!');
      setPostData({ title: '', image: null, caption: '' });
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">Create a Post</h2>
        <p className="text-center text-sm text-gray-500 mb-4">Posting as <strong>{username || '...'}</strong></p>
        {loading && <div className="text-center mb-4">Loading...</div>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title:</label>
            <input
              type="text"
              value={postData.title}
              onChange={handleChange}
              name="title"
              id="title"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#58D59A]"
              placeholder="Enter a title"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">Upload Image:</label>
            <div className="flex justify-center items-center">
              <label
                htmlFor="image"
                className="cursor-pointer bg-[#58D59A] hover:bg-[#53a57f] focus:bg-[#48b381] text-white px-4 py-2 rounded shadow transition"
              >
                Choose File
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="caption" className="block text-sm font-medium mb-1">Caption:</label>
            <textarea
              name="caption"
              value={postData.caption}
              onChange={handleChange}
              id="caption"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#58D59A] resize-none"
              placeholder="Write your caption here..."
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#58D59A] hover:bg-[#53a57f] focus:bg-[#48b381] text-white py-2 rounded font-medium"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
