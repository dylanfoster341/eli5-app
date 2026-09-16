"use client";

import { useState, type FormEvent } from "react";

// PieceTogetherHero.tsx
//
// Drop this component anywhere in a Next.js (App Router) page, e.g.:
//
//   import PieceTogetherHero from "@/components/PieceTogetherHero";
//   export default function Home() {
//     return <PieceTogetherHero />;
//   }
//
// It's fully self-contained (styles + SVG + markup), so it won't clash with
// Tailwind or any other CSS in the project. All custom properties, keyframes,
// and SVG ids are scoped/prefixed so it's safe to drop into an existing app.
//
// The "Try it" card at the bottom is wired to POST /api/explain and render
// the response — delete it if your page already has its own input UI below
// this hero.
//
// Fonts: this uses "Unbounded" (headline) and "Work Sans" (body) from Google
// Fonts, loaded via the <link> below. If you'd rather use next/font, just
// remove the <link> and swap the font-family values in the <style> block for
// your next/font variable(s) — everything falls back to system-ui either way.

const PLACEHOLDER_ANSWER =
  "Sunlight looks white, but it's actually made of all the colors mixed together. When it hits our " +
  "air, blue light bounces around way more than the other colors — so when you look up, the blue is " +
  "what's bouncing back into your eyes from every direction.";

export default function PieceTogetherHero() {
  const [question, setQuestion] = useState("Why is the sky blue?");
  const [answer, setAnswer] = useState(PLACEHOLDER_ANSWER);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(res.ok ? data.answer : data.error ?? "Something went wrong.");
    } catch {
      setAnswer("Failed to reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="piece-together">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600&family=Work+Sans:wght@400;500;600&display=swap"
      />
      <style>{`
        .piece-together {
          --pt-bg: #f5f6fb;
          --pt-surface: #ffffff;
          --pt-ink: #171a2b;
          --pt-ink-soft: #5b5f77;
          --pt-border: rgba(23,26,43,0.10);
          --pt-shadow: rgba(23,26,43,0.22);

          --pt-indigo: #4a3fd6;
          --pt-coral: #ff6a4d;
          --pt-teal: #12b3a6;
          --pt-amber: #f2ab3d;
          --pt-violet: #9b6bf2;

          --pt-glow: #ffd666;
          --pt-focus: #4a3fd6;
        }
        @media (prefers-color-scheme: dark) {
          .piece-together:not([data-theme="light"]) {
            --pt-bg: #12131c;
            --pt-surface: #1b1d2b;
            --pt-ink: #f2f2f7;
            --pt-ink-soft: #a2a5bd;
            --pt-border: rgba(242,242,247,0.12);
            --pt-shadow: rgba(0,0,0,0.55);

            --pt-indigo: #6a5cf0;
            --pt-coral: #ff8163;
            --pt-teal: #2ad0c2;
            --pt-amber: #ffc25c;
            --pt-violet: #b28af5;

            --pt-glow: #ffe08a;
          }
        }
        .piece-together[data-theme="dark"] {
          --pt-bg: #12131c;
          --pt-surface: #1b1d2b;
          --pt-ink: #f2f2f7;
          --pt-ink-soft: #a2a5bd;
          --pt-border: rgba(242,242,247,0.12);
          --pt-shadow: rgba(0,0,0,0.55);

          --pt-indigo: #6a5cf0;
          --pt-coral: #ff8163;
          --pt-teal: #2ad0c2;
          --pt-amber: #ffc25c;
          --pt-violet: #b28af5;

          --pt-glow: #ffe08a;
        }

        .piece-together, .piece-together * { box-sizing: border-box; }

        .piece-together {
          background: var(--pt-bg);
          color: var(--pt-ink);
          font-family: "Work Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
          padding-inline: 20px;
          padding-block: 56px;
          display: flex;
          justify-content: center;
        }

        .piece-together .pt-page {
          width: 100%;
          max-width: 640px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 36px;
        }

        .piece-together .pt-stage {
          position: relative;
          width: 260px;
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .piece-together .pt-stage svg { overflow: visible; width: 260px; height: 260px; }

        .piece-together .pt-piece { animation: pt-dropFast .8s both; }
        .piece-together .pt-p1 { animation-delay: 0s; }
        .piece-together .pt-p2 { animation-delay: .30s; }
        .piece-together .pt-p3 { animation-delay: .60s; }
        .piece-together .pt-p4 { animation-delay: .90s; }

        @keyframes pt-dropFast {
          0%   { opacity: 0; transform: translateY(-190px); animation-timing-function: cubic-bezier(.5,0,.85,.35); }
          55%  { opacity: 1; transform: translateY(0); animation-timing-function: ease-out; }
          72%  { transform: translateY(-7px); animation-timing-function: ease-in; }
          100% { transform: translateY(0); }
        }

        .piece-together .pt-glow-group {
          opacity: 0;
          animation: pt-shine .5s ease-out 1.85s both, pt-pulse 2.6s ease-in-out 2.35s infinite;
        }
        @keyframes pt-shine {
          from { opacity: 0; transform: scale(.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pt-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: .74; }
        }

        .piece-together .pt-copy {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          opacity: 0;
          animation: pt-rise .6s ease-out 2.35s both;
        }
        @keyframes pt-rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .piece-together h1 {
          font-family: "Unbounded", "Work Sans", sans-serif;
          font-weight: 600;
          font-size: clamp(28px, 6vw, 38px);
          line-height: 1.15;
          text-wrap: balance;
          margin: 0;
        }
        .piece-together .pt-sub {
          color: var(--pt-ink-soft);
          font-size: 16px;
          max-width: 46ch;
          margin: 0;
        }

        .piece-together .pt-demo {
          width: 100%;
          background: var(--pt-surface);
          border: 1px solid var(--pt-border);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          opacity: 0;
          animation: pt-rise .6s ease-out 2.55s both;
        }
        .piece-together .pt-demo-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--pt-ink-soft);
        }
        .piece-together .pt-demo-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .piece-together .pt-demo-input {
          flex: 1 1 220px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--pt-border);
          background: var(--pt-bg);
          color: var(--pt-ink);
          font-family: inherit;
          font-size: 15px;
        }
        .piece-together .pt-demo-input:focus-visible { outline: 2px solid var(--pt-focus); outline-offset: 2px; }
        .piece-together .pt-demo-btn {
          padding: 12px 20px;
          border-radius: 12px;
          border: none;
          background: var(--pt-indigo);
          color: #fff;
          font-family: inherit;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }
        .piece-together .pt-demo-btn:focus-visible { outline: 2px solid var(--pt-indigo); outline-offset: 2px; }
        .piece-together .pt-demo-answer {
          border-left: 3px solid var(--pt-teal);
          padding-left: 14px;
          color: var(--pt-ink-soft);
          font-size: 15px;
          line-height: 1.55;
        }

        @media (prefers-reduced-motion: reduce) {
          .piece-together .pt-piece,
          .piece-together .pt-glow-group,
          .piece-together .pt-copy,
          .piece-together .pt-demo {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="pt-page">
        <div className="pt-stage">
          <svg
            viewBox="0 0 260 260"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Four interlocking puzzle pieces fitting together into a picture of a glowing lightbulb"
          >
            <defs>
              <linearGradient id="pt-bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--pt-indigo)" />
                <stop offset="55%" stopColor="var(--pt-violet)" />
                <stop offset="100%" stopColor="var(--pt-coral)" />
              </linearGradient>
              <radialGradient id="pt-bulbGrad" cx="45%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#fff7e0" />
                <stop offset="45%" stopColor="var(--pt-glow)" />
                <stop offset="100%" stopColor="var(--pt-amber)" />
              </radialGradient>
              <radialGradient id="pt-bulbGlow" cx="50%" cy="46%" r="55%">
                <stop offset="0%" stopColor="var(--pt-glow)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--pt-glow)" stopOpacity="0" />
              </radialGradient>
              <filter id="pt-iconGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* the single shared picture: a lightbulb on a soft gradient square.
                  each puzzle piece below is a clipped window onto this same artwork,
                  so together they reveal one coherent image rather than flat colors. */}
              <g id="pt-artwork">
                <rect x="60" y="60" width="140" height="140" fill="url(#pt-bgGrad)" />
                <circle cx="130" cy="108" r="42" fill="url(#pt-bulbGrad)" />
                <polygon points="114,146 146,146 140,158 120,158" fill="url(#pt-bulbGrad)" />
                <rect x="118" y="158" width="24" height="8" rx="2" fill="#8a8ea3" />
                <rect x="119" y="167" width="22" height="8" rx="2" fill="#787c92" />
                <rect x="120" y="176" width="20" height="10" rx="3" fill="#63677c" />
                <path
                  d="M116,114 Q123,92 130,114 Q137,92 144,114"
                  fill="none"
                  stroke="#4a2f10"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.55"
                />
              </g>

              {/* each piece's true jigsaw silhouette (straight outer edges, real
                  interlocking tab/blank knobs on its two inner edges) used to
                  window the shared artwork above */}
              <clipPath id="pt-clip-p1">
                <path d="M 60.00,60.00 L 130.00,60.00 L 130.00,78.90 Q 137.70,83.80 145.40,88.70 A 14.00,14.00 0 1 1 145.40,101.30 Q 137.70,106.20 130.00,111.10 L 130.00,130.00 L 111.10,130.00 Q 106.20,122.30 101.30,114.60 A 14.00,14.00 0 1 0 88.70,114.60 Q 83.80,122.30 78.90,130.00 L 60.00,130.00 L 60.00,60.00 Z" />
              </clipPath>
              <clipPath id="pt-clip-p2">
                <path d="M 130.00,60.00 L 200.00,60.00 L 200.00,130.00 L 181.10,130.00 Q 176.20,137.70 171.30,145.40 A 14.00,14.00 0 1 1 158.70,145.40 Q 153.80,137.70 148.90,130.00 L 130.00,130.00 L 130.00,111.10 Q 137.70,106.20 145.40,101.30 A 14.00,14.00 0 1 0 145.40,88.70 Q 137.70,83.80 130.00,78.90 L 130.00,60.00 Z" />
              </clipPath>
              <clipPath id="pt-clip-p3">
                <path d="M 60.00,130.00 L 78.90,130.00 Q 83.80,122.30 88.70,114.60 A 14.00,14.00 0 1 1 101.30,114.60 Q 106.20,122.30 111.10,130.00 L 130.00,130.00 L 130.00,148.90 Q 122.30,153.80 114.60,158.70 A 14.00,14.00 0 1 0 114.60,171.30 Q 122.30,176.20 130.00,181.10 L 130.00,200.00 L 60.00,200.00 L 60.00,130.00 Z" />
              </clipPath>
              <clipPath id="pt-clip-p4">
                <path d="M 130.00,130.00 L 148.90,130.00 Q 153.80,137.70 158.70,145.40 A 14.00,14.00 0 1 0 171.30,145.40 Q 176.20,137.70 181.10,130.00 L 200.00,130.00 L 200.00,200.00 L 130.00,200.00 L 130.00,181.10 Q 122.30,176.20 114.60,171.30 A 14.00,14.00 0 1 1 114.60,158.70 Q 122.30,153.80 130.00,148.90 L 130.00,130.00 Z" />
              </clipPath>
            </defs>

            {/* four real jigsaw pieces, each a clipped fragment of the SAME artwork
                above, dropping in and locking together into one square that reads
                as a single lightbulb picture. */}
            <g className="pt-piece pt-p1" style={{ filter: "drop-shadow(0 2px 3px var(--pt-shadow))" }}>
              <use href="#pt-artwork" clipPath="url(#pt-clip-p1)" />
              <path
                d="M 60.00,60.00 L 130.00,60.00 L 130.00,78.90 Q 137.70,83.80 145.40,88.70 A 14.00,14.00 0 1 1 145.40,101.30 Q 137.70,106.20 130.00,111.10 L 130.00,130.00 L 111.10,130.00 Q 106.20,122.30 101.30,114.60 A 14.00,14.00 0 1 0 88.70,114.60 Q 83.80,122.30 78.90,130.00 L 60.00,130.00 L 60.00,60.00 Z"
                fill="none"
                stroke="var(--pt-ink)"
                strokeOpacity="0.30"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>
            <g className="pt-piece pt-p2" style={{ filter: "drop-shadow(0 2px 3px var(--pt-shadow))" }}>
              <use href="#pt-artwork" clipPath="url(#pt-clip-p2)" />
              <path
                d="M 130.00,60.00 L 200.00,60.00 L 200.00,130.00 L 181.10,130.00 Q 176.20,137.70 171.30,145.40 A 14.00,14.00 0 1 1 158.70,145.40 Q 153.80,137.70 148.90,130.00 L 130.00,130.00 L 130.00,111.10 Q 137.70,106.20 145.40,101.30 A 14.00,14.00 0 1 0 145.40,88.70 Q 137.70,83.80 130.00,78.90 L 130.00,60.00 Z"
                fill="none"
                stroke="var(--pt-ink)"
                strokeOpacity="0.30"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>
            <g className="pt-piece pt-p3" style={{ filter: "drop-shadow(0 2px 3px var(--pt-shadow))" }}>
              <use href="#pt-artwork" clipPath="url(#pt-clip-p3)" />
              <path
                d="M 60.00,130.00 L 78.90,130.00 Q 83.80,122.30 88.70,114.60 A 14.00,14.00 0 1 1 101.30,114.60 Q 106.20,122.30 111.10,130.00 L 130.00,130.00 L 130.00,148.90 Q 122.30,153.80 114.60,158.70 A 14.00,14.00 0 1 0 114.60,171.30 Q 122.30,176.20 130.00,181.10 L 130.00,200.00 L 60.00,200.00 L 60.00,130.00 Z"
                fill="none"
                stroke="var(--pt-ink)"
                strokeOpacity="0.30"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>
            <g className="pt-piece pt-p4" style={{ filter: "drop-shadow(0 2px 3px var(--pt-shadow))" }}>
              <use href="#pt-artwork" clipPath="url(#pt-clip-p4)" />
              <path
                d="M 130.00,130.00 L 148.90,130.00 Q 153.80,137.70 158.70,145.40 A 14.00,14.00 0 1 0 171.30,145.40 Q 176.20,137.70 181.10,130.00 L 200.00,130.00 L 200.00,200.00 L 130.00,200.00 L 130.00,181.10 Q 122.30,176.20 114.60,171.30 A 14.00,14.00 0 1 1 114.60,158.70 Q 122.30,153.80 130.00,148.90 L 130.00,130.00 Z"
                fill="none"
                stroke="var(--pt-ink)"
                strokeOpacity="0.30"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>

            {/* shine, once the picture is complete */}
            <g className="pt-glow-group">
              <circle cx="130" cy="110" r="80" fill="url(#pt-bulbGlow)" />
              <g stroke="var(--pt-glow)" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" filter="url(#pt-iconGlow)">
                <line x1="78" y1="108" x2="64" y2="108" />
                <line x1="90" y1="76" x2="80" y2="66" />
                <line x1="130" y1="64" x2="130" y2="48" />
                <line x1="170" y1="76" x2="180" y2="66" />
                <line x1="182" y1="108" x2="196" y2="108" />
              </g>
            </g>
          </svg>
        </div>

        <div className="pt-copy">
          <h1>Explain It Like I&apos;m 5</h1>
          <p className="pt-sub">
            Confusing topic? Drop it in and watch it click into place.
          </p>
        </div>

        <div className="pt-demo">
          <span className="pt-demo-label">Try it</span>
          <form className="pt-demo-row" onSubmit={handleSubmit}>
            <input
              className="pt-demo-input"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={loading}
            />
            <button className="pt-demo-btn" type="submit" disabled={loading || !question.trim()}>
              {loading ? "Thinking…" : "Explain"}
            </button>
          </form>
          <p className="pt-demo-answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}