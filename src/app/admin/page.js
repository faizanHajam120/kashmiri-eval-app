"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function AdminPage() {
    const [profile, setProfile] = useState(null);
    const [evaluators, setEvaluators] = useState([]);
    const [evalCount, setEvalCount] = useState(0);
    const [allRatings, setAllRatings] = useState([]);
    const [allEvaluations, setAllEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/login"); return; }
            const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            if (prof?.role !== "admin") { router.push("/evaluate"); return; }
            setProfile(prof);

            const { count } = await supabase.from("evaluations").select("*", { count: "exact", head: true });
            setEvalCount(count || 0);

            const { data: profs } = await supabase.from("profiles").select("*").order("created_at");
            setEvaluators(profs || []);

            const { data: rats } = await supabase.from("ratings").select("*");
            setAllRatings(rats || []);

            const { data: evals } = await supabase.from("evaluations").select("*");
            setAllEvaluations(evals || []);

            setLoading(false);
        }
        init();
    }, [router]);

    // Compute stats per evaluator
    const evalByUser = {};
    allRatings.forEach(r => {
        if (!evalByUser[r.evaluator_id]) evalByUser[r.evaluator_id] = [];
        evalByUser[r.evaluator_id].push(r);
    });

    // Aggregate scores
    const avgSysA_Adeq = allRatings.length > 0 ? (allRatings.reduce((s, r) => s + r.system_a_adequacy, 0) / allRatings.length).toFixed(2) : "—";
    const avgSysA_Flu = allRatings.length > 0 ? (allRatings.reduce((s, r) => s + r.system_a_fluency, 0) / allRatings.length).toFixed(2) : "—";
    const avgSysB_Adeq = allRatings.length > 0 ? (allRatings.reduce((s, r) => s + r.system_b_adequacy, 0) / allRatings.length).toFixed(2) : "—";
    const avgSysB_Flu = allRatings.length > 0 ? (allRatings.reduce((s, r) => s + r.system_b_fluency, 0) / allRatings.length).toFixed(2) : "—";

    const prefA = allRatings.filter(r => r.preference === "A").length;
    const prefB = allRatings.filter(r => r.preference === "B").length;
    const prefTie = allRatings.filter(r => r.preference === "Tie").length;

    const winRateData = [
        { name: 'System A', Wins: prefA },
        { name: 'System B', Wins: prefB },
        { name: 'Ties', Wins: prefTie }
    ];

    const radarData = [
        { subject: 'Adequacy', SystemA: parseFloat(avgSysA_Adeq) || 0, SystemB: parseFloat(avgSysB_Adeq) || 0, fullMark: 5 },
        { subject: 'Fluency', SystemA: parseFloat(avgSysA_Flu) || 0, SystemB: parseFloat(avgSysB_Flu) || 0, fullMark: 5 },
    ];

    function exportCSV() {
        if (allRatings.length === 0) return;

        // Define CSV headers
        const header = "evaluation_id,evaluator_id,evaluator_name,native_language,kashmiri_proficiency,english_proficiency,education_level,age_group,sys_a_adequacy,sys_a_fluency,sys_b_adequacy,sys_b_fluency,preference,time_seconds,source_kashmiri,reference_english,system_a_identity,system_a_translation,system_b_identity,system_b_translation\n";

        // Map ratings to CSV rows, joining with evaluator profiles & evaluations
        const rows = allRatings.map(r => {
            const ev = evaluators.find(e => e.id === r.evaluator_id) || {};
            const evaluation = allEvaluations.find(e => e.id === r.evaluation_id) || {};

            // Helper to escape double quotes and wrap string in quotes for valid CSV formatting
            const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

            return `${r.evaluation_id},${r.evaluator_id},${escapeCsv(ev.full_name)},${escapeCsv(ev.native_language)},${escapeCsv(ev.kashmiri_proficiency)},${escapeCsv(ev.english_proficiency)},${escapeCsv(ev.education_level)},${escapeCsv(ev.age_group)},${r.system_a_adequacy},${r.system_a_fluency},${r.system_b_adequacy},${r.system_b_fluency},${r.preference},${r.time_spent_seconds},${escapeCsv(evaluation.source_kashmiri)},${escapeCsv(evaluation.reference_english)},${escapeCsv(evaluation.system_a_identity)},${escapeCsv(evaluation.system_a_translation)},${escapeCsv(evaluation.system_b_identity)},${escapeCsv(evaluation.system_b_translation)}`;
        }).join("\n");

        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kashmir_ai_eval_results.csv";
        a.click();

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    async function deleteResponses(evaluatorId) {
        if (!confirm("Are you sure you want to delete ALL responses submitted by this evaluator? This cannot be undone.")) return;

        setIsDeleting(evaluatorId);
        const { error } = await supabase.from("ratings").delete().eq("evaluator_id", evaluatorId);
        setIsDeleting(null);

        if (error) {
            alert("Error deleting responses: " + error.message);
        } else {
            // Remove from local state to instantly update the UI without reloading
            setAllRatings(prev => prev.filter(r => r.evaluator_id !== evaluatorId));
        }
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    if (loading) return <div className="loading">Loading admin...</div>;

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">KashmirAI Research</Link>
                    <div className="navbar-links">
                        <Link href="/guide" style={{ fontWeight: 600, color: "var(--accent)" }}>📖 Guide</Link>
                        <Link href="/evaluate">Evaluate</Link>
                        <Link href="/admin/upload">Upload CSV</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container page">
                <div className="page-header">
                    <h1>Admin Dashboard</h1>
                    <p>Monitor evaluation progress and view aggregate results.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{evalCount}</div>
                        <div className="stat-label">Total Sentences</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{allRatings.length}</div>
                        <div className="stat-label">Total Ratings</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{evaluators.filter(e => e.role === "evaluator").length}</div>
                        <div className="stat-label">Evaluators</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {allRatings.length > 0 ? Math.round(allRatings.reduce((s, r) => s + r.time_spent_seconds, 0) / allRatings.length) : 0}s
                        </div>
                        <div className="stat-label">Avg Time</div>
                    </div>
                </div>

                {/* Score Charts */}
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>Live Analytics</h3>

                    {allRatings.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: 24 }}>
                            {/* Win Rate Bar Chart */}
                            <div style={{ height: 300 }}>
                                <h4 style={{ textAlign: 'center', marginBottom: 16, color: 'var(--text-secondary)' }}>Overall Preference (Wins)</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={winRateData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke="var(--text-muted)" />
                                        <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-high)' }} />
                                        <Bar dataKey="Wins" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Quality Radar Chart */}
                            <div style={{ height: 300 }}>
                                <h4 style={{ textAlign: 'center', marginBottom: 16, color: 'var(--text-secondary)' }}>Adequacy vs Fluency</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="var(--border-subtle)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: 'var(--text-muted)' }} />
                                        <Radar name="System A" dataKey="SystemA" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.4} />
                                        <Radar name="System B" dataKey="SystemB" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                        <Legend />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-high)' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No ratings yet to generate charts.</p>
                    )}

                    <div className="table-container">
                        <table>
                            <thead><tr><th>Metric</th><th>System A</th><th>System B</th></tr></thead>
                            <tbody>
                                <tr><td>Adequacy (1-5)</td><td>{avgSysA_Adeq}</td><td>{avgSysB_Adeq}</td></tr>
                                <tr><td>Fluency (1-5)</td><td>{avgSysA_Flu}</td><td>{avgSysB_Flu}</td></tr>
                                <tr><td>Preference</td>
                                    <td>{prefA} ({allRatings.length > 0 ? Math.round(prefA / allRatings.length * 100) : 0}%)</td>
                                    <td>{prefB} ({allRatings.length > 0 ? Math.round(prefB / allRatings.length * 100) : 0}%)</td>
                                </tr>
                                <tr><td>Tie</td><td colSpan={2} style={{ textAlign: "center" }}>{prefTie} ({allRatings.length > 0 ? Math.round(prefTie / allRatings.length * 100) : 0}%)</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Evaluator Progress */}
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>Evaluator Progress</h3>
                    <div className="table-container">
                        <table>
                            <thead><tr><th>Name</th><th>Role</th><th>Completed</th><th>Avg Time</th><th>Progress</th><th>Actions</th></tr></thead>
                            <tbody>
                                {evaluators.map(ev => {
                                    const evals = evalByUser[ev.id] || [];
                                    const done = evals.length;
                                    const pct = evalCount > 0 ? Math.round(done / evalCount * 100) : 0;
                                    const avgTime = done > 0 ? Math.round(evals.reduce((s, r) => s + r.time_spent_seconds, 0) / done) : 0;
                                    /* Assume any completion average under 7 seconds for two translations is spam */
                                    const isSpam = done > 3 && avgTime < 7;

                                    return (
                                        <tr key={ev.id}>
                                            <td>
                                                <div>{ev.full_name || "—"}</div>
                                                {isSpam && <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', marginTop: 4, display: 'inline-block' }}>⚠️ Spam Risk (Fast)</span>}
                                            </td>
                                            <td><span className={`badge ${ev.role === "admin" ? "badge-accent" : "badge-success"}`}>{ev.role}</span></td>
                                            <td>{done}/{evalCount}</td>
                                            <td>{avgTime > 0 ? `${avgTime}s` : "—"}</td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div className="progress-bar-bg" style={{ flex: 1, height: 6 }}>
                                                        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{pct}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                {ev.role !== "admin" && (
                                                    <button
                                                        onClick={() => deleteResponses(ev.id)}
                                                        className="btn"
                                                        style={{ padding: "4px 10px", fontSize: "0.75rem", background: "rgba(220, 38, 38, 0.1)", color: "#f87171", border: "1px solid rgba(220, 38, 38, 0.3)", borderRadius: "var(--radius-sm)" }}
                                                        disabled={isDeleting === ev.id || done === 0}
                                                    >
                                                        {isDeleting === ev.id ? "..." : "Delete Data"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <button onClick={exportCSV} className="btn btn-primary" disabled={allRatings.length === 0}>
                    📥 Export All Ratings as CSV
                </button>
            </div>
        </>
    );
}
