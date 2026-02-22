"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function GuidePage() {
    const [profile, setProfile] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
                setProfile(prof);
            }
        }
        init();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">KashmirAI Eval</Link>
                    <div className="navbar-links">
                        {profile && <Link href="/evaluate">Evaluate</Link>}
                        {profile && <Link href="/progress">My Progress</Link>}
                        {profile?.role === "admin" && <Link href="/admin">Admin</Link>}
                        {profile ? <button onClick={handleLogout}>Logout</button> : <Link href="/login" className="btn btn-primary" style={{ padding: "8px 16px" }}>Login</Link>}
                    </div>
                </div>
            </nav>

            <div className="container page" style={{ maxWidth: 800 }}>
                <div className="page-header" style={{ textAlign: "center", marginBottom: 40 }}>
                    <h1 style={{ fontSize: "2.5rem", marginBottom: 16 }}>Evaluator Guide</h1>
                    <p style={{ fontSize: "1.1rem" }}>How to rate the machine translation outputs correctly.</p>
                </div>

                <div className="card" style={{ padding: 40, marginBottom: 32 }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: 16, color: "var(--accent)" }}>1. What are we doing?</h2>
                    <p style={{ lineHeight: 1.7, color: "var(--text-medium)" }}>
                        You will be shown an original <strong>Source Sentence in Kashmiri</strong>, accompanied by a <strong>Reference Translation in English</strong> to clarify the exact intended meaning.
                        <br /><br />
                        Below that, you will see two translations produced by two different AI models (<strong>System A</strong> and <strong>System B</strong>). Your job is to rate each system based on two main criteria: <strong>Adequacy</strong> and <strong>Fluency</strong>. Finally, you will choose an overall preference.
                    </p>
                </div>

                <div className="card" style={{ padding: 40, marginBottom: 32 }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: 16, color: "var(--accent)" }}>2. Rating Criteria</h2>

                    <div style={{ marginBottom: 32 }}>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>🎯 Adequacy (1 to 5)</h3>
                        <p style={{ lineHeight: 1.7, color: "var(--text-medium)", marginBottom: 16 }}>
                            <em>"How much of the meaning from the original source sentence is preserved in the translation?"</em> Ignore minor grammatical mistakes here; focus only on meaning.
                        </p>
                        <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>5 - All Meaning:</strong> All meaning is preserved accurately.</li>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>4 - Most Meaning:</strong> Almost all meaning is preserved.</li>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>3 - Much Meaning:</strong> The core idea is preserved, but some details are lost.</li>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>2 - Little Meaning:</strong> Only small fragments of the meaning are present.</li>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>1 - None:</strong> Completely broken meaning or entirely unrelated.</li>
                        </ul>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 32 }}>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>🗣️ Fluency (1 to 5)</h3>
                        <p style={{ lineHeight: 1.7, color: "var(--text-medium)", marginBottom: 16 }}>
                            <em>"How natural and grammatically correct does the Kashmiri translation sound?"</em> Ignore the original meaning here; focus only on how good the Kashmiri sentence is on its own.
                        </p>
                        <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>5 - Flawless:</strong> Perfect, native-sounding sentence.</li>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>4 - Good:</strong> Natural, with maybe one very minor phrasing issue.</li>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>3 - Non-native:</strong> Understandable, but sounds clunky or strange.</li>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>2 - Disfluent:</strong> Grammatically broken, hard to read smoothly.</li>
                            <li style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8 }}><strong>1 - Incomprehensible:</strong> Complete gibberish or unreadable.</li>
                        </ul>
                    </div>
                </div>

                <div className="card" style={{ padding: 40, marginBottom: 40 }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: 16, color: "var(--accent)" }}>3. Overall Preference</h2>
                    <p style={{ lineHeight: 1.7, color: "var(--text-medium)" }}>
                        After rating both systems individually, you must choose an overall winner:
                        <br /><br />
                        <strong>System A </strong>or<strong> System B:</strong> Choose one if it is clearly better than the other (better meaning, better phrasing, or fewer errors).<br /><br />
                        <strong>Tie:</strong> Only choose Tie if both systems are perfectly identical, equally amazing, or equally terrible. Do not use Tie to avoid making a hard choice!
                    </p>
                </div>

                <div style={{ textAlign: "center", marginBottom: 60 }}>
                    {profile ? (
                        <Link href="/evaluate" className="btn btn-primary btn-lg">Back to Evaluation Portal →</Link>
                    ) : (
                        <Link href="/signup" className="btn btn-primary btn-lg">Ready? Create an Account →</Link>
                    )}
                </div>
            </div>
        </>
    );
}
