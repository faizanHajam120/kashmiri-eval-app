"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EvaluatePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [evalItems, setEvalItems] = useState([]);
    const [rated, setRated] = useState(new Set());
    const [currentIdx, setCurrentIdx] = useState(0);
    const [ratings, setRatings] = useState({ sa: 0, sf: 0, ba: 0, bf: 0, pref: "" });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef(null);
    const startTime = useRef(Date.now());
    const router = useRouter();

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/login"); return; }
            setUser(user);

            const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            setProfile(prof);

            const { data: evals } = await supabase.from("evaluations")
                .select("id, source_kashmiri, reference_english, system_a_translation, system_b_translation")
                .order("created_at", { ascending: true });
            setEvalItems(evals || []);

            const { data: myRatings } = await supabase.from("ratings")
                .select("evaluation_id").eq("evaluator_id", user.id);
            setRated(new Set((myRatings || []).map(r => r.evaluation_id)));
            setLoading(false);
        }
        init();
    }, [router]);

    useEffect(() => {
        startTime.current = Date.now();
    }, [currentIdx]);

    const unrated = evalItems.filter(e => !rated.has(e.id));
    const current = unrated[currentIdx] || null;
    const totalDone = rated.size;
    const totalAll = evalItems.length;
    const progress = totalAll > 0 ? (totalDone / totalAll) * 100 : 0;

    const isComplete = ratings.sa > 0 && ratings.sf > 0 && ratings.ba > 0 && ratings.bf > 0 && ratings.pref !== "";

    async function submitRating() {
        if (!isComplete || !current) return;
        setSaving(true);
        const elapsed = Math.round((Date.now() - startTime.current) / 1000);

        const { error } = await supabase.from("ratings").insert({
            evaluation_id: current.id,
            evaluator_id: user.id,
            system_a_adequacy: ratings.sa,
            system_a_fluency: ratings.sf,
            system_b_adequacy: ratings.ba,
            system_b_fluency: ratings.bf,
            preference: ratings.pref,
            time_spent_seconds: elapsed,
        });

        if (!error) {
            setRated(prev => new Set([...prev, current.id]));
            setRatings({ sa: 0, sf: 0, ba: 0, bf: 0, pref: "" });
            setCurrentIdx(0);
        }
        setSaving(false);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    if (loading) return <div className="loading">Loading evaluations...</div>;

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">KashmirAI Eval</Link>
                    <div className="navbar-links">
                        <Link href="/progress">My Progress</Link>
                        {profile?.role === "admin" && <Link href="/admin">Admin</Link>}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container page">
                {/* Progress */}
                {/* Progress */}
                <div className="progress-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <p className="progress-text" style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-high)' }}>
                            <strong>{totalDone}</strong> of <strong>{totalAll}</strong> evaluated
                        </p>
                        <span className="badge badge-success" style={{ background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.2)', color: '#34d399' }}>
                            ✓ Auto-saved. Safe to exit & resume.
                        </span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Milestone Halfway Tracker */}
                {totalAll > 0 && totalDone === Math.ceil(totalAll / 2) && unrated.length > 0 && (
                    <div className="success-msg" style={{ width: '100%', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>🌟 Part 1 Complete!</strong>
                            You are exactly halfway done. Your progress is saved, so feel free to wrap up for now and resume Part 2 later.
                        </div>
                        <Link href="/progress" className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Take a Break</Link>
                    </div>
                )}

                {!current ? (
                    <div className="card text-center" style={{ padding: 60 }}>
                        <h2 style={{ marginBottom: 12 }}>🎉 All done!</h2>
                        <p style={{ color: "var(--text-secondary)" }}>
                            You've evaluated all {totalAll} sentences. Thank you for contributing!
                        </p>
                        <Link href="/progress" className="btn btn-primary" style={{ marginTop: 20 }}>View Results</Link>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 32 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h2 style={{ fontSize: "1.2rem" }}>Sentence {totalDone + 1} of {totalAll}</h2>
                            <span className="badge badge-accent">Remaining: {unrated.length}</span>
                        </div>

                        {/* Source */}
                        <div className="translation-box kashmiri">
                            <div className="label">Source (Kashmiri)</div>
                            <div className="text">{current.source_kashmiri}</div>
                        </div>

                        {/* Reference */}
                        <div className="translation-box">
                            <div className="label">Reference Translation (English)</div>
                            <div className="text">{current.reference_english}</div>
                        </div>

                        <hr className="divider" />

                        {/* System A */}
                        <div className="translation-box" style={{ borderLeft: "3px solid var(--accent)" }}>
                            <div className="label">System A</div>
                            <div className="text">{current.system_a_translation}</div>
                        </div>

                        <div className="rating-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                            <RatingGroup label="System A — Adequacy" value={ratings.sa}
                                onChange={(v) => setRatings(prev => ({ ...prev, sa: v }))} />
                            <RatingGroup label="System A — Fluency" value={ratings.sf}
                                onChange={(v) => setRatings(prev => ({ ...prev, sf: v }))} />
                        </div>

                        {/* System B */}
                        <div className="translation-box" style={{ borderLeft: "3px solid #a78bfa" }}>
                            <div className="label">System B</div>
                            <div className="text">{current.system_b_translation}</div>
                        </div>

                        <div className="rating-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                            <RatingGroup label="System B — Adequacy" value={ratings.ba}
                                onChange={(v) => setRatings(prev => ({ ...prev, ba: v }))} />
                            <RatingGroup label="System B — Fluency" value={ratings.bf}
                                onChange={(v) => setRatings(prev => ({ ...prev, bf: v }))} />
                        </div>

                        <hr className="divider" />

                        {/* Preference */}
                        <div className="rating-group">
                            <label>Overall Preference</label>
                            <div className="pref-buttons">
                                {["A", "Tie", "B"].map(opt => (
                                    <button key={opt}
                                        className={`pref-btn ${ratings.pref === opt ? "active" : ""}`}
                                        onClick={() => setRatings(prev => ({ ...prev, pref: opt }))}>
                                        {opt === "A" ? "⬅ System A" : opt === "B" ? "System B ➡" : "≈ Tie"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 16 }}
                            disabled={!isComplete || saving} onClick={submitRating}>
                            {saving ? "Saving..." : isComplete ? "Submit & Next →" : "Rate all fields to continue"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

function RatingGroup({ label, value, onChange }) {
    return (
        <div className="rating-group">
            <label>{label}</label>
            <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map(n => (
                    <button key={n}
                        className={`rating-btn ${value === n ? "active" : ""}`}
                        onClick={() => onChange(n)}>
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
}
