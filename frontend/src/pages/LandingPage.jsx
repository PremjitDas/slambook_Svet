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
import { Heart, Sparkles, ArrowRight, ChevronDown, X } from "lucide-react";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api";

/* ═══════════════════════════════════════════
   ROTATING SWEET MESSAGES
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
   PARTICLE FIELD
═══════════════════════════════════════════ */
function ParticleField() {
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
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.25 + 0.05,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.012 + 0.004,
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
          hue: Math.random() > 0.5 ? "#e8637a" : "#f2a8b5",
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
        p.x += Math.sin(p.wobble) * 0.35 + p.speedX;
        p.wobble += p.wobbleSpeed;
        if (p.y < -60) {
          p.y = canvas.height + 60;
          p.x = Math.random() * canvas.width;
        }
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "#e8637a";
        drawHeart(p.x, p.y, p.size);
        ctx.fill();
      });
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life -= p.decay;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life * 0.55;
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
      className="absolute inset-0 pointer-events-none z-[5]"
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
    icon: <Heart size={22} strokeWidth={1.5} />,
    title: "Fill Your Book",
    desc: "Answer questions about your wedding dreams through the lens of the five love languages.",
    image:
      "https://static.prod-images.emergentagent.com/jobs/2fe24af1-e331-4795-95b5-01edb84814c1/images/419e8df8fc54523ce02ddb7ced0712815d7319fefaca0390e6dae7754fe47215.png",
  },
  {
    step: "02",
    icon: <Sparkles size={22} strokeWidth={1.5} />,
    title: "Guess & Share",
    desc: "Predict your partner's answers, then share your unique link for them to complete their half.",
    image:
      "https://static.prod-images.emergentagent.com/jobs/2fe24af1-e331-4795-95b5-01edb84814c1/images/40db8ec20bc892532d45ca7efe8392beaaea74b9435ea37df783d446cc971902.png",
  },
  {
    step: "03",
    icon: <ArrowRight size={22} strokeWidth={1.5} />,
    title: "Discover Together",
    desc: "See your compatibility score and receive personalised wedding decor recommendations.",
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
  const [activeStep, setActiveStep] = useState(0);

  const heroMessage = INITIAL_MESSAGE;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % HOW_IT_WORKS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

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
    <div className="ll-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Tenor+Sans&display=swap');

        :root {
          --ink: #0f0608;
          --parchment: #fef0f3;
          --gold: #e8637a;
          --gold-light: #f2a8b5;
          --wine: #8b1a2e;
          --wine-mid: #c0314f;
          --blush: #f7c5cf;
          --smoke: #3a1220;
          --cream: #fde8ed;
        }

        .ll-root {
          min-height: 100vh;
          background: var(--ink);
          color: var(--parchment);
          font-family: 'Tenor Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .ll-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 4rem;
          background: linear-gradient(to bottom, rgba(15,6,8,0.95), transparent);
        }

        .ll-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .ll-logo-mark {
          width: 42px; height: 42px;
          border: 1.5px solid var(--gold);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px;
          letter-spacing: 0.05em;
          color: var(--gold);
          transition: all 0.3s;
        }

        .ll-logo:hover .ll-logo-mark {
          background: var(--gold);
          color: var(--ink);
        }

        .ll-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-style: italic;
          color: var(--gold-light);
          letter-spacing: 0.05em;
        }

        /* ── HERO ── */
        .ll-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ll-hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(139,26,46,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 80% 30%, rgba(232,99,122,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 100% 100% at 50% 100%, rgba(58,18,32,0.7) 0%, transparent 60%);
        }

        .ll-hero-line {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--gold), transparent);
          opacity: 0.2;
        }

        .ll-hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .ll-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
          opacity: 0;
          animation: fadeUp 0.9s ease forwards 0.2s;
        }

        .ll-eyebrow-line {
          width: 40px; height: 1px;
          background: var(--gold);
          opacity: 0.6;
        }

        .ll-eyebrow-text {
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .ll-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(4rem, 10vw, 9rem);
          font-weight: 300;
          line-height: 0.9;
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeUp 1s ease forwards 0.4s;
        }

        .ll-hero-title .word-love {
          display: block;
          color: var(--parchment);
          font-style: italic;
        }

        .ll-hero-title .word-lang {
          display: block;
          color: var(--gold);
          letter-spacing: -0.02em;
        }

        .ll-hero-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-style: italic;
          color: rgba(253,246,238,0.55);
          max-width: 520px;
          margin: 0 auto 3.5rem;
          line-height: 1.7;
          opacity: 0;
          animation: fadeUp 1s ease forwards 0.6s;
        }

        .ll-hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          opacity: 0;
          animation: fadeUp 1s ease forwards 0.8s;
        }

        .ll-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          background: var(--gold);
          color: var(--ink);
          border: none;
          font-family: 'Tenor Sans', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }

        .ll-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--wine-mid);
          transform: translateX(-100%);
          transition: transform 0.35s ease;
        }

        .ll-btn-primary:hover::before { transform: translateX(0); }
        .ll-btn-primary:hover { color: white; }
        .ll-btn-primary span, .ll-btn-primary svg { position: relative; z-index: 1; }

        .ll-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          background: transparent;
          color: var(--gold-light);
          border: 1px solid rgba(232,99,122,0.4);
          font-family: 'Tenor Sans', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.35s ease;
        }

        .ll-btn-secondary:hover {
          background: rgba(232,99,122,0.08);
          border-color: var(--gold);
          color: var(--gold);
        }

        .ll-scroll-hint {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(232,99,122,0.4);
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          animation: float 2s ease-in-out infinite;
        }

        /* ── MARQUEE ── */
        .ll-marquee-wrap {
          overflow: hidden;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(232,99,122,0.15);
          border-bottom: 1px solid rgba(232,99,122,0.15);
          background: rgba(232,99,122,0.03);
        }

        .ll-marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marquee 35s linear infinite;
        }

        .ll-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 2rem;
          margin-right: 2rem;
        }

        .ll-marquee-word {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-style: italic;
          color: rgba(232,99,122,0.35);
          letter-spacing: 0.05em;
        }

        .ll-marquee-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(232,99,122,0.25);
        }

        /* ── HOW IT WORKS ── */
        .ll-hiw {
          padding: 8rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .ll-section-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .ll-section-label-line {
          width: 32px; height: 1px;
          background: var(--gold);
          opacity: 0.5;
        }

        .ll-section-label-text {
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .ll-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          color: var(--parchment);
          margin-bottom: 5rem;
          line-height: 1.1;
        }

        .ll-section-title em {
          color: var(--gold);
          font-style: italic;
        }

        .ll-hiw-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .ll-hiw-tabs {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .ll-hiw-tab {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          padding: 2rem 0;
          border-bottom: 1px solid rgba(232,99,122,0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .ll-hiw-tab::before {
          content: '';
          position: absolute;
          left: -2rem;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: var(--gold);
          transition: height 0.4s ease;
        }

        .ll-hiw-tab.active::before { height: 80%; }

        .ll-hiw-tab-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: rgba(232,99,122,0.2);
          line-height: 1;
          transition: color 0.3s;
          min-width: 48px;
        }

        .ll-hiw-tab.active .ll-hiw-tab-num { color: var(--gold); }

        .ll-hiw-tab-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: rgba(253,246,238,0.45);
          margin-bottom: 0.5rem;
          transition: color 0.3s;
        }

        .ll-hiw-tab.active .ll-hiw-tab-title { color: var(--parchment); }

        .ll-hiw-tab-desc {
          font-size: 0.85rem;
          color: rgba(253,246,238,0.3);
          line-height: 1.7;
          max-height: 0;
          overflow: hidden;
          transition: all 0.4s ease, color 0.3s;
        }

        .ll-hiw-tab.active .ll-hiw-tab-desc {
          max-height: 80px;
          color: rgba(253,246,238,0.5);
        }

        .ll-hiw-visual {
          position: relative;
          aspect-ratio: 3/4;
        }

        .ll-hiw-img-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .ll-hiw-img {
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.6s ease;
          position: absolute;
          inset: 0;
        }

        .ll-hiw-img.visible { opacity: 1; }

        .ll-hiw-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(139,26,46,0.3), rgba(15,6,8,0.5));
          pointer-events: none;
        }

        .ll-hiw-step-badge {
          position: absolute;
          bottom: 2rem; right: 2rem;
          width: 64px; height: 64px;
          border: 1px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          background: rgba(15,6,8,0.8);
          color: var(--gold);
        }

        /* ── QUOTE ── */
        .ll-quote {
          padding: 7rem 4rem;
          text-align: center;
          position: relative;
          border-top: 1px solid rgba(232,99,122,0.1);
          border-bottom: 1px solid rgba(232,99,122,0.1);
          background: linear-gradient(135deg, rgba(139,26,46,0.08), transparent, rgba(232,99,122,0.05));
        }

        .ll-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 8rem;
          line-height: 0.5;
          color: rgba(232,99,122,0.1);
          margin-bottom: 2rem;
          display: block;
        }

        .ll-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-style: italic;
          font-weight: 300;
          color: rgba(253,246,238,0.75);
          max-width: 700px;
          margin: 0 auto 2.5rem;
          line-height: 1.5;
        }

        .ll-quote-source {
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(232,99,122,0.4);
        }

        /* ── BOTTOM CTA ── */
        .ll-cta {
          padding: 9rem 4rem;
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .ll-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--parchment);
          margin-bottom: 1.5rem;
        }

        .ll-cta-title em {
          color: var(--gold);
          font-style: italic;
          display: block;
        }

        .ll-cta-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: rgba(253,246,238,0.4);
          font-size: 1.1rem;
          margin-bottom: 3.5rem;
          line-height: 1.7;
        }

        /* ── FOOTER ── */
        .ll-footer {
          padding: 3rem 4rem;
          border-top: 1px solid rgba(232,99,122,0.12);
          text-align: center;
        }

        .ll-footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-style: italic;
          color: var(--gold);
          margin-bottom: 0.5rem;
        }

        .ll-footer-sub {
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(232,99,122,0.25);
        }

        /* ── MODALS ── */
        .ll-modal {
          background: #1a050a !important;
          border: 1px solid rgba(232,99,122,0.2) !important;
          border-radius: 0 !important;
          box-shadow: 0 40px 80px rgba(0,0,0,0.8) !important;
          color: var(--parchment) !important;
          padding: 0 !important;
          max-width: 460px !important;
          overflow: hidden !important;
        }

        .ll-modal-banner {
          height: 5px;
          background: linear-gradient(90deg, var(--wine) 0%, var(--gold) 50%, var(--wine-mid) 100%);
        }

        .ll-modal-header {
          text-align: center;
          padding: 2.5rem 2.5rem 1.5rem;
          border-bottom: 1px solid rgba(232,99,122,0.1);
        }

        .ll-modal-ornament {
          display: flex;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .ll-modal-icon {
          width: 56px; height: 56px;
          border: 1px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
          margin: 0 auto 1.25rem;
        }

        .ll-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          font-style: italic;
          color: var(--parchment);
          margin-bottom: 0.35rem;
        }

        .ll-modal-subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: rgba(232,99,122,0.5);
        }

        .ll-modal-body {
          padding: 2rem 2.5rem 2.5rem;
        }

        .ll-field-label {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(232,99,122,0.6);
          margin-bottom: 0.75rem;
        }

        .ll-field-group { margin-bottom: 1.75rem; }

        .ll-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(232,99,122,0.2);
          color: var(--parchment);
          font-family: 'Tenor Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
          box-sizing: border-box;
          caret-color: var(--gold);
        }

        .ll-input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(232,99,122,0.07);
        }
        .ll-input::placeholder { color: rgba(253,246,238,0.2); }

        .ll-input-center {
          text-align: center;
          font-size: 1.5rem;
          letter-spacing: 0.3em;
          font-family: 'Cormorant Garamond', serif;
        }

        .ll-roles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .ll-role-btn {
          padding: 1.25rem 1rem;
          background: transparent;
          border: 1px solid rgba(232,99,122,0.2);
          color: rgba(253,246,238,0.5);
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Cormorant Garamond', serif;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .ll-role-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .ll-role-btn:hover::before { opacity: 1; }

        .ll-role-btn:hover {
          border-color: rgba(232,99,122,0.5);
          color: var(--parchment);
          background: rgba(232,99,122,0.05);
        }

        .ll-role-btn.selected {
          border-color: var(--gold);
          background: rgba(232,99,122,0.1);
          color: var(--gold);
        }

        .ll-role-btn.selected::before { opacity: 1; }

        .ll-role-main {
          display: block;
          font-size: 1.2rem;
          font-style: italic;
          margin-bottom: 0.2rem;
        }

        .ll-role-sub {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          font-family: 'Tenor Sans', sans-serif;
          opacity: 0.6;
        }

        .ll-ages {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .ll-age-btn {
          padding: 0.875rem;
          background: transparent;
          border: 1px solid rgba(232,99,122,0.2);
          color: rgba(253,246,238,0.5);
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Cormorant Garamond', serif;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .ll-age-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0;
          transition: opacity 0.28s;
        }

        .ll-age-btn:hover::before { opacity: 1; }

        .ll-age-btn:hover {
          border-color: rgba(232,99,122,0.5);
          background: rgba(232,99,122,0.04);
          color: var(--parchment);
        }

        .ll-age-btn.selected {
          border-color: var(--gold);
          background: rgba(232,99,122,0.08);
          color: var(--gold);
        }

        .ll-age-btn.selected::before { opacity: 1; }

        .ll-age-main {
          display: block;
          font-size: 1rem;
          font-style: italic;
          margin-bottom: 0.15rem;
        }

        .ll-age-sub {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          font-family: 'Tenor Sans', sans-serif;
          opacity: 0.5;
        }

        .ll-modal-divider {
          height: 1px;
          margin: 1.5rem 0;
          background: linear-gradient(90deg, transparent, rgba(232,99,122,0.15), transparent);
        }

        .ll-submit-btn {
          width: 100%;
          padding: 1rem;
          background: var(--gold);
          color: var(--ink);
          border: none;
          font-family: 'Tenor Sans', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .ll-submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s;
        }

        .ll-submit-btn:hover::before { left: 150%; }
        .ll-submit-btn:hover:not(:disabled) { background: var(--wine-mid); color: white; }
        .ll-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .ll-modal-note {
          text-align: center;
          font-size: 0.7rem;
          color: rgba(232,99,122,0.3);
          margin-top: 1rem;
          letter-spacing: 0.05em;
        }

        .ll-close-btn {
          position: absolute;
          top: 1rem; right: 1rem;
          background: transparent;
          border: none;
          color: rgba(232,99,122,0.4);
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.2s;
          line-height: 0;
          z-index: 10;
        }

        .ll-close-btn:hover { color: var(--gold); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .ll-nav { padding: 1.25rem 1.5rem; }
          .ll-hiw { padding: 5rem 1.5rem; }
          .ll-hiw-layout { grid-template-columns: 1fr; gap: 3rem; }
          .ll-hiw-visual { display: none; }
          .ll-quote { padding: 5rem 1.5rem; }
          .ll-cta { padding: 6rem 1.5rem; }
          .ll-footer { padding: 2rem 1.5rem; }
          .ll-modal-body { padding: 1.5rem; }
          .ll-modal-header { padding: 2rem 1.5rem 1.25rem; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="ll-nav">
        <div className="ll-logo">
          <div className="ll-logo-mark">e365</div>
          <span className="ll-logo-name">Events 365</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section data-testid="hero-section" className="ll-hero">
        <div className="ll-hero-bg" />
        {[20, 40, 60, 80].map((left) => (
          <div
            key={left}
            className="ll-hero-line"
            style={{ left: `${left}%` }}
          />
        ))}
        <ParticleField />

        <div className="ll-hero-content">
          <div className="ll-eyebrow">
            <div className="ll-eyebrow-line" />
            <span className="ll-eyebrow-text">
              A Love Language Experience by e365
            </span>
            <div className="ll-eyebrow-line" />
          </div>

          <h1 data-testid="hero-title" className="ll-hero-title">
            <span className="word-love">Love</span>
            <span className="word-lang">Language</span>
          </h1>

          <p data-testid="hero-subtitle" className="ll-hero-subtitle">
            {heroMessage}
          </p>

          <div className="ll-hero-ctas">
            <button
              data-testid="start-quiz-button"
              onClick={() => setShowStartModal(true)}
              className="ll-btn-primary"
            >
              <Heart size={16} />
              <span>Start Your Slam Book</span>
              <ArrowRight size={16} />
            </button>
            <button
              data-testid="join-quiz-button"
              onClick={() => setShowJoinModal(true)}
              className="ll-btn-secondary"
            >
              <Sparkles size={16} />
              <span>Join Partner's Book</span>
            </button>
          </div>
        </div>

        <div data-testid="scroll-indicator" className="ll-scroll-hint">
          <span>Scroll</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <section data-testid="marquee-section" className="ll-marquee-wrap">
        <div className="ll-marquee-track">
          {[...Array(2)].map((_, rep) =>
            MARQUEE_WORDS.map((word, i) => (
              <span key={`${rep}-${i}`} className="ll-marquee-item">
                <span className="ll-marquee-word">{word}</span>
                <span className="ll-marquee-dot" />
              </span>
            )),
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section data-testid="how-it-works-section" className="ll-hiw">
        <div className="ll-section-label">
          <div className="ll-section-label-line" />
          <span className="ll-section-label-text">The Journey</span>
        </div>
        <h2 data-testid="how-it-works-title" className="ll-section-title">
          How It <em>Works</em>
        </h2>

        <div className="ll-hiw-layout">
          <div className="ll-hiw-tabs">
            {HOW_IT_WORKS.map((item, idx) => (
              <div
                key={idx}
                data-testid={`feature-${idx + 1}`}
                className={`ll-hiw-tab ${activeStep === idx ? "active" : ""}`}
                onClick={() => setActiveStep(idx)}
              >
                <div className="ll-hiw-tab-num">{item.step}</div>
                <div>
                  <div className="ll-hiw-tab-title">{item.title}</div>
                  <div className="ll-hiw-tab-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ll-hiw-visual">
            <div className="ll-hiw-img-wrap">
              {HOW_IT_WORKS.map((item, idx) => (
                <img
                  key={idx}
                  src={item.image}
                  alt={item.title}
                  className={`ll-hiw-img ${activeStep === idx ? "visible" : ""}`}
                />
              ))}
              <div className="ll-hiw-img-overlay" />
            </div>
            <div className="ll-hiw-step-badge">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.5rem",
                  fontStyle: "italic",
                }}
              >
                {HOW_IT_WORKS[activeStep].step}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section data-testid="quote-section" className="ll-quote">
        <span className="ll-quote-mark">"</span>
        <blockquote className="ll-quote-text">
          The greatest thing you'll ever learn is just to love and be loved in
          return.
        </blockquote>
        <div
          style={{
            width: 40,
            height: 1,
            background: "var(--gold)",
            opacity: 0.4,
            margin: "0 auto 1.5rem",
          }}
        />
        <p className="ll-quote-source">Moulin Rouge</p>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section data-testid="bottom-cta-section" className="ll-cta">
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "1.5rem",
          }}
        >
          Begin Your Story
        </p>
        <h2 data-testid="bottom-cta-title" className="ll-cta-title">
          Ready to discover your
          <em>love language?</em>
        </h2>
        <p className="ll-cta-sub">
          Create your shared slam book and explore what makes your bond truly
          unique.
        </p>
        <button
          data-testid="bottom-start-button"
          onClick={() => setShowStartModal(true)}
          className="ll-btn-primary"
          style={{ margin: "0 auto" }}
        >
          <Heart size={16} />
          <span>Start Now</span>
          <ArrowRight size={16} />
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer data-testid="footer" className="ll-footer">
        <div className="ll-footer-logo">Love & Language</div>
        <p className="ll-footer-sub">A love language experience by e365</p>
      </footer>

      {/* ══════════════════════════════
          START MODAL
      ══════════════════════════════ */}
      <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
        <DialogContent
          className="ll-modal"
          style={{ maxWidth: 460, padding: 0 }}
        >
          <button
            className="ll-close-btn"
            onClick={() => setShowStartModal(false)}
          >
            <X size={18} />
          </button>

          <div className="ll-modal-banner" />

          <div className="ll-modal-header">
            <div className="ll-modal-ornament">
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
                  stroke="#e8637a"
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
                    <stop offset="0%" stopColor="#e8637a" stopOpacity="0" />
                    <stop offset="100%" stopColor="#e8637a" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient
                    id="mg2"
                    x1="0"
                    y1="0"
                    x2="42"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#e8637a" stopOpacity="1" />
                    <stop offset="100%" stopColor="#e8637a" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="ll-modal-icon">
              <Heart size={22} />
            </div>
            <h3 className="ll-modal-title">Begin Your Journey</h3>
            <p className="ll-modal-subtitle">Create your shared slam book</p>
          </div>

          <div className="ll-modal-body">
            <div className="ll-field-group">
              <label className="ll-field-label">Your Partner's Name</label>
              <input
                data-testid="partner-name-input"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Enter their name…"
                className="ll-input"
              />
            </div>

            <div className="ll-field-group">
              <label className="ll-field-label">I Am The…</label>
              <div className="ll-roles">
                {[
                  { id: "bride", label: "Bride", sub: "the beloved" },
                  { id: "groom", label: "Groom", sub: "the devoted" },
                ].map((r) => (
                  <button
                    key={r.id}
                    data-testid={`role-${r.id}-button`}
                    onClick={() => setRole(r.id)}
                    className={`ll-role-btn ${role === r.id ? "selected" : ""}`}
                  >
                    <span className="ll-role-main">{r.label}</span>
                    <span className="ll-role-sub">{r.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ll-field-group">
              <label className="ll-field-label">Your Age Group</label>
              <div className="ll-ages">
                {AGE_GROUPS.map((ag) => (
                  <button
                    key={ag.value}
                    data-testid={`age-group-${ag.value}`}
                    onClick={() => setAgeGroup(ag.value)}
                    className={`ll-age-btn ${ageGroup === ag.value ? "selected" : ""}`}
                  >
                    <span className="ll-age-main">{ag.label}</span>
                    <span className="ll-age-sub">{ag.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ll-modal-divider" />

            <button
              data-testid="create-session-button"
              onClick={handleStartQuiz}
              disabled={isLoading}
              className="ll-submit-btn"
            >
              {isLoading ? "Creating…" : "Create My Slam Book"}
              <ArrowRight size={16} />
            </button>

            <p className="ll-modal-note">
              Your partner will receive a unique link to join
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════
          JOIN MODAL
      ══════════════════════════════ */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent
          className="ll-modal"
          style={{ maxWidth: 420, padding: 0 }}
        >
          <button
            className="ll-close-btn"
            onClick={() => setShowJoinModal(false)}
          >
            <X size={18} />
          </button>

          <div
            className="ll-modal-banner"
            style={{
              background:
                "linear-gradient(90deg, #8b1a2e 0%, #e8637a 50%, #c0314f 100%)",
            }}
          />

          <div className="ll-modal-header">
            <div className="ll-modal-ornament">
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
                  stroke="#f2a8b5"
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
                    <stop offset="0%" stopColor="#f2a8b5" stopOpacity="0" />
                    <stop offset="100%" stopColor="#f2a8b5" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient
                    id="mg4"
                    x1="0"
                    y1="0"
                    x2="42"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#f2a8b5" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f2a8b5" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div
              className="ll-modal-icon"
              style={{
                borderColor: "var(--gold-light)",
                color: "var(--gold-light)",
              }}
            >
              <Sparkles size={22} />
            </div>
            <h3 className="ll-modal-title">Join Your Partner</h3>
            <p className="ll-modal-subtitle">
              Enter the code they shared with you
            </p>
          </div>

          <div className="ll-modal-body">
            <div className="ll-field-group">
              <label
                className="ll-field-label"
                style={{ textAlign: "center", display: "block" }}
              >
                Share Code
              </label>
              <input
                data-testid="join-code-input"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABC12345"
                maxLength={8}
                className="ll-input ll-input-center"
              />
              <p className="ll-modal-note" style={{ marginTop: "0.5rem" }}>
                8-character code from your partner
              </p>
            </div>

            <div className="ll-modal-divider" />

            <button
              data-testid="join-session-button"
              onClick={handleJoinQuiz}
              disabled={isLoading}
              className="ll-submit-btn"
              style={{ background: "var(--wine-mid)" }}
            >
              {isLoading ? "Finding…" : "Join Slam Book"}
              <ArrowRight size={16} />
            </button>

            <p className="ll-modal-note">
              You'll answer the same questions as your partner
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}