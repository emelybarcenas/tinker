
import Icon from '@mdi/react';
import { mdiMagnify, mdiAccount , mdiNotePlusOutline } from '@mdi/js';
import ForumnCards from "./ForumnCards";
import {useState, useEffect} from 'react'
import { supabase } from '../supabase';

export default function Home(){
    
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
const [sortBy, setSortBy] = useState('combined');

  useEffect(()=>{
    const fetchPosts = async () => {

      const {data, error} = await supabase
      .from('Post')
      .select('*')

      if (error) {
        console.error('Error fetching posts:', error)
      } else{
        setPosts(data)
      }

      setLoading(false)
    
    }
    
    fetchPosts()

},[])

const filteredPosts = posts
  .filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.caption.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    } else if (sortBy === 'recent') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'combined') {
      // First sort by upvotes, then by recency
      if (b.upvotes === a.upvotes) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return b.upvotes - a.upvotes;
    }
    return 0;
  });

  
  if (loading) return <p>Posts Loading...</p>
  return(
    <div className="">

    <h1 className=" mb-5 text-4xl font-bold text-center">Where creativity meets tech.</h1>

{/*Search Input */}
 <div className="flex items-center justify-center">
  <div className="relative w-full max-w-md">
    <input
      type="search"
      placeholder="Search..."
      id="site-search"
      value={searchTerm}
      onChange={(e)=>setSearchTerm(e.target.value)}
      className="w-full bg-gray-300 pr-10 pl-5 py-2 mb-10 rounded-xl"
    />
    <button className="absolute right-3 -translate-y-1/2 mt-2 text-gray-600">
      <Icon path={mdiMagnify} size={1} />
    </button>
  </div>
</div>

{/*Sort By: */}
<div className="flex justify-center items-center gap-4 mb-10 overflow-visible">
<h1>Sort By:</h1>
<button className="bg-[#58D59A] hover:bg-[#53a57f] focus:bg-[#48b381]  px-2 py-1 rounded"
onClick={()=> setSortBy('upvotes')} >Upvotes</button>
<button className="bg-[#58D59A] hover:bg-[#53a57f] focus:bg-[#48b381] px-2 py-1  rounded"
onClick={(()=>setSortBy('recent'))}
>Recent</button>
</div>

{/*Posts Filtered*/}
  <div className="flex flex-wrap justify-center gap-10">
  {filteredPosts.map((post) => (
    <ForumnCards 
    key={post.id}
    title={post.title}
    caption={post.caption}
    imageURL={post.image_url}
    postId={post.id}
    createdAt={post.created_at}

    />
  ))}

  </div>
 
</div>
    )
}