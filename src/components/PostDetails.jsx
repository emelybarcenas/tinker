import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiArrowUpBoldOutline } from '@mdi/js';
import Comments from "./Comments";

export default function PostDetails() {
   const { postId } = useParams();
   const [post, setPost] = useState(null);
   const [upvotes, setUpvotes] = useState(0);

   // Fetch the post details
   useEffect(() => {
     const fetchPost = async () => {
       const { data, error } = await supabase
         .from('Post')
         .select('*')
         .eq('id', postId)
         .single();

       if (!error) {
         setPost(data);
         setUpvotes(data.upvotes || 0); // Set initial upvotes if available
       } else {
         console.error('Error fetching post:', error);
       }
     };

     if (postId) fetchPost();
   }, [postId]);

   // Handle upvote
   const handleUpvote = async () => {
     const newUpvotes = upvotes + 1;

     const { error } = await supabase
       .from('Post')
       .update({ upvotes: newUpvotes })
       .eq('id', postId);

     if (!error) {
       setUpvotes(newUpvotes);
     } else {
       console.error('Error updating upvotes:', error);
     }
   };
   
   if (!post) return <div>Loading...</div>;

   return (
    <div className="flex flex-col">
     <div className="flex m-10">
       {post.image_url && (
         <img src={post.image_url} alt={post.title} className="mt-4 w-full max-w-md" />
       )}
       <section className="flex flex-col justify-start text-left m-5">
         <h1 className="text-4xl font-bold">{post.title}</h1>
         <p className="text-sm text-gray-500 italic mt-2">Posted by @{post.username}</p> {/* Use username from Post table */}
         <p className="pt-10">{post.caption}</p>
         <div className="flex justify-start pl-1 items-center mt-4">
           <p>{upvotes}</p>
           <button onClick={handleUpvote} className="cursor-pointer ml-1">
             <Icon path={mdiArrowUpBoldOutline} size={0.8} />
           </button>
         </div>
       </section>
       </div>
       <Comments postId={postId}/>
     </div>
   );
}