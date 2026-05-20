import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api";

function MagicCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const hearts = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      size: Math.random() * 10 + 4,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.06,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.018 + 0.006,
    }));

    const trail = [];
    const onMove = (e) => {
      for (let i = 0; i < 2; i++) {
        trail.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          r: Math.random() * 3 + 1,
          life: 1,
          decay: Math.random() * 0.04 + 0.025,
          hue: Math.random() > 0.5 ? "#E8B4A0" : "#C9A87C",
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    const drawHeart = (ctx, x, y, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.4);
      ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.3, 0, size * 0.5);
      ctx.bezierCurveTo(-size, -size * 0.3, -size * 0.5, -size, 0, -size * 0.4);
      ctx.closePath();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach((h) => {
        h.y -= h.speedY;
        h.x += Math.sin(h.wobble) * 0.4 + h.speedX;
        h.wobble += h.wobbleSpeed;
        if (h.y < -30) {
          h.y = canvas.height + 30;
          h.x = Math.random() * canvas.width;
        }
        ctx.globalAlpha = h.opacity;
        ctx.fillStyle = "#E8B4A0";
        drawHeart(ctx, h.x, h.y, h.size);
        ctx.fill();
      });
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life -= p.decay;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life * 0.65;
        ctx.fillStyle = p.hue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
      }}
    />
  );
}

/* ── Age groups config ── */
const AGE_GROUPS = [
  { value: "18-24", label: "18 – 24", sub: "young & free" },
  { value: "24-30", label: "24 – 30", sub: "finding our way" },
  { value: "30-40", label: "30 – 40", sub: "in our stride" },
  { value: "40-60", label: "40 – 60", sub: "seasoned together" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [role, setRole] = useState("");
  const [ageGroup, setAgeGroup] = useState(""); // ← new state
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = async () => {
    if (!partnerName.trim() || !role) {
      toast.error("Please enter your partner's name and select your role");
      return;
    }
    if (!ageGroup) {
      toast.error("Please select your age group");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(API + "/sessions", {
        partner_name: partnerName,
        role,
        age_range: ageGroup, // ← sent to API
      });
      console.log(response);
      toast.success("Your Slam Book has been created!");
      navigate(
        "/quiz/" + response.data.data.share_code + "?role=" + role + "&creator=true",
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to create session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinQuiz = async () => {
    if (!joinCode.trim()) {
      toast.error("Please enter a share code");
      return;
    }
    setIsLoading(true);
    try {
      await axios.get(API + "/sessions/" + joinCode.toUpperCase());
      navigate("/join/" + joinCode.toUpperCase());
    } catch (error) {
      console.error(error);
      toast.error("Session not found. Please check your code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@200;300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --night: #0D0B14;
          --deep: #110D1C;
          --panel: rgba(22,17,36,0.88);
          --rose-gold: #E8B4A0;
          --champagne: #C9A87C;
          --lavender: #B8A9D9;
          --blush: #D4829A;
          --text-main: #F5EFE8;
          --text-muted: #9B8FAA;
        }
        body { background: var(--night); }

        @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(40px,-30px) scale(1.12);} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-30px,20px) scale(0.9);} }
        @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(20px,30px) scale(1.08);}66%{transform:translate(-20px,-10px) scale(0.95);} }
        .orb1{animation:orb1 12s ease-in-out infinite;}
        .orb2{animation:orb2 16s ease-in-out infinite;}
        .orb3{animation:orb3 20s ease-in-out infinite;}

        @keyframes riseIn { from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);} }
        .rise1{animation:riseIn 1s 0.1s cubic-bezier(.22,1,.36,1) both;}
        .rise2{animation:riseIn 1s 0.3s cubic-bezier(.22,1,.36,1) both;}
        .rise3{animation:riseIn 1s 0.55s cubic-bezier(.22,1,.36,1) both;}
        .rise4{animation:riseIn 1s 0.8s cubic-bezier(.22,1,.36,1) both;}

        @keyframes shimmerSlide { 0%{background-position:-200% center;}100%{background-position:200% center;} }
        .shimmer-bar {
          height:1px;width:180px;margin:0 auto;
          background:linear-gradient(90deg,transparent 0%,#C9A87C 40%,#E8B4A0 60%,transparent 100%);
          background-size:200% 100%;animation:shimmerSlide 3s linear infinite;
        }

        .badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;border:1px solid rgba(232,180,160,0.3);background:rgba(232,180,160,0.08);font-family:'DM Sans',sans-serif;font-size:10px;font-weight:300;letter-spacing:0.25em;text-transform:uppercase;color:var(--rose-gold);}
        .badge-dot{width:4px;height:4px;border-radius:50%;background:var(--rose-gold);animation:bdPulse 2s ease-in-out infinite;}
        @keyframes bdPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.6);}}

        .hero-title{font-family:'Playfair Display',serif;font-weight:400;font-size:clamp(3.6rem,9vw,6.5rem);line-height:1.04;letter-spacing:-0.02em;color:var(--text-main);}
        .hero-title .italic{font-style:italic;color:var(--rose-gold);}
        .hero-title .amp{font-style:italic;color:var(--champagne);font-size:0.85em;}

        .cta-primary{display:inline-flex;align-items:center;gap:10px;padding:15px 34px;background:linear-gradient(135deg,#E8B4A0 0%,#C9807A 100%);color:#1A0F18;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;border:none;border-radius:100px;cursor:pointer;transition:transform .3s,box-shadow .3s,filter .3s;box-shadow:0 8px 32px rgba(232,180,160,0.3);position:relative;overflow:hidden;}
        .cta-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%);pointer-events:none;}
        .cta-primary:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(232,180,160,0.45);filter:brightness(1.07);}

        .cta-outline{display:inline-flex;align-items:center;gap:10px;padding:14px 34px;background:transparent;color:var(--text-main);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;border:1px solid rgba(232,180,160,0.35);border-radius:100px;cursor:pointer;transition:transform .3s,box-shadow .3s,border-color .3s,background .3s;backdrop-filter:blur(8px);}
        .cta-outline:hover{transform:translateY(-3px);border-color:rgba(232,180,160,0.7);background:rgba(232,180,160,0.08);box-shadow:0 8px 32px rgba(232,180,160,0.15);}

        @keyframes scrollPulse{0%,100%{opacity:.2;transform:translateX(-50%) scaleY(1);}50%{opacity:.8;transform:translateX(-50%) scaleY(1.2);}}
        .scroll-indicator{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);width:1px;height:60px;background:linear-gradient(to bottom,transparent,var(--champagne),transparent);animation:scrollPulse 2.5s ease-in-out infinite;}

        .section-label{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:300;letter-spacing:0.35em;text-transform:uppercase;color:var(--champagne);margin-bottom:16px;text-align:center;}
        .section-title{font-family:'Playfair Display',serif;font-weight:400;font-size:clamp(2rem,4vw,2.8rem);color:var(--text-main);text-align:center;letter-spacing:0.01em;}

        .step-card{padding:44px 32px;border-radius:20px;border:1px solid rgba(232,180,160,0.1);background:var(--panel);backdrop-filter:blur(20px);position:relative;overflow:hidden;text-align:center;transition:transform .4s cubic-bezier(.22,1,.36,1),border-color .4s,box-shadow .4s;}
        .step-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--rose-gold),transparent);opacity:0;transition:opacity .4s;}
        .step-card:hover{transform:translateY(-8px);border-color:rgba(232,180,160,0.28);box-shadow:0 24px 60px rgba(0,0,0,0.4);}
        .step-card:hover::before{opacity:1;}

        .step-num-big{font-family:'Playfair Display',serif;font-size:72px;font-weight:400;line-height:1;margin-bottom:20px;display:block;background:linear-gradient(135deg,rgba(232,180,160,0.15),rgba(201,168,124,0.08));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;transition:all .4s;}
        .step-card:hover .step-num-big{background:linear-gradient(135deg,#E8B4A0,#C9A87C);-webkit-background-clip:text;background-clip:text;}
        .step-icon-ring{width:52px;height:52px;border-radius:50%;border:1px solid rgba(232,180,160,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;background:rgba(232,180,160,0.05);transition:border-color .4s,background .4s;}
        .step-card:hover .step-icon-ring{border-color:rgba(232,180,160,0.4);background:rgba(232,180,160,0.12);}
        .step-title{font-family:'Playfair Display',serif;font-weight:400;font-size:20px;color:var(--text-main);margin-bottom:12px;}
        .step-desc{font-family:'DM Sans',sans-serif;font-weight:200;font-size:13.5px;color:var(--text-muted);line-height:1.85;}

        @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        .marquee-track{display:flex;gap:60px;white-space:nowrap;animation:marquee 22s linear infinite;}
        .marquee-item{font-family:'Playfair Display',serif;font-style:italic;font-size:13px;color:rgba(232,180,160,0.28);letter-spacing:0.08em;user-select:none;}
        .marquee-dot{display:inline-block;width:3px;height:3px;border-radius:50%;background:rgba(201,168,124,0.28);vertical-align:middle;margin:0 30px;}

        /* ══ MODAL ══ */
        .vv-modal-content {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          max-width: 460px !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          overflow: visible !important;
        }
        .modal-card {
          position: relative; border-radius: 28px; overflow: hidden;
          background: #0F0C1A; border: 1px solid rgba(232,180,160,0.15);
          box-shadow: 0 0 0 1px rgba(232,180,160,0.05), 0 32px 80px rgba(0,0,0,0.8), 0 0 120px rgba(212,130,154,0.08);
        }
        .modal-banner { height: 6px; background: linear-gradient(90deg,#B8A9D9 0%,#E8B4A0 40%,#C9A87C 70%,#D4829A 100%); }
        .modal-glow {
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle,rgba(212,130,154,0.12) 0%,transparent 70%);
          filter: blur(40px); pointer-events: none; z-index: 0;
        }
        .modal-inner { position: relative; z-index: 1; padding: 36px 36px 32px; }
        .modal-ornament { display: flex; justify-content: center; margin-bottom: 18px; }
        .modal-title { font-family:'Playfair Display',serif; font-weight:400; font-style:italic; font-size:28px; text-align:center; color:var(--text-main); letter-spacing:0.01em; margin-bottom:4px; }
        .modal-sub { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:300; letter-spacing:0.22em; text-transform:uppercase; color:var(--text-muted); text-align:center; margin-bottom:32px; }
        .modal-divider { height:1px; margin:24px 0; background:linear-gradient(90deg,transparent,rgba(232,180,160,0.15),transparent); }
        .field-label { display:block; font-family:'DM Sans',sans-serif; font-size:10px; font-weight:300; letter-spacing:0.3em; text-transform:uppercase; color:rgba(184,169,217,0.7); margin-bottom:10px; }
        .field-input { width:100%; background:rgba(255,255,255,0.03); border:1px solid rgba(232,180,160,0.12); border-radius:14px; color:var(--text-main); font-family:'DM Sans',sans-serif; font-weight:300; font-size:15px; padding:14px 18px; outline:none; transition:border-color .3s,box-shadow .3s,background .3s; caret-color:var(--rose-gold); }
        .field-input::placeholder { color:rgba(155,143,170,0.35); }
        .field-input:focus { border-color:rgba(232,180,160,0.35); background:rgba(232,180,160,0.04); box-shadow:0 0 0 3px rgba(232,180,160,0.06),0 0 20px rgba(232,180,160,0.05); }
        .field-input-code { text-align:center; letter-spacing:0.35em; font-size:18px; font-weight:300; }
        .role-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .role-tile { position:relative; cursor:pointer; padding:0; border:none; background:none; border-radius:18px; overflow:hidden; transition:transform .3s cubic-bezier(.22,1,.36,1); }
        .role-tile:hover { transform:translateY(-3px); }
        .role-tile-inner { border-radius:18px; border:1px solid rgba(232,180,160,0.1); background:rgba(255,255,255,0.025); padding:22px 16px 18px; display:flex; flex-direction:column; align-items:center; gap:8px; transition:border-color .3s,background .3s,box-shadow .3s; position:relative; overflow:hidden; }
        .role-tile-inner::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(232,180,160,0.3),transparent); opacity:0; transition:opacity .3s; }
        .role-tile:hover .role-tile-inner::before { opacity:1; }
        .role-tile.bride-active .role-tile-inner { border-color:rgba(212,130,154,0.5); background:linear-gradient(145deg,rgba(212,130,154,0.12) 0%,rgba(212,130,154,0.04) 100%); box-shadow:0 0 32px rgba(212,130,154,0.12),inset 0 1px 0 rgba(212,130,154,0.2); }
        .role-tile.groom-active .role-tile-inner { border-color:rgba(184,169,217,0.5); background:linear-gradient(145deg,rgba(184,169,217,0.12) 0%,rgba(184,169,217,0.04) 100%); box-shadow:0 0 32px rgba(184,169,217,0.12),inset 0 1px 0 rgba(184,169,217,0.2); }
        .role-icon-wrap { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:4px; transition:transform .3s; }
        .role-tile:hover .role-icon-wrap { transform:scale(1.1); }
        .role-icon-bride { background:rgba(212,130,154,0.15); border:1px solid rgba(212,130,154,0.25); }
        .role-icon-groom { background:rgba(184,169,217,0.15); border:1px solid rgba(184,169,217,0.25); }
        .role-tile-name { font-family:'Playfair Display',serif; font-style:italic; font-size:17px; color:var(--text-main); display:block; }
        .role-tile-sub { font-family:'DM Sans',sans-serif; font-size:9px; letter-spacing:0.25em; text-transform:uppercase; color:var(--text-muted); display:block; }
        .role-check { position:absolute; top:10px; right:10px; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:600; opacity:0; transition:opacity .3s,transform .3s; transform:scale(0.5); }
        .bride-active .role-check { background:rgba(212,130,154,0.9); opacity:1; transform:scale(1); }
        .groom-active .role-check { background:rgba(184,169,217,0.9); opacity:1; transform:scale(1); }

        /* ── Age group pills ── */
        .age-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .age-pill {
          cursor:pointer; border:none; padding:0; background:none;
          border-radius:14px; overflow:hidden;
          transition:transform .28s cubic-bezier(.22,1,.36,1);
        }
        .age-pill:hover { transform:translateY(-2px); }
        .age-pill-inner {
          border-radius:14px;
          border:1px solid rgba(232,180,160,0.1);
          background:rgba(255,255,255,0.025);
          padding:14px 16px 12px;
          display:flex; flex-direction:column; align-items:center; gap:4px;
          transition:border-color .28s, background .28s, box-shadow .28s;
          position:relative; overflow:hidden;
        }
        .age-pill-inner::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(201,168,124,0.4),transparent);
          opacity:0; transition:opacity .28s;
        }
        .age-pill:hover .age-pill-inner::before { opacity:1; }
        .age-pill.age-active .age-pill-inner {
          border-color:rgba(201,168,124,0.55);
          background:linear-gradient(145deg,rgba(201,168,124,0.13) 0%,rgba(201,168,124,0.04) 100%);
          box-shadow:0 0 28px rgba(201,168,124,0.14),inset 0 1px 0 rgba(201,168,124,0.22);
        }
        .age-pill-label {
          font-family:'Playfair Display',serif; font-style:italic;
          font-size:15px; color:var(--text-main); display:block;
          transition:color .28s;
        }
        .age-pill.age-active .age-pill-label { color:#C9A87C; }
        .age-pill-sub {
          font-family:'DM Sans',sans-serif; font-size:9px;
          letter-spacing:0.22em; text-transform:uppercase;
          color:var(--text-muted); display:block;
        }
        /* check dot for age */
        .age-check {
          position:absolute; top:8px; right:8px;
          width:16px; height:16px; border-radius:50%;
          background:rgba(201,168,124,0.9);
          display:flex; align-items:center; justify-content:center;
          font-size:8px; font-weight:700; color:#1A0F18;
          opacity:0; transform:scale(0.4);
          transition:opacity .28s, transform .28s;
        }
        .age-active .age-check { opacity:1; transform:scale(1); }

        .modal-btn { width:100%; padding:16px; border:none; border-radius:100px; cursor:pointer; background:linear-gradient(135deg,#E8B4A0 0%,#D4829A 50%,#C9807A 100%); background-size:200% 100%; background-position:0% center; color:#1A0F18; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:400; letter-spacing:0.22em; text-transform:uppercase; display:flex; align-items:center; justify-content:center; gap:10px; transition:transform .3s,box-shadow .3s,background-position .4s; box-shadow:0 8px 28px rgba(232,180,160,0.25),0 2px 8px rgba(212,130,154,0.2); position:relative; overflow:hidden; margin-top:4px; }
        .modal-btn::before { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transition:left .5s; }
        .modal-btn:hover::before { left:150%; }
        .modal-btn:hover { transform:translateY(-2px); box-shadow:0 14px 40px rgba(232,180,160,0.35),0 4px 16px rgba(212,130,154,0.25); background-position:100% center; }
        .modal-btn:active { transform:translateY(0); }
        .modal-btn:disabled { opacity:.55; cursor:default; transform:none; }
        .modal-footer-note { text-align:center; margin-top:20px; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:300; color:rgba(155,143,170,0.4); letter-spacing:0.06em; }
      `}</style>

      <div style={{ background: "var(--night)", minHeight: "100vh" }}>
        {/* ─── HERO ─── */}
        <section
          style={{
            minHeight: "100vh",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('https://images.unsplash.com/photo-1668321654792-e576f8e703d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.2) saturate(0.55)",
              zIndex: 0,
            }}
          />
          <div
            className="orb1"
            style={{
              position: "absolute",
              top: "15%",
              left: "20%",
              width: 480,
              height: 480,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(212,130,154,0.22) 0%,transparent 70%)",
              filter: "blur(60px)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <div
            className="orb2"
            style={{
              position: "absolute",
              bottom: "10%",
              right: "15%",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(184,169,217,0.18) 0%,transparent 70%)",
              filter: "blur(70px)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <div
            className="orb3"
            style={{
              position: "absolute",
              top: "50%",
              left: "55%",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(201,168,124,0.14) 0%,transparent 70%)",
              filter: "blur(50px)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
          <MagicCanvas />
          <div
            style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              padding: "0 24px",
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            <div className="rise1" style={{ marginBottom: 28 }}>
              <span className="badge">
                <span className="badge-dot" />A Love Language Experience
              </span>
            </div>
            <h1
              className="hero-title rise2"
              data-testid="hero-title"
              style={{ marginBottom: 28 }}
            >
              Vows <span className="amp">&amp;</span>
              <br />
              <span className="italic">Volumes</span>
            </h1>
            <div className="rise2 shimmer-bar" style={{ marginBottom: 28 }} />
            <p
              className="rise3"
              data-testid="hero-subtitle"
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 200,
                fontSize: 15,
                color: "var(--text-muted)",
                lineHeight: 1.9,
                maxWidth: 440,
                margin: "0 auto 52px",
                letterSpacing: "0.03em",
              }}
            >
              Discover your wedding style through the five love languages. Fill
              your book, guess your partner's answers, and unlock personalised
              décor recommendations.
            </p>
            <div
              className="rise4"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "center",
              }}
            >
              <button
                className="cta-primary"
                onClick={() => setShowStartModal(true)}
                data-testid="start-quiz-button"
              >
                <Heart size={15} strokeWidth={1.5} />
                Start Your Slam Book
              </button>
              <button
                className="cta-outline"
                onClick={() => setShowJoinModal(true)}
                data-testid="join-quiz-button"
              >
                <Sparkles size={15} strokeWidth={1.5} />
                Join Partner's Book
              </button>
            </div>
          </div>
          <div className="scroll-indicator" />
        </section>

        {/* ─── MARQUEE ─── */}
        <div
          style={{
            overflow: "hidden",
            padding: "18px 0",
            borderTop: "1px solid rgba(232,180,160,0.07)",
            borderBottom: "1px solid rgba(232,180,160,0.07)",
            background: "rgba(255,255,255,0.012)",
          }}
        >
          <div className="marquee-track">
            {[...Array(2)].map((_, rep) =>
              [
                "Love Languages",
                "Décor Dreams",
                "Compatibility",
                "Forever Begins",
                "Wedding Vision",
                "Vows & Volumes",
                "Soulmate Style",
              ].map((t, i) => (
                <span key={`${rep}-${i}`} className="marquee-item">
                  {t}
                  <span className="marquee-dot" />
                </span>
              )),
            )}
          </div>
        </div>

        {/* ─── HOW IT WORKS ─── */}
        <section
          style={{
            padding: "120px 24px",
            background:
              "linear-gradient(180deg,var(--night) 0%,#110D1C 50%,var(--night) 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(232,180,160,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(232,180,160,0.022) 1px,transparent 1px)`,
              backgroundSize: "80px 80px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}
          >
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <p className="section-label" data-testid="hero-overline">
                The Journey
              </p>
              <h2 className="section-title">How It Works</h2>
              <div className="shimmer-bar" style={{ marginTop: 22 }} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: 24,
              }}
            >
              {[
                {
                  step: "01",
                  icon: "♡",
                  title: "Fill Your Book",
                  desc: "Answer questions about your wedding dreams based on the five love languages.",
                  color: "#D4829A",
                },
                {
                  step: "02",
                  icon: "✦",
                  title: "Guess & Share",
                  desc: "Predict your partner's answers, then share your unique link for them to complete.",
                  color: "#C9A87C",
                },
                {
                  step: "03",
                  icon: "◇",
                  title: "Discover Together",
                  desc: "See your compatibility score and receive AI-powered décor recommendations.",
                  color: "#B8A9D9",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="step-card"
                  data-testid={`feature-${idx + 1}`}
                >
                  <span className="step-num-big">{item.step}</span>
                  <div className="step-icon-ring">
                    <span style={{ fontSize: 18, color: item.color }}>
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            START SLAM BOOK MODAL
        ══════════════════════════════════ */}
        <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
          <DialogContent className="vv-modal-content">
            <div className="modal-card">
              <div className="modal-banner" />
              <div className="modal-glow" />

              <div className="modal-inner">
                {/* Ornament */}
                <div className="modal-ornament">
                  <svg width="120" height="22" viewBox="0 0 120 22" fill="none">
                    <line
                      x1="0"
                      y1="11"
                      x2="42"
                      y2="11"
                      stroke="url(#mg1)"
                      strokeWidth="0.7"
                    />
                    <path
                      d="M51 11 C53 6 57 3 60 11 C63 3 67 6 69 11"
                      stroke="#E8B4A0"
                      strokeWidth="0.9"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <line
                      x1="78"
                      y1="11"
                      x2="120"
                      y2="11"
                      stroke="url(#mg2)"
                      strokeWidth="0.7"
                    />
                    <defs>
                      <linearGradient
                        id="mg1"
                        x1="0"
                        y1="0"
                        x2="42"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#C9A87C" stopOpacity="0" />
                        <stop
                          offset="100%"
                          stopColor="#C9A87C"
                          stopOpacity="1"
                        />
                      </linearGradient>
                      <linearGradient
                        id="mg2"
                        x1="0"
                        y1="0"
                        x2="42"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#C9A87C" stopOpacity="1" />
                        <stop
                          offset="100%"
                          stopColor="#C9A87C"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <p className="modal-title">Begin Your Journey</p>
                <p className="modal-sub">Create your shared slam book</p>

                {/* Partner name */}
                <div style={{ marginBottom: 22 }}>
                  <label className="field-label">Your Partner's Name</label>
                  <input
                    className="field-input"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter their name…"
                    data-testid="partner-name-input"
                  />
                </div>

                {/* Role picker */}
                <div style={{ marginBottom: 22 }}>
                  <label className="field-label" style={{ marginBottom: 14 }}>
                    I Am The…
                  </label>
                  <div className="role-grid">
                    <button
                      className={`role-tile${role === "bride" ? " bride-active" : ""}`}
                      onClick={() => setRole("bride")}
                      data-testid="role-bride-button"
                    >
                      <div className="role-tile-inner">
                        <div
                          className="role-check"
                          style={{ color: "#1A0F18" }}
                        >
                          ✓
                        </div>
                        <div className="role-icon-wrap role-icon-bride">
                          <span style={{ color: "#D4829A" }}>♡</span>
                        </div>
                        <span className="role-tile-name">Bride</span>
                        <span className="role-tile-sub">the beloved</span>
                      </div>
                    </button>
                    <button
                      className={`role-tile${role === "groom" ? " groom-active" : ""}`}
                      onClick={() => setRole("groom")}
                      data-testid="role-groom-button"
                    >
                      <div className="role-tile-inner">
                        <div
                          className="role-check"
                          style={{ color: "#1A0F18" }}
                        >
                          ✓
                        </div>
                        <div className="role-icon-wrap role-icon-groom">
                          <span style={{ color: "#B8A9D9" }}>◇</span>
                        </div>
                        <span className="role-tile-name">Groom</span>
                        <span className="role-tile-sub">the devoted</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ── AGE GROUP ── */}
                <div style={{ marginBottom: 26 }}>
                  <label className="field-label" style={{ marginBottom: 14 }}>
                    Your Age Group
                  </label>
                  <div className="age-grid">
                    {AGE_GROUPS.map((ag) => (
                      <button
                        key={ag.value}
                        className={`age-pill${ageGroup === ag.value ? " age-active" : ""}`}
                        onClick={() => setAgeGroup(ag.value)}
                        data-testid={`age-group-${ag.value}`}
                      >
                        <div className="age-pill-inner">
                          <div className="age-check">✓</div>
                          <span className="age-pill-label">{ag.label}</span>
                          <span className="age-pill-sub">{ag.sub}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-divider" />

                <button
                  className="modal-btn"
                  onClick={handleStartQuiz}
                  disabled={isLoading}
                  data-testid="create-session-button"
                >
                  {isLoading ? "Creating…" : "Create My Slam Book"}
                  <ArrowRight size={14} />
                </button>

                <p className="modal-footer-note">
                  Your partner will receive a unique link to join
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ══════════════════════════════════
            JOIN PARTNER MODAL
        ══════════════════════════════════ */}
        <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
          <DialogContent className="vv-modal-content">
            <div className="modal-card">
              <div className="modal-banner" />
              <div
                className="modal-glow"
                style={{
                  background:
                    "radial-gradient(circle,rgba(184,169,217,0.12) 0%,transparent 70%)",
                }}
              />

              <div className="modal-inner">
                <div className="modal-ornament">
                  <svg width="120" height="22" viewBox="0 0 120 22" fill="none">
                    <line
                      x1="0"
                      y1="11"
                      x2="42"
                      y2="11"
                      stroke="url(#mg3)"
                      strokeWidth="0.7"
                    />
                    <path
                      d="M51 11 C53 6 57 3 60 11 C63 3 67 6 69 11"
                      stroke="#B8A9D9"
                      strokeWidth="0.9"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <line
                      x1="78"
                      y1="11"
                      x2="120"
                      y2="11"
                      stroke="url(#mg4)"
                      strokeWidth="0.7"
                    />
                    <defs>
                      <linearGradient
                        id="mg3"
                        x1="0"
                        y1="0"
                        x2="42"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#B8A9D9" stopOpacity="0" />
                        <stop
                          offset="100%"
                          stopColor="#B8A9D9"
                          stopOpacity="1"
                        />
                      </linearGradient>
                      <linearGradient
                        id="mg4"
                        x1="0"
                        y1="0"
                        x2="42"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#B8A9D9" stopOpacity="1" />
                        <stop
                          offset="100%"
                          stopColor="#B8A9D9"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <p className="modal-title">Join Your Partner</p>
                <p className="modal-sub">Enter the code they shared with you</p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "8px 0 28px",
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,rgba(184,169,217,0.15),rgba(232,180,160,0.08))",
                      border: "1px solid rgba(184,169,217,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      color: "var(--lavender)",
                      boxShadow: "0 0 32px rgba(184,169,217,0.1)",
                    }}
                  >
                    ✦
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label
                    className="field-label"
                    style={{ textAlign: "center", display: "block" }}
                  >
                    Share Code
                  </label>
                  <input
                    className="field-input field-input-code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ABC12345"
                    maxLength={8}
                    data-testid="join-code-input"
                    style={{
                      textAlign: "center",
                      letterSpacing: "0.35em",
                      fontSize: 20,
                    }}
                  />
                </div>

                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    fontWeight: 300,
                    color: "rgba(155,143,170,0.4)",
                    textAlign: "center",
                    letterSpacing: "0.05em",
                    marginBottom: 24,
                  }}
                >
                  8-character code from your partner
                </p>

                <div className="modal-divider" />

                <button
                  className="modal-btn"
                  onClick={handleJoinQuiz}
                  disabled={isLoading}
                  style={{
                    background:
                      "linear-gradient(135deg,#B8A9D9 0%,#9B88C5 50%,#7B6BAA 100%)",
                    boxShadow: "0 8px 28px rgba(184,169,217,0.2)",
                  }}
                  data-testid="join-session-button"
                >
                  {isLoading ? "Finding…" : "Join Slam Book"}
                  <ArrowRight size={14} />
                </button>

                <p className="modal-footer-note">
                  You'll answer the same questions as your partner
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

