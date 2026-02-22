"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
    const [profile, setProfile] = useState(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/login"); return; }
            const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            if (prof?.role !== "admin") { router.push("/evaluate"); return; }
            setProfile(prof);
        }
        init();
    }, [router]);

    async function handleUpload(e) {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        setError("");
        setResult(null);

        try {
            const text = await file.text();
            const lines = text.split("\n").filter(l => l.trim());
            const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));

            // Find column indices
            const srcIdx = headers.findIndex(h => h.includes("source") || h.includes("kashmiri"));
            const refIdx = headers.findIndex(h => h.includes("reference") || h.includes("english"));
            const sysAIdx = headers.findIndex(h => h.includes("system_a") && h.includes("translation"));
            const sysBIdx = headers.findIndex(h => h.includes("system_b") && h.includes("translation"));

            if (srcIdx === -1 || refIdx === -1 || sysAIdx === -1 || sysBIdx === -1) {
                setError(`CSV must have columns: source_kashmiri, reference_english, system_a_translation, system_b_translation. Found: ${headers.join(", ")}`);
                setUploading(false);
                return;
            }

            // Parse rows with proper CSV handling
            const rows = [];
            for (let i = 1; i < lines.length; i++) {
                const cols = parseCSVLine(lines[i]);
                if (cols.length > Math.max(srcIdx, refIdx, sysAIdx, sysBIdx)) {
                    rows.push({
                        source_kashmiri: cols[srcIdx],
                        reference_english: cols[refIdx],
                        system_a_translation: cols[sysAIdx],
                        system_b_translation: cols[sysBIdx],
                        system_a_identity: "unknown",
                        system_b_identity: "unknown",
                    });
                }
            }

            // Insert in batches
            const batch = 25;
            let inserted = 0;
            for (let i = 0; i < rows.length; i += batch) {
                const chunk = rows.slice(i, i + batch);
                const { error: insertErr } = await supabase.from("evaluations").insert(chunk);
                if (insertErr) {
                    setError(`Insert error at row ${i}: ${insertErr.message}`);
                    break;
                }
                inserted += chunk.length;
            }

            setResult({ total: rows.length, inserted });
        } catch (err) {
            setError(`Parse error: ${err.message}`);
        }
        setUploading(false);
    }

    function parseCSVLine(line) {
        const result = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
                else { inQuotes = !inQuotes; }
            } else if (char === "," && !inQuotes) {
                result.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">KashmirAI Research</Link>
                    <div className="navbar-links">
                        <Link href="/admin">Dashboard</Link>
                        <Link href="/evaluate">Evaluate</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container page">
                <div className="page-header">
                    <h1>Upload Evaluation Data</h1>
                    <p>Upload a CSV file with translation pairs for evaluators to rate.</p>
                </div>

                <div className="card" style={{ maxWidth: 600 }}>
                    <h3 style={{ marginBottom: 16 }}>CSV Format Required</h3>
                    <div className="translation-box" style={{ marginBottom: 24 }}>
                        <code style={{ fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
                            {`source_kashmiri, reference_english, system_a_translation, system_b_translation`}
                        </code>
                    </div>

                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Select CSV File</label>
                            <input type="file" accept=".csv" className="form-input"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{ padding: 10 }} />
                        </div>

                        {error && <p className="error-msg mb-4">{error}</p>}

                        {result && (
                            <div className="success-msg mb-4" style={{ fontSize: "1rem" }}>
                                ✅ Uploaded {result.inserted} of {result.total} sentences successfully!
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg" disabled={!file || uploading}>
                            {uploading ? "Uploading..." : "Upload CSV"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
