"use client";

import { useState, useRef } from "react";

const ScoreRing = ({ score }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#FCE300" : score >= 50 ? "#FF3D00" : "#ff1a1a";
  const glowColor = score >= 75 ? "rgba(252,227,0,0.6)" : score >= 50 ? "rgba(255,61,0,0.6)" : "rgba(255,26,26,0.6)";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <svg width="140" height="140" viewBox="0 0 140 140"
        style={{ filter: `drop-shadow(0 0 14px ${glowColor})` }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="butt"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px', transition: 'stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text x="70" y="63" textAnchor="middle" fill={color} fontSize="32" fontFamily="Orbitron" fontWeight="900">{score}</text>
        <text x="70" y="82" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="Share Tech Mono" letterSpacing="2">/100</text>
      </svg>
      <span style={{
        color, fontFamily: 'Orbitron', fontWeight: 900,
        fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase',
        textShadow: `0 0 14px ${color}`,
      }}>
        {score >= 75 ? "◈ GÜÇLÜ CV" : score >= 50 ? "◈ GELİŞTİRİLMELİ" : "◈ ZAYIF CV"}
      </span>
    </div>
  );
};

const Section = ({ title, items, variant, delay }) => {
  const styles = {
    yellow: { bg: 'rgba(0,0,0,0.88)', border: '#FCE300', color: '#FCE300' },
    red:    { bg: 'rgba(0,0,0,0.88)', border: '#FF3D00', color: '#FF3D00' },
    cyan:   { bg: 'rgba(0,0,0,0.88)', border: '#00B4D8', color: '#00B4D8' },
    orange: { bg: 'rgba(0,0,0,0.88)', border: '#FF6400', color: '#FF6400' },
  };
  const s = styles[variant] || styles.yellow;

  return (
    <div className="card-enter result-card cyber-box"
      style={{ animationDelay: `${delay}s`, padding: '24px', background: s.bg, borderTop: `3px solid ${s.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ color: s.color, textShadow: `0 0 8px ${s.color}` }}>◆</span>
        <h3 style={{
          fontFamily: 'Orbitron', fontWeight: 900,
          fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: s.color, textShadow: `0 0 10px ${s.color}44`,
        }}>{title}</h3>
      </div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '12px', lineHeight: '1.7', color: '#ddd' }}>
            <span style={{ color: s.color, flexShrink: 0, fontWeight: 900, fontSize: '1.1rem', textShadow: `0 0 6px ${s.color}` }}>›</span>
            <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', letterSpacing: '0.02em' }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f); setResult(null); setError(null);
    } else {
      setError("HATA: Sadece .PDF formatı kabul edilir.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
    const res = await fetch("https://cv-analyzer-backend-i5nq.onrender.com/analyze", {
  method: "POST",
  body: formData,
});
      if (!res.ok) throw new Error("ANALİZ BAŞARISIZ — Sunucu hatası.");
      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="noise" />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px, 6vw, 64px) clamp(16px, 5vw, 28px) 60px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)', color: '#080808', letterSpacing: '0.2em', opacity: 0.6 }}>
              SYS://AI_ANALYZER_v2.0
            </span>
            <div className="deco-line" style={{ flex: 1, minWidth: '40px' }} />
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: 'clamp(0.5rem, 1.5vw, 0.6rem)', color: '#080808', letterSpacing: '0.1em', opacity: 0.5 }}>
              NODE_ACTIVE<span className="blink">_</span>
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Orbitron', fontWeight: 900,
            fontSize: 'clamp(2.8rem, 10vw, 6rem)',
            lineHeight: '0.9', letterSpacing: '-0.01em', color: '#080808',
          }}>CV</h1>

          <h1 className="glitch" data-text="ANALİZÖR" style={{
            fontFamily: 'Orbitron', fontWeight: 900,
            fontSize: 'clamp(2.8rem, 10vw, 6rem)',
            lineHeight: '0.9', color: '#00B4D8',
            letterSpacing: '-0.01em',
            textShadow: '0 0 20px rgba(0,180,216,0.4)',
          }}>ANALİZÖR</h1>

          <p style={{
            marginTop: '24px', color: 'rgba(0,0,0,0.5)',
            fontFamily: 'Share Tech Mono',
            fontSize: 'clamp(0.65rem, 2vw, 0.78rem)',
            maxWidth: '440px', lineHeight: '2.2', letterSpacing: '0.04em',
          }}>
            // UPLOAD CV.PDF → AI SCAN →<br />
            // STRENGTHS + WEAKNESSES + SCORE<br />
            // POWERED BY CLAUDE AI ENGINE
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={`upload-zone cyber-box ${dragging ? 'dragging' : ''}`}
          style={{ padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 40px)', textAlign: 'center', marginBottom: '12px' }}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])} />

          {file ? (
            <div>
              <div style={{ fontSize: '2.2rem', marginBottom: '12px', color: '#080808' }}>◈</div>
              <p style={{ fontFamily: 'Orbitron', fontWeight: 900, color: '#080808', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', letterSpacing: '0.03em', wordBreak: 'break-all' }}>
                {file.name}
              </p>
              <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.65rem', marginTop: '8px', fontFamily: 'Share Tech Mono', letterSpacing: '0.1em' }}>
                {(file.size / 1024).toFixed(0)}KB — CLICK TO CHANGE
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '2.2rem', marginBottom: '14px', color: 'rgba(0,0,0,0.2)', fontFamily: 'Orbitron' }}>⬆</div>
              <p style={{ fontFamily: 'Orbitron', fontWeight: 700, color: 'rgba(0,0,0,0.45)', fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                DROP PDF HERE OR CLICK
              </p>
              <p style={{ color: 'rgba(0,0,0,0.25)', fontSize: '0.65rem', marginTop: '8px', fontFamily: 'Share Tech Mono', letterSpacing: '0.15em' }}>
                MAX_SIZE: 5MB
              </p>
            </div>
          )}
        </div>

        <button className="btn-primary" onClick={handleAnalyze} disabled={!file || loading}
          style={{ width: '100%', marginTop: '12px', marginBottom: '28px' }}>
          {loading ? <span className="pulse">◈ SCANNING...</span> : "◈ RUN ANALYSIS →"}
        </button>

        {loading && (
          <div style={{ marginBottom: '36px' }}>
            <div className="progress-bar" />
            <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: '0.65rem', marginTop: '10px', fontFamily: 'Share Tech Mono', letterSpacing: '0.1em' }}>
              // AI_ENGINE PROCESSING INPUT... PLEASE WAIT
            </p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(0,0,0,0.85)', border: '2px solid #FF3D00',
            padding: '14px 20px', color: '#FF3D00',
            fontFamily: 'Share Tech Mono', fontSize: 'clamp(0.72rem, 2vw, 0.82rem)',
            marginBottom: '24px', letterSpacing: '0.06em',
            boxShadow: '0 0 20px rgba(255,61,0,0.2)',
          }}>
            ✗ {error}
          </div>
        )}

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Score + Summary */}
            <div className="card-enter result-card cyber-box" style={{
              background: 'rgba(0,0,0,0.88)', borderTop: '3px solid #FCE300',
              padding: 'clamp(20px, 4vw, 36px)',
              display: 'flex', gap: 'clamp(24px, 4vw, 48px)',
              alignItems: 'flex-start', flexWrap: 'wrap',
            }}>
              <ScoreRing score={result.overall_score} />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ color: '#FCE300', textShadow: '0 0 8px #FCE300' }}>◆</span>
                  <h3 style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(0.65rem, 2vw, 0.78rem)', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FCE300' }}>
                    GENEL DEĞERLENDİRME
                  </h3>
                </div>
                <p style={{ color: '#ccc', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', lineHeight: '1.9', fontFamily: 'Rajdhani', fontWeight: 600, letterSpacing: '0.02em' }}>
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Keywords */}
            {result.keywords?.length > 0 && (
              <div className="card-enter stagger-1" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.keywords.map((kw, i) => <span key={i} className="tag">{kw}</span>)}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: '14px' }}>
              {result.strengths?.length > 0 && <Section title="Güçlü Yönler" items={result.strengths} variant="yellow" delay={0.2} />}
              {result.weaknesses?.length > 0 && <Section title="Zayıf Yönler" items={result.weaknesses} variant="red" delay={0.3} />}
            </div>

            {result.suggestions?.length > 0 && <Section title="Öneriler" items={result.suggestions} variant="cyan" delay={0.4} />}
            {result.missing_sections?.length > 0 && result.missing_sections[0] !== "" &&
              <Section title="Eksik Bölümler" items={result.missing_sections} variant="orange" delay={0.5} />}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
              <button className="btn-secondary" onClick={() => { setResult(null); setFile(null); }}>
                ◈ YENİ ANALİZ →
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: '72px', paddingTop: '20px',
          borderTop: '2px solid rgba(0,0,0,0.15)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        }}>
          <span style={{ color: 'rgba(0,0,0,0.35)', fontFamily: 'Share Tech Mono', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
            // POWERED_BY CLAUDE_AI
          </span>
          <span style={{
            color: '#ffffff', fontFamily: 'Orbitron', fontWeight: 900,
            fontSize: 'clamp(0.65rem, 2vw, 0.82rem)', letterSpacing: '0.18em', textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(0,0,0,0.9)',
            background: 'rgba(0,0,0,0.8)',
            padding: '7px 18px',
            clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
          }}>
            © CEM KARACA 2026
          </span>
        </footer>

      </main>
    </>
  );
}
