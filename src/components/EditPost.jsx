import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function EditPost() {
  const { postId } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // For navigation after editing
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    image: null,
    caption: '',
    image_url: '', // To store the existing image URL
  });

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('Post')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPostData({
          title: data.title,
          caption: data.caption,
          image_url: data.image_url, // Pre-fill the existing image URL
        });
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
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
        image: file,
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
    setLoading(true);

    let imageUrl = postData.image_url; // Use the existing image URL by default

    // If a new image is uploaded, replace the existing one
    if (postData.image) {
      imageUrl = await uploadImage(postData.image);
      if (!imageUrl) {
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from('Post')
      .update({
        title: postData.title,
        caption: postData.caption,
        image_url: imageUrl,
      })
      .eq('id', postId);

    if (error) {
      console.error('Error updating post:', error);
      alert('Failed to update the post.');
    } else {
      alert('Post updated successfully!');
      navigate(`/post/${postId}`); // Redirect to the post details page
    }

    setLoading(false);
  };


  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      const { error } = await supabase
        .from('Post')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete the post.');
      } else {
        alert('Post deleted successfully!');
        navigate('/'); // Redirect to the homepage after deletion
      }
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">Edit Post</h2>
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
            {postData.image_url && (
              <p className="text-sm text-gray-500 mt-2">Current Image: <a href={postData.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a></p>
            )}
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
            Update Post
          </button>
          <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-medium"
            >
              Delete Post
            </button>
        </form>
      </div>
    </div>
  );
}