'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      if (res.ok) {
        // After successful signup, sign in
        const result = await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        
        if (result?.ok) {
          router.push('/dashboard');
          router.refresh();
        }
      } else {
        const data = await res.json();
        alert("Signup failed: " + data.message);
      }
    } catch (error) {
      alert("An error occurred during signup");
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Username"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">Sign Up</button>
      </form>
      <div className="text-center mt-4">
        Or sign up with:
        <button 
          onClick={handleGoogleSignIn}
          className="ml-2 bg-blue-600 px-3 py-1 text-white rounded"
        >
          Google
        </button>
      </div>
    </div>
  );
}
