import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

const WHATSAPP_NUMBER = "919813312768";
const PHONE_NUMBER = "+919813312768";
const EMAIL = "hello@orvium.in";

// ─── EmailJS Config ────────────────────────────────────────────────
// 1. Sign up free at https://emailjs.com
// 2. Create an Email Service (Gmail recommended) → copy Service ID
// 3. Create TWO Email Templates:
//      a) Contact form template — variables: {{from_name}}, {{from_email}}, {{phone}}, {{business}}, {{message}}
//      b) Zoom call booking template — variables: {{from_name}}, {{from_email}}, {{phone}}, {{business}}, {{call_date}}, {{call_time}}, {{notes}}
//    Copy each Template ID
// 4. Go to Account → API Keys → copy your Public Key
// Paste everything below:
const EMAILJS_SERVICE_ID        = "YOUR_SERVICE_ID";       // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID       = "YOUR_TEMPLATE_ID";       // contact form template
const EMAILJS_ZOOM_TEMPLATE_ID  = "YOUR_ZOOM_TEMPLATE_ID";  // zoom booking template
const EMAILJS_PUBLIC_KEY        = "YOUR_PUBLIC_KEY";        // e.g. "aBcDeFgHiJkLmNoPq"
// ──────────────────────────────────────────────────────────────────

// ─── Brand Colors ──────────────────────────────────────────────────
const NAVY = "#0F172A";
const INDIGO = "#4F46E5";
const INDIGO_LIGHT = "#6366F1";
const BG = "#FFFFFF";
const BG_SOFT = "#F8FAFC";
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";
// ──────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useCounter(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

const NAV_LINKS = ["Home", "Services", "Portfolio", "Industries", "Testimonials", "FAQ", "Contact"];

// ─── Modal: Free Sample Design Request ─────────────────────────────
function SampleModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "", industry: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      alert("Please fill in your name and email.");
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone || "Not provided",
          business: form.business || "Not provided",
          message: `FREE SAMPLE DESIGN REQUEST\nIndustry: ${form.industry || "Not specified"}`,
          to_email: EMAIL,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
      zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, padding: "36px", maxWidth: 440, width: "100%",
        position: "relative", boxShadow: "0 24px 60px rgba(15,23,42,0.25)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: BG_SOFT, border: `1px solid ${BORDER}`,
          borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: NAVY, fontSize: 16,
        }}>✕</button>
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🎉</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8, color: NAVY }}>Request Sent!</h3>
            <p style={{ color: TEXT_MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>We'll send your free sample design within a few hours.</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🎁</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 6, color: NAVY }}>Get a Free Sample Design</h3>
            <p style={{ color: TEXT_MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, marginBottom: 22, lineHeight: 1.6 }}>
              Share a few details and we'll send a free mockup of what your website could look like — no obligation.
            </p>
            {["name", "email", "phone", "business"].map(key => (
              <input key={key} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={
                  key === "name" ? "Your Name *" :
                  key === "email" ? "Your Email *" :
                  key === "phone" ? "Phone Number" : "Business Name"
                }
                style={{
                  width: "100%", background: BG_SOFT, border: `1px solid ${BORDER}`,
                  borderRadius: 8, padding: "12px 14px", color: NAVY, fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 10,
                }}
                onFocus={e => e.target.style.borderColor = INDIGO}
                onBlur={e => e.target.style.borderColor = BORDER}
              />
            ))}
            <input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}
              placeholder="Industry (e.g. Salon, Clinic, Restaurant)"
              style={{
                width: "100%", background: BG_SOFT, border: `1px solid ${BORDER}`,
                borderRadius: 8, padding: "12px 14px", color: NAVY, fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 18,
              }}
              onFocus={e => e.target.style.borderColor = INDIGO}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
            <button onClick={handleSubmit} disabled={sending} style={{
              width: "100%", background: `linear-gradient(135deg,${INDIGO},${NAVY})`,
              border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 14.5, padding: "13px", borderRadius: 10,
              cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1,
              boxShadow: "0 6px 20px rgba(79,70,229,0.3)",
            }}>{sending ? "Sending..." : "Request Free Sample"}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Modal: Book a Free Zoom Call ───────────────────────────────────
function ZoomModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", notes: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.date || !form.time) {
      alert("Please fill in your name, email, preferred date, and time.");
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ZOOM_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone || "Not provided",
          call_date: form.date,
          call_time: form.time,
          notes: form.notes || "No additional notes",
          to_email: EMAIL,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setSending(false);
    }
  };

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
      zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      overflowY: "auto",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, padding: "36px", maxWidth: 460, width: "100%",
        position: "relative", boxShadow: "0 24px 60px rgba(15,23,42,0.25)", margin: "auto",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: BG_SOFT, border: `1px solid ${BORDER}`,
          borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: NAVY, fontSize: 16,
        }}>✕</button>
        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>📅</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8, color: NAVY }}>Call Requested!</h3>
            <p style={{ color: TEXT_MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
              We'll confirm your Zoom call for <strong>{form.date}</strong> at <strong>{form.time}</strong> shortly via email or WhatsApp.
            </p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 30, marginBottom: 10 }}>📹</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 6, color: NAVY }}>Book a Free Zoom Call</h3>
            <p style={{ color: TEXT_MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, marginBottom: 22, lineHeight: 1.6 }}>
              Pick a date and time that works for you — we'll send a Zoom link to confirm.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your Name *"
                style={{
                  width: "100%", background: BG_SOFT, border: `1px solid ${BORDER}`,
                  borderRadius: 8, padding: "12px 14px", color: NAVY, fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", outline: "none",
                }}
                onFocus={e => e.target.style.borderColor = INDIGO}
                onBlur={e => e.target.style.borderColor = BORDER}
              />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone Number"
                style={{
                  width: "100%", background: BG_SOFT, border: `1px solid ${BORDER}`,
                  borderRadius: 8, padding: "12px 14px", color: NAVY, fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", outline: "none",
                }}
                onFocus={e => e.target.style.borderColor = INDIGO}
                onBlur={e => e.target.style.borderColor = BORDER}
              />
            </div>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Your Email *" type="email"
              style={{
                width: "100%", background: BG_SOFT, border: `1px solid ${BORDER}`,
                borderRadius: 8, padding: "12px 14px", color: NAVY, fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 10,
              }}
              onFocus={e => e.target.style.borderColor = INDIGO}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ display: "block", color: TEXT_MUTED, fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginBottom: 5 }}>Preferred Date *</label>
                <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  type="date" min={today}
                  style={{
                    width: "100%", background: BG_SOFT, border: `1px solid ${BORDER}`,
                    borderRadius: 8, padding: "11px 12px", color: NAVY, fontSize: 13.5,
                    fontFamily: "'DM Sans', sans-serif", outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = INDIGO}
                  onBlur={e => e.target.style.borderColor = BORDER}
                />
              </div>
              <div>
                <label style={{ display: "block", color: TEXT_MUTED, fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginBottom: 5 }}>Preferred Time *</label>
                <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                  type="time"
                  style={{
                    width: "100%", background: BG_SOFT, border: `1px solid ${BORDER}`,
                    borderRadius: 8, padding: "11px 12px", color: NAVY, fontSize: 13.5,
                    fontFamily: "'DM Sans', sans-serif", outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = INDIGO}
                  onBlur={e => e.target.style.borderColor = BORDER}
                />
              </div>
            </div>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Anything you'd like to discuss? (optional)" rows={3}
              style={{
                width: "100%", background: BG_SOFT, border: `1px solid ${BORDER}`,
                borderRadius: 8, padding: "12px 14px", color: NAVY, fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 18, resize: "vertical",
              }}
              onFocus={e => e.target.style.borderColor = INDIGO}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
            <button onClick={handleSubmit} disabled={sending} style={{
              width: "100%", background: `linear-gradient(135deg,${INDIGO},${NAVY})`,
              border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 14.5, padding: "13px", borderRadius: 10,
              cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1,
              boxShadow: "0 6px 20px rgba(79,70,229,0.3)",
            }}>{sending ? "Booking..." : "Book Free Zoom Call"}</button>
          </>
        )}
      </div>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scroll = (id) => {
    setMenuOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)",
      backdropFilter: "blur(18px)",
      borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
      transition: "all 0.4s ease",
      padding: "0 5vw",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px" }}>
          <span style={{ color: NAVY }}>OR</span><span style={{ color: INDIGO }}>VIUM</span>
          <span style={{ color: TEXT_MUTED, fontSize: 11, fontWeight: 400, letterSpacing: 2, marginLeft: 6 }}>.IN</span>
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scroll(l)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: NAVY, fontSize: 13.5, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500, letterSpacing: 0.2, transition: "color 0.2s", opacity: 0.75,
              padding: "4px 0",
            }}
              onMouseEnter={e => e.target.style.color = INDIGO}
              onMouseLeave={e => e.target.style.color = NAVY}
            >{l}</button>
          ))}
          <button onClick={() => scroll("Contact")} style={{
            background: `linear-gradient(135deg,${INDIGO},${NAVY})`, border: "none", cursor: "pointer",
            color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            padding: "9px 22px", borderRadius: 8, letterSpacing: 0.3,
            boxShadow: "0 4px 16px rgba(79,70,229,0.25)", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.target.style.transform = "none"}
          >Get Started</button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: NAVY,
          fontSize: 18,
        }} className="mobile-menu-btn">☰</button>
      </div>
      {menuOpen && (
        <div style={{ background: "#fff", padding: "16px 5vw 24px", borderTop: `1px solid ${BORDER}` }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scroll(l)} style={{
              display: "block", width: "100%", textAlign: "left", background: "none",
              border: "none", color: NAVY, fontSize: 15,
              fontFamily: "'DM Sans', sans-serif", padding: "12px 0", cursor: "pointer",
              borderBottom: `1px solid ${BORDER}`,
            }}>{l}</button>
          ))}
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @media(max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#FFFFFF;color:#0F172A;font-family:'DM Sans',sans-serif}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#F8FAFC}
        ::-webkit-scrollbar-thumb{background:#4F46E5;border-radius:10px}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        .fade-up{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}
        .fade-up.visible{opacity:1;transform:translateY(0)}
        .card-hover{transition:transform 0.3s ease,box-shadow 0.3s ease}
        .card-hover:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(15,23,42,0.1)!important}
      `}</style>
    </nav>
  );
}

function HeroSection({ onSample, onZoom }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  const badges = [
    { icon: "✅", text: "WhatsApp Integration" },
    { icon: "✅", text: "Mobile Friendly" },
    { icon: "✅", text: "Free SSL" },
    { icon: "✅", text: "SEO Setup" },
    { icon: "✅", text: "Ready Within 2 Hours" },
  ];
  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "120px 5vw 80px",
      background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(79,70,229,0.07) 0%, transparent 60%), ${BG}`,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${BORDER} 1px,transparent 1px),linear-gradient(90deg,${BORDER} 1px,transparent 1px)`,
        backgroundSize: "60px 60px", opacity: 0.5, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "18%", left: "6%", width: 280, height: 280,
        background: "radial-gradient(circle,rgba(79,70,229,0.1) 0%,transparent 70%)",
        borderRadius: "50%", animation: "float 6s ease-in-out infinite", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(79,70,229,0.07)", border: "1px solid rgba(79,70,229,0.2)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 28,
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
          transition: "all 0.6s ease 0.1s",
        }}>
          <span style={{ width: 7, height: 7, background: "#22C55E", borderRadius: "50%", animation: "pulse 2s infinite" }} />
          <span style={{ color: NAVY, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3, opacity: 0.75 }}>
            50+ Businesses Served · 100% Satisfaction Guarantee
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.1,
          fontSize: "clamp(38px, 6.5vw, 72px)", letterSpacing: "-2px", marginBottom: 22, color: NAVY,
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
          transition: "all 0.7s ease 0.2s",
        }}>
          Get Your Business Online<br />
          <span style={{
            background: `linear-gradient(135deg,${INDIGO} 0%,${INDIGO_LIGHT} 50%,${NAVY} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>In 2 Hours</span>
        </h1>

        <p style={{
          color: TEXT_MUTED, fontSize: "clamp(15px, 2vw, 18px)",
          lineHeight: 1.7, maxWidth: 600, margin: "0 auto 36px",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.3s",
        }}>
          Professional websites for shops, doctors, salons, manufacturers and local businesses — starting at ₹999.
        </p>

        <div style={{
          display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 20,
          opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.4s",
        }}>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to get my website built`} target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#25D366", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: 15, padding: "15px 34px", borderRadius: 10, textDecoration: "none",
              boxShadow: "0 8px 26px rgba(37,211,102,0.35)", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >💬 Chat on WhatsApp</a>
          <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", border: `1.5px solid ${NAVY}`, color: NAVY,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: 15, padding: "14px 30px", borderRadius: 10, textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = NAVY; }}
          >Get Website Today</a>
        </div>

        {/* Free Sample + Zoom CTAs */}
        <div style={{
          display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 44,
          opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.45s",
        }}>
          <button onClick={onSample} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(79,70,229,0.08)", border: `1.5px dashed ${INDIGO}`,
            color: INDIGO, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: 13.5, padding: "11px 22px", borderRadius: 10, cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(79,70,229,0.14)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(79,70,229,0.08)"}
          >🎁 Get a Free Sample Design</button>
          <button onClick={onZoom} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(15,23,42,0.04)", border: `1.5px dashed ${NAVY}`,
            color: NAVY, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: 13.5, padding: "11px 22px", borderRadius: 10, cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(15,23,42,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(15,23,42,0.04)"}
          >📹 Book a Free Zoom Call</button>
        </div>

        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
          opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.5s",
        }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: BG_SOFT, border: `1px solid ${BORDER}`,
              borderRadius: 100, padding: "7px 14px",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: NAVY, fontWeight: 500,
            }}>
              <span>{b.icon}</span><span style={{ opacity: 0.8 }}>{b.text.replace("✅ ", "")}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const [ref, inView] = useInView();
  const items = [
    { icon: "🔒", label: "Free SSL Included" },
    { icon: "⚡", label: "2-Hour Delivery" },
    { icon: "🛟", label: "Lifetime Support" },
    { icon: "📊", label: "50+ Projects Completed" },
    { icon: "⭐", label: "4.9/5 Google Reviews" },
  ];
  return (
    <section style={{ padding: "36px 5vw", background: BG_SOFT, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
      <div ref={ref} className={`fade-up ${inView ? "visible" : ""}`} style={{
        maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap",
        justifyContent: "center", gap: "28px 40px",
      }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 17 }}>{it.icon}</span>
            <span style={{ color: NAVY, fontSize: 13.5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", opacity: 0.8 }}>{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhySection() {
  const [ref, inView] = useInView();
  const cards = [
    { icon: "⚡", title: "Delivered Within 2 Hours", desc: "Get a fully functional website within 2 hours of sharing your details." },
    { icon: "💰", title: "Affordable Pricing", desc: "Professional websites starting at just ₹999. No hidden charges." },
    { icon: "🛟", title: "Lifetime Support", desc: "We're always a WhatsApp message away — for updates, fixes, or questions." },
    { icon: "📱", title: "Mobile Optimized", desc: "Perfect experience across every device, since most of your customers browse on phones." },
    { icon: "💬", title: "WhatsApp Enabled", desc: "Every website comes with a built-in WhatsApp button so leads reach you instantly." },
  ];
  return (
    <section style={{ padding: "100px 5vw", position: "relative", background: BG }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: INDIGO, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Why Orvium</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginTop: 12, letterSpacing: "-1px", color: NAVY }}>
            Why Choose Orvium?
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 22 }}>
          {cards.map((c, i) => (
            <div key={i} className={`card-hover fade-up ${inView ? "visible" : ""}`}
              style={{
                background: BG_SOFT, border: `1px solid ${BORDER}`,
                borderRadius: 16, padding: "30px 26px",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s, box-shadow 0.3s ease`,
              }}>
              <div style={{
                width: 50, height: 50, background: "rgba(79,70,229,0.08)",
                border: "1px solid rgba(79,70,229,0.2)", borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 18,
              }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 10, color: NAVY }}>{c.title}</h3>
              <p style={{ color: TEXT_MUTED, fontSize: 13.5, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const [ref, inView] = useInView();
  const plans = [
    { name: "Starter", price: "₹999", tag: "Most Popular",
      features: ["One-page website", "WhatsApp button", "Mobile responsive", "Free SSL", "Deployment"],
      color: INDIGO, highlight: false },
    { name: "Business", price: "₹4,999", tag: "Best Value",
      features: ["Up to 5 pages", "Contact form", "Google Maps integration", "Basic SEO", "WhatsApp button", "Free SSL"],
      color: INDIGO, highlight: true },
    { name: "Premium", price: "₹9,999", tag: "Enterprise",
      features: ["Custom design", "Analytics integration", "Blog section", "Advanced SEO", "Priority support", "Free SSL"],
      color: NAVY, highlight: false },
  ];
  return (
    <section id="services" style={{ padding: "100px 5vw", background: BG_SOFT }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: INDIGO, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Pricing</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginTop: 12, letterSpacing: "-1px", color: NAVY }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ color: TEXT_MUTED, marginTop: 12, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>No hidden fees. No surprises. Just results.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {plans.map((p, i) => (
            <div key={i} className={`fade-up ${inView ? "visible" : ""}`}
              style={{
                background: "#fff", border: p.highlight ? `2px solid ${INDIGO}` : `1px solid ${BORDER}`,
                borderRadius: 20, padding: "36px 30px", position: "relative",
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s, box-shadow 0.3s ease`,
                boxShadow: p.highlight ? "0 12px 40px rgba(79,70,229,0.15)" : "0 2px 12px rgba(15,23,42,0.04)",
                transform: p.highlight ? "scale(1.02)" : "none",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 16px 44px rgba(79,70,229,0.2)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = p.highlight ? "0 12px 40px rgba(79,70,229,0.15)" : "0 2px 12px rgba(15,23,42,0.04)"}
            >
              <div style={{
                position: "absolute", top: 20, right: 20,
                background: `${p.color}12`, border: `1px solid ${p.color}30`,
                borderRadius: 100, padding: "3px 12px",
                color: p.color, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
              }}>{p.tag}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8, color: NAVY }}>{p.name}</h3>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 40, color: p.color, marginBottom: 24, letterSpacing: "-1px" }}>{p.price}</div>
              <div style={{ marginBottom: 28 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: p.color, fontSize: 14, fontWeight: 700 }}>✓</span>
                    <span style={{ color: NAVY, fontSize: 14, fontFamily: "'DM Sans', sans-serif", opacity: 0.8 }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in the ${p.name} plan at ${p.price}`} target="_blank" rel="noreferrer"
                style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  background: p.highlight ? `linear-gradient(135deg,${INDIGO},${NAVY})` : "#fff",
                  border: p.highlight ? "none" : `1.5px solid ${NAVY}`,
                  color: p.highlight ? "#fff" : NAVY, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  fontSize: 14, padding: "13px 24px", borderRadius: 10,
                  transition: "all 0.2s",
                  boxShadow: p.highlight ? "0 6px 20px rgba(79,70,229,0.3)" : "none",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >Get Started</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const [ref, inView] = useInView();
  const steps = [
    { num: "01", title: "Contact Us", desc: "Reach out via WhatsApp, call, or email to get started." },
    { num: "02", title: "Share Details", desc: "Tell us about your business — logo, content, requirements." },
    { num: "03", title: "We Build It", desc: "Our team designs and develops your website within 2 hours." },
    { num: "04", title: "Go Live", desc: "We deploy your website and hand over all credentials." },
  ];
  return (
    <section style={{ padding: "100px 5vw", background: BG }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 68 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: INDIGO, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>How It Works</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginTop: 12, letterSpacing: "-1px", color: NAVY }}>
            From Contact to Live in 2 Hours
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} className={`fade-up ${inView ? "visible" : ""}`}
              style={{
                textAlign: "center", padding: "0 20px", position: "relative",
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", top: 32, right: 0, width: "50%", height: 1,
                  background: `linear-gradient(90deg,${BORDER},transparent)`,
                }} />
              )}
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                background: "rgba(79,70,229,0.07)", border: `2px solid rgba(79,70,229,0.3)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: INDIGO,
              }}>{s.num}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16.5, marginBottom: 10, color: NAVY }}>{s.title}</h3>
              <p style={{ color: TEXT_MUTED, fontSize: 13.5, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  const [ref, inView] = useInView();
  const projects = [
    { name: "Dr. Sharma Clinic", cat: "Doctor / Healthcare", color: INDIGO, emoji: "🩺" },
    { name: "Luxe Salon & Spa", cat: "Salon", color: "#0EA5E9", emoji: "✂️" },
    { name: "Spice Garden", cat: "Restaurant", color: "#F59E0B", emoji: "🍽️" },
    { name: "Apex Manufacturing", cat: "Manufacturer", color: NAVY, emoji: "🏭" },
    { name: "Vogue Store", cat: "Clothing Brand", color: "#8B5CF6", emoji: "👗" },
  ];
  return (
    <section id="portfolio" style={{ padding: "100px 5vw", background: BG_SOFT }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: INDIGO, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Portfolio</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginTop: 12, letterSpacing: "-1px", color: NAVY }}>
            See What We've Built
          </h2>
          <p style={{ color: TEXT_MUTED, marginTop: 12, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>
            Real businesses, real websites. People buy proof, not promises.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {projects.map((p, i) => (
            <div key={i} className={`fade-up ${inView ? "visible" : ""}`}
              style={{
                borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`, height: 200,
              }}
              onMouseEnter={e => { e.currentTarget.querySelector(".overlay").style.opacity = "1"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.querySelector(".overlay").style.opacity = "0"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{
                width: "100%", height: "100%", background: `${p.color}0d`, border: `1px solid ${p.color}30`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 46, marginBottom: 10 }}>{p.emoji}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: NAVY }}>{p.name}</h3>
                <span style={{ color: p.color, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>{p.cat}</span>
              </div>
              <div className="overlay" style={{
                position: "absolute", inset: 0, background: `linear-gradient(135deg,${p.color}e6,${p.color}cc)`,
                display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s ease",
              }}>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=I want a website like your ${p.name} demo`} target="_blank" rel="noreferrer"
                  style={{ background: "#fff", color: NAVY, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, padding: "10px 24px", borderRadius: 8, textDecoration: "none", letterSpacing: 0.3 }}>View Project →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  const [ref, inView] = useInView();
  const industries = [
    { title: "Website for Doctors", icon: "🩺", desc: "Appointment booking, patient trust, and a professional online presence." },
    { title: "Website for Manufacturers", icon: "🏭", desc: "Showcase your catalog, capacity, and credibility to B2B buyers." },
    { title: "Website for Restaurants", icon: "🍽️", desc: "Menus, location, and WhatsApp ordering — all in one place." },
    { title: "Website for Salons", icon: "✂️", desc: "Show your work, attract new clients, and make booking effortless." },
  ];
  return (
    <section id="industries" style={{ padding: "100px 5vw", background: BG }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: INDIGO, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Industries</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginTop: 12, letterSpacing: "-1px", color: NAVY }}>
            Built for Your Industry
          </h2>
          <p style={{ color: TEXT_MUTED, marginTop: 12, fontSize: 15, fontFamily: "'DM Sans', sans-serif", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Orvium helps Indian businesses establish an online presence within hours, not weeks — across every industry.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {industries.map((it, i) => (
            <a key={i} href={`https://wa.me/${WHATSAPP_NUMBER}?text=I want a ${it.title}`} target="_blank" rel="noreferrer"
              className={`card-hover fade-up ${inView ? "visible" : ""}`}
              style={{
                background: BG_SOFT, border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: "28px 24px", textDecoration: "none", display: "block",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s, box-shadow 0.3s ease`,
              }}>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{it.icon}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8, color: NAVY }}>{it.title}</h3>
              <p style={{ color: TEXT_MUTED, fontSize: 13, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{it.desc}</p>
              <span style={{ color: INDIGO, fontSize: 12.5, fontWeight: 600, marginTop: 12, display: "inline-block" }}>Learn more →</span>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 40, textAlign: "center" }} className={`fade-up ${inView ? "visible" : ""}`}>
          <p style={{ color: TEXT_MUTED, fontSize: 13.5, fontFamily: "'DM Sans', sans-serif" }}>
            Also includes: Landing Pages · Google Maps Setup · Custom Forms · Hosting · Domain Setup · Basic SEO
          </p>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [ref, inView] = useInView();
  const testimonials = [
    { name: "Rahul Sharma", role: "Business Owner", text: "Orvium delivered our website incredibly fast. The whole experience was seamless from start to finish. Highly recommended to anyone looking for quick results.", avatar: "RS" },
    { name: "Priya Mehta", role: "Founder", text: "The whole process was smooth and professional. They understood exactly what my business needed and delivered beyond expectations in just 2 hours.", avatar: "PM" },
    { name: "Aman Verma", role: "Entrepreneur", text: "Affordable pricing and excellent support throughout. The team was responsive and made sure everything was perfect before going live.", avatar: "AV" },
  ];
  return (
    <section id="testimonials" style={{ padding: "100px 5vw", background: BG_SOFT }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: INDIGO, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Testimonials</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginTop: 12, letterSpacing: "-1px", color: NAVY }}>
            What Clients Say
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} className={`card-hover fade-up ${inView ? "visible" : ""}`}
              style={{
                background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "32px 28px",
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s, box-shadow 0.3s ease`,
                boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
              }}>
              <div style={{ color: "#F59E0B", fontSize: 17, marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ color: NAVY, fontSize: 14.5, lineHeight: 1.8, opacity: 0.8, fontFamily: "'DM Sans', sans-serif", marginBottom: 22 }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${INDIGO},${NAVY})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#fff",
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14.5, color: NAVY }}>{t.name}</div>
                  <div style={{ color: TEXT_MUTED, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label, active }) {
  const num = useCounter(value, 2000, active);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(34px,4.5vw,54px)", letterSpacing: "-2px",
        background: `linear-gradient(135deg,${INDIGO},${NAVY})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1,
      }}>{num}{suffix}</div>
      <div style={{ color: TEXT_MUTED, fontSize: 13, marginTop: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function StatsSection() {
  const [ref, inView] = useInView();
  const stats = [
    { value: 50, suffix: "+", label: "Projects Delivered" },
    { value: 100, suffix: "%", label: "Client Satisfaction" },
    { value: 2, suffix: " Hrs", label: "Average Delivery" },
    { value: 3, suffix: "+", label: "Years Experience" },
  ];
  return (
    <section style={{ padding: "80px 5vw", background: BG }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", background: `linear-gradient(135deg, rgba(79,70,229,0.05), rgba(15,23,42,0.03))`,
        border: "1px solid rgba(79,70,229,0.15)", borderRadius: 24, padding: "56px 40px",
      }}>
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 36 }}>
          {stats.map((s, i) => (<StatCard key={i} {...s} active={inView} />))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [ref, inView] = useInView();
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "How fast can you deliver?", a: "Within 2 hours for most projects. We start immediately after receiving your business details and content." },
    { q: "Do you provide domains?", a: "We assist with domain setup and registration. You can choose your own domain or we can suggest options." },
    { q: "Is SSL included?", a: "Yes, free SSL certificate is included with every website. Your visitors will see the secure padlock icon." },
    { q: "Is the website mobile friendly?", a: "Absolutely. Every website we build is fully responsive and optimized for fast loading on phones — where most of your traffic comes from." },
    { q: "Can I request changes after delivery?", a: "Yes! We offer lifetime support — reach out on WhatsApp anytime for updates or fixes." },
    { q: "Do you offer a guarantee?", a: "Yes — 100% satisfaction guarantee. If you're not happy with the result, we'll revise it until you are." },
  ];
  return (
    <section id="faq" style={{ padding: "100px 5vw", background: BG_SOFT }}>
      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: INDIGO, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>FAQ</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginTop: 12, letterSpacing: "-1px", color: NAVY }}>
            Common Questions
          </h2>
        </div>
        {faqs.map((f, i) => (
          <div key={i} className={`fade-up ${inView ? "visible" : ""}`}
            style={{
              border: `1px solid ${BORDER}`, borderRadius: 12, marginBottom: 10, overflow: "hidden",
              transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              background: open === i ? "rgba(79,70,229,0.04)" : "#fff",
            }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: "100%", padding: "20px 24px", display: "flex", justifyContent: "space-between",
              alignItems: "center", background: "none", border: "none", cursor: "pointer", color: NAVY, textAlign: "left",
            }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15 }}>{f.q}</span>
              <span style={{ color: INDIGO, fontSize: 20, transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 16 }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 24px 20px", color: TEXT_MUTED, fontSize: 14, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in Name, Email, and Message.");
      return;
    }
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, phone: form.phone || "Not provided", business: form.business || "Not provided", message: form.message, to_email: EMAIL },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Something went wrong. Please try WhatsApp or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" style={{ padding: "100px 5vw", background: BG }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: INDIGO, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Contact</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,46px)", marginTop: 12, letterSpacing: "-1px", color: NAVY }}>
            Get In Touch
          </h2>
          <p style={{ color: TEXT_MUTED, marginTop: 12, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>We'll respond within 30 minutes during business hours.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 40 }} className={`fade-up ${inView ? "visible" : ""}`} id="contact-grid">
          <div>
            <div style={{ marginBottom: 32 }}>
              {[
                { icon: "📞", label: "Phone", value: PHONE_NUMBER, href: `tel:+919999999999` },
                { icon: "✉️", label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
                { icon: "🌐", label: "Website", value: "orvium.in", href: "https://orvium.in" },
              ].map((item, i) => (
                <a key={i} href={item.href} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "18px 0",
                  borderBottom: `1px solid ${BORDER}`, textDecoration: "none", transition: "all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                >
                  <div style={{
                    width: 46, height: 46, background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.2)",
                    borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ color: TEXT_MUTED, fontSize: 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{item.label}</div>
                    <div style={{ color: NAVY, fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "#25D366", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                padding: "12px", borderRadius: 10, textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >💬 WhatsApp</a>
              <a href={`tel:+919999999999`} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.25)", color: INDIGO,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, padding: "12px", borderRadius: 10, textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >📞 Call Now</a>
            </div>
          </div>
          <div style={{ background: BG_SOFT, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "36px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 8, color: NAVY }}>Message Sent!</h3>
                <p style={{ color: TEXT_MUTED, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>We'll get back to you within 30 minutes.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", business: "", message: "" }); }}
                  style={{ marginTop: 20, background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.25)", color: INDIGO, borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Send Another
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {[
                    { key: "name", label: "Full Name *", placeholder: "Your Name" },
                    { key: "email", label: "Email *", placeholder: "your@email.com" },
                    { key: "phone", label: "Phone", placeholder: "+91 XXXXX XXXXX" },
                    { key: "business", label: "Business Name", placeholder: "Your Business" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", color: TEXT_MUTED, fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginBottom: 6 }}>{f.label}</label>
                      <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        style={{ width: "100%", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "11px 14px", color: NAVY, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                        onFocus={e => e.target.style.borderColor = INDIGO}
                        onBlur={e => e.target.style.borderColor = BORDER}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", color: TEXT_MUTED, fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginBottom: 6 }}>Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project..." rows={4}
                    style={{ width: "100%", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "11px 14px", color: NAVY, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = INDIGO}
                    onBlur={e => e.target.style.borderColor = BORDER}
                  />
                </div>
                <button onClick={handleSubmit} disabled={sending}
                  style={{
                    width: "100%", background: `linear-gradient(135deg,${INDIGO},${NAVY})`, border: "none", color: "#fff",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, padding: "14px", borderRadius: 10,
                    cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, boxShadow: "0 8px 26px rgba(79,70,229,0.3)", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { if (!sending) e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}
                >{sending ? "Sending..." : "Send Message ✉️"}</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:720px){#contact-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

function FinalCTA({ onSample, onZoom }) {
  const [ref, inView] = useInView();
  return (
    <section style={{ padding: "80px 5vw", background: BG_SOFT }}>
      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }} className={`fade-up ${inView ? "visible" : ""}`}>
        <div style={{ background: `linear-gradient(135deg, ${NAVY}, #1E1B4B)`, borderRadius: 24, padding: "70px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle,rgba(99,102,241,0.25) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: 1, padding: "5px 14px", borderRadius: 100, marginBottom: 18, fontFamily: "'DM Sans', sans-serif" }}>Get your website today — limited slots this week</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#fff", fontSize: "clamp(26px,4vw,46px)", letterSpacing: "-1px", marginBottom: 14 }}>Ready To Take Your<br />Business Online?</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>Let's build your website today. Fast, affordable, professional.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
            <a href={`tel:+919999999999`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: NAVY, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, padding: "13px 28px", borderRadius: 10, textDecoration: "none" }}>📞 Call Now</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to build my website with Orvium`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, padding: "13px 28px", borderRadius: 10, textDecoration: "none", boxShadow: "0 6px 20px rgba(37,211,102,0.3)" }}>💬 WhatsApp Us</a>
            <a href={`mailto:${EMAIL}?subject=Website Inquiry`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, padding: "13px 28px", borderRadius: 10, textDecoration: "none" }}>✉️ Send Email</a>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onSample} style={{ background: "transparent", border: "1.5px dashed rgba(255,255,255,0.4)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, padding: "10px 20px", borderRadius: 10, cursor: "pointer" }}>🎁 Get a Free Sample Design</button>
            <button onClick={onZoom} style={{ background: "transparent", border: "1.5px dashed rgba(255,255,255,0.4)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, padding: "10px 20px", borderRadius: 10, cursor: "pointer" }}>📹 Book a Free Zoom Call</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const scroll = (id) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer style={{ padding: "60px 5vw 30px", borderTop: `1px solid ${BORDER}`, background: NAVY }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 40, marginBottom: 50 }} id="footer-grid">
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", marginBottom: 12 }}>
              <span style={{ color: "#fff" }}>OR</span><span style={{ color: INDIGO_LIGHT }}>VIUM</span><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400, letterSpacing: 2, marginLeft: 4 }}>.IN</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", maxWidth: 260 }}>
              Get Your Business Online In 2 Hours. Fast, professional, affordable websites for every business.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[{ icon: "📸", label: "Instagram" }, { icon: "💼", label: "LinkedIn" }, { icon: "💻", label: "GitHub" }].map((s, i) => (
                <a key={i} href="#" title={s.label} style={{ width: 38, height: 38, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                >{s.icon}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Navigation</div>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scroll(l)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", padding: "5px 0", transition: "color 0.2s", textAlign: "left" }}
                onMouseEnter={e => e.target.style.color = INDIGO_LIGHT}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}
              >{l}</button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Contact</div>
            {[{ icon: "📞", text: PHONE_NUMBER }, { icon: "✉️", text: EMAIL }, { icon: "🌐", text: "orvium.in" }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>© 2026 Orvium.in. All Rights Reserved.</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Built with ❤️ in India</span>
        </div>
      </div>
      <style>{`@media(max-width:768px){#footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}

function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 2000); }, []);
  return (
    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to get my website built with Orvium`} target="_blank" rel="noreferrer"
      style={{
        position: "fixed", bottom: 28, right: 24, zIndex: 200, width: 58, height: 58, borderRadius: "50%", background: "#25D366",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, textDecoration: "none",
        boxShadow: "0 6px 30px rgba(37,211,102,0.45)", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.5)",
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      title="Chat on WhatsApp"
    >💬
      <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "2px solid rgba(37,211,102,0.4)", animation: "pulse 2s infinite" }} />
    </a>
  );
}

export default function App() {
  const [sampleOpen, setSampleOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  return (
    <div style={{ background: "#FFFFFF", color: NAVY, minHeight: "100vh" }}>
      <Navbar />
      <HeroSection onSample={() => setSampleOpen(true)} onZoom={() => setZoomOpen(true)} />
      <TrustBar />
      <WhySection />
      <ServicesSection />
      <ProcessSection />
      <StatsSection />
      <PortfolioSection />
      <IndustriesSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <FinalCTA onSample={() => setSampleOpen(true)} onZoom={() => setZoomOpen(true)} />
      <Footer />
      <WhatsAppFloat />
      <SampleModal open={sampleOpen} onClose={() => setSampleOpen(false)} />
      <ZoomModal open={zoomOpen} onClose={() => setZoomOpen(false)} />
    </div>
  );
}
