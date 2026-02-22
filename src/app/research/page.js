import Link from "next/link";

export const metadata = {
    title: "Research — Kashmiri Language Machine Translation",
    description:
        "Ongoing research on Kashmiri-English machine translation using LLM fine-tuning. Human evaluation platform for native Kashmiri speakers.",
    keywords: [
        "Kashmiri machine translation research",
        "Kashmiri NLP",
        "low-resource machine translation",
        "Kashmiri language technology",
    ],
};

export default function ResearchPage() {
    return (
        <>
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
                        <Link href="/signup" className="btn btn-primary" style={{ padding: "8px 20px" }}>Evaluate</Link>
                    </div>
                </div>
            </nav>

            <div className="container page">
                {/* Header */}
                <div className="page-header" style={{ textAlign: "center", marginBottom: 48 }}>
                    <div className="research-badge" style={{ marginBottom: 20 }}>📄 Ongoing Research</div>
                    <h1 style={{ fontSize: "2.6rem", lineHeight: 1.2 }}>
                        Low-Resource Neural Machine Translation for Kashmiri
                    </h1>
                    <p style={{ fontSize: "1.15rem", maxWidth: 700, margin: "16px auto 0" }}>
                        Investigating LLM fine-tuning for Kashmiri→English translation
                    </p>
                    <p style={{ color: "var(--text-low)", marginTop: 12, fontSize: "0.95rem" }}>
                        Faizan Ayoub · KashmirAI Research · Paper forthcoming
                    </p>
                </div>

                {/* Overview */}
                <section className="research-section">
                    <h2>Research Overview</h2>
                    <div className="research-section-body">
                        <p>
                            This work investigates LLM-based machine translation for Kashmiri (کٲشُر), a
                            low-resource endangered language spoken by over 7 million people in the Kashmir
                            Valley. We are building tools and models that can translate between Kashmiri
                            and English, with the goal of advancing language technology for this
                            underserved language.
                        </p>
                        <p>
                            The research is currently in progress. Detailed methodology, results, and
                            analysis will be shared upon publication of the associated conference paper.
                            For further details, please contact us below.
                        </p>
                    </div>
                </section>

                {/* Background */}
                <section className="research-section">
                    <h2>1. Background</h2>
                    <div className="research-section-body">
                        <h3>The Kashmiri Language</h3>
                        <p>
                            Kashmiri (ISO 639-3: kas) is a Dardic language of the Indo-Aryan family, primarily
                            spoken in the Kashmir Valley of Jammu & Kashmir, India. It is written in the
                            Perso-Arabic script (Nastaliq), which poses unique challenges for NLP systems
                            designed primarily for Latin-script or Devanagari-script languages.
                        </p>
                        <p>
                            Despite being an official language of the Indian Union Territory and spoken by millions,
                            Kashmiri remains severely underserved in the NLP ecosystem with minimal
                            digital linguistic resources available.
                        </p>

                        <h3>The Low-Resource Challenge</h3>
                        <p>
                            Low-resource machine translation remains one of the hardest problems in NLP.
                            Models trained on insufficient data exhibit well-documented failure modes.
                            Our work aims to study these challenges specifically for Kashmiri.
                        </p>
                    </div>
                </section>

                {/* What We're Doing */}
                <section className="research-section">
                    <h2>2. Research Focus Areas</h2>
                    <div className="research-section-body">
                        <div className="contributions-grid">
                            <div className="contribution-card">
                                <span className="contribution-number">1</span>
                                <h4>Parallel Corpus Construction</h4>
                                <p>Aggregating and quality-filtering Kashmiri-English parallel data from multiple open sources.</p>
                            </div>
                            <div className="contribution-card">
                                <span className="contribution-number">2</span>
                                <h4>LLM Fine-Tuning</h4>
                                <p>Exploring how modern large language models can be adapted for Kashmiri translation tasks.</p>
                            </div>
                            <div className="contribution-card">
                                <span className="contribution-number">3</span>
                                <h4>Human Evaluation</h4>
                                <p>Building a community-driven evaluation platform with native Kashmiri speakers.</p>
                            </div>
                            <div className="contribution-card">
                                <span className="contribution-number">4</span>
                                <h4>Baseline Comparisons</h4>
                                <p>Comparing our approach against existing multilingual translation models.</p>
                            </div>
                        </div>
                        <p style={{ marginTop: 24, fontStyle: "italic", color: "var(--text-low)" }}>
                            Specific models, dataset sizes, training configurations, and evaluation
                            metrics are confidential until the research paper is published.
                        </p>
                    </div>
                </section>

                {/* Human Evaluation */}
                <section className="research-section">
                    <h2>3. Human Evaluation Platform</h2>
                    <div className="research-section-body">
                        <p>
                            A core component of this research is human evaluation by native Kashmiri speakers.
                            We built this platform — KashmirAI Research — specifically for this purpose.
                            Evaluators rate translations from anonymized systems on:
                        </p>
                        <ul className="research-list">
                            <li><strong>Adequacy (1-5)</strong> — How much meaning from the source is preserved</li>
                            <li><strong>Fluency (1-5)</strong> — How natural and grammatically correct the translation sounds</li>
                            <li><strong>Overall Preference</strong> — Which system produced the better translation</li>
                        </ul>
                        <div style={{ textAlign: "center", marginTop: 24 }}>
                            <Link href="/signup" className="btn btn-primary">
                                Contribute as an Evaluator →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Publication Status + Contact */}
                <section className="research-section">
                    <h2>Publication Status</h2>
                    <div className="research-section-body" style={{ textAlign: "center" }}>
                        <div className="research-badge" style={{ fontSize: "1rem", padding: "12px 24px" }}>
                            🔬 Research in Progress — Paper Forthcoming
                        </div>
                        <p style={{ marginTop: 16 }}>
                            Full results, metrics, and analysis will be published in an upcoming conference paper.
                        </p>
                        <div className="card" style={{ padding: 32, marginTop: 24, textAlign: "center" }}>
                            <h3 style={{ marginBottom: 12 }}>📞 Contact for Further Details</h3>
                            <p style={{ color: "var(--text-medium)", marginBottom: 8 }}>
                                For inquiries about this research, collaboration opportunities, or
                                early access to findings:
                            </p>
                            <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-high)" }}>
                                📱 +91 7006718915
                            </p>
                            <p style={{ color: "var(--text-low)", fontSize: "0.85rem", marginTop: 8 }}>
                                Faizan Ayoub — Lead Researcher, KashmirAI Research
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="site-footer">
                    <p>© 2025 KashmirAI Research — by Faizan Ayoub</p>
                    <p style={{ fontSize: "0.85rem", marginTop: 8 }}>
                        Kashmir's pioneering NLP research platform for Kashmiri language technology.
                    </p>
                </footer>
            </div>
        </>
    );
}
