// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Heart, Sparkles, ArrowRight } from "lucide-react";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { toast } from "sonner";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL + "/api";

// function MagicCanvas() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     let animId;

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     resize();
//     window.addEventListener("resize", resize);

//     const hearts = Array.from({ length: 28 }, () => ({
//       x: Math.random() * window.innerWidth,
//       y: Math.random() * window.innerHeight + window.innerHeight,
//       size: Math.random() * 10 + 4,
//       speedY: Math.random() * 0.6 + 0.2,
//       speedX: (Math.random() - 0.5) * 0.3,
//       opacity: Math.random() * 0.3 + 0.06,
//       wobble: Math.random() * Math.PI * 2,
//       wobbleSpeed: Math.random() * 0.018 + 0.006,
//     }));

//     const trail = [];
//     const onMove = (e) => {
//       for (let i = 0; i < 2; i++) {
//         trail.push({
//           x: e.clientX + (Math.random() - 0.5) * 12,
//           y: e.clientY + (Math.random() - 0.5) * 12,
//           r: Math.random() * 3 + 1,
//           life: 1,
//           decay: Math.random() * 0.04 + 0.025,
//           hue: Math.random() > 0.5 ? "#E8B4A0" : "#C9A87C",
//         });
//       }
//     };
//     window.addEventListener("mousemove", onMove);

//     const drawHeart = (ctx, x, y, size) => {
//       ctx.save();
//       ctx.translate(x, y);
//       ctx.beginPath();
//       ctx.moveTo(0, -size * 0.4);
//       ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.3, 0, size * 0.5);
//       ctx.bezierCurveTo(-size, -size * 0.3, -size * 0.5, -size, 0, -size * 0.4);
//       ctx.closePath();
//       ctx.restore();
//     };

//     const tick = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       hearts.forEach((h) => {
//         h.y -= h.speedY;
//         h.x += Math.sin(h.wobble) * 0.4 + h.speedX;
//         h.wobble += h.wobbleSpeed;
//         if (h.y < -30) {
//           h.y = canvas.height + 30;
//           h.x = Math.random() * canvas.width;
//         }
//         ctx.globalAlpha = h.opacity;
//         ctx.fillStyle = "#E8B4A0";
//         drawHeart(ctx, h.x, h.y, h.size);
//         ctx.fill();
//       });
//       for (let i = trail.length - 1; i >= 0; i--) {
//         const p = trail[i];
//         p.life -= p.decay;
//         if (p.life <= 0) {
//           trail.splice(i, 1);
//           continue;
//         }
//         ctx.globalAlpha = p.life * 0.65;
//         ctx.fillStyle = p.hue;
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
//         ctx.fill();
//       }
//       ctx.globalAlpha = 1;
//       animId = requestAnimationFrame(tick);
//     };
//     tick();

//     return () => {
//       cancelAnimationFrame(animId);
//       window.removeEventListener("resize", resize);
//       window.removeEventListener("mousemove", onMove);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: "absolute",
//         inset: 0,
//         pointerEvents: "none",
//         zIndex: 5,
//       }}
//     />
//   );
// }

// /* ── Age groups config ── */
// const AGE_GROUPS = [
//   { value: "18-24", label: "18 – 24", sub: "young & free" },
//   { value: "24-30", label: "24 – 30", sub: "finding our way" },
//   { value: "30-40", label: "30 – 40", sub: "in our stride" },
//   { value: "40-60", label: "40 – 60", sub: "seasoned together" },
// ];

// export default function LandingPage() {
//   const navigate = useNavigate();
//   const [showStartModal, setShowStartModal] = useState(false);
//   const [showJoinModal, setShowJoinModal] = useState(false);
//   const [partnerName, setPartnerName] = useState("");
//   const [role, setRole] = useState("");
//   const [ageGroup, setAgeGroup] = useState(""); // ← new state
//   const [joinCode, setJoinCode] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleStartQuiz = async () => {
//     if (!partnerName.trim() || !role) {
//       toast.error("Please enter your partner's name and select your role");
//       return;
//     }
//     if (!ageGroup) {
//       toast.error("Please select your age group");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await axios.post(API + "/sessions", {
//         partner_name: partnerName,
//         role,
//         age_range: ageGroup, // ← sent to API
//       });
//       console.log(response);
//       toast.success("Your Slam Book has been created!");
//       navigate(
//         "/quiz/" + response.data.data.share_code + "?role=" + role + "&creator=true",
//       );
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to create session. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleJoinQuiz = async () => {
//     if (!joinCode.trim()) {
//       toast.error("Please enter a share code");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       await axios.get(API + "/sessions/" + joinCode.toUpperCase());
//       navigate("/join/" + joinCode.toUpperCase());
//     } catch (error) {
//       console.error(error);
//       toast.error("Session not found. Please check your code.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@200;300;400&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         :root {
//           --night: #0D0B14;
//           --deep: #110D1C;
//           --panel: rgba(22,17,36,0.88);
//           --rose-gold: #E8B4A0;
//           --champagne: #C9A87C;
//           --lavender: #B8A9D9;
//           --blush: #D4829A;
//           --text-main: #F5EFE8;
//           --text-muted: #9B8FAA;
//         }
//         body { background: var(--night); }

//         @keyframes orb1 { 0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(40px,-30px) scale(1.12);} }
//         @keyframes orb2 { 0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-30px,20px) scale(0.9);} }
//         @keyframes orb3 { 0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(20px,30px) scale(1.08);}66%{transform:translate(-20px,-10px) scale(0.95);} }
//         .orb1{animation:orb1 12s ease-in-out infinite;}
//         .orb2{animation:orb2 16s ease-in-out infinite;}
//         .orb3{animation:orb3 20s ease-in-out infinite;}

//         @keyframes riseIn { from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);} }
//         .rise1{animation:riseIn 1s 0.1s cubic-bezier(.22,1,.36,1) both;}
//         .rise2{animation:riseIn 1s 0.3s cubic-bezier(.22,1,.36,1) both;}
//         .rise3{animation:riseIn 1s 0.55s cubic-bezier(.22,1,.36,1) both;}
//         .rise4{animation:riseIn 1s 0.8s cubic-bezier(.22,1,.36,1) both;}

//         @keyframes shimmerSlide { 0%{background-position:-200% center;}100%{background-position:200% center;} }
//         .shimmer-bar {
//           height:1px;width:180px;margin:0 auto;
//           background:linear-gradient(90deg,transparent 0%,#C9A87C 40%,#E8B4A0 60%,transparent 100%);
//           background-size:200% 100%;animation:shimmerSlide 3s linear infinite;
//         }

//         .badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;border:1px solid rgba(232,180,160,0.3);background:rgba(232,180,160,0.08);font-family:'DM Sans',sans-serif;font-size:10px;font-weight:300;letter-spacing:0.25em;text-transform:uppercase;color:var(--rose-gold);}
//         .badge-dot{width:4px;height:4px;border-radius:50%;background:var(--rose-gold);animation:bdPulse 2s ease-in-out infinite;}
//         @keyframes bdPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.6);}}

//         .hero-title{font-family:'Playfair Display',serif;font-weight:400;font-size:clamp(3.6rem,9vw,6.5rem);line-height:1.04;letter-spacing:-0.02em;color:var(--text-main);}
//         .hero-title .italic{font-style:italic;color:var(--rose-gold);}
//         .hero-title .amp{font-style:italic;color:var(--champagne);font-size:0.85em;}

//         .cta-primary{display:inline-flex;align-items:center;gap:10px;padding:15px 34px;background:linear-gradient(135deg,#E8B4A0 0%,#C9807A 100%);color:#1A0F18;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;border:none;border-radius:100px;cursor:pointer;transition:transform .3s,box-shadow .3s,filter .3s;box-shadow:0 8px 32px rgba(232,180,160,0.3);position:relative;overflow:hidden;}
//         .cta-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%);pointer-events:none;}
//         .cta-primary:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(232,180,160,0.45);filter:brightness(1.07);}

//         .cta-outline{display:inline-flex;align-items:center;gap:10px;padding:14px 34px;background:transparent;color:var(--text-main);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;border:1px solid rgba(232,180,160,0.35);border-radius:100px;cursor:pointer;transition:transform .3s,box-shadow .3s,border-color .3s,background .3s;backdrop-filter:blur(8px);}
//         .cta-outline:hover{transform:translateY(-3px);border-color:rgba(232,180,160,0.7);background:rgba(232,180,160,0.08);box-shadow:0 8px 32px rgba(232,180,160,0.15);}

//         @keyframes scrollPulse{0%,100%{opacity:.2;transform:translateX(-50%) scaleY(1);}50%{opacity:.8;transform:translateX(-50%) scaleY(1.2);}}
//         .scroll-indicator{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);width:1px;height:60px;background:linear-gradient(to bottom,transparent,var(--champagne),transparent);animation:scrollPulse 2.5s ease-in-out infinite;}

//         .section-label{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:300;letter-spacing:0.35em;text-transform:uppercase;color:var(--champagne);margin-bottom:16px;text-align:center;}
//         .section-title{font-family:'Playfair Display',serif;font-weight:400;font-size:clamp(2rem,4vw,2.8rem);color:var(--text-main);text-align:center;letter-spacing:0.01em;}

//         .step-card{padding:44px 32px;border-radius:20px;border:1px solid rgba(232,180,160,0.1);background:var(--panel);backdrop-filter:blur(20px);position:relative;overflow:hidden;text-align:center;transition:transform .4s cubic-bezier(.22,1,.36,1),border-color .4s,box-shadow .4s;}
//         .step-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--rose-gold),transparent);opacity:0;transition:opacity .4s;}
//         .step-card:hover{transform:translateY(-8px);border-color:rgba(232,180,160,0.28);box-shadow:0 24px 60px rgba(0,0,0,0.4);}
//         .step-card:hover::before{opacity:1;}

//         .step-num-big{font-family:'Playfair Display',serif;font-size:72px;font-weight:400;line-height:1;margin-bottom:20px;display:block;background:linear-gradient(135deg,rgba(232,180,160,0.15),rgba(201,168,124,0.08));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;transition:all .4s;}
//         .step-card:hover .step-num-big{background:linear-gradient(135deg,#E8B4A0,#C9A87C);-webkit-background-clip:text;background-clip:text;}
//         .step-icon-ring{width:52px;height:52px;border-radius:50%;border:1px solid rgba(232,180,160,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;background:rgba(232,180,160,0.05);transition:border-color .4s,background .4s;}
//         .step-card:hover .step-icon-ring{border-color:rgba(232,180,160,0.4);background:rgba(232,180,160,0.12);}
//         .step-title{font-family:'Playfair Display',serif;font-weight:400;font-size:20px;color:var(--text-main);margin-bottom:12px;}
//         .step-desc{font-family:'DM Sans',sans-serif;font-weight:200;font-size:13.5px;color:var(--text-muted);line-height:1.85;}

//         @keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
//         .marquee-track{display:flex;gap:60px;white-space:nowrap;animation:marquee 22s linear infinite;}
//         .marquee-item{font-family:'Playfair Display',serif;font-style:italic;font-size:13px;color:rgba(232,180,160,0.28);letter-spacing:0.08em;user-select:none;}
//         .marquee-dot{display:inline-block;width:3px;height:3px;border-radius:50%;background:rgba(201,168,124,0.28);vertical-align:middle;margin:0 30px;}

//         /* ══ MODAL ══ */
//         .vv-modal-content {
//           background: transparent !important;
//           border: none !important;
//           padding: 0 !important;
//           max-width: 460px !important;
//           border-radius: 0 !important;
//           box-shadow: none !important;
//           overflow: visible !important;
//         }
//         .modal-card {
//           position: relative; border-radius: 28px; overflow: hidden;
//           background: #0F0C1A; border: 1px solid rgba(232,180,160,0.15);
//           box-shadow: 0 0 0 1px rgba(232,180,160,0.05), 0 32px 80px rgba(0,0,0,0.8), 0 0 120px rgba(212,130,154,0.08);
//         }
//         .modal-banner { height: 6px; background: linear-gradient(90deg,#B8A9D9 0%,#E8B4A0 40%,#C9A87C 70%,#D4829A 100%); }
//         .modal-glow {
//           position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
//           width: 300px; height: 300px; border-radius: 50%;
//           background: radial-gradient(circle,rgba(212,130,154,0.12) 0%,transparent 70%);
//           filter: blur(40px); pointer-events: none; z-index: 0;
//         }
//         .modal-inner { position: relative; z-index: 1; padding: 36px 36px 32px; }
//         .modal-ornament { display: flex; justify-content: center; margin-bottom: 18px; }
//         .modal-title { font-family:'Playfair Display',serif; font-weight:400; font-style:italic; font-size:28px; text-align:center; color:var(--text-main); letter-spacing:0.01em; margin-bottom:4px; }
//         .modal-sub { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:300; letter-spacing:0.22em; text-transform:uppercase; color:var(--text-muted); text-align:center; margin-bottom:32px; }
//         .modal-divider { height:1px; margin:24px 0; background:linear-gradient(90deg,transparent,rgba(232,180,160,0.15),transparent); }
//         .field-label { display:block; font-family:'DM Sans',sans-serif; font-size:10px; font-weight:300; letter-spacing:0.3em; text-transform:uppercase; color:rgba(184,169,217,0.7); margin-bottom:10px; }
//         .field-input { width:100%; background:rgba(255,255,255,0.03); border:1px solid rgba(232,180,160,0.12); border-radius:14px; color:var(--text-main); font-family:'DM Sans',sans-serif; font-weight:300; font-size:15px; padding:14px 18px; outline:none; transition:border-color .3s,box-shadow .3s,background .3s; caret-color:var(--rose-gold); }
//         .field-input::placeholder { color:rgba(155,143,170,0.35); }
//         .field-input:focus { border-color:rgba(232,180,160,0.35); background:rgba(232,180,160,0.04); box-shadow:0 0 0 3px rgba(232,180,160,0.06),0 0 20px rgba(232,180,160,0.05); }
//         .field-input-code { text-align:center; letter-spacing:0.35em; font-size:18px; font-weight:300; }
//         .role-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
//         .role-tile { position:relative; cursor:pointer; padding:0; border:none; background:none; border-radius:18px; overflow:hidden; transition:transform .3s cubic-bezier(.22,1,.36,1); }
//         .role-tile:hover { transform:translateY(-3px); }
//         .role-tile-inner { border-radius:18px; border:1px solid rgba(232,180,160,0.1); background:rgba(255,255,255,0.025); padding:22px 16px 18px; display:flex; flex-direction:column; align-items:center; gap:8px; transition:border-color .3s,background .3s,box-shadow .3s; position:relative; overflow:hidden; }
//         .role-tile-inner::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(232,180,160,0.3),transparent); opacity:0; transition:opacity .3s; }
//         .role-tile:hover .role-tile-inner::before { opacity:1; }
//         .role-tile.bride-active .role-tile-inner { border-color:rgba(212,130,154,0.5); background:linear-gradient(145deg,rgba(212,130,154,0.12) 0%,rgba(212,130,154,0.04) 100%); box-shadow:0 0 32px rgba(212,130,154,0.12),inset 0 1px 0 rgba(212,130,154,0.2); }
//         .role-tile.groom-active .role-tile-inner { border-color:rgba(184,169,217,0.5); background:linear-gradient(145deg,rgba(184,169,217,0.12) 0%,rgba(184,169,217,0.04) 100%); box-shadow:0 0 32px rgba(184,169,217,0.12),inset 0 1px 0 rgba(184,169,217,0.2); }
//         .role-icon-wrap { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:4px; transition:transform .3s; }
//         .role-tile:hover .role-icon-wrap { transform:scale(1.1); }
//         .role-icon-bride { background:rgba(212,130,154,0.15); border:1px solid rgba(212,130,154,0.25); }
//         .role-icon-groom { background:rgba(184,169,217,0.15); border:1px solid rgba(184,169,217,0.25); }
//         .role-tile-name { font-family:'Playfair Display',serif; font-style:italic; font-size:17px; color:var(--text-main); display:block; }
//         .role-tile-sub { font-family:'DM Sans',sans-serif; font-size:9px; letter-spacing:0.25em; text-transform:uppercase; color:var(--text-muted); display:block; }
//         .role-check { position:absolute; top:10px; right:10px; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:600; opacity:0; transition:opacity .3s,transform .3s; transform:scale(0.5); }
//         .bride-active .role-check { background:rgba(212,130,154,0.9); opacity:1; transform:scale(1); }
//         .groom-active .role-check { background:rgba(184,169,217,0.9); opacity:1; transform:scale(1); }

//         /* ── Age group pills ── */
//         .age-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
//         .age-pill {
//           cursor:pointer; border:none; padding:0; background:none;
//           border-radius:14px; overflow:hidden;
//           transition:transform .28s cubic-bezier(.22,1,.36,1);
//         }
//         .age-pill:hover { transform:translateY(-2px); }
//         .age-pill-inner {
//           border-radius:14px;
//           border:1px solid rgba(232,180,160,0.1);
//           background:rgba(255,255,255,0.025);
//           padding:14px 16px 12px;
//           display:flex; flex-direction:column; align-items:center; gap:4px;
//           transition:border-color .28s, background .28s, box-shadow .28s;
//           position:relative; overflow:hidden;
//         }
//         .age-pill-inner::before {
//           content:''; position:absolute; top:0; left:0; right:0; height:1px;
//           background:linear-gradient(90deg,transparent,rgba(201,168,124,0.4),transparent);
//           opacity:0; transition:opacity .28s;
//         }
//         .age-pill:hover .age-pill-inner::before { opacity:1; }
//         .age-pill.age-active .age-pill-inner {
//           border-color:rgba(201,168,124,0.55);
//           background:linear-gradient(145deg,rgba(201,168,124,0.13) 0%,rgba(201,168,124,0.04) 100%);
//           box-shadow:0 0 28px rgba(201,168,124,0.14),inset 0 1px 0 rgba(201,168,124,0.22);
//         }
//         .age-pill-label {
//           font-family:'Playfair Display',serif; font-style:italic;
//           font-size:15px; color:var(--text-main); display:block;
//           transition:color .28s;
//         }
//         .age-pill.age-active .age-pill-label { color:#C9A87C; }
//         .age-pill-sub {
//           font-family:'DM Sans',sans-serif; font-size:9px;
//           letter-spacing:0.22em; text-transform:uppercase;
//           color:var(--text-muted); display:block;
//         }
//         /* check dot for age */
//         .age-check {
//           position:absolute; top:8px; right:8px;
//           width:16px; height:16px; border-radius:50%;
//           background:rgba(201,168,124,0.9);
//           display:flex; align-items:center; justify-content:center;
//           font-size:8px; font-weight:700; color:#1A0F18;
//           opacity:0; transform:scale(0.4);
//           transition:opacity .28s, transform .28s;
//         }
//         .age-active .age-check { opacity:1; transform:scale(1); }

//         .modal-btn { width:100%; padding:16px; border:none; border-radius:100px; cursor:pointer; background:linear-gradient(135deg,#E8B4A0 0%,#D4829A 50%,#C9807A 100%); background-size:200% 100%; background-position:0% center; color:#1A0F18; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:400; letter-spacing:0.22em; text-transform:uppercase; display:flex; align-items:center; justify-content:center; gap:10px; transition:transform .3s,box-shadow .3s,background-position .4s; box-shadow:0 8px 28px rgba(232,180,160,0.25),0 2px 8px rgba(212,130,154,0.2); position:relative; overflow:hidden; margin-top:4px; }
//         .modal-btn::before { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); transition:left .5s; }
//         .modal-btn:hover::before { left:150%; }
//         .modal-btn:hover { transform:translateY(-2px); box-shadow:0 14px 40px rgba(232,180,160,0.35),0 4px 16px rgba(212,130,154,0.25); background-position:100% center; }
//         .modal-btn:active { transform:translateY(0); }
//         .modal-btn:disabled { opacity:.55; cursor:default; transform:none; }
//         .modal-footer-note { text-align:center; margin-top:20px; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:300; color:rgba(155,143,170,0.4); letter-spacing:0.06em; }
//       `}</style>

//       <div style={{ background: "var(--night)", minHeight: "100vh" }}>
//         {/* ─── HERO ─── */}
//         <section
//           style={{
//             minHeight: "100vh",
//             position: "relative",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               backgroundImage: `url('https://images.unsplash.com/photo-1668321654792-e576f8e703d2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               filter: "brightness(0.2) saturate(0.55)",
//               zIndex: 0,
//             }}
//           />
//           <div
//             className="orb1"
//             style={{
//               position: "absolute",
//               top: "15%",
//               left: "20%",
//               width: 480,
//               height: 480,
//               borderRadius: "50%",
//               background:
//                 "radial-gradient(circle,rgba(212,130,154,0.22) 0%,transparent 70%)",
//               filter: "blur(60px)",
//               zIndex: 1,
//               pointerEvents: "none",
//             }}
//           />
//           <div
//             className="orb2"
//             style={{
//               position: "absolute",
//               bottom: "10%",
//               right: "15%",
//               width: 420,
//               height: 420,
//               borderRadius: "50%",
//               background:
//                 "radial-gradient(circle,rgba(184,169,217,0.18) 0%,transparent 70%)",
//               filter: "blur(70px)",
//               zIndex: 1,
//               pointerEvents: "none",
//             }}
//           />
//           <div
//             className="orb3"
//             style={{
//               position: "absolute",
//               top: "50%",
//               left: "55%",
//               width: 320,
//               height: 320,
//               borderRadius: "50%",
//               background:
//                 "radial-gradient(circle,rgba(201,168,124,0.14) 0%,transparent 70%)",
//               filter: "blur(50px)",
//               zIndex: 1,
//               pointerEvents: "none",
//             }}
//           />
//           <MagicCanvas />
//           <div
//             style={{
//               position: "relative",
//               zIndex: 10,
//               textAlign: "center",
//               padding: "0 24px",
//               maxWidth: 720,
//               margin: "0 auto",
//             }}
//           >
//             <div className="rise1" style={{ marginBottom: 28 }}>
//               <span className="badge">
//                 <span className="badge-dot" />A Love Language Experience
//               </span>
//             </div>
//             <h1
//               className="hero-title rise2"
//               data-testid="hero-title"
//               style={{ marginBottom: 28 }}
//             >
//               Vows <span className="amp">&amp;</span>
//               <br />
//               <span className="italic">Volumes</span>
//             </h1>
//             <div className="rise2 shimmer-bar" style={{ marginBottom: 28 }} />
//             <p
//               className="rise3"
//               data-testid="hero-subtitle"
//               style={{
//                 fontFamily: "'DM Sans',sans-serif",
//                 fontWeight: 200,
//                 fontSize: 15,
//                 color: "var(--text-muted)",
//                 lineHeight: 1.9,
//                 maxWidth: 440,
//                 margin: "0 auto 52px",
//                 letterSpacing: "0.03em",
//               }}
//             >
//               Discover your wedding style through the five love languages. Fill
//               your book, guess your partner's answers, and unlock personalised
//               décor recommendations.
//             </p>
//             <div
//               className="rise4"
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 16,
//                 justifyContent: "center",
//               }}
//             >
//               <button
//                 className="cta-primary"
//                 onClick={() => setShowStartModal(true)}
//                 data-testid="start-quiz-button"
//               >
//                 <Heart size={15} strokeWidth={1.5} />
//                 Start Your Slam Book
//               </button>
//               <button
//                 className="cta-outline"
//                 onClick={() => setShowJoinModal(true)}
//                 data-testid="join-quiz-button"
//               >
//                 <Sparkles size={15} strokeWidth={1.5} />
//                 Join Partner's Book
//               </button>
//             </div>
//           </div>
//           <div className="scroll-indicator" />
//         </section>

//         {/* ─── MARQUEE ─── */}
//         <div
//           style={{
//             overflow: "hidden",
//             padding: "18px 0",
//             borderTop: "1px solid rgba(232,180,160,0.07)",
//             borderBottom: "1px solid rgba(232,180,160,0.07)",
//             background: "rgba(255,255,255,0.012)",
//           }}
//         >
//           <div className="marquee-track">
//             {[...Array(2)].map((_, rep) =>
//               [
//                 "Love Languages",
//                 "Décor Dreams",
//                 "Compatibility",
//                 "Forever Begins",
//                 "Wedding Vision",
//                 "Vows & Volumes",
//                 "Soulmate Style",
//               ].map((t, i) => (
//                 <span key={`${rep}-${i}`} className="marquee-item">
//                   {t}
//                   <span className="marquee-dot" />
//                 </span>
//               )),
//             )}
//           </div>
//         </div>

//         {/* ─── HOW IT WORKS ─── */}
//         <section
//           style={{
//             padding: "120px 24px",
//             background:
//               "linear-gradient(180deg,var(--night) 0%,#110D1C 50%,var(--night) 100%)",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               inset: 0,
//               backgroundImage: `linear-gradient(rgba(232,180,160,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(232,180,160,0.022) 1px,transparent 1px)`,
//               backgroundSize: "80px 80px",
//               pointerEvents: "none",
//             }}
//           />
//           <div
//             style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}
//           >
//             <div style={{ textAlign: "center", marginBottom: 80 }}>
//               <p className="section-label" data-testid="hero-overline">
//                 The Journey
//               </p>
//               <h2 className="section-title">How It Works</h2>
//               <div className="shimmer-bar" style={{ marginTop: 22 }} />
//             </div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
//                 gap: 24,
//               }}
//             >
//               {[
//                 {
//                   step: "01",
//                   icon: "♡",
//                   title: "Fill Your Book",
//                   desc: "Answer questions about your wedding dreams based on the five love languages.",
//                   color: "#D4829A",
//                 },
//                 {
//                   step: "02",
//                   icon: "✦",
//                   title: "Guess & Share",
//                   desc: "Predict your partner's answers, then share your unique link for them to complete.",
//                   color: "#C9A87C",
//                 },
//                 {
//                   step: "03",
//                   icon: "◇",
//                   title: "Discover Together",
//                   desc: "See your compatibility score and receive AI-powered décor recommendations.",
//                   color: "#B8A9D9",
//                 },
//               ].map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="step-card"
//                   data-testid={`feature-${idx + 1}`}
//                 >
//                   <span className="step-num-big">{item.step}</span>
//                   <div className="step-icon-ring">
//                     <span style={{ fontSize: 18, color: item.color }}>
//                       {item.icon}
//                     </span>
//                   </div>
//                   <h3 className="step-title">{item.title}</h3>
//                   <p className="step-desc">{item.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════
//             START SLAM BOOK MODAL
//         ══════════════════════════════════ */}
//         <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
//           <DialogContent className="vv-modal-content">
//             <div className="modal-card">
//               <div className="modal-banner" />
//               <div className="modal-glow" />

//               <div className="modal-inner">
//                 {/* Ornament */}
//                 <div className="modal-ornament">
//                   <svg width="120" height="22" viewBox="0 0 120 22" fill="none">
//                     <line
//                       x1="0"
//                       y1="11"
//                       x2="42"
//                       y2="11"
//                       stroke="url(#mg1)"
//                       strokeWidth="0.7"
//                     />
//                     <path
//                       d="M51 11 C53 6 57 3 60 11 C63 3 67 6 69 11"
//                       stroke="#E8B4A0"
//                       strokeWidth="0.9"
//                       fill="none"
//                       strokeLinecap="round"
//                     />
//                     <line
//                       x1="78"
//                       y1="11"
//                       x2="120"
//                       y2="11"
//                       stroke="url(#mg2)"
//                       strokeWidth="0.7"
//                     />
//                     <defs>
//                       <linearGradient
//                         id="mg1"
//                         x1="0"
//                         y1="0"
//                         x2="42"
//                         y2="0"
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop offset="0%" stopColor="#C9A87C" stopOpacity="0" />
//                         <stop
//                           offset="100%"
//                           stopColor="#C9A87C"
//                           stopOpacity="1"
//                         />
//                       </linearGradient>
//                       <linearGradient
//                         id="mg2"
//                         x1="0"
//                         y1="0"
//                         x2="42"
//                         y2="0"
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop offset="0%" stopColor="#C9A87C" stopOpacity="1" />
//                         <stop
//                           offset="100%"
//                           stopColor="#C9A87C"
//                           stopOpacity="0"
//                         />
//                       </linearGradient>
//                     </defs>
//                   </svg>
//                 </div>

//                 <p className="modal-title">Begin Your Journey</p>
//                 <p className="modal-sub">Create your shared slam book</p>

//                 {/* Partner name */}
//                 <div style={{ marginBottom: 22 }}>
//                   <label className="field-label">Your Partner's Name</label>
//                   <input
//                     className="field-input"
//                     value={partnerName}
//                     onChange={(e) => setPartnerName(e.target.value)}
//                     placeholder="Enter their name…"
//                     data-testid="partner-name-input"
//                   />
//                 </div>

//                 {/* Role picker */}
//                 <div style={{ marginBottom: 22 }}>
//                   <label className="field-label" style={{ marginBottom: 14 }}>
//                     I Am The…
//                   </label>
//                   <div className="role-grid">
//                     <button
//                       className={`role-tile${role === "bride" ? " bride-active" : ""}`}
//                       onClick={() => setRole("bride")}
//                       data-testid="role-bride-button"
//                     >
//                       <div className="role-tile-inner">
//                         <div
//                           className="role-check"
//                           style={{ color: "#1A0F18" }}
//                         >
//                           ✓
//                         </div>
//                         <div className="role-icon-wrap role-icon-bride">
//                           <span style={{ color: "#D4829A" }}>♡</span>
//                         </div>
//                         <span className="role-tile-name">Bride</span>
//                         <span className="role-tile-sub">the beloved</span>
//                       </div>
//                     </button>
//                     <button
//                       className={`role-tile${role === "groom" ? " groom-active" : ""}`}
//                       onClick={() => setRole("groom")}
//                       data-testid="role-groom-button"
//                     >
//                       <div className="role-tile-inner">
//                         <div
//                           className="role-check"
//                           style={{ color: "#1A0F18" }}
//                         >
//                           ✓
//                         </div>
//                         <div className="role-icon-wrap role-icon-groom">
//                           <span style={{ color: "#B8A9D9" }}>◇</span>
//                         </div>
//                         <span className="role-tile-name">Groom</span>
//                         <span className="role-tile-sub">the devoted</span>
//                       </div>
//                     </button>
//                   </div>
//                 </div>

//                 {/* ── AGE GROUP ── */}
//                 <div style={{ marginBottom: 26 }}>
//                   <label className="field-label" style={{ marginBottom: 14 }}>
//                     Your Age Group
//                   </label>
//                   <div className="age-grid">
//                     {AGE_GROUPS.map((ag) => (
//                       <button
//                         key={ag.value}
//                         className={`age-pill${ageGroup === ag.value ? " age-active" : ""}`}
//                         onClick={() => setAgeGroup(ag.value)}
//                         data-testid={`age-group-${ag.value}`}
//                       >
//                         <div className="age-pill-inner">
//                           <div className="age-check">✓</div>
//                           <span className="age-pill-label">{ag.label}</span>
//                           <span className="age-pill-sub">{ag.sub}</span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="modal-divider" />

//                 <button
//                   className="modal-btn"
//                   onClick={handleStartQuiz}
//                   disabled={isLoading}
//                   data-testid="create-session-button"
//                 >
//                   {isLoading ? "Creating…" : "Create My Slam Book"}
//                   <ArrowRight size={14} />
//                 </button>

//                 <p className="modal-footer-note">
//                   Your partner will receive a unique link to join
//                 </p>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* ══════════════════════════════════
//             JOIN PARTNER MODAL
//         ══════════════════════════════════ */}
//         <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
//           <DialogContent className="vv-modal-content">
//             <div className="modal-card">
//               <div className="modal-banner" />
//               <div
//                 className="modal-glow"
//                 style={{
//                   background:
//                     "radial-gradient(circle,rgba(184,169,217,0.12) 0%,transparent 70%)",
//                 }}
//               />

//               <div className="modal-inner">
//                 <div className="modal-ornament">
//                   <svg width="120" height="22" viewBox="0 0 120 22" fill="none">
//                     <line
//                       x1="0"
//                       y1="11"
//                       x2="42"
//                       y2="11"
//                       stroke="url(#mg3)"
//                       strokeWidth="0.7"
//                     />
//                     <path
//                       d="M51 11 C53 6 57 3 60 11 C63 3 67 6 69 11"
//                       stroke="#B8A9D9"
//                       strokeWidth="0.9"
//                       fill="none"
//                       strokeLinecap="round"
//                     />
//                     <line
//                       x1="78"
//                       y1="11"
//                       x2="120"
//                       y2="11"
//                       stroke="url(#mg4)"
//                       strokeWidth="0.7"
//                     />
//                     <defs>
//                       <linearGradient
//                         id="mg3"
//                         x1="0"
//                         y1="0"
//                         x2="42"
//                         y2="0"
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop offset="0%" stopColor="#B8A9D9" stopOpacity="0" />
//                         <stop
//                           offset="100%"
//                           stopColor="#B8A9D9"
//                           stopOpacity="1"
//                         />
//                       </linearGradient>
//                       <linearGradient
//                         id="mg4"
//                         x1="0"
//                         y1="0"
//                         x2="42"
//                         y2="0"
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop offset="0%" stopColor="#B8A9D9" stopOpacity="1" />
//                         <stop
//                           offset="100%"
//                           stopColor="#B8A9D9"
//                           stopOpacity="0"
//                         />
//                       </linearGradient>
//                     </defs>
//                   </svg>
//                 </div>

//                 <p className="modal-title">Join Your Partner</p>
//                 <p className="modal-sub">Enter the code they shared with you</p>

//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     margin: "8px 0 28px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 72,
//                       height: 72,
//                       borderRadius: "50%",
//                       background:
//                         "linear-gradient(135deg,rgba(184,169,217,0.15),rgba(232,180,160,0.08))",
//                       border: "1px solid rgba(184,169,217,0.2)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: 28,
//                       color: "var(--lavender)",
//                       boxShadow: "0 0 32px rgba(184,169,217,0.1)",
//                     }}
//                   >
//                     ✦
//                   </div>
//                 </div>

//                 <div style={{ marginBottom: 10 }}>
//                   <label
//                     className="field-label"
//                     style={{ textAlign: "center", display: "block" }}
//                   >
//                     Share Code
//                   </label>
//                   <input
//                     className="field-input field-input-code"
//                     value={joinCode}
//                     onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
//                     placeholder="ABC12345"
//                     maxLength={8}
//                     data-testid="join-code-input"
//                     style={{
//                       textAlign: "center",
//                       letterSpacing: "0.35em",
//                       fontSize: 20,
//                     }}
//                   />
//                 </div>

//                 <p
//                   style={{
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 11,
//                     fontWeight: 300,
//                     color: "rgba(155,143,170,0.4)",
//                     textAlign: "center",
//                     letterSpacing: "0.05em",
//                     marginBottom: 24,
//                   }}
//                 >
//                   8-character code from your partner
//                 </p>

//                 <div className="modal-divider" />

//                 <button
//                   className="modal-btn"
//                   onClick={handleJoinQuiz}
//                   disabled={isLoading}
//                   style={{
//                     background:
//                       "linear-gradient(135deg,#B8A9D9 0%,#9B88C5 50%,#7B6BAA 100%)",
//                     boxShadow: "0 8px 28px rgba(184,169,217,0.2)",
//                   }}
//                   data-testid="join-session-button"
//                 >
//                   {isLoading ? "Finding…" : "Join Slam Book"}
//                   <ArrowRight size={14} />
//                 </button>

//                 <p className="modal-footer-note">
//                   You'll answer the same questions as your partner
//                 </p>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api";

/* ═══════════════════════════════════════════
   ROTATING SWEET MESSAGES
   — picked once per page load, changes on refresh
   ═══════════════════════════════════════════ */
const SWEET_MESSAGES = [
  "Every love story is unique — let yours speak in its own language.",
  "Two hearts, one vision. Discover the décor that reflects your forever.",
  "Love is the answer. The language is just the beginning.",
  "Your wedding day is a love letter. Let's help you write it together.",
  "When two souls align, even the smallest details become poetry.",
  "Romance isn't just felt — it's seen, heard, and lived every day.",
  "The best weddings begin with understanding. Yours starts here.",
  "Fill the pages of your story with colour, feeling, and forever.",
  "Great love deserves great expression. Begin yours today.",
  "Some things are written in the stars. Others, in your love language.",
];

const INITIAL_MESSAGE =
  SWEET_MESSAGES[Math.floor(Math.random() * SWEET_MESSAGES.length)];

/* ═══════════════════════════════════════════
   CINEMATIC HEART CANVAS
   ═══════════════════════════════════════════ */
function CinematicCanvas() {
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

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      size: Math.random() * 8 + 2,
      speedY: Math.random() * 0.5 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.15 + 0.03,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.012 + 0.004,
      type: Math.random() > 0.6 ? "heart" : "dot",
      hue: Math.random() > 0.5 ? "rgba(122, 0, 22, " : "rgba(212, 175, 55, ",
    }));

    const trail = [];
    const onMove = (e) => {
      for (let i = 0; i < 3; i++) {
        trail.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          r: Math.random() * 2.5 + 0.5,
          life: 1,
          decay: Math.random() * 0.03 + 0.015,
          color:
            Math.random() > 0.5 ? "rgba(212, 175, 55, " : "rgba(122, 0, 22, ",
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    const drawHeart = (cx, cy, size) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - size * 0.4);
      ctx.bezierCurveTo(
        cx + size * 0.5,
        cy - size,
        cx + size,
        cy - size * 0.3,
        cx,
        cy + size * 0.5,
      );
      ctx.bezierCurveTo(
        cx - size,
        cy - size * 0.3,
        cx - size * 0.5,
        cy - size,
        cx,
        cy - size * 0.4,
      );
      ctx.closePath();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += Math.sin(p.wobble) * 0.3 + p.speedX;
        p.wobble += p.wobbleSpeed;
        if (p.y < -40) {
          p.y = canvas.height + 40;
          p.x = Math.random() * canvas.width;
        }
        ctx.globalAlpha = p.opacity;
        if (p.type === "heart") {
          ctx.fillStyle = p.hue + "1)";
          drawHeart(p.x, p.y, p.size);
          ctx.fill();
        } else {
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size * 2,
          );
          grad.addColorStop(0, p.hue + "0.6)");
          grad.addColorStop(1, p.hue + "0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i];
        t.life -= t.decay;
        if (t.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = t.life * 0.7;
        const grad = ctx.createRadialGradient(
          t.x,
          t.y,
          0,
          t.x,
          t.y,
          t.r * t.life * 3,
        );
        grad.addColorStop(0, t.color + "0.8)");
        grad.addColorStop(1, t.color + "0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r * t.life * 3, 0, Math.PI * 2);
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

/* ═══════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════ */
const AGE_GROUPS = [
  { value: "18-24", label: "18 – 24", sub: "young & free" },
  { value: "24-30", label: "24 – 30", sub: "finding our way" },
  { value: "30-40", label: "30 – 40", sub: "in our stride" },
  { value: "40-60", label: "40 – 60", sub: "seasoned together" },
];

const MARQUEE_WORDS = [
  "Intimacy",
  "Devotion",
  "Forever",
  "Connection",
  "Passion",
  "Vows",
  "Volumes",
  "Love Languages",
  "Soulmate",
  "Together",
  "Promise",
  "Eternal",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: <Heart size={22} strokeWidth={1} />,
    title: "Fill Your Book",
    desc: "Answer questions about your wedding dreams through the lens of the five love languages.",
    accent: "#7A0016",
    image:
      "https://static.prod-images.emergentagent.com/jobs/2fe24af1-e331-4795-95b5-01edb84814c1/images/419e8df8fc54523ce02ddb7ced0712815d7319fefaca0390e6dae7754fe47215.png",
  },
  {
    step: "02",
    icon: <Sparkles size={22} strokeWidth={1} />,
    title: "Guess & Share",
    desc: "Predict your partner's answers, then share your unique link for them to complete their half.",
    accent: "#D4AF37",
    image:
      "https://static.prod-images.emergentagent.com/jobs/2fe24af1-e331-4795-95b5-01edb84814c1/images/40db8ec20bc892532d45ca7efe8392beaaea74b9435ea37df783d446cc971902.png",
  },
  {
    step: "03",
    icon: <ArrowRight size={22} strokeWidth={1} />,
    title: "Discover Together",
    desc: "See your compatibility score and receive personalised wedding decor recommendations.",
    accent: "#C5B396",
    image:
      "https://images.pexels.com/photos/7265057/pexels-photo-7265057.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

/* ═══════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [role, setRole] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const heroMessage = INITIAL_MESSAGE;

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
        age_range: ageGroup,
      });
      toast.success("Your Slam Book has been created!");
      navigate(
        "/quiz/" +
          response.data.data.share_code +
          "?role=" +
          role +
          "&creator=true",
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg-base: #050505; --bg-surface: #0a0a0b;
          --brand-gold: #D4AF37; --brand-crimson: #7A0016; --brand-champagne: #C5B396;
          --text-primary: #F5EFE8; --text-secondary: #B8A99A; --text-muted: #7A6E65;
          --border-light: rgba(212, 175, 55, 0.12);
        }
        body { background: var(--bg-base); }

        @keyframes riseIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.6); } }
        @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes msgFadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        .rise1 { animation: riseIn 0.9s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
        .rise2 { animation: riseIn 0.9s 0.25s cubic-bezier(0.22,1,0.36,1) both; }
        .rise3 { animation: riseIn 0.9s 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .rise4 { animation: riseIn 0.9s 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .rise5 { animation: riseIn 1s 2s cubic-bezier(0.22,1,0.36,1) both; }
        .msg-appear { animation: msgFadeIn 1.2s 0.55s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── NAV BAR ── */
        .nav-bar {
          position: absolute; top: 0; left: 0; right: 0; z-index: 20;
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 48px;
        }

        /* ── E365 LOGO SLOT ── */
        .e365-logo-slot {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          text-decoration: none;
        }
        /*
          ╔══════════════════════════════════════════════════════╗
          ║  LOGO PLACEHOLDER                                    ║
          ║  Replace .e365-logo-placeholder div with:           ║
          ║  <img src="/your-logo.svg" alt="e365" height="38"/> ║
          ╚══════════════════════════════════════════════════════╝
        */
        .e365-logo-placeholder {
          width: 42px; height: 42px;
          border: 1px solid rgba(212,175,55,0.35);
          background: rgba(212,175,55,0.06);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 400;
          letter-spacing: 0.08em; color: var(--brand-gold);
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .e365-logo-slot:hover .e365-logo-placeholder {
          border-color: rgba(212,175,55,0.6);
          background: rgba(212,175,55,0.1);
          box-shadow: 0 0 20px rgba(212,175,55,0.1);
        }
        .e365-logo-name {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 17px; font-weight: 300; letter-spacing: 0.06em;
          color: rgba(212,175,55,0.65); transition: color 0.3s;
        }
        .e365-logo-slot:hover .e365-logo-name { color: var(--brand-gold); }

        /* ── OVERLINE BADGE ── */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 10px; padding: 5px 20px;
          border: 1px solid rgba(212, 175, 55, 0.25); background: rgba(212, 175, 55, 0.06);
          font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 300;
          letter-spacing: 0.3em; text-transform: uppercase; color: var(--brand-gold);
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brand-gold); animation: pulse-dot 2s ease-in-out infinite; }

        /* ── HERO TITLE ── */
        .hero-title {
          font-family: 'Cormorant Garamond', serif; font-weight: 300;
          font-size: clamp(3.5rem, 10vw, 7.5rem); line-height: 1; letter-spacing: -0.03em; color: var(--text-primary);
        }
        .hero-title .amp { font-style: italic; font-weight: 400; color: var(--brand-gold); font-size: 0.85em; }
        .hero-title .gradient-text {
          font-style: italic;
          background: linear-gradient(135deg, #7A0016, #D4AF37);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* ── SWEET MESSAGE ── */
        .hero-message-wrap { position: relative; }
        .hero-message-rule {
          width: 1px; height: 28px; margin: 0 auto;
          background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.35), transparent);
        }
        .hero-message {
          font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300;
          font-size: clamp(15px, 2.2vw, 19px); color: var(--text-secondary);
          line-height: 1.75; max-width: 480px; margin: 0 auto; letter-spacing: 0.02em;
        }

        /* ── GOLD DIVIDER ── */
        .gold-line { width: 120px; height: 1px; margin: 0 auto; background: linear-gradient(90deg, transparent, var(--brand-gold), transparent); }

        /* ── CTAs ── */
        .cta-primary {
          display: inline-flex; align-items: center; gap: 12px; padding: 15px 36px;
          background: linear-gradient(135deg, #7A0016, #990020);
          border: 1px solid rgba(122, 0, 22, 0.6); color: var(--brand-champagne);
          font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer;
          transition: transform 0.4s, box-shadow 0.4s;
          box-shadow: 0 8px 40px rgba(122, 0, 22, 0.35), 0 0 80px rgba(122, 0, 22, 0.1);
          position: relative; overflow: hidden;
        }
        .cta-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); opacity: 0; transition: opacity 0.6s; }
        .cta-primary:hover::before { opacity: 1; }
        .cta-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 60px rgba(122, 0, 22, 0.5), 0 0 120px rgba(122, 0, 22, 0.15); }

        .cta-outline {
          display: inline-flex; align-items: center; gap: 12px; padding: 14px 36px;
          background: transparent; border: 1px solid rgba(212, 175, 55, 0.3); color: var(--brand-gold);
          font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 300;
          letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; backdrop-filter: blur(12px);
          transition: transform 0.4s, box-shadow 0.4s, border-color 0.4s, background 0.4s;
        }
        .cta-outline:hover { transform: translateY(-3px); border-color: rgba(212, 175, 55, 0.6); background: rgba(212, 175, 55, 0.06); box-shadow: 0 8px 40px rgba(212, 175, 55, 0.1); }

        /* ── SCROLL INDICATOR ── */
        .scroll-label { font-family: 'Outfit', sans-serif; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-muted); }
        .scroll-chevron { animation: scrollBounce 2s ease-in-out infinite; color: var(--brand-gold); opacity: 0.5; }

        /* ── MARQUEE ── */
        .marquee-track { display: flex; gap: 0; white-space: nowrap; animation: marqueeScroll 30s linear infinite; }
        .marquee-item { display: inline-flex; align-items: center; gap: 40px; margin: 0 40px; font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; font-size: clamp(18px, 3vw, 28px); color: var(--text-muted); letter-spacing: 0.08em; user-select: none; }
        .marquee-diamond { display: inline-block; width: 4px; height: 4px; background: var(--brand-gold); opacity: 0.3; transform: rotate(45deg); }

        /* ── SECTION HEADERS ── */
        .section-overline { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 400; letter-spacing: 0.35em; text-transform: uppercase; color: var(--brand-gold); display: block; margin-bottom: 16px; text-align: center; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(2rem, 5vw, 3.5rem); color: var(--text-primary); text-align: center; letter-spacing: -0.02em; }

        /* ── STEP CARDS ── */
        .step-card { background: rgba(10,10,11,0.6); backdrop-filter: blur(24px); border: 1px solid var(--border-light); overflow: hidden; padding: 0; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.6s, box-shadow 0.6s; }
        .step-card:hover { transform: translateY(-8px); border-color: rgba(212,175,55,0.35); box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(122,0,22,0.08); }
        .step-card-img { position: relative; height: 192px; overflow: hidden; }
        .step-card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .step-card:hover .step-card-bg { transform: scale(1.1); }
        .step-card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.95) 100%); }
        .step-num { position: absolute; top: 24px; left: 32px; font-family: 'Cormorant Garamond', serif; font-size: 72px; font-weight: 300; line-height: 1; background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(122,0,22,0.08)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .step-card-top-line { position: absolute; top: 0; left: 0; right: 0; height: 1px; opacity: 0; transition: opacity 0.5s; }
        .step-card:hover .step-card-top-line { opacity: 1; }
        .step-card-body { padding: 8px 32px 40px; }
        .step-icon-box { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-light); background: rgba(212,175,55,0.04); margin-bottom: 24px; transition: transform 0.4s; }
        .step-card:hover .step-icon-box { transform: scale(1.1); }
        .step-card-title { font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 22px; color: var(--text-primary); letter-spacing: 0.01em; margin-bottom: 12px; }
        .step-card-desc { font-family: 'Outfit', sans-serif; font-weight: 200; font-size: 14px; color: var(--text-muted); line-height: 1.9; letter-spacing: 0.02em; }

        /* ── QUOTE ── */
        .quote-mark { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 80px; line-height: 1; color: rgba(212,175,55,0.12); display: block; margin-bottom: 32px; }
        blockquote { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; font-size: clamp(1.4rem, 3.5vw, 2.2rem); color: var(--text-secondary); line-height: 1.6; letter-spacing: 0.01em; }

        /* ══ MODAL ══ */
        .vv-modal-outer { background: transparent !important; border: none !important; padding: 0 !important; max-width: 480px !important; border-radius: 0 !important; box-shadow: none !important; overflow: visible !important; }
        .modal-card { position: relative; overflow: hidden; background: rgba(5,5,5,0.92); backdrop-filter: blur(40px); border: 1px solid rgba(212,175,55,0.2); box-shadow: 0 32px 100px rgba(0,0,0,0.8), 0 0 120px rgba(122,0,22,0.08); }
        .modal-banner-crimson { height: 2px; background: linear-gradient(90deg, #7A0016, #D4AF37, #7A0016); }
        .modal-banner-gold { height: 2px; background: linear-gradient(90deg, #D4AF37, #C5B396, #D4AF37); }
        .modal-glow-crimson { position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(122,0,22,0.12) 0%, transparent 70%); filter: blur(40px); pointer-events: none; z-index: 0; }
        .modal-glow-gold { position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%); filter: blur(40px); pointer-events: none; z-index: 0; }
        .modal-inner { position: relative; z-index: 1; padding: 40px 40px 32px; }
        .modal-title { font-family: 'Cormorant Garamond', serif; font-weight: 400; font-style: italic; font-size: 28px; text-align: center; color: var(--text-primary); letter-spacing: 0.01em; margin-bottom: 4px; }
        .modal-sub { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); text-align: center; margin-bottom: 32px; }
        .modal-divider { height: 1px; margin: 24px 0; background: linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent); }
        .field-label { display: block; font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 400; letter-spacing: 0.3em; text-transform: uppercase; color: var(--brand-gold); opacity: 0.7; margin-bottom: 12px; }
        .field-input-line { width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(212,175,55,0.2); color: var(--text-primary); font-family: 'Outfit', sans-serif; font-weight: 300; font-size: 16px; padding: 12px 0; outline: none; caret-color: var(--brand-gold); transition: border-color 0.3s; }
        .field-input-line::placeholder { color: rgba(197,179,150,0.25); }
        .field-input-line:focus { border-bottom-color: var(--brand-gold); }
        .field-input-box { width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(212,175,55,0.15); color: var(--text-primary); font-family: 'Outfit', sans-serif; font-weight: 300; font-size: 22px; text-align: center; letter-spacing: 0.4em; padding: 16px; outline: none; caret-color: var(--brand-gold); transition: border-color 0.3s, background 0.3s, box-shadow 0.3s; }
        .field-input-box::placeholder { color: rgba(197,179,150,0.25); }
        .field-input-box:focus { border-color: rgba(212,175,55,0.4); background: rgba(212,175,55,0.03); box-shadow: 0 0 24px rgba(212,175,55,0.06); }

        .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .role-tile { cursor: pointer; padding: 0; border: none; background: none; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .role-tile:hover { transform: translateY(-3px); }
        .role-tile-inner { position: relative; padding: 20px 16px 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(212,175,55,0.1); transition: border-color 0.3s, background 0.3s, box-shadow 0.3s; overflow: hidden; }
        .role-tile-inner::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent); opacity: 0; transition: opacity 0.3s; }
        .role-tile:hover .role-tile-inner::before { opacity: 1; }
        .role-tile.bride-active .role-tile-inner { border-color: rgba(122,0,22,0.6); background: linear-gradient(145deg, rgba(122,0,22,0.12), rgba(122,0,22,0.04)); box-shadow: 0 0 30px rgba(122,0,22,0.15); }
        .role-tile.groom-active .role-tile-inner { border-color: rgba(212,175,55,0.6); background: linear-gradient(145deg, rgba(212,175,55,0.1), rgba(212,175,55,0.03)); box-shadow: 0 0 30px rgba(212,175,55,0.1); }
        .role-icon-ring { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.3s; }
        .role-tile:hover .role-icon-ring { transform: scale(1.1); }
        .role-name { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 17px; color: var(--text-primary); display: block; }
        .role-sub { font-family: 'Outfit', sans-serif; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); display: block; }
        .role-check { position: absolute; top: 10px; right: 10px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: var(--brand-champagne); opacity: 0; transform: scale(0.5); transition: opacity 0.3s, transform 0.3s; }
        .bride-active .role-check { background: #7A0016; opacity: 1; transform: scale(1); }
        .groom-active .role-check { background: rgba(212,175,55,0.9); color: #050505; opacity: 1; transform: scale(1); }

        .age-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .age-pill { cursor: pointer; border: none; background: none; padding: 0; transition: transform 0.28s cubic-bezier(0.22,1,0.36,1); }
        .age-pill:hover { transform: translateY(-2px); }
        .age-pill-inner { position: relative; padding: 14px 12px; display: flex; flex-direction: column; align-items: center; gap: 4px; background: rgba(255,255,255,0.02); border: 1px solid rgba(212,175,55,0.08); transition: border-color 0.28s, background 0.28s, box-shadow 0.28s; overflow: hidden; }
        .age-pill-inner::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent); opacity: 0; transition: opacity 0.28s; }
        .age-pill:hover .age-pill-inner::before { opacity: 1; }
        .age-pill.age-active .age-pill-inner { border-color: rgba(212,175,55,0.45); background: linear-gradient(145deg, rgba(212,175,55,0.1), rgba(212,175,55,0.03)); box-shadow: 0 0 24px rgba(212,175,55,0.08); }
        .age-label { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; color: var(--text-primary); display: block; transition: color 0.28s; }
        .age-pill.age-active .age-label { color: var(--brand-gold); }
        .age-sub { font-family: 'Outfit', sans-serif; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); display: block; }
        .age-check { position: absolute; top: 8px; right: 8px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; background: rgba(212,175,55,0.9); font-size: 8px; font-weight: 700; color: #050505; opacity: 0; transform: scale(0.4); transition: opacity 0.28s, transform 0.28s; }
        .age-active .age-check { opacity: 1; transform: scale(1); }

        .modal-btn-crimson { width: 100%; padding: 16px; background: linear-gradient(135deg, #7A0016 0%, #990020 50%, #7A0016 100%); background-size: 200% 100%; border: none; cursor: pointer; color: var(--brand-champagne); font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 32px rgba(122,0,22,0.3); position: relative; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
        .modal-btn-crimson::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); opacity: 0; transition: opacity 0.6s; }
        .modal-btn-crimson:hover::before { opacity: 1; }
        .modal-btn-crimson:hover { transform: translateY(-2px); box-shadow: 0 14px 48px rgba(122,0,22,0.45); }
        .modal-btn-crimson:disabled { opacity: 0.6; cursor: default; transform: none; }

        .modal-btn-gold { width: 100%; padding: 16px; background: linear-gradient(135deg, #D4AF37 0%, #B8972E 100%); border: none; cursor: pointer; color: #050505; font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 32px rgba(212,175,55,0.2); position: relative; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
        .modal-btn-gold::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); opacity: 0; transition: opacity 0.6s; }
        .modal-btn-gold:hover::before { opacity: 1; }
        .modal-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 14px 48px rgba(212,175,55,0.35); }
        .modal-btn-gold:disabled { opacity: 0.6; cursor: default; transform: none; }

        .modal-footer-note { text-align: center; margin-top: 20px; font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 300; color: rgba(197,179,150,0.3); letter-spacing: 0.04em; }
        input::placeholder { color: rgba(197, 179, 150, 0.25) !important; }
      `}</style>

      <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
        {/* ════════════════════════════════════
            HERO
            ════════════════════════════════════ */}
        <section
          data-testid="hero-section"
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
              zIndex: 0,
              backgroundImage:
                "url('https://static.prod-images.emergentagent.com/jobs/2fe24af1-e331-4795-95b5-01edb84814c1/images/970bf1dfd87e0a4e1e7828459e813d5fc5ba42ec20e8074c16b46f1e49b9a986.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(122,0,22,0.15) 0%, rgba(5,5,5,0.92) 60%, rgba(5,5,5,0.98) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(212,175,55,0.04) 0%, transparent 50%)",
            }}
          />
          <CinematicCanvas />

          {/* ── E365 LOGO ── */}
          <div className="nav-bar">
            <div className="e365-logo-slot">
              {/*
                ┌──────────────────────────────────────────────────────────────┐
                │  REPLACE THE DIV BELOW WITH YOUR ACTUAL LOGO                │
                │  Example: <img src="/e365-logo.svg" alt="e365" height="38"> │
                └──────────────────────────────────────────────────────────────┘
              */}
              <div className="e365-logo-placeholder">e365</div>
              <span className="e365-logo-name">Events 365</span>
            </div>
          </div>

          {/* Hero Content */}
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
            <div className="rise1" style={{ marginBottom: 40 }}>
              <span className="hero-badge" data-testid="hero-overline">
                <span className="badge-dot" />A Love Language Experience
              </span>
            </div>

            {/* Title — Love & Language */}
            <h1
              className="hero-title rise2"
              data-testid="hero-title"
              style={{ marginBottom: 24 }}
            >
              Love <span className="amp">&amp;</span>
              <br />
              <span className="gradient-text">Language</span>
            </h1>

            <div className="rise2 gold-line" style={{ marginBottom: 32 }} />

            {/* Sweet rotating message */}
            <div
              className="msg-appear hero-message-wrap"
              style={{ marginBottom: 56 }}
            >
              <div className="hero-message-rule" style={{ marginBottom: 18 }} />
              <p className="hero-message" data-testid="hero-subtitle">
                {heroMessage}
              </p>
              <div className="hero-message-rule" style={{ marginTop: 18 }} />
            </div>

            <div
              className="rise4"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                justifyContent: "center",
              }}
            >
              <button
                className="cta-primary"
                onClick={() => setShowStartModal(true)}
                data-testid="start-quiz-button"
              >
                <Heart size={14} strokeWidth={1.5} />
                Start Your Slam Book
              </button>
              <button
                className="cta-outline"
                onClick={() => setShowJoinModal(true)}
                data-testid="join-quiz-button"
              >
                <Sparkles size={14} strokeWidth={1.5} />
                Join Partner's Book
              </button>
            </div>
          </div>

          <div
            className="rise5"
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
            data-testid="scroll-indicator"
          >
            <span className="scroll-label">Scroll</span>
            <div className="scroll-chevron">
              <ChevronDown size={16} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            MARQUEE
            ════════════════════════════════════ */}
        <section
          data-testid="marquee-section"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "24px 0",
            borderTop: "1px solid var(--border-light)",
            borderBottom: "1px solid var(--border-light)",
            background: "rgba(5,5,5,0.8)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="marquee-track">
            {[...Array(2)].map((_, rep) =>
              MARQUEE_WORDS.map((word, i) => (
                <span key={`${rep}-${i}`} className="marquee-item">
                  {word}
                  <span className="marquee-diamond" />
                </span>
              )),
            )}
          </div>
        </section>

        {/* ════════════════════════════════════
            HOW IT WORKS
            ════════════════════════════════════ */}
        <section
          data-testid="how-it-works-section"
          style={{
            position: "relative",
            padding: "128px 24px",
            overflow: "hidden",
            background:
              "linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 50%, var(--bg-base) 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div
            style={{ maxWidth: 1152, margin: "0 auto", position: "relative" }}
          >
            <div style={{ textAlign: "center", marginBottom: 96 }}>
              <span className="section-overline">The Journey</span>
              <h2 className="section-title" data-testid="how-it-works-title">
                How It Works
              </h2>
              <div className="gold-line" style={{ width: 80, marginTop: 24 }} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 32,
              }}
            >
              {HOW_IT_WORKS.map((item, idx) => (
                <div
                  key={idx}
                  className="step-card"
                  data-testid={`feature-${idx + 1}`}
                >
                  <div className="step-card-img">
                    <div
                      className="step-card-bg"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="step-card-img-overlay" />
                    <span className="step-num">{item.step}</span>
                    <div
                      className="step-card-top-line"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
                      }}
                    />
                  </div>
                  <div className="step-card-body">
                    <div
                      className="step-icon-box"
                      style={{ color: item.accent }}
                    >
                      {item.icon}
                    </div>
                    <h3 className="step-card-title">{item.title}</h3>
                    <p className="step-card-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            QUOTE
            ════════════════════════════════════ */}
        <section
          data-testid="quote-section"
          style={{
            position: "relative",
            padding: "112px 24px",
            overflow: "hidden",
            background: "var(--bg-base)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 30% 50%, rgba(122,0,22,0.06) 0%, transparent 50%)",
            }}
          />
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
            }}
          >
            <span className="quote-mark">"</span>
            <blockquote>
              The greatest thing you'll ever learn is just to love and be loved
              in return.
            </blockquote>
            <div
              style={{
                width: 40,
                height: 1,
                background: "var(--brand-gold)",
                opacity: 0.3,
                margin: "32px auto 24px",
              }}
            />
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 300,
                fontSize: 11,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              Moulin Rouge
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════
            BOTTOM CTA
            ════════════════════════════════════ */}
        <section
          data-testid="bottom-cta-section"
          style={{
            position: "relative",
            padding: "128px 24px",
            overflow: "hidden",
            background: "var(--bg-base)",
            borderTop: "1px solid var(--border-light)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(122,0,22,0.08) 0%, transparent 50%)",
            }}
          />
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
            }}
          >
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "var(--brand-gold)",
                marginBottom: 20,
              }}
            >
              Begin Your Story
            </p>
            <h2
              data-testid="bottom-cta-title"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: 20,
                lineHeight: 1.1,
              }}
            >
              Ready to discover your
              <br />
              <span style={{ fontStyle: "italic", color: "var(--brand-gold)" }}>
                love language?
              </span>
            </h2>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 200,
                fontSize: 15,
                color: "var(--text-muted)",
                lineHeight: 1.8,
                maxWidth: 400,
                margin: "0 auto 48px",
              }}
            >
              Create your shared slam book and explore what makes your bond
              unique.
            </p>
            <button
              className="cta-primary"
              onClick={() => setShowStartModal(true)}
              data-testid="bottom-start-button"
              style={{ margin: "0 auto" }}
            >
              <Heart size={14} strokeWidth={1.5} />
              Start Now
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════
            FOOTER
            ════════════════════════════════════ */}
        <footer
          data-testid="footer"
          style={{
            padding: "40px 24px",
            textAlign: "center",
            borderTop: "1px solid var(--border-light)",
            background: "var(--bg-base)",
          }}
        >
          {/* e365 footer mark — replace inner span with <img src="/e365-logo.svg" … /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 18px",
                border: "1px solid rgba(212,175,55,0.1)",
                background: "rgba(212,175,55,0.03)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  color: "rgba(212,175,55,0.35)",
                }}
              >
                e365
              </span>
            </div>
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 16,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            Love &amp; Language
          </p>
          <p
            style={{
              marginTop: 8,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 10,
              fontWeight: 300,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(197,179,150,0.3)",
            }}
          >
            A love language experience by e365
          </p>
        </footer>

        {/* ════════════════════════════════════
            START MODAL
            ════════════════════════════════════ */}
        <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
          <DialogContent className="vv-modal-outer">
            <div className="modal-card">
              <div className="modal-banner-crimson" />
              <div className="modal-glow-crimson" />
              <div className="modal-inner">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
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
                      stroke="#D4AF37"
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
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                        <stop
                          offset="100%"
                          stopColor="#D4AF37"
                          stopOpacity="1"
                        />
                      </linearGradient>
                      <linearGradient
                        id="mg2"
                        x1="78"
                        y1="0"
                        x2="120"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
                        <stop
                          offset="100%"
                          stopColor="#D4AF37"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <p className="modal-title">Begin Your Journey</p>
                <p className="modal-sub">Create your shared slam book</p>
                <div style={{ marginBottom: 24 }}>
                  <label className="field-label">Your Partner's Name</label>
                  <input
                    className="field-input-line"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter their name…"
                    data-testid="partner-name-input"
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label className="field-label" style={{ marginBottom: 16 }}>
                    I Am The…
                  </label>
                  <div className="role-grid">
                    {[
                      {
                        id: "bride",
                        label: "Bride",
                        sub: "the beloved",
                        crimson: true,
                        icon: (
                          <Heart
                            size={18}
                            strokeWidth={1}
                            style={{ color: "#7A0016" }}
                          />
                        ),
                      },
                      {
                        id: "groom",
                        label: "Groom",
                        sub: "the devoted",
                        crimson: false,
                        icon: (
                          <Sparkles
                            size={18}
                            strokeWidth={1}
                            style={{ color: "#D4AF37" }}
                          />
                        ),
                      },
                    ].map((r) => (
                      <button
                        key={r.id}
                        className={`role-tile${role === r.id ? (r.crimson ? " bride-active" : " groom-active") : ""}`}
                        onClick={() => setRole(r.id)}
                        data-testid={`role-${r.id}-button`}
                      >
                        <div className="role-tile-inner">
                          <div className="role-check">✓</div>
                          <div
                            className="role-icon-ring"
                            style={{
                              background: r.crimson
                                ? "rgba(122,0,22,0.15)"
                                : "rgba(212,175,55,0.1)",
                              border: `1px solid ${r.crimson ? "rgba(122,0,22,0.3)" : "rgba(212,175,55,0.25)"}`,
                            }}
                          >
                            {r.icon}
                          </div>
                          <span className="role-name">{r.label}</span>
                          <span className="role-sub">{r.sub}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 32 }}>
                  <label className="field-label" style={{ marginBottom: 16 }}>
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
                          <span className="age-label">{ag.label}</span>
                          <span className="age-sub">{ag.sub}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="modal-divider" />
                <button
                  className="modal-btn-crimson"
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

        {/* ════════════════════════════════════
            JOIN MODAL
            ════════════════════════════════════ */}
        <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
          <DialogContent className="vv-modal-outer">
            <div className="modal-card">
              <div className="modal-banner-gold" />
              <div className="modal-glow-gold" />
              <div className="modal-inner">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
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
                      stroke="#D4AF37"
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
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                        <stop
                          offset="100%"
                          stopColor="#D4AF37"
                          stopOpacity="1"
                        />
                      </linearGradient>
                      <linearGradient
                        id="mg4"
                        x1="78"
                        y1="0"
                        x2="120"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
                        <stop
                          offset="100%"
                          stopColor="#D4AF37"
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
                      width: 80,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(122,0,22,0.06))",
                      border: "1px solid rgba(212,175,55,0.2)",
                      boxShadow: "0 0 40px rgba(212,175,55,0.06)",
                    }}
                  >
                    <Sparkles
                      size={28}
                      strokeWidth={1}
                      style={{ color: "var(--brand-gold)" }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label
                    className="field-label"
                    style={{ textAlign: "center", display: "block" }}
                  >
                    Share Code
                  </label>
                  <input
                    className="field-input-box"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ABC12345"
                    maxLength={8}
                    data-testid="join-code-input"
                  />
                </div>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11,
                    fontWeight: 300,
                    color: "rgba(197,179,150,0.3)",
                    textAlign: "center",
                    letterSpacing: "0.04em",
                    marginBottom: 24,
                  }}
                >
                  8-character code from your partner
                </p>
                <div className="modal-divider" />
                <button
                  className="modal-btn-gold"
                  onClick={handleJoinQuiz}
                  disabled={isLoading}
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