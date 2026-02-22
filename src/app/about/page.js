import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "About Faizan Ayoub — AI Researcher | KashmirAI Research",
    description:
        "Faizan Ayoub is an AI researcher and developer building Kashmir's pioneering NLP research infrastructure. Specializing in low-resource machine translation, LLM fine-tuning, and Kashmiri language technology.",
    keywords: [
        "Faizan Ayoub AI researcher",
        "Kashmiri NLP researcher",
        "Kashmir AI developer",
        "low-resource NLP",
        "machine translation researcher",
    ],
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Faizan (Hajam) Ayoub",
    jobTitle: "AI Researcher & Developer",
    url: "https://kashmiri-eval.vercel.app/about",
    knowsAbout: [
        "Natural Language Processing",
        "Machine Translation",
        "Low-Resource Languages",
        "Kashmiri Language",
        "Large Language Models",
        "Deep Learning",
        "Data Science",
    ],
    worksFor: {
        "@type": "Organization",
        name: "KashmirAI Research",
        url: "https://kashmiri-eval.vercel.app",
    },
};

export default function AboutPage() {
    return (
        <>
            <div className="bg-mesh" />
            <div className="glow-blob glow-blob-1" />
            <div className="glow-blob glow-blob-2" />
            <div className="glow-blob glow-blob-3" />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

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
                {/* Profile Header */}
                <section className="about-hero">
                    <div className="about-avatar animate-in">
                        <Image
                            src="/faizan-ayoub-hero.png"
                            alt="Faizan Ayoub - Founder of CalmConnect and AI Researcher"
                            width={120}
                            height={120}
                            className="about-avatar-image"
                            priority
                        />
                    </div>
                    <h1 className="animate-in animate-in-delay-1">Faizan (Hajam) Ayoub</h1>
                    <p className="about-role animate-in animate-in-delay-2">AI Researcher & Developer</p>
                    <p className="about-tagline animate-in animate-in-delay-3">
                        Building Kashmir's pioneering NLP research infrastructure.<br />
                        Passionate about applying cutting-edge AI to preserve and empower low-resource languages.
                    </p>
                </section>

                {/* Bio */}
                <section className="research-section">
                    <h2>About Me</h2>
                    <div className="research-section-body">
                        <p>
                            I'm Faizan Ayoub, an AI researcher and developer focused on NLP for low-resource
                            languages. My current work centers on building Kashmiri language technology,
                            specifically machine translation systems that can bridge the digital divide
                            for underserved languages.
                        </p>
                        <p>
                            I created <strong>KashmirAI Research</strong> — Kashmir's pioneering NLP
                            research platform — to advance machine translation capabilities for the Kashmiri
                            language and make the research publicly accessible. This platform combines
                            cutting-edge LLM fine-tuning with community-driven human evaluation from native
                            Kashmiri speakers.
                        </p>
                    </div>
                </section>

                {/* Research Interests */}
                <section className="research-section">
                    <h2>Research Interests</h2>
                    <div className="research-section-body">
                        <div className="interests-grid">
                            <div className="interest-tag">🧠 Large Language Models</div>
                            <div className="interest-tag">🌐 Low-Resource NLP</div>
                            <div className="interest-tag">🔤 Machine Translation</div>
                            <div className="interest-tag">📝 Kashmiri Language Tech</div>
                            <div className="interest-tag">⚡ Fine-Tuning Techniques</div>
                            <div className="interest-tag">📊 Data Science</div>
                            <div className="interest-tag">🤖 Deep Learning</div>
                            <div className="interest-tag">🔬 Computational Linguistics</div>
                        </div>
                    </div>
                </section>

                {/* Current Project */}
                <section className="research-section">
                    <h2>Current Project</h2>
                    <div className="research-section-body">
                        <div className="card" style={{ padding: 32 }}>
                            <h3 style={{ marginBottom: 12 }}>
                                🔬 Kashmiri-English Machine Translation
                            </h3>
                            <p style={{ color: "var(--text-medium)", lineHeight: 1.8, marginBottom: 16 }}>
                                Fine-tuning large language models for
                                Kashmiri→English translation. Includes dataset construction from multiple
                                open sources, comparative studies, and human evaluation
                                via this platform. Paper forthcoming.
                            </p>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <span className="badge badge-accent">LLM Fine-Tuning</span>
                                <span className="badge badge-accent">Low-Resource NLP</span>
                                <span className="badge badge-accent">Parallel Corpus</span>
                                <span className="badge badge-accent">Human Eval</span>
                            </div>
                            <div style={{ marginTop: 20 }}>
                                <Link href="/research" className="btn btn-secondary" style={{ padding: "10px 24px" }}>
                                    View Full Research →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="research-section">
                    <h2>Technical Skills</h2>
                    <div className="research-section-body">
                        <div className="skills-grid">
                            <div className="skill-category">
                                <h4>🤖 AI / ML</h4>
                                <ul>
                                    <li>PyTorch & Deep Learning Frameworks</li>
                                    <li>LLM Fine-Tuning</li>
                                    <li>SentenceTransformers</li>
                                    <li>Translation Evaluation Metrics</li>
                                    <li>Deep Learning</li>
                                </ul>
                            </div>
                            <div className="skill-category">
                                <h4>💻 Development</h4>
                                <ul>
                                    <li>Python, JavaScript</li>
                                    <li>Next.js & React</li>
                                    <li>Supabase (Auth, Database, RLS)</li>
                                    <li>Kaggle Notebooks</li>
                                    <li>Google Colab</li>
                                </ul>
                            </div>
                            <div className="skill-category">
                                <h4>📊 Data</h4>
                                <ul>
                                    <li>Pandas & NumPy</li>
                                    <li>Corpus Construction & Filtering</li>
                                    <li>Data Quality Assessment</li>
                                    <li>Cross-lingual Embeddings</li>
                                    <li>Statistical Analysis</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="research-section">
                    <h2>Get in Touch</h2>
                    <div className="research-section-body" style={{ textAlign: "center" }}>
                        <p style={{ marginBottom: 16 }}>
                            Interested in collaborating on Kashmiri NLP research or low-resource language technology?
                            I'd love to hear from you.
                        </p>
                        <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-high)", marginBottom: 20 }}>
                            📱 +91 7006718915
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="https://github.com/faizanHajam120" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: "12px 28px" }}>
                                GitHub
                            </a>
                            <a href="https://linkedin.com/in/faizan-hajam" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: "12px 28px" }}>
                                LinkedIn
                            </a>
                            <Link href="/signup" className="btn btn-primary" style={{ padding: "12px 28px" }}>
                                Join as Evaluator
                            </Link>
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
