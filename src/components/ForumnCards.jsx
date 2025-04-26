import Icon from '@mdi/react';
import { mdiArrowUpBoldOutline, mdiSquareEditOutline } from '@mdi/js';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

export default function ForumnCards({ title, caption, imageURL, postId, createdAt }) {
  const [upvotes, setUpvotes] = useState(0);
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(''); // Logged-in user's username

  useEffect(() => {
    const fetchPostData = async () => {
      const { data, error } = await supabase
        .from('Post')
        .select('upvotes, username') // Fetch both upvotes and username
        .eq('id', postId)
        .single();

      if (!error && data) {
        setUpvotes(data.upvotes || 0);
        setUsername(data.username || '');
      } else {
        console.error('Error fetching post:', error);
      }
    };

    const fetchCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        const { data: profile, error: profileError } = await supabase
          .from('UserProfiles')
          .select('username')
          .eq('supabase_user_id', user.id)
          .single();

        if (!profileError && profile) {
          setCurrentUser(profile.username);
        } else {
          console.error('Error fetching current user profile:', profileError);
        }
      }
    };

    if (postId) fetchPostData();
    fetchCurrentUser();
  }, [postId]);

  const handleUpvote = async (e) => {
    e.stopPropagation();
    const newUpvotes = upvotes + 1;

    const { error } = await supabase
      .from('Post')
      .update({ upvotes: newUpvotes })
      .eq('id', postId);

    if (!error) setUpvotes(newUpvotes);
  };

  const timeAgo = (timestamp) => {
    const postTime = new Date(timestamp);
    if (isNaN(postTime)) return 'Invalid date';

    const now = new Date();
    const seconds = Math.floor((now - postTime) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
    }

    return 'Just now';
  };

  return (
    <div className="relative border-2 border-gray-300 rounded-xl flex justify-start items-center p-4 w-full md:w-96 lg:w-2/5 transition-transform duration-300 hover:scale-105 bg-white h-64 group">
    {/* Show Edit Post link only if the logged-in user is the post owner */}
    {currentUser === username && (
      <Link
        to={`edit-post/${postId}`}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <Icon path={mdiSquareEditOutline} size={1} />
      </Link>
    )}
    <div className="aspect-square w-32 flex-shrink-0">
      <img 
        src={imageURL} 
        alt={title} 
        className="object-cover w-full h-full rounded" 
      />
    </div>
  
    <div className="flex flex-col text-black p-3 w-full overflow-hidden">
      <Link to={`/post/${postId}`} className="font-bold text-left p-1 hover:underline flex-wrap">
        <h1>{title}</h1>
      </Link>
  
      {username && (
        <p className="text-sm text-gray-600 italic text-left truncate"> @{username}</p>
      )}
  
      <p className="text-left text-sm p-1 line-clamp-3 overflow-hidden text-ellipsis">
        {caption}
      </p>
  
      <div className="flex justify-start pl-1 items-center">
        <p>{upvotes}</p>
        <button onClick={handleUpvote} className="cursor-pointer ml-1">
          <Icon path={mdiArrowUpBoldOutline} size={0.8} />
        </button>
        <p className="text-xs text-gray-500 truncate pl-3">{timeAgo(createdAt)}</p>
      </div>
    </div>
  </div>
  );
}