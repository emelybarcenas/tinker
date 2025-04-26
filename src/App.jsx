import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabase';
import Home from './components/Home';
import './App.css';
import NavBar from './components/NavBar';
import CreatePost from './components/CreatePost';
import PostDetails from './components/PostDetails';
import Login from './components/Login';
import Signup from './components/SignUp';
import EditPost from './components/EditPost';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><NavBar user={user} /><Home /></>} />
        <Route path="/create" element={<><NavBar user={user} /><CreatePost /></>} />
        <Route path="/post/:postId" element={<><NavBar user={user} /><PostDetails /></>} />
        <Route path="/log-in" element={<><NavBar user={user} /><Login /></>} />
        <Route path="/sign-up" element={<><NavBar user={user} /><Signup /></>} />
        <Route path="/edit-post/:postId" element={<><NavBar user={user} /><EditPost /></>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
