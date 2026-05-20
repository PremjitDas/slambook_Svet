import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Share2, Copy, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api";

const THEME = {
  bride: {
    bg: "#120610",
    accent: "#D4829A",
    accentSoft: "#E8A8BC",
    accentDeep: "#A85070",
    glow1: "rgba(212,130,154,0.35)",
    glow2: "rgba(168,80,112,0.2)",
    glow3: "rgba(232,168,188,0.15)",
    text: "#FDF0F4",
    muted: "#B88898",
    cardBg: "rgba(212,130,154,0.06)",
    cardBorder: "rgba(212,130,154,0.2)",
    selBg: "rgba(212,130,154,0.14)",
    selBorder: "#D4829A",
    btnGrad: "linear-gradient(135deg,#D4829A 0%,#A85070 100%)",
    btnShadow: "rgba(212,130,154,0.5)",
    shimmer: "rgba(232,168,188,0.6)",
    icon: "♡",
    selIcon: "♡",
    fontStyle: "italic",
    phaseIcon: ["♡", "◇", "✦"],
  },
  groom: {
    bg: "#030A14",
    accent: "#2E6DA4",
    accentSoft: "#5090C8",
    accentDeep: "#1A4A78",
    glow1: "rgba(46,109,164,0.4)",
    glow2: "rgba(20,60,110,0.25)",
    glow3: "rgba(80,144,200,0.18)",
    text: "#EDF4FC",
    muted: "#5878A0",
    cardBg: "rgba(46,109,164,0.07)",
    cardBorder: "rgba(46,109,164,0.22)",
    selBg: "rgba(46,109,164,0.15)",
    selBorder: "#2E6DA4",
    btnGrad: "linear-gradient(135deg,#2E6DA4 0%,#1A4A78 100%)",
    btnShadow: "rgba(46,109,164,0.55)",
    shimmer: "rgba(80,144,200,0.6)",
    icon: "◆",
    selIcon: "✓",
    fontStyle: "normal",
    phaseIcon: ["◆", "◇", "✦"],
  },
};

/* Animated particle canvas for background */
function ParticleField({ role }) {
  const ref = useRef(null);
  const T = THEME[role];
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = role === "bride" ? 55 : 45;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      op: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
      pSpeed: Math.random() * 0.012 + 0.006,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pSpeed;
        if (p.x < 0) p.x = c.width;
        if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;
        const alpha = p.op * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          role === "bride"
            ? `rgba(212,130,154,${alpha})`
            : `rgba(80,144,200,${alpha})`;
        ctx.fill();
      });

      /* connect nearby dots */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            const alpha = (1 - dist / 110) * 0.08;
            ctx.strokeStyle =
              role === "bride"
                ? `rgba(212,130,154,${alpha})`
                : `rgba(46,109,164,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [role]);
  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

export default function QuizPage() {
  const { shareCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "bride";
  const isCreator = searchParams.get("creator") === "true";
  const T = THEME[role];

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [ownAnswers, setOwnAnswers] = useState({});
  const [partnerGuesses, setPartnerGuesses] = useState({});
  const [bonusAnswers, setBonusAnswers] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const [dir, setDir] = useState(1);

  const questionKeys = questions ? Object.keys(questions.main_questions) : [];
  const bonusKeys = questions ? Object.keys(questions.bonus_questions) : [];
  const totalSteps = questionKeys.length * 2 + bonusKeys.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  useEffect(() => {
    fetchData();
  }, [shareCode]);

  const fetchData = async () => {
    try {
      const sR = await axios.get(API + "/sessions/" + shareCode);
      console.log(sR);
      
      
      const qR = await axios.get(API + "/questions/"+ sR.data.data.age_range);
      setSession(sR.data.data);
      setQuestions(qR.data.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load quiz");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentQuestion = () => {
    if (!questions) return null;
    const pName = session?.partner_name || "Partner";
    if (currentStep < questionKeys.length) {
      const key = questionKeys[currentStep];
      return {
        ...questions.main_questions[key],
        key,
        phase: "own",
        phaseTitle: "Your Answer",
      };
    } else if (currentStep < questionKeys.length * 2) {
      const key = questionKeys[currentStep - questionKeys.length];
      return {
        ...questions.main_questions[key],
        key,
        phase: "guess",
        phaseTitle: `Guess ${pName}'s Answer`,
      };
    } else {
      const key = bonusKeys[currentStep - questionKeys.length * 2];
      return {
        ...questions.bonus_questions[key],
        key,
        phase: "bonus",
        phaseTitle: "Compatibility Check",
      };
    }
  };

  const handleAnswer = (answer) => {
    const q = getCurrentQuestion();
    if (!q) return;
    if (q.phase === "own")
      setOwnAnswers((p) => ({
        ...p,
        [q.id]: { question_id: q.id, category: q.category, answer },
      }));
    else if (q.phase === "guess")
      setPartnerGuesses((p) => ({
        ...p,
        [q.id]: {
          question_id: q.id,
          category: q.category,
          guessed_answer: answer,
        },
      }));
    else
      setBonusAnswers((p) => ({ ...p, [q.id]: { question_id: q.id, answer } }));
  };

  const getCurrentAnswer = () => {
    const q = getCurrentQuestion();
    if (!q) return null;
    if (q.phase === "own") return ownAnswers[q.id]?.answer;
    if (q.phase === "guess") return partnerGuesses[q.id]?.guessed_answer;
    return bonusAnswers[q.id]?.answer;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDir(1);
      setAnimKey((k) => k + 1);
      setCurrentStep((p) => p + 1);
    } else handleSubmit();
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setDir(-1);
      setAnimKey((k) => k + 1);
      setCurrentStep((p) => p - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(API + "/sessions/" + shareCode + "/submit", {
        role,
        own_answers: Object.values(ownAnswers),
        partner_guesses: Object.values(partnerGuesses),
        bonus_answers: Object.values(bonusAnswers),
      });
      toast.success("Answers saved!");
      if (isCreator) setShowShareModal(true);
      else {
        const u = await axios.get(API + "/sessions/" + shareCode);
        navigate("/results/" + shareCode);
        if (!u.data.bride_completed || !u.data.groom_completed)
          toast.info("Waiting for your partner!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(
      window.location.origin + "/join/" + shareCode,
    );
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{`@keyframes sp{to{transform:rotate(360deg)}}.ldr{width:36px;height:36px;border-radius:50%;border:1.5px solid ${T.cardBorder};border-top-color:${T.accent};animation:sp .8s linear infinite}`}</style>
        <div className="ldr" />
      </div>
    );

  const question = getCurrentQuestion();
  const phase = question?.phase || "own";
  const hasAns = !!getCurrentAnswer();
  const phaseIdx = phase === "own" ? 0 : phase === "guess" ? 1 : 2;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@200;300;400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${T.bg};overflow-x:hidden}

        /* ── Progress ── */
        .pb-rail{height:3px;background:rgba(255,255,255,0.05)}
        .pb-fill{height:100%;transition:width .8s cubic-bezier(.22,1,.36,1);
          background:linear-gradient(90deg,${T.accentDeep},${T.accent},${T.accentSoft},${T.accent});
          background-size:300% 100%;animation:pbShimmer 3s linear infinite}
        @keyframes pbShimmer{0%{background-position:0%}100%{background-position:300%}}

        /* ── Question slide ── */
        @keyframes slideInR{from{opacity:0;transform:translateX(60px) scale(0.97)}to{opacity:1;transform:translateX(0) scale(1)}}
        @keyframes slideInL{from{opacity:0;transform:translateX(-60px) scale(0.97)}to{opacity:1;transform:translateX(0) scale(1)}}
        .anim-fwd{animation:slideInR .5s cubic-bezier(.22,1,.36,1) both}
        .anim-bwd{animation:slideInL .5s cubic-bezier(.22,1,.36,1) both}

        /* ── Glow orb ── */
        @keyframes orbPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:.75}}
        .glow-orb{animation:orbPulse 7s ease-in-out infinite}

        /* ── Option card ── */
        .opt-card{
          width:100%;display:flex;align-items:center;gap:0;
          border-radius:20px;cursor:pointer;text-align:left;
          border:1px solid ${T.cardBorder};
          background:${T.cardBg};
          backdrop-filter:blur(12px);
          transition:transform .3s cubic-bezier(.22,1,.36,1),
            border-color .3s,background .3s,box-shadow .3s;
          overflow:hidden;position:relative;
        }
        .opt-card:hover{
          transform:translateY(-4px) scale(1.01);
          border-color:${T.selBorder};
          background:${T.selBg};
          box-shadow:0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${T.selBorder}22;
        }
        .opt-card.chosen{
          border-color:${T.selBorder};
          background:${T.selBg};
          transform:translateY(-4px);
          box-shadow:0 20px 56px rgba(0,0,0,0.45),
            0 0 0 1px ${T.selBorder}44,
            0 0 40px ${T.btnShadow};
        }
        /* Top sheen on hover/chosen */
        .opt-card::before{
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,${T.shimmer},transparent);
          opacity:0;transition:opacity .3s;
        }
        .opt-card:hover::before,.opt-card.chosen::before{opacity:1}

        /* Left accent bar */
        .opt-bar{
          width:4px;align-self:stretch;flex-shrink:0;
          background:${T.accent};opacity:0;
          transition:opacity .3s;
          border-radius:20px 0 0 20px;
        }
        .opt-card.chosen .opt-bar,.opt-card:hover .opt-bar{opacity:1}

        /* Key bubble */
        .opt-bubble{
          flex-shrink:0;width:40px;height:40px;border-radius:12px;
          display:flex;align-items:center;justify-content:center;
          font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;
          margin:0 16px;
          transition:background .3s,color .3s,box-shadow .3s,transform .3s;
          border:1px solid ${T.cardBorder};
          background:rgba(255,255,255,0.04);
          color:${T.muted};
        }
        .opt-card.chosen .opt-bubble{
          background:${T.accent};color:#fff;border-color:${T.accent};
          box-shadow:0 6px 20px ${T.btnShadow};
          transform:scale(1.08);
        }

        /* ── Text input ── */
        .ans-input{
          width:100%;padding:22px 26px;
          background:${T.cardBg};border:1px solid ${T.cardBorder};
          border-radius:20px;color:${T.text};
          font-family:'DM Sans',sans-serif;font-weight:300;font-size:16px;
          text-align:center;outline:none;
          backdrop-filter:blur(12px);
          transition:border-color .3s,box-shadow .3s;
          caret-color:${T.accent};
        }
        .ans-input::placeholder{color:${T.muted};opacity:0.45}
        .ans-input:focus{
          border-color:${T.selBorder};
          box-shadow:0 0 0 4px ${T.btnShadow}22,0 0 30px ${T.btnShadow}20;
        }

        /* ── Nav buttons ── */
        .btn-bk{
          display:inline-flex;align-items:center;gap:8px;
          padding:13px 26px;border-radius:100px;cursor:pointer;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          color:${T.muted};font-family:'DM Sans',sans-serif;
          font-size:11px;font-weight:300;letter-spacing:.18em;text-transform:uppercase;
          transition:all .3s;
        }
        .btn-bk:hover:not(:disabled){
          background:rgba(255,255,255,0.08);
          border-color:${T.accentSoft}44;color:${T.text};
        }
        .btn-bk:disabled{opacity:.2;cursor:default}

        .btn-nx{
          display:inline-flex;align-items:center;gap:10px;
          padding:14px 36px;border-radius:100px;cursor:pointer;border:none;
          font-family:'DM Sans',sans-serif;font-size:11px;
          font-weight:400;letter-spacing:.22em;text-transform:uppercase;
          transition:transform .3s,box-shadow .3s,filter .3s,opacity .3s;
          position:relative;overflow:hidden;
        }
        .btn-nx::before{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%);
          pointer-events:none;
        }
        .btn-nx::after{
          content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transition:left .55s;
        }
        .btn-nx:hover:not(:disabled)::after{left:150%}
        .btn-nx:hover:not(:disabled){transform:translateY(-3px);filter:brightness(1.12)}
        .btn-nx:active:not(:disabled){transform:translateY(-1px)}
        .btn-nx:disabled{opacity:.28;cursor:default}

        /* ── Step dots ── */
        .sdot{height:4px;border-radius:2px;transition:all .4s cubic-bezier(.22,1,.36,1)}

        /* ── Phase badge ── */
        @keyframes badgePulse{0%,100%{box-shadow:0 0 0 0 ${T.glow1}}60%{box-shadow:0 0 0 6px transparent}}
        .phase-badge{
          display:inline-flex;align-items:center;gap:8px;
          padding:6px 16px;border-radius:100px;
          border:1px solid ${T.cardBorder};
          background:${T.cardBg};backdrop-filter:blur(12px);
          animation:badgePulse 3s ease-in-out infinite;
        }

        /* ── Category tag ── */
        .cat-tag{
          display:inline-flex;align-items:center;gap:8px;
          padding:5px 18px;border-radius:100px;
          font-family:'DM Sans',sans-serif;font-size:9px;
          font-weight:300;letter-spacing:.32em;text-transform:uppercase;
          background:${T.selBg};border:1px solid ${T.selBorder}44;
          color:${T.accent};
        }

        /* ── Share modal ── */
        .smod{
          background:linear-gradient(145deg,${T.bg} 0%,${role === "bride" ? "#1E0818" : "#060F1E"} 100%);
          border:1px solid ${T.cardBorder};border-radius:28px;overflow:hidden;
          box-shadow:0 50px 120px rgba(0,0,0,0.85),0 0 80px ${T.btnShadow}22;
        }
        .smod-strip{height:4px;background:linear-gradient(90deg,${T.accentDeep},${T.accent},${T.accentSoft})}
        .smod-body{padding:36px 34px 32px}
        .slink-row{display:flex;gap:10px;margin-bottom:16px}
        .slink-inp{
          flex:1;background:rgba(255,255,255,0.04);
          border:1px solid ${T.cardBorder};border-radius:12px;
          color:${T.muted};font-family:'DM Sans',sans-serif;font-size:12px;
          padding:13px 16px;outline:none;
        }
        .scopy{
          padding:0 20px;border:none;border-radius:12px;cursor:pointer;
          background:${T.btnGrad};color:#fff;
          display:flex;align-items:center;justify-content:center;
          transition:transform .3s,filter .3s;
        }
        .scopy:hover{transform:translateY(-2px);filter:brightness(1.1)}
        .scode{
          text-align:center;padding:20px;margin-bottom:20px;
          background:${T.cardBg};border:1px solid ${T.cardBorder};border-radius:16px;
        }
        .sacts{display:flex;gap:10px}
        .sact{
          flex:1;padding:14px 6px;border-radius:100px;cursor:pointer;
          font-family:'DM Sans',sans-serif;font-size:10px;
          font-weight:400;letter-spacing:.18em;text-transform:uppercase;
          display:flex;align-items:center;justify-content:center;gap:8px;
          transition:transform .3s,box-shadow .3s;
        }
        .sact:hover{transform:translateY(-2px)}
        .sact-ghost{background:transparent;border:1px solid ${T.cardBorder};color:${T.text}}
        .sact-ghost:hover{border-color:${T.accentSoft}66;box-shadow:0 8px 24px ${T.btnShadow}22}
        .sact-fill{background:${T.btnGrad};border:none;color:#fff;box-shadow:0 8px 24px ${T.btnShadow}}
        .sact-fill:hover{box-shadow:0 14px 36px ${T.btnShadow}}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Particle network ── */}
        <ParticleField role={role} />

        {/* ── Large glow orb — center ── */}
        <div
          className="glow-orb"
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.glow1} 0%, ${T.glow2} 35%, transparent 70%)`,
            filter: "blur(80px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Secondary orb */}
        <div
          style={{
            position: "fixed",
            bottom: "10%",
            right: "5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.glow3} 0%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ═══════════════ TOP BAR ═══════════════ */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            background:
              role === "bride" ? "rgba(18,6,16,0.82)" : "rgba(3,10,20,0.86)",
            backdropFilter: "blur(28px)",
            borderBottom: `1px solid ${T.cardBorder}`,
          }}
        >
          {/* Progress bar */}
          <div className="pb-rail">
            <div className="pb-fill" style={{ width: progress + "%" }} />
          </div>

          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            {/* Phase badge */}
            <div className="phase-badge">
              <span style={{ fontSize: 14, color: T.accent }}>
                {T.phaseIcon[phaseIdx]}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10,
                  fontWeight: 300,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: T.accent,
                  whiteSpace: "nowrap",
                }}
              >
                {question?.phaseTitle}
              </span>
            </div>

            {/* Dots + counter */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: Math.min(totalSteps, 16) }).map(
                  (_, i) => {
                    const cur = i === Math.min(currentStep, 15);
                    const done = i < Math.min(currentStep, 15);
                    return (
                      <div
                        key={i}
                        className="sdot"
                        style={{
                          width: cur ? 20 : 4,
                          background: done
                            ? T.accent
                            : cur
                              ? T.accentSoft
                              : "rgba(255,255,255,0.1)",
                          opacity: done ? 0.45 : 1,
                          boxShadow: cur ? `0 0 8px ${T.accent}` : "none",
                        }}
                      />
                    );
                  },
                )}
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 300,
                  color: T.muted,
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                }}
              >
                {currentStep + 1}
                <span style={{ opacity: 0.3 }}>/{totalSteps}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════ MAIN CONTENT ═══════════════ */}
        <div
          style={{
            paddingTop: 100,
            paddingBottom: 120,
            paddingLeft: 24,
            paddingRight: 24,
            maxWidth: 680,
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
          }}
        >
          {question && (
            <div className={dir >= 0 ? "anim-fwd" : "anim-bwd"} key={animKey}>
              {/* Category tag */}
              {question.category && (
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <span className="cat-tag" data-testid="question-category">
                    {T.phaseIcon[phaseIdx]} {question.category}
                  </span>
                  {question.subtitle && (
                    <p
                      style={{
                        marginTop: 10,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        fontWeight: 200,
                        color: T.muted,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {question.subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Ornamental line */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginBottom: 36,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    maxWidth: 80,
                    height: 1,
                    background: `linear-gradient(90deg,transparent,${T.accent})`,
                  }}
                />
                <span style={{ color: T.accent, fontSize: 16, opacity: 0.7 }}>
                  {T.phaseIcon[phaseIdx]}
                </span>
                <div
                  style={{
                    flex: 1,
                    maxWidth: 80,
                    height: 1,
                    background: `linear-gradient(90deg,${T.accent},transparent)`,
                  }}
                />
              </div>

              {/* ── QUESTION TEXT — hero moment ── */}
              <div
                style={{
                  marginBottom: 48,
                  textAlign: "center",
                  padding: "32px 24px",
                  background:
                    role === "bride"
                      ? "linear-gradient(145deg,rgba(212,130,154,0.06),rgba(212,130,154,0.02))"
                      : "linear-gradient(145deg,rgba(46,109,164,0.07),rgba(46,109,164,0.02))",
                  borderRadius: 24,
                  border: `1px solid ${T.cardBorder}`,
                  backdropFilter: "blur(16px)",
                  boxShadow: `inset 0 1px 0 ${T.shimmer}18, 0 24px 60px rgba(0,0,0,0.3)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Inner glow */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 200,
                    height: 120,
                    borderRadius: "50%",
                    background: `radial-gradient(circle,${T.glow1} 0%,transparent 70%)`,
                    filter: "blur(30px)",
                    pointerEvents: "none",
                  }}
                />
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: role === "bride" ? 400 : 300,
                    fontStyle: role === "bride" ? "italic" : "normal",
                    fontSize: "clamp(1.55rem,4.5vw,2.5rem)",
                    color: T.text,
                    lineHeight: 1.38,
                    letterSpacing: role === "bride" ? "0.01em" : "0.025em",
                    position: "relative",
                    zIndex: 1,
                  }}
                  data-testid="question-text"
                >
                  {question.question}
                </h2>
              </div>

              {/* ── OPTIONS ── */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {question.type === "text" ? (
                  <input
                    className="ans-input"
                    value={getCurrentAnswer() || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Write your answer…"
                    data-testid="text-answer-input"
                  />
                ) : (
                  Object.entries(question.options || {}).map(
                    ([key, value], idx) => {
                      const sel = getCurrentAnswer() === key;
                      return (
                        <button
                          key={key}
                          className={`opt-card${sel ? " chosen" : ""}`}
                          onClick={() => handleAnswer(key)}
                          style={{ animationDelay: `${idx * 0.06}s` }}
                          data-testid={"option-" + key}
                        >
                          {/* Left accent bar */}
                          <div className="opt-bar" />

                          {/* Key bubble */}
                          <div className="opt-bubble">{key}</div>

                          {/* Text */}
                          <span
                            style={{
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: 14,
                              fontWeight: 300,
                              color: sel ? T.text : T.muted,
                              lineHeight: 1.65,
                              letterSpacing: "0.02em",
                              flex: 1,
                              paddingRight: 16,
                              paddingTop: 18,
                              paddingBottom: 18,
                              transition: "color .3s",
                            }}
                          >
                            {value}
                          </span>

                          {/* Chosen icon — right */}
                          {sel && (
                            <span
                              style={{
                                fontSize: role === "bride" ? 20 : 16,
                                color: T.accent,
                                paddingRight: 22,
                                flexShrink: 0,
                                animation: "none",
                                textShadow: `0 0 12px ${T.accent}`,
                              }}
                            >
                              {T.selIcon}
                            </span>
                          )}
                        </button>
                      );
                    },
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ BOTTOM NAV ═══════════════ */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            background:
              role === "bride" ? "rgba(18,6,16,0.9)" : "rgba(3,10,20,0.92)",
            backdropFilter: "blur(28px)",
            borderTop: `1px solid ${T.cardBorder}`,
          }}
        >
          <div
            style={{
              maxWidth: 680,
              margin: "0 auto",
              padding: "16px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              className="btn-bk"
              onClick={handleBack}
              disabled={currentStep === 0}
              data-testid="back-button"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <button
              className="btn-nx"
              onClick={handleNext}
              disabled={!hasAns || isSubmitting}
              style={{
                background: hasAns ? T.btnGrad : "rgba(255,255,255,0.05)",
                color: hasAns ? "#fff" : T.muted,
                boxShadow: hasAns ? `0 10px 36px ${T.btnShadow}` : "none",
              }}
              data-testid="next-button"
            >
              {isSubmitting
                ? "Saving…"
                : currentStep === totalSteps - 1
                  ? "Complete"
                  : "Continue"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* ═══════════════ SHARE MODAL ═══════════════ */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent
            className="sm:max-w-md"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              boxShadow: "none",
            }}
          >
            <div className="smod">
              <div className="smod-strip" />
              <div className="smod-body">
                {/* Ornament */}
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <svg width="110" height="22" viewBox="0 0 110 22" fill="none">
                    <line
                      x1="0"
                      y1="11"
                      x2="40"
                      y2="11"
                      stroke="url(#sg1)"
                      strokeWidth="0.7"
                    />
                    {role === "bride" ? (
                      <path
                        d="M49 11C51 6 55 3 55 11C55 3 59 6 61 11"
                        stroke={T.accent}
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                      />
                    ) : (
                      <rect
                        x="50"
                        y="6"
                        width="10"
                        height="10"
                        stroke={T.accent}
                        strokeWidth="0.8"
                        fill="none"
                      />
                    )}
                    <line
                      x1="70"
                      y1="11"
                      x2="110"
                      y2="11"
                      stroke="url(#sg2)"
                      strokeWidth="0.7"
                    />
                    <defs>
                      <linearGradient
                        id="sg1"
                        x1="0"
                        y1="0"
                        x2="40"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          offset="0%"
                          stopColor={T.accent}
                          stopOpacity="0"
                        />
                        <stop
                          offset="100%"
                          stopColor={T.accent}
                          stopOpacity="0.6"
                        />
                      </linearGradient>
                      <linearGradient
                        id="sg2"
                        x1="0"
                        y1="0"
                        x2="40"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          offset="0%"
                          stopColor={T.accent}
                          stopOpacity="0.6"
                        />
                        <stop
                          offset="100%"
                          stopColor={T.accent}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <DialogHeader style={{ marginBottom: 22 }}>
                  <DialogTitle
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontWeight: 400,
                      fontStyle: role === "bride" ? "italic" : "normal",
                      fontSize: 26,
                      textAlign: "center",
                      color: T.text,
                    }}
                  >
                    Share with {session?.partner_name}
                  </DialogTitle>
                  <DialogDescription
                    style={{
                      textAlign: "center",
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 200,
                      fontSize: 12,
                      color: T.muted,
                      letterSpacing: "0.05em",
                      marginTop: 8,
                    }}
                  >
                    Send this link so they can complete their book
                  </DialogDescription>
                </DialogHeader>

                <div className="slink-row">
                  <input
                    className="slink-inp"
                    value={window.location.origin + "/join/" + shareCode}
                    readOnly
                    data-testid="share-link-input"
                  />
                  <button
                    className="scopy"
                    onClick={copyShareLink}
                    data-testid="copy-link-button"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                </div>

                <div className="scode">
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 9,
                      fontWeight: 300,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: T.muted,
                      marginBottom: 12,
                    }}
                  >
                    Share Code
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 36,
                      letterSpacing: "0.4em",
                      color: T.text,
                      textShadow: `0 0 24px ${T.btnShadow}`,
                    }}
                    data-testid="share-code-display"
                  >
                    {shareCode}
                  </p>
                </div>

                <div className="sacts">
                  <button
                    className="sact sact-ghost"
                    onClick={copyShareLink}
                    data-testid="share-button"
                  >
                    <Share2 size={13} />
                    Share Link
                  </button>
                  <button
                    className="sact sact-fill"
                    onClick={() => navigate("/results/" + shareCode)}
                    data-testid="view-results-button"
                  >
                    View Results
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}