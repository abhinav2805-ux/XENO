'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

const handleSubmit = async (e: any) => {
  e.preventDefault();
  setError("");

  try {
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    console.log("signIn response", res);

    if (!res) {
      setError("No response from server. Check backend or credentials.");
      return;
    }

    if (res.ok && res.url) {
      router.push(res.url);
    } else {
      setError("Invalid credentials");
    }
  } catch (err) {
    console.error("SignIn error:", err);
    setError("Unexpected error during sign in.");
  }
};




  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign In</button>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-red-500 text-white py-2 rounded mt-2"
        >
          Sign in with Google
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
      <div className="mt-4 text-center">
        <a href="/signup" className="text-blue-600 underline">Don't have an account? Sign Up</a>
      </div>
    </div>
  );
}