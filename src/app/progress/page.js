"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProgressPage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [myRatings, setMyRatings] = useState([]);
    const [totalEvals, setTotalEvals] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/login"); return; }
            setUser(user);

            const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            setProfile(prof);

            const { count } = await supabase.from("evaluations").select("*", { count: "exact", head: true });
            setTotalEvals(count || 0);

            const { data: rats } = await supabase.from("ratings")
                .select("*").eq("evaluator_id", user.id).order("created_at", { ascending: false });
            setMyRatings(rats || []);
            setLoading(false);
        }
        init();
    }, [router]);

    const progress = totalEvals > 0 ? (myRatings.length / totalEvals) * 100 : 0;
    const avgTime = myRatings.length > 0
        ? Math.round(myRatings.reduce((s, r) => s + r.time_spent_seconds, 0) / myRatings.length)
        : 0;

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">KashmirAI Eval</Link>
                    <div className="navbar-links">
                        <Link href="/evaluate">Evaluate</Link>
                        {profile?.role === "admin" && <Link href="/admin">Admin</Link>}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container page">
                <div className="page-header">
                    <h1>Your Progress</h1>
                    <p>Hi {profile?.full_name || "Evaluator"}! Here's your evaluation progress.</p>
                </div>

                <div className="progress-container">
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="progress-text">{myRatings.length} of {totalEvals} ({Math.round(progress)}%)</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{myRatings.length}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{totalEvals - myRatings.length}</div>
                        <div className="stat-label">Remaining</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{avgTime}s</div>
                        <div className="stat-label">Avg Time/Sentence</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{Math.round(progress)}%</div>
                        <div className="stat-label">Progress</div>
                    </div>
                </div>

                {myRatings.length < totalEvals && (
                    <Link href="/evaluate" className="btn btn-primary btn-lg">Continue Evaluating →</Link>
                )}

                {myRatings.length > 0 && (
                    <>
                        <hr className="divider" />
                        <h3 style={{ marginBottom: 16 }}>Recent Evaluations</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th><th>A Adeq</th><th>A Flu</th><th>B Adeq</th><th>B Flu</th><th>Pref</th><th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myRatings.slice(0, 15).map((r, i) => (
                                        <tr key={r.id}>
                                            <td>{myRatings.length - i}</td>
                                            <td>{r.system_a_adequacy}</td>
                                            <td>{r.system_a_fluency}</td>
                                            <td>{r.system_b_adequacy}</td>
                                            <td>{r.system_b_fluency}</td>
                                            <td><span className="badge badge-accent">{r.preference}</span></td>
                                            <td>{r.time_spent_seconds}s</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
