"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/evaluate");
        }
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">KashmirAI Eval</Link>
                </div>
            </nav>
            <div className="container page">
                <div style={{ maxWidth: 420, margin: '60px auto' }}>
                    <div className="card">
                        <h2 style={{ marginBottom: 8, fontSize: '1.5rem' }}>Welcome back</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 28 }}>Sign in to continue evaluating</p>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-input" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-input" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}
                                style={{ marginTop: 8 }}>
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                        <p className="text-center mt-4" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Don't have an account? <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
