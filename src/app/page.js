"use client";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Ambient glow blobs */}
      <div className="bg-mesh" />
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />
      <div className="glow-blob glow-blob-3" />

      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">KashmirAI Eval</Link>
          <div className="navbar-links">
            <Link href="/login">Login</Link>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '8px 20px' }}>Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <section className="hero">
          <h1 className="animate-in">Human Evaluation for<br />Kashmiri Translation</h1>
          <p className="animate-in animate-in-delay-1">
            Help advance machine translation for the Kashmiri language.
            Rate translations from two anonymous systems and contribute
            to cutting-edge NLP research.
          </p>
          <div className="hero-actions animate-in animate-in-delay-2">
            <Link href="/signup" className="btn btn-primary btn-lg">Start Evaluating</Link>
            <Link href="/login" className="btn btn-secondary btn-lg">Sign In</Link>
          </div>
        </section>

        <div className="feature-grid">
          <div className="card animate-in animate-in-delay-2">
            <h3 style={{ marginBottom: 12 }}>🔤 Kashmiri → English</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              Evaluate machine translations of Kashmiri text into English.
              Compare two anonymous systems side-by-side.
            </p>
          </div>
          <div className="card animate-in animate-in-delay-3">
            <h3 style={{ marginBottom: 12 }}>📊 Adequacy & Fluency</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              Rate translations on a 1-5 scale for meaning preservation
              (adequacy) and English quality (fluency).
            </p>
          </div>
          <div className="card animate-in animate-in-delay-4">
            <h3 style={{ marginBottom: 12 }}>🔬 Research Impact</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              Your evaluations directly contribute to a published research
              paper comparing LLM vs NMT for low-resource translation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
