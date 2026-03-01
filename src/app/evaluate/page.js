"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import * as Diff from "diff";

export default function EvaluatePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [evalItems, setEvalItems] = useState([]);
    const [rated, setRated] = useState(new Set());
    const [currentIdx, setCurrentIdx] = useState(0);
    const [ratings, setRatings] = useState({ visual_sa: 0, visual_sf: 0, visual_ba: 0, visual_bf: 0, visual_pref: "" });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSwapped, setIsSwapped] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const timerRef = useRef(null);
    const startTime = useRef(Date.now());
    const prevDoneRef = useRef(0);
    const submitBtnRef = useRef(null);
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
            setIsSwapped(Math.random() > 0.5);
        }
        init();
    }, [router]);

    useEffect(() => {
        startTime.current = Date.now();
    }, [currentIdx, rated]);

    const unrated = evalItems.filter(e => !rated.has(e.id));
    const current = unrated[currentIdx] || null;
    const totalDone = rated.size;
    const totalAll = evalItems.length;
    const progress = totalAll > 0 ? (totalDone / totalAll) * 100 : 0;

    // Confetti logic
    useEffect(() => {
        if (totalAll > 0 && totalDone > prevDoneRef.current) {
            const half = Math.ceil(totalAll / 2);
            if (totalDone === half || totalDone === totalAll) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
        prevDoneRef.current = totalDone;
    }, [totalDone, totalAll]);

    // Keyboard Shortcuts logic
    const handleKeyDown = useCallback((e) => {
        if (!current) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key;

        setRatings(prev => {
            let next = { ...prev };
            // Visual A (1-5 for adeq, Shift+1-5 for fluency)
            if (['1', '2', '3', '4', '5'].includes(key)) {
                if (e.shiftKey) next.visual_sf = parseInt(key);
                else next.visual_sa = parseInt(key);
            }
            // Visual B (6-0 for adeq, Shift+6-0 for fluency)
            if (['6', '7', '8', '9', '0'].includes(key)) {
                const map = { '6': 1, '7': 2, '8': 3, '9': 4, '0': 5 };
                if (e.shiftKey) next.visual_bf = map[key];
                else next.visual_ba = map[key];
            }

            // Preference
            if (key === 'ArrowLeft') next.visual_pref = 'A';
            if (key === 'ArrowRight') next.visual_pref = 'B';
            if (key === 'ArrowDown') next.visual_pref = 'Tie';

            return next;
        });

        if (key === 'Enter') {
            e.preventDefault();
            if (submitBtnRef.current && !submitBtnRef.current.disabled) {
                submitBtnRef.current.click();
            }
        }
    }, [current]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const isComplete = ratings.visual_sa > 0 && ratings.visual_sf > 0 && ratings.visual_ba > 0 && ratings.visual_bf > 0 && ratings.visual_pref !== "";

    async function submitRating() {
        if (!isComplete || !current) return;
        setSaving(true);
        const elapsed = Math.round((Date.now() - startTime.current) / 1000);

        const db_sa = isSwapped ? ratings.visual_ba : ratings.visual_sa;
        const db_sf = isSwapped ? ratings.visual_bf : ratings.visual_sf;
        const db_ba = isSwapped ? ratings.visual_sa : ratings.visual_ba;
        const db_bf = isSwapped ? ratings.visual_sf : ratings.visual_bf;
        const db_pref = ratings.visual_pref === "Tie" ? "Tie" :
            (ratings.visual_pref === "A" && !isSwapped) || (ratings.visual_pref === "B" && isSwapped) ? "A" : "B";

        const { error } = await supabase.from("ratings").insert({
            evaluation_id: current.id,
            evaluator_id: user.id,
            system_a_adequacy: db_sa,
            system_a_fluency: db_sf,
            system_b_adequacy: db_ba,
            system_b_fluency: db_bf,
            preference: db_pref,
            time_spent_seconds: elapsed,
        });

        if (!error) {
            setRated(prev => new Set([...prev, current.id]));
            setRatings({ visual_sa: 0, visual_sf: 0, visual_ba: 0, visual_bf: 0, visual_pref: "" });
            setIsSwapped(Math.random() > 0.5);
            setCurrentIdx(0);
        } else {
            alert("Error saving evaluation: " + error.message);
        }
        setSaving(false);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    if (loading) return <div className="loading">Loading evaluations...</div>;

    let diffA = null;
    let diffB = null;

    if (current) {
        const visualA_text = isSwapped ? current.system_b_translation : current.system_a_translation;
        const visualB_text = isSwapped ? current.system_a_translation : current.system_b_translation;

        try {
            const diffResult = Diff.diffWords(visualA_text, visualB_text);
            diffA = diffResult.map((part, i) => {
                const color = part.removed ? '#ef4444' : 'inherit';
                const bg = part.removed ? 'rgba(239, 68, 68, 0.15)' : 'transparent';
                if (part.added) return null;
                return <span key={i} style={{ color, backgroundColor: bg, padding: part.removed ? '2px 4px' : 0, borderRadius: 4 }}>{part.value}</span>;
            });
            diffB = diffResult.map((part, i) => {
                const color = part.added ? '#10b981' : 'inherit';
                const bg = part.added ? 'rgba(16, 185, 129, 0.15)' : 'transparent';
                if (part.removed) return null;
                return <span key={i} style={{ color, backgroundColor: bg, padding: part.added ? '2px 4px' : 0, borderRadius: 4 }}>{part.value}</span>;
            });
        } catch (e) {
            diffA = visualA_text;
            diffB = visualB_text;
        }
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">KashmirAI Research</Link>
                    <div className="navbar-links">
                        <Link href="/guide" style={{ fontWeight: 600, color: "var(--accent)" }}>📖 Guide</Link>
                        <Link href="/progress">My Progress</Link>
                        {profile?.role === "admin" && <Link href="/admin">Admin</Link>}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container page">
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

                    {/* Instructions Panel */}
                    <div style={{ marginBottom: 24 }}>
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: showInstructions ? '12px 12px 0 0' : 12,
                                color: 'var(--text-high)',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span>📋 How to Evaluate — What do I need to do?</span>
                            <span style={{ fontSize: '1.2rem', transition: 'transform 0.2s', transform: showInstructions ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                        </button>

                        {showInstructions && (
                            <div style={{
                                background: 'rgba(15, 15, 25, 0.6)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderTop: 'none',
                                borderRadius: '0 0 12px 12px',
                                padding: '24px 28px',
                                fontSize: '0.9rem',
                                lineHeight: 1.7,
                                color: 'var(--text-secondary)'
                            }}>
                                <div style={{ marginBottom: 20 }}>
                                    <h3 style={{ color: 'var(--text-high)', fontSize: '1rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        🔍 What is this?
                                    </h3>
                                    <p style={{ margin: 0 }}>
                                        You are comparing translations from <strong style={{ color: '#818cf8' }}>two different AI translation systems</strong>.
                                        For each Kashmiri sentence, you'll see a <strong>reference (correct) translation</strong> and outputs from <strong>System A</strong> and <strong>System B</strong>.
                                        The systems are anonymized — you won't know which AI model produced each translation. This ensures unbiased evaluation.
                                    </p>
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <h3 style={{ color: 'var(--text-high)', fontSize: '1rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        ⭐ Rating Scale (1-5)
                                    </h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                        <div style={{ flex: '1 1 240px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 8, borderLeft: '3px solid #818cf8' }}>
                                            <strong style={{ color: '#818cf8' }}>Adequacy</strong> — Does it capture the <em>meaning</em>?
                                            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: '0.85rem' }}>
                                                <li><strong>5</strong> = All meaning preserved</li>
                                                <li><strong>4</strong> = Most meaning preserved</li>
                                                <li><strong>3</strong> = Some meaning preserved</li>
                                                <li><strong>2</strong> = Little meaning preserved</li>
                                                <li><strong>1</strong> = No meaningful content</li>
                                            </ul>
                                        </div>
                                        <div style={{ flex: '1 1 240px', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 8, borderLeft: '3px solid #10b981' }}>
                                            <strong style={{ color: '#10b981' }}>Fluency</strong> — Does it read <em>naturally</em> in English?
                                            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: '0.85rem' }}>
                                                <li><strong>5</strong> = Flawless, natural English</li>
                                                <li><strong>4</strong> = Good, minor errors</li>
                                                <li><strong>3</strong> = Understandable but awkward</li>
                                                <li><strong>2</strong> = Barely understandable</li>
                                                <li><strong>1</strong> = Incomprehensible / gibberish</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <h3 style={{ color: 'var(--text-high)', fontSize: '1rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        🏆 Overall Preference
                                    </h3>
                                    <p style={{ margin: 0 }}>
                                        After rating both systems, pick which translation you think is <strong>better overall</strong>, or select <strong>Tie</strong> if they are equally good (or equally bad).
                                        Compare them against the <strong>reference translation</strong> to judge.
                                    </p>
                                </div>

                                <div style={{
                                    background: 'rgba(251, 191, 36, 0.08)',
                                    border: '1px solid rgba(251, 191, 36, 0.2)',
                                    borderRadius: 8,
                                    padding: '12px 16px',
                                    fontSize: '0.85rem'
                                }}>
                                    <strong style={{ color: '#fbbf24' }}>💡 Quick Tips:</strong>
                                    <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                                        <li>Read the <strong>reference translation</strong> first, then compare System A and B against it</li>
                                        <li>Green/red highlights show the <strong>differences</strong> between the two systems</li>
                                        <li>Rate <strong>each system independently</strong> — don't compare them to each other for adequacy/fluency</li>
                                        <li>Your progress auto-saves — you can close the tab and come back anytime</li>
                                    </ul>
                                </div>
                            </div>
                        )}
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
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h2 style={{ fontSize: "1.2rem" }}>Sentence {totalDone + 1} of {totalAll}</h2>
                            <span className="badge badge-accent">Remaining: {unrated.length}</span>
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: 8, fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                                <span><strong style={{ color: "var(--text-high)" }}>⚡ Keyboard Shortcuts (Power User)</strong></span>
                                <span>Submit: <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>Enter</code></span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                                <span>System A Adequacy: <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>1-5</code> | Fluency: <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>Shift + 1-5</code></span>
                                <span>System B Adequacy: <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>6-0</code> | Fluency: <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>Shift + 6-0</code></span>
                                <span>Preference: <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>⬅</code> <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>⬇</code> <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>➡</code></span>
                            </div>
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
                            <div className="label" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>System A</span>
                            </div>
                            <div className="text" style={{ lineHeight: 1.8 }}>{diffA}</div>
                        </div>

                        <div className="rating-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                            <RatingGroup label="System A — Adequacy" value={ratings.visual_sa}
                                onChange={(v) => setRatings(prev => ({ ...prev, visual_sa: v }))} />
                            <RatingGroup label="System A — Fluency" value={ratings.visual_sf}
                                onChange={(v) => setRatings(prev => ({ ...prev, visual_sf: v }))} />
                        </div>

                        {/* System B */}
                        <div className="translation-box" style={{ borderLeft: "3px solid #10b981" }}>
                            <div className="label" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>System B</span>
                            </div>
                            <div className="text" style={{ lineHeight: 1.8 }}>{diffB}</div>
                        </div>

                        <div className="rating-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                            <RatingGroup label="System B — Adequacy" value={ratings.visual_ba}
                                onChange={(v) => setRatings(prev => ({ ...prev, visual_ba: v }))} />
                            <RatingGroup label="System B — Fluency" value={ratings.visual_bf}
                                onChange={(v) => setRatings(prev => ({ ...prev, visual_bf: v }))} />
                        </div>

                        <hr className="divider" />

                        {/* Preference */}
                        <div className="rating-group">
                            <label>Overall Preference</label>
                            <div className="pref-buttons">
                                {["A", "Tie", "B"].map(opt => (
                                    <button key={opt}
                                        className={`pref-btn ${ratings.visual_pref === opt ? "active" : ""}`}
                                        onClick={() => setRatings(prev => ({ ...prev, visual_pref: opt }))}>
                                        {opt === "A" ? "⬅ System A" : opt === "B" ? "System B ➡" : "⬇ Tie"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            ref={submitBtnRef}
                            className="btn btn-primary btn-lg btn-block" style={{ marginTop: 16 }}
                            disabled={!isComplete || saving} onClick={submitRating}>
                            {saving ? "Saving..." : isComplete ? "Submit & Next (Enter) →" : "Rate all fields to continue"}
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
