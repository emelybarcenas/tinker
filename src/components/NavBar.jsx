import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiNotePlusOutline } from '@mdi/js';
import { supabase } from '../supabase';

export default function NavBar({ user }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      window.location.reload(); // reload to reflect logged-out state
    }
  };

  return (
    <nav className="flex justify-between text-black p-5">
      <div className="font-bold text-2xl">
        <Link to="/">Tinker</Link>
      </div>

      <div className="flex items-center gap-10 rounded">
        <div className="flex gap-2">
          {!user ? (
            <>
              <Link to="/sign-up">
                <button className="bg-[#58D59A] p-2 rounded-xl">Sign Up</button>
              </Link>
              <Link to="/log-in">
                <button className="bg-[#ffffff] text-[black] border-[#58D59A] border-2 p-2 rounded-xl">
                  Log In
                </button>
              </Link>
            </>
          ) : (
           <div className='flex justify-center items-center gap-10'>
              <Link to="/create">
                <Icon path={mdiNotePlusOutline} size={1} />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#58D59A] text-black px-3 py-2 rounded-xl"
              >
                Log Out
              </button>
              </div>
          )}
        </div>
      </div>
    </nav>
  );
}
