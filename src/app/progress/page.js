"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProgressPage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [myRatings, setMyRatings] = useState([]);
    const [allRatings, setAllRatings] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
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

            const { data: allRats } = await supabase.from("ratings").select("evaluator_id");
            setAllRatings(allRats || []);

            const { data: profs } = await supabase.from("profiles").select("id, full_name, role").eq("role", "evaluator");
            setAllProfiles(profs || []);

            setLoading(false);
        }
        init();
    }, [router]);

    const progress = totalEvals > 0 ? (myRatings.length / totalEvals) * 100 : 0;
    const avgTime = myRatings.length > 0
        ? Math.round(myRatings.reduce((s, r) => s + r.time_spent_seconds, 0) / myRatings.length)
        : 0;

    const leaderStats = {};
    (allRatings || []).forEach(r => {
        leaderStats[r.evaluator_id] = (leaderStats[r.evaluator_id] || 0) + 1;
    });

    const leaderboard = (allProfiles || [])
        .map(p => ({
            id: p.id,
            name: p.full_name || "Anonymous",
            score: leaderStats[p.id] || 0,
            isMe: p.id === user?.id
        }))
        .filter(p => p.score > 0 || p.isMe)
        .sort((a, b) => b.score - a.score);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">KashmirAI Research</Link>
                    <div className="navbar-links">
                        <Link href="/guide" style={{ fontWeight: 600, color: "var(--accent)" }}>📖 Guide</Link>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: 40 }}>
                    {/* Milestone Checklist */}
                    <div className="card" style={{ padding: 32 }}>
                        <h3 style={{ marginBottom: 24, fontSize: '1.25rem', color: 'var(--text-high)' }}>Your Research Milestones</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: progress >= 50 ? 'rgba(52, 211, 153, 0.05)' : 'var(--bg-surface)', border: `1px solid ${progress >= 50 ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: progress >= 50 ? '#34d399' : 'transparent', border: `2px solid ${progress >= 50 ? '#34d399' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030014', fontWeight: 'bold', flexShrink: 0 }}>
                                    {progress >= 50 ? "✓" : "1"}
                                </div>
                                <div>
                                    <h4 style={{ color: progress >= 50 ? '#34d399' : 'var(--text-high)', margin: '0 0 4px 0', fontSize: '1.05rem' }}>Part 1: The First Half</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-medium)' }}>Complete 50% of the assigned sentences.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: progress >= 100 ? 'rgba(52, 211, 153, 0.05)' : 'var(--bg-surface)', border: `1px solid ${progress >= 100 ? 'rgba(52, 211, 153, 0.3)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: progress >= 100 ? '#34d399' : 'transparent', border: `2px solid ${progress >= 100 ? '#34d399' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030014', fontWeight: 'bold', flexShrink: 0 }}>
                                    {progress >= 100 ? "✓" : "2"}
                                </div>
                                <div>
                                    <h4 style={{ color: progress >= 100 ? '#34d399' : 'var(--text-high)', margin: '0 0 4px 0', fontSize: '1.05rem' }}>Part 2: The Final Push</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-medium)' }}>Complete all remaining sentences (100%).</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="card" style={{ padding: 32 }}>
                        <h3 style={{ marginBottom: 24, fontSize: '1.25rem', color: 'var(--text-high)' }}>🏆 Top Evaluators</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {leaderboard.slice(0, 5).map((l, idx) => (
                                <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 8, background: l.isMe ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-surface)', border: l.isMe ? '1px solid var(--accent)' : '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 24, fontWeight: 'bold', color: idx === 0 ? '#fbbf24' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : 'var(--text-muted)' }}>
                                            #{idx + 1}
                                        </div>
                                        <div style={{ fontWeight: l.isMe ? 600 : 400, color: l.isMe ? 'var(--accent)' : 'var(--text-high)' }}>
                                            {l.name} {l.isMe && "(You)"}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--text-high)' }}>{l.score}</div>
                                </div>
                            ))}
                            {leaderboard.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No evaluations yet.</p>}
                        </div>
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
