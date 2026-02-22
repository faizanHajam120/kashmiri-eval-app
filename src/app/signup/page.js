"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Demographics
    const [nativeLanguage, setNativeLanguage] = useState("");
    const [kashmiriProficiency, setKashmiriProficiency] = useState("");
    const [englishProficiency, setEnglishProficiency] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [ageGroup, setAgeGroup] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSignup(e) {
        e.preventDefault();
        setError("");

        // Basic validation for demographic dropdowns
        if (!nativeLanguage || !kashmiriProficiency || !englishProficiency || !educationLevel || !ageGroup) {
            setError("Please fill out all demographic fields for research quality purposes.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    native_language: nativeLanguage,
                    kashmiri_proficiency: kashmiriProficiency,
                    english_proficiency: englishProficiency,
                    education_level: educationLevel,
                    age_group: ageGroup
                }
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/evaluate"), 1500);
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
                <div style={{ maxWidth: 480, margin: '60px auto' }}>
                    <div className="card">
                        <h2 style={{ marginBottom: 8, fontSize: '1.8rem', color: 'var(--text-high)' }}>Apply as Evaluator</h2>
                        <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', marginBottom: 28 }}>
                            Please provide your demographic background to ensure high-quality research standards.
                        </p>

                        {success ? (
                            <div className="success-msg" style={{ textAlign: 'center', padding: 20, fontSize: '1rem', width: '100%' }}>
                                ✅ Academic profile created! Redirecting...
                            </div>
                        ) : (
                            <form onSubmit={handleSignup}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" className="form-input" value={fullName}
                                        onChange={(e) => setFullName(e.target.value)} required placeholder="Your full name" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-input" value={email}
                                        onChange={(e) => setEmail(e.target.value)} required placeholder="academic@example.com" />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-input" value={password}
                                        onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters" />
                                </div>

                                <hr className="divider" style={{ margin: '32px 0' }} />
                                <h3 style={{ color: 'var(--text-high)', fontSize: '1.2rem', marginBottom: '20px' }}>Research Demographics</h3>

                                <div className="form-group">
                                    <label>Native Language</label>
                                    <select className="form-input" value={nativeLanguage} onChange={e => setNativeLanguage(e.target.value)} required style={{ appearance: 'auto' }}>
                                        <option value="" disabled>Select Language</option>
                                        <option value="Kashmiri">Kashmiri</option>
                                        <option value="Urdu">Urdu</option>
                                        <option value="English">English</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Kashmiri Proficiency</label>
                                    <select className="form-input" value={kashmiriProficiency} onChange={e => setKashmiriProficiency(e.target.value)} required style={{ appearance: 'auto' }}>
                                        <option value="" disabled>Select Proficiency</option>
                                        <option value="Native">Native/Bilingual</option>
                                        <option value="Fluent">Fluent</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Basic">Basic</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>English Proficiency</label>
                                    <select className="form-input" value={englishProficiency} onChange={e => setEnglishProficiency(e.target.value)} required style={{ appearance: 'auto' }}>
                                        <option value="" disabled>Select Proficiency</option>
                                        <option value="Native">Native/Bilingual</option>
                                        <option value="Fluent">Fluent</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Basic">Basic</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Highest Education Level</label>
                                    <select className="form-input" value={educationLevel} onChange={e => setEducationLevel(e.target.value)} required style={{ appearance: 'auto' }}>
                                        <option value="" disabled>Select Education Level</option>
                                        <option value="High School">High School</option>
                                        <option value="Bachelors">Bachelors Degree</option>
                                        <option value="Masters">Masters Degree</option>
                                        <option value="PhD">PhD / Doctorate</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Age Group</label>
                                    <select className="form-input" value={ageGroup} onChange={e => setAgeGroup(e.target.value)} required style={{ appearance: 'auto' }}>
                                        <option value="" disabled>Select Age Group</option>
                                        <option value="18-24">18-24</option>
                                        <option value="25-34">25-34</option>
                                        <option value="35-44">35-44</option>
                                        <option value="45-54">45-54</option>
                                        <option value="55+">55+</option>
                                    </select>
                                </div>

                                {error && <p className="error-msg" style={{ width: '100%' }}>{error}</p>}

                                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}
                                    style={{ marginTop: '24px' }}>
                                    {loading ? "Submitting Application..." : "Create Academic Profile"}
                                </button>
                            </form>
                        )}
                        <p className="text-center mt-4" style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                            Already an evaluator? <Link href="/login" style={{ color: 'var(--accent-1)', fontWeight: '500' }}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
