import { useState } from 'react';
import { supabase } from '../supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
  
    // Sign up the user with email and password
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
  
    const userId = data?.user?.id; // This is the UUID
  
    if (userId) {
      // Insert into the UserProfiles table, using supabase_user_id to store the UUID
      const { error: profileError } = await supabase.from('UserProfiles').insert([
        { username, supabase_user_id: userId } // Store the UUID in the supabase_user_id column
      ]);
  
      if (profileError) {
        setError(profileError.message);
        return;
      }
  
      alert('Sign up successful. Please check your email for confirmation.');
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="bg-[#58D59A] text-white p-2 rounded">
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
