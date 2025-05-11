'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";

export default function SignUp() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } else {
      const data = await res.json();
      setError(data.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 py-12">
      <Card className="w-full max-w-md shadow-xl border border-slate-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-800">Sign Up</CardTitle>
            <Badge variant="outline" className="text-slate-600 bg-slate-50">New User</Badge>
          </div>
          <div className="text-slate-500 text-sm mt-2">Create your account to access the dashboard.</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <CheckCircle className="h-4 w-4" /> Sign Up
            </Button>
           <Button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-300 mt-1 cursor-pointer"
          >
            <img src="/google-icon.jpeg" alt="Google logo" className="h-5 w-5" />
            Sign in with Google
          </Button>

            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
           <Link href="/signin" className="text-blue-600 underline inline-flex items-center gap-1">
  Sign In <ArrowRight className="h-4 w-4" />
</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}