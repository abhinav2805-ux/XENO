'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

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
      setError("Unexpected error during sign in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 py-12">
      <Card className="w-full max-w-md shadow-xl border border-slate-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-800">Sign In</CardTitle>
            <Badge variant="outline" className="text-slate-600 bg-slate-50">Welcome Back</Badge>
          </div>
          <div className="text-slate-500 text-sm mt-2">Sign in to your account to access the dashboard.</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <LogIn className="h-4 w-4" /> Sign In
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
            <span className="text-slate-600">Don't have an account? </span>
            <Link href="/signup" className="text-blue-600 underline inline-flex items-center gap-1">
              Sign Up <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}