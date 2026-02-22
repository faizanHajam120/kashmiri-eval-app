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
          <Link href="/" className="navbar-brand">KashmirAI Research</Link>
          <div className="navbar-links">
            <Link href="/research">Research</Link>
            <Link href="/about">About</Link>
            <Link href="/guide">Guide</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '8px 20px' }}>Evaluate</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Hero */}
        <section className="hero">
          <div className="research-badge animate-in">
            🔬 Kashmir's Pioneering NLP Research Platform
          </div>
          <h1 className="animate-in animate-in-delay-1">
            Advancing Machine<br />Translation for Kashmiri
          </h1>
          <p className="animate-in animate-in-delay-2">
            Pioneering low-resource NLP research for the Kashmiri language.
            Fine-tuning large language models to build an advanced Kashmiri→English
            machine translation system — with human evaluation from native speakers.
          </p>
          <div className="hero-actions animate-in animate-in-delay-3">
            <Link href="/signup" className="btn btn-primary btn-lg" style={{
              fontSize: '1.1rem',
              padding: '16px 36px',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}>✋ Start Evaluating</Link>
            <Link href="/research" className="btn btn-secondary btn-lg">Explore Research</Link>
          </div>
        </section>

        {/* Motivating CTA Banner */}
        <div className="cta-banner animate-in animate-in-delay-4">
          <div className="cta-banner-icon">🔔</div>
          <div className="cta-banner-content">
            <h3>Native Kashmiri Speaker? We Need Your Help!</h3>
            <p>
              It's simple — just read Kashmiri→English translations and rate whether
              they sound accurate and natural. <strong>No technical skills needed.</strong> Takes
              just 10–15 minutes. Your input directly shapes AI research for our language.
            </p>
            <Link href="/signup" className="btn btn-primary" style={{ marginTop: 12, padding: '10px 24px' }}>
              Join as Evaluator — It's Free →
            </Link>
          </div>
        </div>
        <div className="feature-grid">
          <div className="card animate-in animate-in-delay-2">
            <h3 style={{ marginBottom: 12 }}>📦 Dataset Construction</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              Building a large-scale Kashmiri-English parallel corpus from
              multiple open sources with rigorous quality filtering.
            </p>
          </div>
          <div className="card animate-in animate-in-delay-3">
            <h3 style={{ marginBottom: 12 }}>🧠 LLM Fine-Tuning</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              Fine-tuning state-of-the-art large language models for
              Kashmiri→English translation tasks.
            </p>
          </div>
          <div className="card animate-in animate-in-delay-4">
            <h3 style={{ marginBottom: 12 }}>🔬 Human Evaluation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
              Native Kashmiri speakers evaluate translations via this platform,
              rating adequacy, fluency, and overall preference — contributing
              directly to ongoing research.
            </p>
          </div>
        </div>

        {/* About the Research */}
        <section className="research-overview animate-in">
          <div className="research-overview-content">
            <h2>About This Research</h2>
            <p>
              Kashmiri (کٲشُر) is a low-resource, endangered language spoken by over
              7 million people in the Kashmir Valley, written in the Perso-Arabic script.
              Despite its cultural significance, it has extremely limited NLP resources
              compared to other Indian languages.
            </p>
            <p>
              This project investigates whether large language models can be effectively
              fine-tuned for Kashmiri translation. Our research is ongoing, and detailed
              findings will be published in an upcoming conference paper.
            </p>
            <Link href="/research" className="btn btn-secondary" style={{ marginTop: 16 }}>
              Read More About Our Research →
            </Link>
          </div>
        </section>

        {/* Researcher */}
        <section className="researcher-section animate-in">
          <div className="researcher-card">
            <div className="researcher-avatar">F</div>
            <div className="researcher-info">
              <h3>Faizan Ayoub</h3>
              <p className="researcher-title">AI Researcher & Developer</p>
              <p className="researcher-bio">
                Building Kashmir's pioneering NLP research infrastructure. Passionate about
                applying cutting-edge AI to preserve and empower low-resource languages.
              </p>
              <Link href="/about" className="btn btn-secondary" style={{ padding: '10px 24px', marginTop: 12 }}>
                Learn More →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <p>© 2025 KashmirAI Research — by Faizan Ayoub</p>
          <p style={{ fontSize: '0.85rem', marginTop: 8 }}>
            Kashmir's pioneering NLP research platform for Kashmiri language technology.
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: 8 }}>
            📞 Contact: +91 7006718915
          </p>
        </footer>
      </div>
    </>
  );
}
