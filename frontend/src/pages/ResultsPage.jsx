// import { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Download,
//   RefreshCw,
//   Heart,
//   Sparkles,
//   Clock,
//   ArrowLeft,
// } from "lucide-react";
// import { Button } from "../components/ui/button";
// import { Progress } from "../components/ui/progress";
// import { toast } from "sonner";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL + "/api";

// /* ── Floating particle canvas ── */
// function Particles() {
//   const ref = useRef(null);
//   useEffect(() => {
//     const c = ref.current;
//     if (!c) return;
//     const ctx = c.getContext("2d");
//     let raf;
//     const resize = () => {
//       c.width = window.innerWidth;
//       c.height = window.innerHeight;
//     };
//     resize();
//     window.addEventListener("resize", resize);
//     const pts = Array.from({ length: 50 }, () => ({
//       x: Math.random() * window.innerWidth,
//       y: Math.random() * window.innerHeight,
//       r: Math.random() * 1.6 + 0.3,
//       vx: (Math.random() - 0.5) * 0.2,
//       vy: (Math.random() - 0.5) * 0.2,
//       op: Math.random() * 0.4 + 0.1,
//       ph: Math.random() * Math.PI * 2,
//       ps: Math.random() * 0.01 + 0.004,
//     }));
//     const COLORS = [
//       "rgba(212,130,154,",
//       "rgba(201,168,124,",
//       "rgba(184,169,217,",
//     ];
//     const draw = () => {
//       ctx.clearRect(0, 0, c.width, c.height);
//       pts.forEach((p, i) => {
//         p.x += p.vx;
//         p.y += p.vy;
//         p.ph += p.ps;
//         if (p.x < 0) p.x = c.width;
//         if (p.x > c.width) p.x = 0;
//         if (p.y < 0) p.y = c.height;
//         if (p.y > c.height) p.y = 0;
//         const a = p.op * (0.6 + 0.4 * Math.sin(p.ph));
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = COLORS[i % 3] + a + ")";
//         ctx.fill();
//       });
//       for (let i = 0; i < pts.length; i++)
//         for (let j = i + 1; j < pts.length; j++) {
//           const dx = pts[i].x - pts[j].x,
//             dy = pts[i].y - pts[j].y;
//           const d = Math.sqrt(dx * dx + dy * dy);
//           if (d < 100) {
//             ctx.beginPath();
//             ctx.moveTo(pts[i].x, pts[i].y);
//             ctx.lineTo(pts[j].x, pts[j].y);
//             ctx.strokeStyle = `rgba(212,130,154,${(1 - d / 100) * 0.06})`;
//             ctx.lineWidth = 0.5;
//             ctx.stroke();
//           }
//         }
//       raf = requestAnimationFrame(draw);
//     };
//     draw();
//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("resize", resize);
//     };
//   }, []);
//   return (
//     <canvas
//       ref={ref}
//       style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
//     />
//   );
// }

// /* ── Animated score ring ── */
// function ScoreRing({ score }) {
//   const [displayed, setDisplayed] = useState(0);
//   const R = 88,
//     C = 2 * Math.PI * R;
//   useEffect(() => {
//     let start = null;
//     const duration = 1600;
//     const step = (ts) => {
//       if (!start) start = ts;
//       const p = Math.min((ts - start) / duration, 1);
//       const ease = 1 - Math.pow(1 - p, 3);
//       setDisplayed(Math.round(ease * score));
//       if (p < 1) requestAnimationFrame(step);
//     };
//     const id = setTimeout(() => requestAnimationFrame(step), 400);
//     return () => clearTimeout(id);
//   }, [score]);
//   const arc = (displayed / 100) * C;

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: 220,
//         height: 220,
//         margin: "0 auto",
//       }}
//     >
//       {/* Outer glow ring */}
//       <div
//         style={{
//           position: "absolute",
//           inset: -16,
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle, rgba(212,130,154,0.18) 0%, transparent 70%)",
//           filter: "blur(16px)",
//           animation: "ringPulse 3s ease-in-out infinite",
//         }}
//       />
//       <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
//         {/* Track */}
//         <circle
//           cx="110"
//           cy="110"
//           r={R}
//           stroke="rgba(255,255,255,0.06)"
//           strokeWidth="6"
//           fill="none"
//         />
//         {/* Glow duplicate */}
//         <circle
//           cx="110"
//           cy="110"
//           r={R}
//           stroke="rgba(212,130,154,0.15)"
//           strokeWidth="14"
//           fill="none"
//         />
//         {/* Main arc */}
//         <circle
//           cx="110"
//           cy="110"
//           r={R}
//           stroke="url(#scoreGrad)"
//           strokeWidth="6"
//           fill="none"
//           strokeDasharray={`${arc} ${C}`}
//           strokeLinecap="round"
//           style={{
//             filter: "drop-shadow(0 0 10px rgba(212,130,154,0.6))",
//             transition: "stroke-dasharray 0.1s",
//           }}
//         />
//         <defs>
//           <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#B8A9D9" />
//             <stop offset="50%" stopColor="#D4829A" />
//             <stop offset="100%" stopColor="#C9A87C" />
//           </linearGradient>
//         </defs>
//       </svg>
//       {/* Center */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
//           <span
//             style={{
//               fontFamily: "'Cormorant Garamond',serif",
//               fontSize: 52,
//               fontWeight: 300,
//               color: "#F5EFE8",
//               lineHeight: 1,
//             }}
//             data-testid="compatibility-score"
//           >
//             {displayed}
//           </span>
//           <span
//             style={{
//               fontFamily: "'DM Sans',sans-serif",
//               fontSize: 20,
//               fontWeight: 200,
//               color: "#9B8FAA",
//             }}
//           >
//             %
//           </span>
//         </div>
//         <span
//           style={{
//             fontFamily: "'DM Sans',sans-serif",
//             fontSize: 10,
//             fontWeight: 300,
//             letterSpacing: "0.22em",
//             textTransform: "uppercase",
//             color: "rgba(232,180,160,0.7)",
//             marginTop: 4,
//           }}
//         >
//           match
//         </span>
//       </div>
//     </div>
//   );
// }

// export default function ResultsPage() {
//   const { shareCode } = useParams();
//   const navigate = useNavigate();
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchResults();
//   }, [shareCode]);

//   const fetchResults = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         API + "/sessions/" + shareCode + "/results",
//       );
//       console.log(response.data.data);
//       setResults(response.data.data);
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       if (err.response?.status === 400) setError("waiting");
//       else {
//         setError("notfound");
//         toast.error("Results not found");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadPDF = async () => {
//     try {
//       const response = await axios.get(
//         API + "/sessions/" + shareCode + "/pdf",
//         { responseType: "blob" },
//       );
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "wedding-slambook-" + shareCode + ".pdf");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       toast.success("Summary downloaded!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to download summary");
//     }
//   };

//   /* ── Shared styles ── */
//   const globalStyles = `
//     @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@200;300;400&display=swap');
//     *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
//     body{background:#0D0B14}
//     @keyframes ringPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.08)}}
//     @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
//     @keyframes shimmerSlide{0%{background-position:-200% center}100%{background-position:200% center}}
//     @keyframes orbFloat{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-18px)}}
//     @keyframes spin{to{transform:rotate(360deg)}}
//     @keyframes barFill{from{width:0%}to{width:var(--w)}}
//     @keyframes badgePop{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
//     .fade-1{animation:fadeUp .8s .1s cubic-bezier(.22,1,.36,1) both}
//     .fade-2{animation:fadeUp .8s .25s cubic-bezier(.22,1,.36,1) both}
//     .fade-3{animation:fadeUp .8s .4s cubic-bezier(.22,1,.36,1) both}
//     .fade-4{animation:fadeUp .8s .55s cubic-bezier(.22,1,.36,1) both}
//     .fade-5{animation:fadeUp .8s .7s cubic-bezier(.22,1,.36,1) both}
//   `;

//   if (loading)
//     return (
//       <>
//         <style>{globalStyles}</style>
//         <div
//           style={{
//             minHeight: "100vh",
//             background: "#0D0B14",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 20,
//           }}
//         >
//           <div
//             style={{
//               width: 34,
//               height: 34,
//               borderRadius: "50%",
//               border: "1.5px solid rgba(212,130,154,0.15)",
//               borderTopColor: "#D4829A",
//               animation: "spin .8s linear infinite",
//             }}
//           />
//           <p
//             style={{
//               fontFamily: "'DM Sans',sans-serif",
//               fontWeight: 200,
//               fontSize: 11,
//               letterSpacing: "0.28em",
//               textTransform: "uppercase",
//               color: "rgba(155,143,170,0.6)",
//             }}
//           >
//             Loading your results…
//           </p>
//         </div>
//       </>
//     );

//   if (error === "waiting")
//     return (
//       <>
//         <style>{globalStyles}</style>
//         <div
//           style={{
//             minHeight: "100vh",
//             background: "linear-gradient(160deg,#0D0B14 0%,#180D1C 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "24px",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <Particles />
//           <div
//             style={{
//               maxWidth: 420,
//               width: "100%",
//               textAlign: "center",
//               position: "relative",
//               zIndex: 10,
//             }}
//           >
//             {/* Icon */}
//             <div
//               style={{
//                 width: 80,
//                 height: 80,
//                 borderRadius: "50%",
//                 background: "rgba(201,168,124,0.1)",
//                 border: "1px solid rgba(201,168,124,0.25)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 28px",
//                 boxShadow: "0 0 40px rgba(201,168,124,0.15)",
//               }}
//             >
//               <Clock size={32} color="#C9A87C" strokeWidth={1.5} />
//             </div>
//             <h1
//               style={{
//                 fontFamily: "'Cormorant Garamond',serif",
//                 fontWeight: 400,
//                 fontStyle: "italic",
//                 fontSize: "clamp(2rem,5vw,2.8rem)",
//                 color: "#F5EFE8",
//                 marginBottom: 16,
//               }}
//               data-testid="waiting-title"
//             >
//               Waiting for Partner
//             </h1>
//             <p
//               style={{
//                 fontFamily: "'DM Sans',sans-serif",
//                 fontWeight: 200,
//                 fontSize: 14,
//                 color: "#9B8FAA",
//                 lineHeight: 1.85,
//                 letterSpacing: "0.03em",
//                 marginBottom: 40,
//               }}
//             >
//               Your partner hasn't completed their book yet. Results will appear
//               once both of you have finished.
//             </p>
//             <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
//               <button
//                 onClick={() => navigate("/")}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "13px 26px",
//                   borderRadius: "100px",
//                   background: "transparent",
//                   border: "1px solid rgba(232,180,160,0.3)",
//                   color: "#F5EFE8",
//                   fontFamily: "'DM Sans',sans-serif",
//                   fontSize: 11,
//                   fontWeight: 300,
//                   letterSpacing: "0.18em",
//                   textTransform: "uppercase",
//                   cursor: "pointer",
//                   transition: "all .3s",
//                 }}
//                 data-testid="back-home-button"
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.borderColor = "rgba(232,180,160,0.6)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.borderColor = "rgba(232,180,160,0.3)")
//                 }
//               >
//                 <ArrowLeft size={13} />
//                 Home
//               </button>
//               <button
//                 onClick={fetchResults}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "13px 26px",
//                   borderRadius: "100px",
//                   background: "linear-gradient(135deg,#D4829A,#A85070)",
//                   border: "none",
//                   color: "#fff",
//                   fontFamily: "'DM Sans',sans-serif",
//                   fontSize: 11,
//                   fontWeight: 400,
//                   letterSpacing: "0.18em",
//                   textTransform: "uppercase",
//                   cursor: "pointer",
//                   boxShadow: "0 8px 28px rgba(212,130,154,0.35)",
//                   transition: "transform .3s, filter .3s",
//                 }}
//                 data-testid="refresh-button"
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translateY(-2px)";
//                   e.currentTarget.style.filter = "brightness(1.1)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.filter = "brightness(1)";
//                 }}
//               >
//                 <RefreshCw size={13} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>
//       </>
//     );

//   if (error === "notfound" || !results)
//     return (
//       <>
//         <style>{globalStyles}</style>
//         <div
//           style={{
//             minHeight: "100vh",
//             background: "#0D0B14",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "24px",
//           }}
//         >
//           <div style={{ textAlign: "center" }}>
//             <h1
//               style={{
//                 fontFamily: "'Cormorant Garamond',serif",
//                 fontWeight: 300,
//                 fontStyle: "italic",
//                 fontSize: 36,
//                 color: "#F5EFE8",
//                 marginBottom: 24,
//               }}
//             >
//               Session Not Found
//             </h1>
//             <button
//               onClick={() => navigate("/")}
//               style={{
//                 padding: "13px 32px",
//                 borderRadius: "100px",
//                 background: "linear-gradient(135deg,#D4829A,#A85070)",
//                 border: "none",
//                 color: "#fff",
//                 fontFamily: "'DM Sans',sans-serif",
//                 fontSize: 11,
//                 letterSpacing: "0.2em",
//                 textTransform: "uppercase",
//                 cursor: "pointer",
//               }}
//             >
//               Go Home
//             </button>
//           </div>
//         </div>
//       </>
//     );

//   const circumference = 2 * Math.PI * 88;

//   /* Category score color mapping */
//   const catColors = ["#D4829A", "#C9A87C", "#B8A9D9", "#E8B4A0", "#8FBCCE"];

//   return (
//     <>
//       <style>
//         {globalStyles +
//           `
//         /* Category bar fill animation */
//         .cat-bar-fill { animation: barFill 1.2s cubic-bezier(.22,1,.36,1) both; }

//         /* Card hover */
//         .cat-card { transition: transform .35s cubic-bezier(.22,1,.36,1), border-color .35s, box-shadow .35s; }
//         .cat-card:hover { transform: translateY(-5px); border-color: rgba(232,180,160,0.28) !important; box-shadow: 0 20px 56px rgba(0,0,0,0.5) !important; }
//         .cat-card:hover .cat-bar-track { background: rgba(255,255,255,0.08) !important; }

//         /* Shimmer bar */
//         .shimmer-bar {
//           height:1px; width:100px; margin:0 auto;
//           background:linear-gradient(90deg,transparent 0%,#C9A87C 45%,#E8B4A0 55%,transparent 100%);
//           background-size:200% 100%;
//           animation:shimmerSlide 3s linear infinite;
//         }

//         /* Download btn */
//         .dl-btn { transition: transform .3s, box-shadow .3s, filter .3s; }
//         .dl-btn:hover { transform: translateY(-3px) !important; filter: brightness(1.1); box-shadow: 0 16px 48px rgba(212,130,154,0.45) !important; }

//         /* Outline btn */
//         .ol-btn { transition: all .3s; }
//         .ol-btn:hover { background: rgba(232,180,160,0.08) !important; border-color: rgba(232,180,160,0.6) !important; transform: translateY(-2px); }

//         /* Img card */
//         .img-card { transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s; overflow:hidden; border-radius:20px; }
//         .img-card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 28px 64px rgba(0,0,0,0.5) !important; }
//         .img-card img { transition: transform .6s cubic-bezier(.22,1,.36,1); }
//         .img-card:hover img { transform: scale(1.06); }

//         /* Orb float */
//         .orb-a { animation: orbFloat 12s ease-in-out infinite; }
//         .orb-b { animation: orbFloat 18s ease-in-out infinite reverse; }
//       `}
//       </style>

//       <div
//         style={{
//           minHeight: "100vh",
//           background: "#0D0B14",
//           position: "relative",
//           overflow: "hidden",
//           fontFamily: "'DM Sans',sans-serif",
//         }}
//       >
//         <Particles />

//         {/* ── Ambient orbs ── */}
//         <div
//           className="orb-a"
//           style={{
//             position: "fixed",
//             top: "10%",
//             left: "15%",
//             width: 500,
//             height: 500,
//             borderRadius: "50%",
//             background:
//               "radial-gradient(circle,rgba(212,130,154,0.18) 0%,transparent 70%)",
//             filter: "blur(80px)",
//             pointerEvents: "none",
//             zIndex: 0,
//           }}
//         />
//         <div
//           className="orb-b"
//           style={{
//             position: "fixed",
//             bottom: "15%",
//             right: "10%",
//             width: 380,
//             height: 380,
//             borderRadius: "50%",
//             background:
//               "radial-gradient(circle,rgba(184,169,217,0.14) 0%,transparent 70%)",
//             filter: "blur(70px)",
//             pointerEvents: "none",
//             zIndex: 0,
//           }}
//         />
//         <div
//           style={{
//             position: "fixed",
//             top: "50%",
//             left: "60%",
//             width: 300,
//             height: 300,
//             borderRadius: "50%",
//             background:
//               "radial-gradient(circle,rgba(201,168,124,0.1) 0%,transparent 70%)",
//             filter: "blur(60px)",
//             pointerEvents: "none",
//             zIndex: 0,
//           }}
//         />

//         <div style={{ position: "relative", zIndex: 10 }}>
//           {/* ══════════ HERO ══════════ */}
//           <section
//             style={{
//               padding: "100px 24px 80px",
//               textAlign: "center",
//               borderBottom: "1px solid rgba(232,180,160,0.08)",
//               background:
//                 "linear-gradient(180deg,rgba(22,8,16,0.6) 0%,transparent 100%)",
//             }}
//           >
//             <div style={{ maxWidth: 680, margin: "0 auto" }}>
//               {/* Badge */}
//               <div className="fade-1" style={{ marginBottom: 20 }}>
//                 <span
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 8,
//                     padding: "5px 18px",
//                     borderRadius: "100px",
//                     border: "1px solid rgba(232,180,160,0.28)",
//                     background: "rgba(232,180,160,0.07)",
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 10,
//                     fontWeight: 300,
//                     letterSpacing: "0.3em",
//                     textTransform: "uppercase",
//                     color: "#E8B4A0",
//                   }}
//                 >
//                   <span
//                     style={{
//                       width: 5,
//                       height: 5,
//                       borderRadius: "50%",
//                       background: "#E8B4A0",
//                       display: "inline-block",
//                       boxShadow: "0 0 8px #E8B4A0",
//                     }}
//                   />
//                   Your Results
//                 </span>
//               </div>

//               <h1
//                 className="fade-2"
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontWeight: 300,
//                   fontStyle: "italic",
//                   fontSize: "clamp(2.8rem,7vw,5rem)",
//                   color: "#F5EFE8",
//                   lineHeight: 1.08,
//                   letterSpacing: "-0.01em",
//                   marginBottom: 16,
//                 }}
//                 data-testid="results-title"
//               >
//                 Compatibility Score
//               </h1>

//               <div
//                 className="fade-2 shimmer-bar"
//                 style={{ marginBottom: 56 }}
//               />

//               {/* Score ring */}
//               <div className="fade-3">
//                 <ScoreRing score={results.compatibility_score} />
//               </div>

//               <p
//                 className="fade-4"
//                 style={{
//                   marginTop: 32,
//                   fontSize: 14,
//                   fontWeight: 200,
//                   color: "#9B8FAA",
//                   lineHeight: 1.9,
//                   maxWidth: 440,
//                   margin: "32px auto 0",
//                   letterSpacing: "0.03em",
//                 }}
//               >
//                 You know each other beautifully. Here's a breakdown of your love
//                 language compatibility.
//               </p>
//             </div>
//           </section>

//           {/* ══════════ CATEGORY BREAKDOWN ══════════ */}
//           <section
//             style={{
//               padding: "80px 24px",
//               background:
//                 "linear-gradient(180deg,#0D0B14 0%,#110D1C 50%,#0D0B14 100%)",
//               position: "relative",
//             }}
//           >
//             {/* Grid texture */}
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 backgroundImage: `linear-gradient(rgba(232,180,160,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(232,180,160,0.02) 1px,transparent 1px)`,
//                 backgroundSize: "80px 80px",
//                 pointerEvents: "none",
//               }}
//             />

//             <div
//               style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}
//             >
//               <div
//                 className="fade-1"
//                 style={{ textAlign: "center", marginBottom: 60 }}
//               >
//                 <p
//                   style={{
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 10,
//                     fontWeight: 300,
//                     letterSpacing: "0.35em",
//                     textTransform: "uppercase",
//                     color: "#C9A87C",
//                     marginBottom: 14,
//                   }}
//                 >
//                   Love Languages
//                 </p>
//                 <h2
//                   style={{
//                     fontFamily: "'Cormorant Garamond',serif",
//                     fontWeight: 400,
//                     fontSize: "clamp(1.8rem,4vw,2.6rem)",
//                     color: "#F5EFE8",
//                   }}
//                 >
//                   Category Breakdown
//                 </h2>
//                 <div className="shimmer-bar" style={{ marginTop: 18 }} />
//               </div>

//               <div
//                 style={{ display: "flex", flexDirection: "column", gap: 16 }}
//               >
//                 {Object.entries(results.category_scores || {}).map(
//                   ([category, score], idx) => {
//                     const color = catColors[idx % catColors.length];
//                     return (
//                       <div
//                         key={category}
//                         className="cat-card fade-2"
//                         style={{
//                           background: "rgba(22,17,36,0.85)",
//                           border: "1px solid rgba(232,180,160,0.1)",
//                           borderRadius: 20,
//                           padding: "28px 28px 24px",
//                           backdropFilter: "blur(20px)",
//                           animationDelay: `${idx * 0.1}s`,
//                           boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
//                           position: "relative",
//                           overflow: "hidden",
//                         }}
//                         data-testid={
//                           "category-" +
//                           category.replace(/\s+/g, "-").toLowerCase()
//                         }
//                       >
//                         {/* Top accent line */}
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: 0,
//                             left: 0,
//                             right: 0,
//                             height: 1,
//                             background: `linear-gradient(90deg,transparent,${color}55,transparent)`,
//                           }}
//                         />

//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "flex-start",
//                             marginBottom: 16,
//                           }}
//                         >
//                           <div>
//                             <h3
//                               style={{
//                                 fontFamily: "'Cormorant Garamond',serif",
//                                 fontWeight: 400,
//                                 fontSize: 20,
//                                 color: "#F5EFE8",
//                                 marginBottom: 4,
//                               }}
//                             >
//                               {category}
//                             </h3>
//                             {results.decor_predictions?.[category] && (
//                               <p
//                                 style={{
//                                   fontSize: 12,
//                                   fontWeight: 200,
//                                   color: "#9B8FAA",
//                                   letterSpacing: "0.03em",
//                                   lineHeight: 1.6,
//                                   maxWidth: 480,
//                                 }}
//                               >
//                                 {results.decor_predictions[category]}
//                               </p>
//                             )}
//                           </div>
//                           {/* Score badge */}
//                           <div
//                             style={{
//                               flexShrink: 0,
//                               marginLeft: 20,
//                               width: 52,
//                               height: 52,
//                               borderRadius: "50%",
//                               border: `1.5px solid ${color}55`,
//                               background: `${color}15`,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               boxShadow: `0 0 20px ${color}20`,
//                             }}
//                           >
//                             <span
//                               style={{
//                                 fontFamily: "'Cormorant Garamond',serif",
//                                 fontSize: 17,
//                                 fontWeight: 400,
//                                 color,
//                               }}
//                             >
//                               {Math.round(score)}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Custom progress bar */}
//                         <div
//                           className="cat-bar-track"
//                           style={{
//                             height: 5,
//                             borderRadius: 3,
//                             background: "rgba(255,255,255,0.06)",
//                             overflow: "hidden",
//                             position: "relative",
//                           }}
//                         >
//                           <div
//                             className="cat-bar-fill"
//                             style={{
//                               height: "100%",
//                               borderRadius: 3,
//                               background: `linear-gradient(90deg,${color}99,${color})`,
//                               boxShadow: `0 0 12px ${color}60`,
//                               "--w": `${score}%`,
//                               animationDelay: `${0.4 + idx * 0.12}s`,
//                             }}
//                           />
//                         </div>
//                       </div>
//                     );
//                   },
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* ══════════ AI RECOMMENDATIONS ══════════ */}
//           <section
//             style={{
//               padding: "80px 24px",
//               background:
//                 "linear-gradient(180deg,#0D0B14 0%,rgba(18,8,24,0.8) 100%)",
//               borderTop: "1px solid rgba(232,180,160,0.06)",
//             }}
//           >
//             <div style={{ maxWidth: 720, margin: "0 auto" }}>
//               {/* Heading */}
//               <div
//                 className="fade-1"
//                 style={{ textAlign: "center", marginBottom: 48 }}
//               >
//                 <div
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     gap: 10,
//                     marginBottom: 16,
//                     padding: "6px 20px",
//                     borderRadius: "100px",
//                     border: "1px solid rgba(232,180,160,0.2)",
//                     background: "rgba(232,180,160,0.06)",
//                   }}
//                 >
//                   <Sparkles size={14} color="#E8B4A0" strokeWidth={1.5} />
//                   <span
//                     style={{
//                       fontFamily: "'DM Sans',sans-serif",
//                       fontSize: 10,
//                       fontWeight: 300,
//                       letterSpacing: "0.28em",
//                       textTransform: "uppercase",
//                       color: "#E8B4A0",
//                     }}
//                   >
//                     AI Powered
//                   </span>
//                 </div>
//                 <h2
//                   style={{
//                     fontFamily: "'Cormorant Garamond',serif",
//                     fontWeight: 400,
//                     fontSize: "clamp(1.8rem,4vw,2.6rem)",
//                     color: "#F5EFE8",
//                   }}
//                 >
//                   Decor Recommendations
//                 </h2>
//                 <div className="shimmer-bar" style={{ marginTop: 18 }} />
//               </div>

//               {/* Recommendation card */}
//               <div
//                 className="fade-2"
//                 data-testid="ai-recommendations"
//                 style={{
//                   background: "rgba(22,17,36,0.9)",
//                   border: "1px solid rgba(232,180,160,0.14)",
//                   borderRadius: 24,
//                   padding: "36px 36px",
//                   backdropFilter: "blur(24px)",
//                   boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
//                   position: "relative",
//                   overflow: "hidden",
//                   marginBottom: 32,
//                 }}
//               >
//                 {/* Top gradient sheen */}
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     height: 2,
//                     background:
//                       "linear-gradient(90deg,transparent,#D4829A,#C9A87C,#B8A9D9,transparent)",
//                     opacity: 0.6,
//                   }}
//                 />
//                 {/* Inner glow */}
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: -40,
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     width: 300,
//                     height: 160,
//                     borderRadius: "50%",
//                     background:
//                       "radial-gradient(circle,rgba(212,130,154,0.1) 0%,transparent 70%)",
//                     filter: "blur(30px)",
//                     pointerEvents: "none",
//                   }}
//                 />

//                 <div
//                   style={{
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontWeight: 300,
//                     fontSize: 14,
//                     color: "#B8A8BC",
//                     lineHeight: 1.95,
//                     letterSpacing: "0.03em",
//                     whiteSpace: "pre-wrap",
//                     position: "relative",
//                     zIndex: 1,
//                   }}
//                 >
//                   {results.ai_recommendations ||
//                     "Generating personalised recommendations…"}
//                 </div>
//               </div>

//               {/* Images */}
//               <div
//                 className="fade-3"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
//                   gap: 20,
//                 }}
//               >
//                 <div
//                   className="img-card"
//                   style={{
//                     aspectRatio: "4/3",
//                     boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
//                     border: "1px solid rgba(232,180,160,0.1)",
//                   }}
//                 >
//                   <img
//                     src="https://images.unsplash.com/photo-1768777270882-9f74939fee50?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwZGVjb3IlMjB0YWJsZXxlbnwwfHx8fDE3NzQ4NjU4Njh8MA&ixlib=rb-4.1.0&q=85"
//                     alt="Wedding decor inspiration"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       display: "block",
//                     }}
//                   />
//                 </div>
//                 <div
//                   className="img-card"
//                   style={{
//                     aspectRatio: "4/3",
//                     boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
//                     border: "1px solid rgba(232,180,160,0.1)",
//                   }}
//                 >
//                   <img
//                     src="https://images.unsplash.com/photo-1719786624838-b5d9a9e3f378?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB3ZWRkaW5nJTIwZGVjb3IlMjB0YWJsZXxlbnwwfHx8fDE3NzQ4NjU4Njh8MA&ixlib=rb-4.1.0&q=85"
//                     alt="Wedding table setting"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                       display: "block",
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ══════════ ACTIONS ══════════ */}
//           <section
//             style={{
//               padding: "72px 24px",
//               background: "#0D0B14",
//               borderTop: "1px solid rgba(232,180,160,0.06)",
//             }}
//           >
//             <div
//               style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}
//             >
//               <div className="fade-1" style={{ marginBottom: 20 }}>
//                 <div className="shimmer-bar" style={{ marginBottom: 36 }} />
//                 <button
//                   className="dl-btn"
//                   onClick={downloadPDF}
//                   style={{
//                     width: "100%",
//                     padding: "16px 24px",
//                     borderRadius: "100px",
//                     border: "none",
//                     cursor: "pointer",
//                     background:
//                       "linear-gradient(135deg,#D4829A 0%,#B05878 100%)",
//                     color: "#fff",
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 11,
//                     fontWeight: 400,
//                     letterSpacing: "0.22em",
//                     textTransform: "uppercase",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 10,
//                     boxShadow: "0 10px 36px rgba(212,130,154,0.35)",
//                     marginBottom: 14,
//                     position: "relative",
//                     overflow: "hidden",
//                   }}
//                   data-testid="download-pdf-button"
//                 >
//                   <div
//                     style={{
//                       position: "absolute",
//                       inset: 0,
//                       background:
//                         "linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 55%)",
//                       pointerEvents: "none",
//                     }}
//                   />
//                   <Download size={15} />
//                   Download Summary
//                 </button>

//                 <button
//                   className="ol-btn"
//                   onClick={() => navigate("/")}
//                   style={{
//                     width: "100%",
//                     padding: "15px 24px",
//                     borderRadius: "100px",
//                     cursor: "pointer",
//                     background: "transparent",
//                     border: "1px solid rgba(232,180,160,0.3)",
//                     color: "#F5EFE8",
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 11,
//                     fontWeight: 300,
//                     letterSpacing: "0.22em",
//                     textTransform: "uppercase",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 10,
//                     backdropFilter: "blur(8px)",
//                   }}
//                   data-testid="start-new-button"
//                 >
//                   <Heart size={14} strokeWidth={1.5} />
//                   Start New Book
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* ══════════ FOOTER ══════════ */}
//           <footer
//             style={{
//               padding: "24px",
//               borderTop: "1px solid rgba(232,180,160,0.06)",
//               background: "rgba(13,11,20,0.95)",
//             }}
//           >
//             <div style={{ textAlign: "center" }}>
//               <svg
//                 width="80"
//                 height="14"
//                 viewBox="0 0 80 14"
//                 fill="none"
//                 style={{ marginBottom: 10 }}
//               >
//                 <line
//                   x1="0"
//                   y1="7"
//                   x2="28"
//                   y2="7"
//                   stroke="#C9A87C"
//                   strokeWidth="0.5"
//                   strokeOpacity="0.4"
//                 />
//                 <path
//                   d="M34 7C35.5 4 38 2 40 7C42 2 44.5 4 46 7"
//                   stroke="#E8B4A0"
//                   strokeWidth="0.7"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeOpacity="0.7"
//                 />
//                 <line
//                   x1="52"
//                   y1="7"
//                   x2="80"
//                   y2="7"
//                   stroke="#C9A87C"
//                   strokeWidth="0.5"
//                   strokeOpacity="0.4"
//                 />
//               </svg>
//               <p
//                 style={{
//                   fontFamily: "'DM Sans',sans-serif",
//                   fontWeight: 200,
//                   fontSize: 11,
//                   color: "rgba(155,143,170,0.45)",
//                   letterSpacing: "0.12em",
//                 }}
//               >
//                 Generated with love by Vows & Volumes
//               </p>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Download,
  RefreshCw,
  Heart,
  Sparkles,
  Clock,
  ArrowLeft,
  X,
  ChevronRight,
  User,
  Phone,
  MapPin,
  IndianRupee,
  Calendar,
  CheckCircle,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api";
const RAZORPAY_KEY =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXX";
const REPORT_PRICE_PAISE = 49900;

const BUDGET_OPTIONS = [
  "Under ₹5 Lakhs",
  "₹5 – ₹15 Lakhs",
  "₹15 – ₹30 Lakhs",
  "₹30 – ₹50 Lakhs",
  "₹50 Lakhs+",
];

/* ─────────────────────────────────────────────
   Field — module level to prevent remount
───────────────────────────────────────────── */
function Field({ label, icon, type, placeholder, value, onChange, error }) {
  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: `1px solid ${error ? "rgba(220,80,80,0.6)" : "rgba(232,180,160,0.2)"}`,
    background: "rgba(255,255,255,0.04)",
    color: "#F5EFE8",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    fontWeight: 300,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .25s",
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          fontWeight: 300,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(232,180,160,0.7)",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {icon} {label}
      </label>
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "rgba(212,130,154,0.55)")}
        onBlur={(e) =>
          (e.target.style.borderColor = error
            ? "rgba(220,80,80,0.6)"
            : "rgba(232,180,160,0.2)")
        }
      />
      {error && (
        <p
          style={{
            fontSize: 11,
            color: "rgba(220,100,100,0.9)",
            marginTop: 4,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Particles
───────────────────────────────────────────── */
function Particles() {
  const ref = useRef(null);
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
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      op: Math.random() * 0.4 + 0.1,
      ph: Math.random() * Math.PI * 2,
      ps: Math.random() * 0.01 + 0.004,
    }));
    const COLORS = [
      "rgba(212,130,154,",
      "rgba(201,168,124,",
      "rgba(184,169,217,",
    ];
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.ph += p.ps;
        if (p.x < 0) p.x = c.width;
        if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;
        const a = p.op * (0.6 + 0.4 * Math.sin(p.ph));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[i % 3] + a + ")";
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(212,130,154,${(1 - d / 100) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

/* ─────────────────────────────────────────────
   Score Ring
───────────────────────────────────────────── */
function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const R = 88,
    C = 2 * Math.PI * R;
  useEffect(() => {
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      setDisplayed(Math.round((1 - Math.pow(1 - p, 3)) * score));
      if (p < 1) requestAnimationFrame(animate);
    };
    const id = setTimeout(() => requestAnimationFrame(animate), 400);
    return () => clearTimeout(id);
  }, [score]);
  const arc = (displayed / 100) * C;
  return (
    <div
      style={{
        position: "relative",
        width: 220,
        height: 220,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -16,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,130,154,0.18) 0%, transparent 70%)",
          filter: "blur(16px)",
          animation: "ringPulse 3s ease-in-out infinite",
        }}
      />
      <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="110"
          cy="110"
          r={R}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="110"
          cy="110"
          r={R}
          stroke="rgba(212,130,154,0.15)"
          strokeWidth="14"
          fill="none"
        />
        <circle
          cx="110"
          cy="110"
          r={R}
          stroke="url(#scoreGrad)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${arc} ${C}`}
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 10px rgba(212,130,154,0.6))",
            transition: "stroke-dasharray 0.1s",
          }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8A9D9" />
            <stop offset="50%" stopColor="#D4829A" />
            <stop offset="100%" stopColor="#C9A87C" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 52,
              fontWeight: 300,
              color: "#F5EFE8",
              lineHeight: 1,
            }}
            data-testid="compatibility-score"
          >
            {displayed}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 20,
              fontWeight: 200,
              color: "#9B8FAA",
            }}
          >
            %
          </span>
        </div>
        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 10,
            fontWeight: 300,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(232,180,160,0.7)",
            marginTop: 4,
          }}
        >
          match
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Download Modal
   Flow: Step 0 (personal) → Step 1 (wedding)
         → Step 2 (submitting to API, auto-advances)
         → Step 3 (checkout / pay)
───────────────────────────────────────────── */

// Step constants for clarity
const STEP_PERSONAL = 0;
const STEP_WEDDING = 1;
const STEP_SAVING = 2; // transient — API call in progress
const STEP_CHECKOUT = 3;

// function DownloadModal({ onClose, onPaymentSuccess, shareCode }) {
//   const [step, setStep] = useState(STEP_PERSONAL);
//   const [errors, setErrors] = useState({});
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     partnerName: "",
//     weddingDate: "",
//     weddingLocation: "",
//     budget: "",
//     guestCount: "",
//   });

//   const handleChange = (key) => (e) => {
//     const val = e.target.value;
//     setForm((prev) => ({ ...prev, [key]: val }));
//     setErrors((prev) => ({ ...prev, [key]: "" }));
//   };

//   /* ── Validation ── */
//   const validateStep = (s) => {
//     const e = {};
//     if (s === STEP_PERSONAL) {
//       if (!form.name.trim()) e.name = "Required";
//       if (!/^\d{10}$/.test(form.phone))
//         e.phone = "Enter a valid 10-digit number";
//       if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
//       if (!form.partnerName.trim()) e.partnerName = "Required";
//     }
//     if (s === STEP_WEDDING) {
//       if (!form.weddingLocation.trim()) e.weddingLocation = "Required";
//       if (!form.budget) e.budget = "Please select a budget";
//     }
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   /* ── Next button handler ── */
//   const handleNext = () => {
//     if (step === STEP_PERSONAL && validateStep(STEP_PERSONAL))
//       setStep(STEP_WEDDING);
//     if (step === STEP_WEDDING && validateStep(STEP_WEDDING)) submitFormData();
//   };

//   /* ── Step 2: POST form data to server, then go to checkout ── */
//   const submitFormData = async () => {
//     setStep(STEP_SAVING); // show spinner
//     try {
//       await axios.post(`${API}/information/`, {
//         fullName: form.name,
//         partnerName: form.partnerName,
//         phoneNumber: form.phone,
//         email: form.email,
//         location: form.weddingLocation,
//         date: form.weddingDate || null,
//         guestCount: form.guestCount ? Number(form.guestCount) : null,
//         budget: form.budget,
//       });
//       toast.success("Details saved!");
//       setStep(STEP_CHECKOUT); // advance to pay screen
//     } catch (err) {
//       console.error(err);
//       const msg =
//         err.response?.data?.message ||
//         "Could not save your details. Please try again.";
//       toast.error(msg);
//       setStep(STEP_WEDDING); // go back so user can retry
//     }
//   };

//   /* ── Razorpay ── */
//   const loadRazorpayScript = () =>
//     new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const s = document.createElement("script");
//       s.src = "https://checkout.razorpay.com/v1/checkout.js";
//       s.onload = () => resolve(true);
//       s.onerror = () => resolve(false);
//       document.body.appendChild(s);
//     });

//   const initRazorpay = async () => {
//     const loaded = await loadRazorpayScript();
//     if (!loaded) {
//       toast.error("Failed to load payment gateway. Please try again.");
//       return;
//     }
//     const rzp = new window.Razorpay({
//       key: RAZORPAY_KEY,
//       amount: REPORT_PRICE_PAISE,
//       currency: "INR",
//       name: "Vows & Volumes",
//       description: "Wedding Slambook PDF Report",
//       prefill: {
//         name: form.name,
//         email: form.email,
//         contact: "91" + form.phone,
//       },
//       notes: {
//         shareCode,
//         weddingLocation: form.weddingLocation,
//         budget: form.budget,
//       },
//       theme: { color: "#D4829A" },
//       handler: (response) => {
//         onPaymentSuccess(response, form);
//         onClose();
//       },
//       modal: { ondismiss: () => toast("Payment cancelled.") },
//     });
//     rzp.on("payment.failed", (r) =>
//       toast.error("Payment failed: " + r.error.description),
//     );
//     rzp.open();
//   };

//   /* ── Styles ── */
//   const selectStyle = {
//     width: "100%",
//     padding: "13px 16px",
//     borderRadius: 12,
//     border: `1px solid ${errors.budget ? "rgba(220,80,80,0.6)" : "rgba(232,180,160,0.2)"}`,
//     background: "rgba(255,255,255,0.04)",
//     color: "#F5EFE8",
//     fontFamily: "'DM Sans',sans-serif",
//     fontSize: 14,
//     fontWeight: 300,
//     outline: "none",
//     boxSizing: "border-box",
//     appearance: "none",
//     cursor: "pointer",
//   };

//   // Progress bar fills: personal=1/3, wedding=2/3, saving=2/3, checkout=3/3
//   const progressFill = [1, 2, 2, 3][step];

//   const stepTitle = [
//     "Tell us about you",
//     "Your wedding",
//     "Saving your details…",
//     "Ready to download",
//   ][step];

//   return (
//     <div
//       onClick={(e) =>
//         e.target === e.currentTarget && step !== STEP_SAVING && onClose()
//       }
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(8,6,16,0.88)",
//         backdropFilter: "blur(12px)",
//         zIndex: 1000,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 24,
//         overflowY: "auto",
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           maxWidth: 480,
//           background: "linear-gradient(160deg,#1A1228 0%,#140E1E 100%)",
//           border: "1px solid rgba(232,180,160,0.15)",
//           borderRadius: 28,
//           overflow: "hidden",
//           position: "relative",
//           animation: "fadeUp .45s cubic-bezier(.22,1,.36,1) both",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
//         }}
//       >
//         {/* Top rainbow bar */}
//         <div
//           style={{
//             height: 2,
//             background: "linear-gradient(90deg,#B8A9D9,#D4829A,#C9A87C)",
//             opacity: 0.8,
//           }}
//         />

//         {/* Header */}
//         <div
//           style={{
//             padding: "28px 32px 0",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//           }}
//         >
//           <div>
//             <p
//               style={{
//                 fontFamily: "'DM Sans',sans-serif",
//                 fontSize: 10,
//                 fontWeight: 300,
//                 letterSpacing: "0.3em",
//                 textTransform: "uppercase",
//                 color: "#C9A87C",
//                 marginBottom: 6,
//               }}
//             >
//               {step === STEP_SAVING
//                 ? "Please wait"
//                 : `Step ${Math.min(step + 1, 3)} of 3`}
//             </p>
//             <h2
//               style={{
//                 fontFamily: "'Cormorant Garamond',serif",
//                 fontWeight: 400,
//                 fontStyle: "italic",
//                 fontSize: 26,
//                 color: "#F5EFE8",
//                 lineHeight: 1.2,
//               }}
//             >
//               {stepTitle}
//             </h2>
//           </div>
//           {/* Hide close button while saving */}
//           {step !== STEP_SAVING && (
//             <button
//               onClick={onClose}
//               style={{
//                 background: "rgba(255,255,255,0.05)",
//                 border: "1px solid rgba(232,180,160,0.15)",
//                 borderRadius: 10,
//                 padding: "8px",
//                 cursor: "pointer",
//                 color: "#9B8FAA",
//                 lineHeight: 0,
//                 marginTop: 4,
//               }}
//             >
//               <X size={16} />
//             </button>
//           )}
//         </div>

//         {/* Progress bars — 3 segments */}
//         <div style={{ display: "flex", gap: 6, padding: "18px 32px 0" }}>
//           {[1, 2, 3].map((seg) => (
//             <div
//               key={seg}
//               style={{
//                 height: 3,
//                 flex: 1,
//                 borderRadius: 2,
//                 background:
//                   seg <= progressFill
//                     ? "linear-gradient(90deg,#D4829A,#C9A87C)"
//                     : "rgba(255,255,255,0.08)",
//                 transition: "background .4s",
//               }}
//             />
//           ))}
//         </div>

//         {/* ── Body ── */}
//         <div style={{ padding: "28px 32px 0" }}>
//           {/* Step 0 — Personal */}
//           {step === STEP_PERSONAL && (
//             <div>
//               <Field
//                 label="Your Name"
//                 icon={<User size={12} />}
//                 placeholder="Priya Sharma"
//                 value={form.name}
//                 onChange={handleChange("name")}
//                 error={errors.name}
//               />
//               <Field
//                 label="Partner's Name"
//                 icon={<Heart size={12} />}
//                 placeholder="Arjun Mehta"
//                 value={form.partnerName}
//                 onChange={handleChange("partnerName")}
//                 error={errors.partnerName}
//               />
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 16,
//                 }}
//               >
//                 <Field
//                   label="Phone"
//                   icon={<Phone size={12} />}
//                   type="tel"
//                   placeholder="9876543210"
//                   value={form.phone}
//                   onChange={handleChange("phone")}
//                   error={errors.phone}
//                 />
//                 <Field
//                   label="Email"
//                   icon={<User size={12} />}
//                   type="email"
//                   placeholder="you@email.com"
//                   value={form.email}
//                   onChange={handleChange("email")}
//                   error={errors.email}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Step 1 — Wedding info */}
//           {step === STEP_WEDDING && (
//             <div>
//               <Field
//                 label="Wedding Location"
//                 icon={<MapPin size={12} />}
//                 placeholder="Mumbai, Maharashtra"
//                 value={form.weddingLocation}
//                 onChange={handleChange("weddingLocation")}
//                 error={errors.weddingLocation}
//               />
//               <Field
//                 label="Wedding Date (approx.)"
//                 icon={<Calendar size={12} />}
//                 type="month"
//                 value={form.weddingDate}
//                 onChange={handleChange("weddingDate")}
//                 error={errors.weddingDate}
//               />
//               <Field
//                 label="Expected Guest Count"
//                 icon={<User size={12} />}
//                 type="number"
//                 placeholder="150"
//                 value={form.guestCount}
//                 onChange={handleChange("guestCount")}
//                 error={errors.guestCount}
//               />
//               {/* Budget select */}
//               <div style={{ marginBottom: 20 }}>
//                 <label
//                   style={{
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 11,
//                     fontWeight: 300,
//                     letterSpacing: "0.2em",
//                     textTransform: "uppercase",
//                     color: "rgba(232,180,160,0.7)",
//                     marginBottom: 6,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 6,
//                   }}
//                 >
//                   <IndianRupee size={12} /> Estimated Budget
//                 </label>
//                 <select
//                   value={form.budget}
//                   onChange={handleChange("budget")}
//                   style={selectStyle}
//                 >
//                   <option value="" disabled>
//                     Select budget range
//                   </option>
//                   {BUDGET_OPTIONS.map((o) => (
//                     <option key={o} value={o}>
//                       {o}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.budget && (
//                   <p
//                     style={{
//                       fontSize: 11,
//                       color: "rgba(220,100,100,0.9)",
//                       marginTop: 4,
//                       fontFamily: "'DM Sans',sans-serif",
//                     }}
//                   >
//                     {errors.budget}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 2 — Saving spinner */}
//           {step === STEP_SAVING && (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: "40px 0 20px",
//                 gap: 20,
//               }}
//             >
//               <div style={{ position: "relative", width: 64, height: 64 }}>
//                 {/* Outer glow */}
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: -6,
//                     borderRadius: "50%",
//                     background:
//                       "radial-gradient(circle,rgba(212,130,154,0.25) 0%,transparent 70%)",
//                     filter: "blur(8px)",
//                   }}
//                 />
//                 {/* Spinning ring */}
//                 <div
//                   style={{
//                     width: 64,
//                     height: 64,
//                     borderRadius: "50%",
//                     border: "1.5px solid rgba(212,130,154,0.15)",
//                     borderTopColor: "#D4829A",
//                     animation: "spin .8s linear infinite",
//                     position: "absolute",
//                     inset: 0,
//                   }}
//                 />
//                 {/* Inner icon */}
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Loader
//                     size={22}
//                     color="#D4829A"
//                     strokeWidth={1.5}
//                     style={{ animation: "spin 2s linear infinite reverse" }}
//                   />
//                 </div>
//               </div>
//               <div style={{ textAlign: "center" }}>
//                 <p
//                   style={{
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 14,
//                     fontWeight: 300,
//                     color: "#F5EFE8",
//                     marginBottom: 6,
//                   }}
//                 >
//                   Saving your details…
//                 </p>
//                 <p
//                   style={{
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 12,
//                     fontWeight: 200,
//                     color: "#9B8FAA",
//                     letterSpacing: "0.04em",
//                   }}
//                 >
//                   Just a moment, please don't close this window
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Step 3 — Checkout summary */}
//           {step === STEP_CHECKOUT && (
//             <div>
//               {/* Saved confirmation badge */}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 10,
//                   padding: "10px 16px",
//                   background: "rgba(80,180,120,0.08)",
//                   border: "1px solid rgba(80,180,120,0.2)",
//                   borderRadius: 12,
//                   marginBottom: 20,
//                 }}
//               >
//                 <CheckCircle size={15} color="#6EC99A" strokeWidth={1.5} />
//                 <span
//                   style={{
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 12,
//                     fontWeight: 300,
//                     color: "#6EC99A",
//                     letterSpacing: "0.04em",
//                   }}
//                 >
//                   Details saved successfully
//                 </span>
//               </div>

//               {/* Summary table */}
//               <div
//                 style={{
//                   background: "rgba(255,255,255,0.04)",
//                   border: "1px solid rgba(232,180,160,0.12)",
//                   borderRadius: 16,
//                   padding: "20px 22px",
//                   marginBottom: 20,
//                 }}
//               >
//                 {[
//                   ["Couple", `${form.name} & ${form.partnerName}`],
//                   ["Phone", form.phone],
//                   ["Email", form.email],
//                   ["Location", form.weddingLocation],
//                   ["Budget", form.budget],
//                   form.weddingDate
//                     ? [
//                         "Wedding Month",
//                         (() => {
//                           const [y, m] = form.weddingDate.split("-");
//                           return new Date(y, m - 1).toLocaleString("default", {
//                             month: "long",
//                             year: "numeric",
//                           });
//                         })(),
//                       ]
//                     : null,
//                   form.guestCount ? ["Guests", form.guestCount] : null,
//                 ]
//                   .filter(Boolean)
//                   .map(([k, v]) => (
//                     <div
//                       key={k}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         padding: "8px 0",
//                         borderBottom: "1px solid rgba(232,180,160,0.07)",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontFamily: "'DM Sans',sans-serif",
//                           fontSize: 12,
//                           fontWeight: 300,
//                           color: "#9B8FAA",
//                         }}
//                       >
//                         {k}
//                       </span>
//                       <span
//                         style={{
//                           fontFamily: "'DM Sans',sans-serif",
//                           fontSize: 13,
//                           fontWeight: 300,
//                           color: "#F5EFE8",
//                           maxWidth: 240,
//                           textAlign: "right",
//                         }}
//                       >
//                         {v}
//                       </span>
//                     </div>
//                   ))}
//               </div>

//               {/* Price row */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   padding: "14px 22px",
//                   background: "rgba(212,130,154,0.08)",
//                   border: "1px solid rgba(212,130,154,0.2)",
//                   borderRadius: 14,
//                   marginBottom: 8,
//                 }}
//               >
//                 <span
//                   style={{
//                     fontFamily: "'DM Sans',sans-serif",
//                     fontSize: 13,
//                     fontWeight: 300,
//                     color: "#E8B4A0",
//                   }}
//                 >
//                   PDF Report + Personalised Recommendations
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "'Cormorant Garamond',serif",
//                     fontSize: 22,
//                     fontWeight: 400,
//                     color: "#D4829A",
//                   }}
//                 >
//                   ₹499
//                 </span>
//               </div>
//               <p
//                 style={{
//                   fontFamily: "'DM Sans',sans-serif",
//                   fontSize: 11,
//                   fontWeight: 200,
//                   color: "rgba(155,143,170,0.5)",
//                   textAlign: "center",
//                   marginBottom: 4,
//                   letterSpacing: "0.04em",
//                 }}
//               >
//                 Secure payment via Razorpay · UPI, Cards, Netbanking
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── Footer buttons ── */}
//         {step !== STEP_SAVING && (
//           <div
//             style={{
//               padding: "24px 32px 32px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             {/* Back / Cancel */}
//             <button
//               onClick={
//                 step === STEP_PERSONAL ? onClose : () => setStep(step - 1)
//               }
//               style={{
//                 padding: "12px 22px",
//                 borderRadius: 100,
//                 border: "1px solid rgba(232,180,160,0.2)",
//                 background: "transparent",
//                 color: "#9B8FAA",
//                 fontFamily: "'DM Sans',sans-serif",
//                 fontSize: 11,
//                 fontWeight: 300,
//                 letterSpacing: "0.18em",
//                 textTransform: "uppercase",
//                 cursor: "pointer",
//               }}
//             >
//               {step === STEP_PERSONAL ? "Cancel" : "← Back"}
//             </button>

//             {/* Continue / Submit / Pay */}
//             <button
//               onClick={step === STEP_CHECKOUT ? initRazorpay : handleNext}
//               style={{
//                 padding: "13px 30px",
//                 borderRadius: 100,
//                 border: "none",
//                 background:
//                   step === STEP_CHECKOUT
//                     ? "linear-gradient(135deg,#D4829A,#A85070)"
//                     : step === STEP_WEDDING
//                       ? "linear-gradient(135deg,#B8A9D9,#7A6AAA)"
//                       : "linear-gradient(135deg,#C9A87C,#A8864A)",
//                 color: "#fff",
//                 fontFamily: "'DM Sans',sans-serif",
//                 fontSize: 11,
//                 fontWeight: 400,
//                 letterSpacing: "0.2em",
//                 textTransform: "uppercase",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//                 boxShadow:
//                   step === STEP_CHECKOUT
//                     ? "0 8px 28px rgba(212,130,154,0.4)"
//                     : "0 8px 24px rgba(184,169,217,0.25)",
//               }}
//             >
//               {step === STEP_CHECKOUT && (
//                 <>
//                   <Download size={14} /> Pay ₹499
//                 </>
//               )}
//               {step === STEP_WEDDING && (
//                 <>
//                   Submit & Continue <ChevronRight size={14} />
//                 </>
//               )}
//               {step === STEP_PERSONAL && (
//                 <>
//                   Continue <ChevronRight size={14} />
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// Replace your existing DownloadModal function with this

function DownloadModal({ onClose, onPaymentSuccess, shareCode }) {
  const [step, setStep] = useState(STEP_PERSONAL);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    partnerName: "",
    weddingDate: "",
    weddingLocation: "",
    budget: "",
    guestCount: "",
  });

  const handleChange = (key) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  /* ── Validation ── */
  const validateStep = (s) => {
    const e = {};
    if (s === STEP_PERSONAL) {
      if (!form.name.trim()) e.name = "Required";
      if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
      if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
      if (!form.partnerName.trim()) e.partnerName = "Required";
    }
    if (s === STEP_WEDDING) {
      if (!form.weddingLocation.trim()) e.weddingLocation = "Required";
      if (!form.budget) e.budget = "Please select a budget";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Next button handler ── */
  const handleNext = () => {
    if (step === STEP_PERSONAL && validateStep(STEP_PERSONAL)) setStep(STEP_WEDDING);
    if (step === STEP_WEDDING && validateStep(STEP_WEDDING)) submitFormData();
  };

  /* ── Step 2: Save lead data to DB, then create Razorpay order ── */
  const submitFormData = async () => {
    setStep(STEP_SAVING);
    try {
      // Step A: Save user details to your DB
      await axios.post(`${API}/information/`, {
        fullName: form.name,
        partnerName: form.partnerName,
        phoneNumber: form.phone,
        email: form.email,
        location: form.weddingLocation,
        date: form.weddingDate || null,
        guestCount: form.guestCount ? Number(form.guestCount) : null,
        budget: form.budget,
      });

      toast.success("Details saved!");
      setStep(STEP_CHECKOUT);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Could not save your details. Please try again.";
      toast.error(msg);
      setStep(STEP_WEDDING);
    }
  };

  /* ── Razorpay: create order on backend first, then open modal ── */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const initRazorpay = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      return;
    }

    let orderData;
    try {
      // Step B: Ask your backend to create a Razorpay order
      // Your backend calls razorpay.orders.create() and returns the order object
      const res = await axios.post(`${API}/sessions/${shareCode}/checkout`, {
        amount: REPORT_PRICE_PAISE,
        currency: "INR",
        receipt: `receipt_${shareCode}_${Date.now()}`,
        name: form.name, // ← add these
        email: form.email, // ← add these
        phone: form.phone, // ← add these
        notes: {
          shareCode,
          email: form.email,
          phone: form.phone,
        },
      });
      orderData = res.data.order; // expects { id, amount, currency } from backend
    } catch (err) {
      console.error(err);
      toast.error("Could not initiate payment. Please try again.");
      return;
    }

    // Step C: Open Razorpay checkout with the order_id from backend
    console.log(form);
    
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY,
      amount: orderData.amount,      // comes from backend order
      currency: orderData.currency,
      order_id: orderData.id,        // ← this is the key addition
      name: "Vows & Volumes",
      description: "Wedding Slambook PDF Report",
      prefill: {
        name: form.name,
        email: form.email,
        contact: "+91" + form.phone,
      },
      notes: {
        shareCode,
        weddingLocation: form.weddingLocation,
        budget: form.budget,
      },
      theme: { color: "#D4829A" },
      handler: async (response) => {
        // Step D: Verify payment signature on backend
        try {
          await axios.post(`${API}/payment/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            shareCode,
            email: form.email,
          });
          onPaymentSuccess(response, form);
          onClose();
        } catch (err) {
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      modal: { ondismiss: () => toast("Payment cancelled.") },
    });

    rzp.on("payment.failed", (r) =>
      toast.error("Payment failed: " + r.error.description)
    );
    rzp.open();
  };

  /* ── Styles ── */
  const selectStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: `1px solid ${errors.budget ? "rgba(220,80,80,0.6)" : "rgba(232,180,160,0.2)"}`,
    background: "rgba(255,255,255,0.04)",
    color: "#F5EFE8",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    fontWeight: 300,
    outline: "none",
    boxSizing: "border-box",
    appearance: "none",
    cursor: "pointer",
  };

  const progressFill = [1, 2, 2, 3][step];

  const stepTitle = [
    "Tell us about you",
    "Your wedding",
    "Saving your details…",
    "Ready to download",
  ][step];

  return (
    <div
      onClick={(e) =>
        e.target === e.currentTarget && step !== STEP_SAVING && onClose()
      }
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,6,16,0.88)",
        backdropFilter: "blur(12px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "linear-gradient(160deg,#1A1228 0%,#140E1E 100%)",
          border: "1px solid rgba(232,180,160,0.15)",
          borderRadius: 28,
          overflow: "hidden",
          position: "relative",
          animation: "fadeUp .45s cubic-bezier(.22,1,.36,1) both",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Top rainbow bar */}
        <div style={{ height: 2, background: "linear-gradient(90deg,#B8A9D9,#D4829A,#C9A87C)", opacity: 0.8 }} />

        {/* Header */}
        <div style={{ padding: "28px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 300, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A87C", marginBottom: 6 }}>
              {step === STEP_SAVING ? "Please wait" : `Step ${Math.min(step + 1, 3)} of 3`}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontStyle: "italic", fontSize: 26, color: "#F5EFE8", lineHeight: 1.2 }}>
              {stepTitle}
            </h2>
          </div>
          {step !== STEP_SAVING && (
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(232,180,160,0.15)", borderRadius: 10, padding: "8px", cursor: "pointer", color: "#9B8FAA", lineHeight: 0, marginTop: 4 }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Progress bars */}
        <div style={{ display: "flex", gap: 6, padding: "18px 32px 0" }}>
          {[1, 2, 3].map((seg) => (
            <div key={seg} style={{ height: 3, flex: 1, borderRadius: 2, background: seg <= progressFill ? "linear-gradient(90deg,#D4829A,#C9A87C)" : "rgba(255,255,255,0.08)", transition: "background .4s" }} />
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px 0" }}>

          {/* Step 0 — Personal */}
          {step === STEP_PERSONAL && (
            <div>
              <Field label="Your Name" icon={<User size={12} />} placeholder="Priya Sharma" value={form.name} onChange={handleChange("name")} error={errors.name} />
              <Field label="Partner's Name" icon={<Heart size={12} />} placeholder="Arjun Mehta" value={form.partnerName} onChange={handleChange("partnerName")} error={errors.partnerName} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Phone" icon={<Phone size={12} />} type="tel" placeholder="9876543210" value={form.phone} onChange={handleChange("phone")} error={errors.phone} />
                <Field label="Email" icon={<User size={12} />} type="email" placeholder="you@email.com" value={form.email} onChange={handleChange("email")} error={errors.email} />
              </div>
            </div>
          )}

          {/* Step 1 — Wedding info */}
          {step === STEP_WEDDING && (
            <div>
              <Field label="Wedding Location" icon={<MapPin size={12} />} placeholder="Mumbai, Maharashtra" value={form.weddingLocation} onChange={handleChange("weddingLocation")} error={errors.weddingLocation} />
              <Field label="Wedding Date (approx.)" icon={<Calendar size={12} />} type="month" value={form.weddingDate} onChange={handleChange("weddingDate")} error={errors.weddingDate} />
              <Field label="Expected Guest Count" icon={<User size={12} />} type="number" placeholder="150" value={form.guestCount} onChange={handleChange("guestCount")} error={errors.guestCount} />
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(232,180,160,0.7)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <IndianRupee size={12} /> Estimated Budget
                </label>
                <select value={form.budget} onChange={handleChange("budget")} style={selectStyle}>
                  <option value="" disabled>Select budget range</option>
                  {BUDGET_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
                {errors.budget && (<p style={{ fontSize: 11, color: "rgba(220,100,100,0.9)", marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>{errors.budget}</p>)}
              </div>
            </div>
          )}

          {/* Step 2 — Saving spinner */}
          {step === STEP_SAVING && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0 20px", gap: 20 }}>
              <div style={{ position: "relative", width: 64, height: 64 }}>
                <div style={{ position: "absolute", inset: -6, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,130,154,0.25) 0%,transparent 70%)", filter: "blur(8px)" }} />
                <div style={{ width: 64, height: 64, borderRadius: "50%", border: "1.5px solid rgba(212,130,154,0.15)", borderTopColor: "#D4829A", animation: "spin .8s linear infinite", position: "absolute", inset: 0 }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader size={22} color="#D4829A" strokeWidth={1.5} style={{ animation: "spin 2s linear infinite reverse" }} />
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 300, color: "#F5EFE8", marginBottom: 6 }}>Saving your details…</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 200, color: "#9B8FAA", letterSpacing: "0.04em" }}>Just a moment, please don't close this window</p>
              </div>
            </div>
          )}

          {/* Step 3 — Checkout summary */}
          {step === STEP_CHECKOUT && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "rgba(80,180,120,0.08)", border: "1px solid rgba(80,180,120,0.2)", borderRadius: 12, marginBottom: 20 }}>
                <CheckCircle size={15} color="#6EC99A" strokeWidth={1.5} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: "#6EC99A", letterSpacing: "0.04em" }}>Details saved successfully</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(232,180,160,0.12)", borderRadius: 16, padding: "20px 22px", marginBottom: 20 }}>
                {[
                  ["Couple", `${form.name} & ${form.partnerName}`],
                  ["Phone", form.phone],
                  ["Email", form.email],
                  ["Location", form.weddingLocation],
                  ["Budget", form.budget],
                  form.weddingDate ? ["Wedding Month", (() => { const [y, m] = form.weddingDate.split("-"); return new Date(y, m - 1).toLocaleString("default", { month: "long", year: "numeric" }); })()] : null,
                  form.guestCount ? ["Guests", form.guestCount] : null,
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(232,180,160,0.07)" }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 300, color: "#9B8FAA" }}>{k}</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, color: "#F5EFE8", maxWidth: 240, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", background: "rgba(212,130,154,0.08)", border: "1px solid rgba(212,130,154,0.2)", borderRadius: 14, marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 300, color: "#E8B4A0" }}>PDF Report + Personalised Recommendations</span>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: "#D4829A" }}>₹499</span>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 200, color: "rgba(155,143,170,0.5)", textAlign: "center", marginBottom: 4, letterSpacing: "0.04em" }}>
                Secure payment via Razorpay · UPI, Cards, Netbanking
              </p>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        {step !== STEP_SAVING && (
          <div style={{ padding: "24px 32px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={step === STEP_PERSONAL ? onClose : () => setStep(step - 1)}
              style={{ padding: "12px 22px", borderRadius: 100, border: "1px solid rgba(232,180,160,0.2)", background: "transparent", color: "#9B8FAA", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}
            >
              {step === STEP_PERSONAL ? "Cancel" : "← Back"}
            </button>
            <button
              onClick={step === STEP_CHECKOUT ? initRazorpay : handleNext}
              style={{ padding: "13px 30px", borderRadius: 100, border: "none", background: step === STEP_CHECKOUT ? "linear-gradient(135deg,#D4829A,#A85070)" : step === STEP_WEDDING ? "linear-gradient(135deg,#B8A9D9,#7A6AAA)" : "linear-gradient(135deg,#C9A87C,#A8864A)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: step === STEP_CHECKOUT ? "0 8px 28px rgba(212,130,154,0.4)" : "0 8px 24px rgba(184,169,217,0.25)" }}
            >
              {step === STEP_CHECKOUT && <><Download size={14} /> Pay ₹499</>}
              {step === STEP_WEDDING && <>Submit & Continue <ChevronRight size={14} /></>}
              {step === STEP_PERSONAL && <>Continue <ChevronRight size={14} /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ResultsPage() {
  const { shareCode } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [shareCode]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        API + "/sessions/" + shareCode + "/results",
      );
      setResults(response.data.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 400) setError("waiting");
      else {
        setError("notfound");
        toast.error("Results not found");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (razorpayResponse, formData) => {
    toast.success("Payment successful! Generating your PDF…");
    try {
      await axios
        .post(API + "/sessions/" + shareCode + "/payment", {
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          email: formData.email,
          phone: formData.phone,
        })
        .catch(() => {});
      const response = await axios.get(
        API + "/sessions/" + shareCode + "/pdf",
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "wedding-slambook-" + shareCode + ".pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Summary downloaded!");
    } catch {
      toast.error("Failed to download. Please contact support.");
    }
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@200;300;400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#0D0B14}
    @keyframes ringPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.08)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmerSlide{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes orbFloat{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-18px)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes barFill{from{width:0%}to{width:var(--w)}}
    .fade-1{animation:fadeUp .8s .1s cubic-bezier(.22,1,.36,1) both}
    .fade-2{animation:fadeUp .8s .25s cubic-bezier(.22,1,.36,1) both}
    .fade-3{animation:fadeUp .8s .4s cubic-bezier(.22,1,.36,1) both}
    .fade-4{animation:fadeUp .8s .55s cubic-bezier(.22,1,.36,1) both}
    input[type=month]::-webkit-calendar-picker-indicator{filter:invert(1) opacity(0.4)}
    input::placeholder{color:rgba(155,143,170,0.4)}
    select option{background:#1A1228;color:#F5EFE8}
  `;

  const catColors = ["#D4829A", "#C9A87C", "#B8A9D9", "#E8B4A0", "#8FBCCE"];

  if (loading)
    return (
      <>
        <style>{globalStyles}</style>
        <div
          style={{
            minHeight: "100vh",
            background: "#0D0B14",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1.5px solid rgba(212,130,154,0.15)",
              borderTopColor: "#D4829A",
              animation: "spin .8s linear infinite",
            }}
          />
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 200,
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(155,143,170,0.6)",
            }}
          >
            Loading your results…
          </p>
        </div>
      </>
    );

  if (error === "waiting")
    return (
      <>
        <style>{globalStyles}</style>
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg,#0D0B14 0%,#180D1C 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Particles />
          <div
            style={{
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(201,168,124,0.1)",
                border: "1px solid rgba(201,168,124,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 28px",
                boxShadow: "0 0 40px rgba(201,168,124,0.15)",
              }}
            >
              <Clock size={32} color="#C9A87C" strokeWidth={1.5} />
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "clamp(2rem,5vw,2.8rem)",
                color: "#F5EFE8",
                marginBottom: 16,
              }}
              data-testid="waiting-title"
            >
              Waiting for Partner
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 200,
                fontSize: 14,
                color: "#9B8FAA",
                lineHeight: 1.85,
                letterSpacing: "0.03em",
                marginBottom: 40,
              }}
            >
              Your partner hasn't completed their book yet. Results will appear
              once both of you have finished.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 26px",
                  borderRadius: "100px",
                  background: "transparent",
                  border: "1px solid rgba(232,180,160,0.3)",
                  color: "#F5EFE8",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  fontWeight: 300,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                data-testid="back-home-button"
              >
                <ArrowLeft size={13} /> Home
              </button>
              <button
                onClick={fetchResults}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 26px",
                  borderRadius: "100px",
                  background: "linear-gradient(135deg,#D4829A,#A85070)",
                  border: "none",
                  color: "#fff",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(212,130,154,0.35)",
                }}
                data-testid="refresh-button"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          </div>
        </div>
      </>
    );

  if (error === "notfound" || !results)
    return (
      <>
        <style>{globalStyles}</style>
        <div
          style={{
            minHeight: "100vh",
            background: "#0D0B14",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: 36,
                color: "#F5EFE8",
                marginBottom: 24,
              }}
            >
              Session Not Found
            </h1>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "13px 32px",
                borderRadius: "100px",
                background: "linear-gradient(135deg,#D4829A,#A85070)",
                border: "none",
                color: "#fff",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      </>
    );

  return (
    <>
      <style>
        {globalStyles +
          `
        .cat-bar-fill{animation:barFill 1.2s cubic-bezier(.22,1,.36,1) both}
        .cat-card{transition:transform .35s cubic-bezier(.22,1,.36,1),border-color .35s,box-shadow .35s}
        .cat-card:hover{transform:translateY(-5px);border-color:rgba(232,180,160,0.28)!important;box-shadow:0 20px 56px rgba(0,0,0,0.5)!important}
        .shimmer-bar{height:1px;width:100px;margin:0 auto;background:linear-gradient(90deg,transparent 0%,#C9A87C 45%,#E8B4A0 55%,transparent 100%);background-size:200% 100%;animation:shimmerSlide 3s linear infinite}
        .dl-btn{transition:transform .3s,box-shadow .3s,filter .3s}
        .dl-btn:hover{transform:translateY(-3px)!important;filter:brightness(1.1);box-shadow:0 16px 48px rgba(212,130,154,0.45)!important}
        .ol-btn{transition:all .3s}
        .ol-btn:hover{background:rgba(232,180,160,0.08)!important;border-color:rgba(232,180,160,0.6)!important;transform:translateY(-2px)}
        .img-card{transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s;overflow:hidden;border-radius:20px}
        .img-card:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 28px 64px rgba(0,0,0,0.5)!important}
        .img-card img{transition:transform .6s cubic-bezier(.22,1,.36,1)}
        .img-card:hover img{transform:scale(1.06)}
        .orb-a{animation:orbFloat 12s ease-in-out infinite}
        .orb-b{animation:orbFloat 18s ease-in-out infinite reverse}
      `}
      </style>

      {showModal && (
        <DownloadModal
          onClose={() => setShowModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          shareCode={shareCode}
        />
      )}

      <div
        style={{
          minHeight: "100vh",
          background: "#0D0B14",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <Particles />
        <div
          className="orb-a"
          style={{
            position: "fixed",
            top: "10%",
            left: "15%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(212,130,154,0.18) 0%,transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          className="orb-b"
          style={{
            position: "fixed",
            bottom: "15%",
            right: "10%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(184,169,217,0.14) 0%,transparent 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "60%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(201,168,124,0.1) 0%,transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 10 }}>
          {/* HERO */}
          <section
            style={{
              padding: "100px 24px 80px",
              textAlign: "center",
              borderBottom: "1px solid rgba(232,180,160,0.08)",
              background:
                "linear-gradient(180deg,rgba(22,8,16,0.6) 0%,transparent 100%)",
            }}
          >
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <div className="fade-1" style={{ marginBottom: 20 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 18px",
                    borderRadius: "100px",
                    border: "1px solid rgba(232,180,160,0.28)",
                    background: "rgba(232,180,160,0.07)",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    fontWeight: 300,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#E8B4A0",
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#E8B4A0",
                      display: "inline-block",
                      boxShadow: "0 0 8px #E8B4A0",
                    }}
                  />{" "}
                  Your Results
                </span>
              </div>
              <h1
                className="fade-2"
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(2.8rem,7vw,5rem)",
                  color: "#F5EFE8",
                  lineHeight: 1.08,
                  letterSpacing: "-0.01em",
                  marginBottom: 16,
                }}
                data-testid="results-title"
              >
                Compatibility Score
              </h1>
              <div
                className="fade-2 shimmer-bar"
                style={{ marginBottom: 56 }}
              />
              <div className="fade-3">
                <ScoreRing score={results.compatibility_score} />
              </div>
              <p
                className="fade-4"
                style={{
                  marginTop: 32,
                  fontSize: 14,
                  fontWeight: 200,
                  color: "#9B8FAA",
                  lineHeight: 1.9,
                  maxWidth: 440,
                  margin: "32px auto 0",
                  letterSpacing: "0.03em",
                }}
              >
                You know each other beautifully. Here's a breakdown of your love
                language compatibility.
              </p>
            </div>
          </section>

          {/* CATEGORY BREAKDOWN */}
          <section
            style={{
              padding: "80px 24px",
              background:
                "linear-gradient(180deg,#0D0B14 0%,#110D1C 50%,#0D0B14 100%)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(rgba(232,180,160,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(232,180,160,0.02) 1px,transparent 1px)`,
                backgroundSize: "80px 80px",
                pointerEvents: "none",
              }}
            />
            <div
              style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}
            >
              <div
                className="fade-1"
                style={{ textAlign: "center", marginBottom: 60 }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    fontWeight: 300,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "#C9A87C",
                    marginBottom: 14,
                  }}
                >
                  Love Languages
                </p>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: 400,
                    fontSize: "clamp(1.8rem,4vw,2.6rem)",
                    color: "#F5EFE8",
                  }}
                >
                  Category Breakdown
                </h2>
                <div className="shimmer-bar" style={{ marginTop: 18 }} />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {Object.entries(results.category_scores || {}).map(
                  ([category, score], idx) => {
                    const color = catColors[idx % catColors.length];
                    return (
                      <div
                        key={category}
                        className="cat-card fade-2"
                        style={{
                          background: "rgba(22,17,36,0.85)",
                          border: "1px solid rgba(232,180,160,0.1)",
                          borderRadius: 20,
                          padding: "28px 28px 24px",
                          backdropFilter: "blur(20px)",
                          animationDelay: `${idx * 0.1}s`,
                          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        data-testid={
                          "category-" +
                          category.replace(/\s+/g, "-").toLowerCase()
                        }
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 1,
                            background: `linear-gradient(90deg,transparent,${color}55,transparent)`,
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 16,
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                fontFamily: "'Cormorant Garamond',serif",
                                fontWeight: 400,
                                fontSize: 20,
                                color: "#F5EFE8",
                                marginBottom: 4,
                              }}
                            >
                              {category}
                            </h3>
                            {results.decor_predictions?.[category] && (
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 200,
                                  color: "#9B8FAA",
                                  letterSpacing: "0.03em",
                                  lineHeight: 1.6,
                                  maxWidth: 480,
                                }}
                              >
                                {results.decor_predictions[category]}
                              </p>
                            )}
                          </div>
                          <div
                            style={{
                              flexShrink: 0,
                              marginLeft: 20,
                              width: 52,
                              height: 52,
                              borderRadius: "50%",
                              border: `1.5px solid ${color}55`,
                              background: `${color}15`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: `0 0 20px ${color}20`,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Cormorant Garamond',serif",
                                fontSize: 17,
                                fontWeight: 400,
                                color,
                              }}
                            >
                              {Math.round(score)}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            height: 5,
                            borderRadius: 3,
                            background: "rgba(255,255,255,0.06)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="cat-bar-fill"
                            style={{
                              height: "100%",
                              borderRadius: 3,
                              background: `linear-gradient(90deg,${color}99,${color})`,
                              boxShadow: `0 0 12px ${color}60`,
                              "--w": `${score}%`,
                              animationDelay: `${0.4 + idx * 0.12}s`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </section>

          {/* AI RECOMMENDATIONS */}
          <section
            style={{
              padding: "80px 24px",
              background:
                "linear-gradient(180deg,#0D0B14 0%,rgba(18,8,24,0.8) 100%)",
              borderTop: "1px solid rgba(232,180,160,0.06)",
            }}
          >
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <div
                className="fade-1"
                style={{ textAlign: "center", marginBottom: 48 }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    padding: "6px 20px",
                    borderRadius: "100px",
                    border: "1px solid rgba(232,180,160,0.2)",
                    background: "rgba(232,180,160,0.06)",
                  }}
                >
                  <Sparkles size={14} color="#E8B4A0" strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: 10,
                      fontWeight: 300,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "#E8B4A0",
                    }}
                  >
                    AI Powered
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: 400,
                    fontSize: "clamp(1.8rem,4vw,2.6rem)",
                    color: "#F5EFE8",
                  }}
                >
                  Decor Recommendations
                </h2>
                <div className="shimmer-bar" style={{ marginTop: 18 }} />
              </div>
              <div
                className="fade-2"
                data-testid="ai-recommendations"
                style={{
                  background: "rgba(22,17,36,0.9)",
                  border: "1px solid rgba(232,180,160,0.14)",
                  borderRadius: 24,
                  padding: "36px",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg,transparent,#D4829A,#C9A87C,#B8A9D9,transparent)",
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: 300,
                    fontSize: 14,
                    color: "#B8A8BC",
                    lineHeight: 1.95,
                    letterSpacing: "0.03em",
                    whiteSpace: "pre-wrap",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {results.ai_recommendations ||
                    "Generating personalised recommendations…"}
                </div>
              </div>
              <div
                className="fade-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                  gap: 20,
                }}
              >
                <div
                  className="img-card"
                  style={{
                    aspectRatio: "4/3",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    border: "1px solid rgba(232,180,160,0.1)",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1768777270882-9f74939fee50?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwZGVjb3IlMjB0YWJsZXxlbnwwfHx8fDE3NzQ4NjU4Njh8MA&ixlib=rb-4.1.0&q=85"
                    alt="Wedding decor inspiration"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  className="img-card"
                  style={{
                    aspectRatio: "4/3",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    border: "1px solid rgba(232,180,160,0.1)",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1719786624838-b5d9a9e3f378?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB3ZWRkaW5nJTIwZGVjb3IlMjB0YWJsZXxlbnwwfHx8fDE3NzQ4NjU4Njh8MA&ixlib=rb-4.1.0&q=85"
                    alt="Wedding table setting"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <section
            style={{
              padding: "72px 24px",
              background: "#0D0B14",
              borderTop: "1px solid rgba(232,180,160,0.06)",
            }}
          >
            <div
              style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}
            >
              <div className="fade-1" style={{ marginBottom: 20 }}>
                <div className="shimmer-bar" style={{ marginBottom: 36 }} />
                <button
                  className="dl-btn"
                  onClick={() => setShowModal(true)}
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: "100px",
                    border: "none",
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg,#D4829A 0%,#B05878 100%)",
                    color: "#fff",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow: "0 10px 36px rgba(212,130,154,0.35)",
                    marginBottom: 14,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  data-testid="download-pdf-button"
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 55%)",
                      pointerEvents: "none",
                    }}
                  />
                  <Download size={15} /> Download Summary
                </button>
                <button
                  className="ol-btn"
                  onClick={() => navigate("/")}
                  style={{
                    width: "100%",
                    padding: "15px 24px",
                    borderRadius: "100px",
                    cursor: "pointer",
                    background: "transparent",
                    border: "1px solid rgba(232,180,160,0.3)",
                    color: "#F5EFE8",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    fontWeight: 300,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    backdropFilter: "blur(8px)",
                  }}
                  data-testid="start-new-button"
                >
                  <Heart size={14} strokeWidth={1.5} /> Start New Book
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer
            style={{
              padding: "24px",
              borderTop: "1px solid rgba(232,180,160,0.06)",
              background: "rgba(13,11,20,0.95)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <svg
                width="80"
                height="14"
                viewBox="0 0 80 14"
                fill="none"
                style={{ marginBottom: 10 }}
              >
                <line
                  x1="0"
                  y1="7"
                  x2="28"
                  y2="7"
                  stroke="#C9A87C"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
                <path
                  d="M34 7C35.5 4 38 2 40 7C42 2 44.5 4 46 7"
                  stroke="#E8B4A0"
                  strokeWidth="0.7"
                  fill="none"
                  strokeLinecap="round"
                  strokeOpacity="0.7"
                />
                <line
                  x1="52"
                  y1="7"
                  x2="80"
                  y2="7"
                  stroke="#C9A87C"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
              </svg>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 200,
                  fontSize: 11,
                  color: "rgba(155,143,170,0.45)",
                  letterSpacing: "0.12em",
                }}
              >
                Generated with love by Vows & Volumes
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}