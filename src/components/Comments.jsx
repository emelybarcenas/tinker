import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
  
    console.log("Post ID in Comments Component:", postId); // Debugging log
  
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("Comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });
  
      if (!error) {
        setComments(data);
      } else {
        console.error("Error fetching comments:", error);
      }
    };
  
    useEffect(() => {
      fetchComments();
      const fetchCurrentUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          setCurrentUser(user);
        }
      };
  
      fetchCurrentUser();
    }, [postId]);
  
    const handleAddComment = async (e) => {
      e.preventDefault();
  
      if (!newComment.trim()) {
        alert("Comment cannot be empty.");
        return;
      }
  
      if (!currentUser) {
        alert("You must be logged in to comment.");
        return;
      }
  
      const { data: profile, error: profileError } = await supabase
        .from("UserProfiles")
        .select("username")
        .eq("supabase_user_id", currentUser.id)
        .single();
  
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        return;
      }
  
      console.log("Post ID before inserting comment:", postId); // Debugging log
  
      const { error } = await supabase
        .from("Comments")
        .insert({
          post_id: postId, // Ensure this is included
          user_id: currentUser.id,
          username: profile.username,
          content: newComment,
        });
  
      if (!error) {
        setNewComment("");
        fetchComments(); // Refetch comments after adding a new one
      } else {
        console.error("Error adding comment:", error);
      }
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
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
  
        {/* Comment Form */}
        {currentUser ? (
            <form onSubmit={handleAddComment} className="mb-4">
  <textarea
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    placeholder="Write a comment..."
    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#58D59A]"
    rows="3"
  />
  <div className="flex justify-end mt-[-53px] mr-[10px]">
    <button
      type="submit"
      className="bg-[#58D59A] hover:bg-[#53a57f] text-white text-sm py-2 px-4 rounded"
    >
      Submit
    </button>
  </div>
</form>
        ) : (
          <p className="text-gray-500">You must be logged in to comment.</p>
        )}
  
        {/* Comments List */}
        <div className="w-full space-y-4 mt-10">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-300 pb-2">
           <div className="flex items-center gap-1">
            <p className="text-md text-gray-600 text-left">@{comment.username} • </p>
            <p className="text-sm text-gray-400 text-left">{timeAgo(comment.created_at)}</p>
           </div>
            <p className="text-left">{comment.content}</p>
           
          </div>
        ))}
      </div>
      </div>
    );
  }