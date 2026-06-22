import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

const WHATSAPP_NUMBER = "919999999999";
const PHONE_NUMBER = "+91 99999 99999";
const EMAIL = "hello@orvium.in";

// ─── EmailJS Config ────────────────────────────────────────────────
// 1. Sign up free at https://emailjs.com
// 2. Create an Email Service (Gmail recommended) → copy Service ID
// 3. Create an Email Template with these variables:
//      {{from_name}}, {{from_email}}, {{phone}}, {{business}}, {{message}}
//    Copy Template ID
// 4. Go to Account → API Keys → copy your Public Key
// Then paste all three below:
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. "aBcDeFgHiJkLmNoPq"
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

const NAV_LINKS = ["Home", "Services", "Portfolio", "Testimonials", "FAQ", "Contact"];

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
      background: scrolled ? "rgba(6,8,15,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(59,130,246,0.12)" : "none",
      transition: "all 0.4s ease",
      padding: "0 5vw",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#fff" }}>OR</span><span style={{ color: "#3B82F6" }}>VIUM</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 400, letterSpacing: 2, marginLeft: 6 }}>.IN</span>
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scroll(l)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.65)", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500, letterSpacing: 0.3, transition: "color 0.2s",
              padding: "4px 0",
            }}
              onMouseEnter={e => e.target.style.color = "#3B82F6"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
            >{l}</button>
          ))}
          <button onClick={() => scroll("Contact")} style={{
            background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", border: "none", cursor: "pointer",
            color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            padding: "9px 22px", borderRadius: 8, letterSpacing: 0.3,
            boxShadow: "0 4px 20px rgba(59,130,246,0.3)", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.target.style.transform = "none"}
          >Get Started</button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: "#fff",
          fontSize: 18,
        }} className="mobile-menu-btn">☰</button>
      </div>
      {menuOpen && (
        <div style={{
          background: "rgba(6,8,15,0.97)", padding: "16px 5vw 24px",
          borderTop: "1px solid rgba(59,130,246,0.1)",
        }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scroll(l)} style={{
              display: "block", width: "100%", textAlign: "left", background: "none",
              border: "none", color: "rgba(255,255,255,0.75)", fontSize: 15,
              fontFamily: "'DM Sans', sans-serif", padding: "12px 0", cursor: "pointer",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>{l}</button>
          ))}
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @media(max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#06080F;color:#fff;font-family:'DM Sans',sans-serif}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#06080F}
        ::-webkit-scrollbar-thumb{background:#3B82F6;border-radius:10px}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes borderPulse{0%,100%{border-color:rgba(59,130,246,0.3)}50%{border-color:rgba(59,130,246,0.7)}}
        .fade-up{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}
        .fade-up.visible{opacity:1;transform:translateY(0)}
        .card-hover{transition:transform 0.3s ease,box-shadow 0.3s ease}
        .card-hover:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(59,130,246,0.2)!important}
      `}</style>
    </nav>
  );
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  const badges = [
    { icon: "⚡", text: "2 Hour Delivery" },
    { icon: "📱", text: "Mobile Friendly" },
    { icon: "🔒", text: "Free SSL" },
    { icon: "🔍", text: "SEO Optimized" },
    { icon: "💬", text: "Unlimited Support" },
  ];
  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "120px 5vw 80px",
    }}>
      {/* BG effects */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(59,130,246,0.18) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "20%", left: "5%", width: 300, height: 300,
        background: "radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)",
        borderRadius: "50%", animation: "float 6s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "5%", width: 200, height: 200,
        background: "radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)",
        borderRadius: "50%", animation: "float 8s ease-in-out infinite 2s",
        pointerEvents: "none",
      }} />
      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
          transition: "all 0.6s ease 0.1s",
        }}>
          <span style={{ width: 7, height: 7, background: "#22C55E", borderRadius: "50%", animation: "pulse 2s infinite" }} />
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5 }}>
            Available Now · Fast Turnaround Guaranteed
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.08,
          fontSize: "clamp(42px, 7vw, 80px)", letterSpacing: "-2px", marginBottom: 24,
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
          transition: "all 0.7s ease 0.2s",
        }}>
          Your Business Online<br />
          <span style={{
            background: "linear-gradient(135deg,#60A5FA 0%,#3B82F6 40%,#818CF8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>In Just 2 Hours</span>
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.55)", fontSize: "clamp(15px, 2vw, 18px)",
          lineHeight: 1.7, maxWidth: 600, margin: "0 auto 40px",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.3s",
        }}>
          Professional websites designed to help businesses grow online without spending weeks or thousands of rupees.
        </p>

        <div style={{
          display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48,
          opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.4s",
        }}>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to get my website built`} target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
              color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: 15, padding: "14px 32px", borderRadius: 10, textDecoration: "none",
              boxShadow: "0 8px 30px rgba(59,130,246,0.35)", transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >
            <span>⚡</span> Get My Website
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 15, padding: "14px 28px", borderRadius: 10, textDecoration: "none",
              backdropFilter: "blur(10px)", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"; e.currentTarget.style.background = "rgba(59,130,246,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>

        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
          opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.5s",
        }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 100, padding: "7px 14px",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.6)",
            }}>
              <span>{b.icon}</span><span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const [ref, inView] = useInView();
  const cards = [
    { icon: "⚡", title: "Lightning Fast Delivery", desc: "Get a fully functional website within 2 hours of sharing your details." },
    { icon: "📱", title: "Mobile Responsive", desc: "Perfect experience across all devices — phones, tablets, and desktops." },
    { icon: "💰", title: "Affordable Pricing", desc: "Professional websites starting at just ₹999. No hidden charges." },
    { icon: "🔍", title: "SEO Optimized", desc: "Help customers discover your business on Google from day one." },
  ];
  return (
    <section style={{ padding: "100px 5vw", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "60%", height: 1,
        background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.3),transparent)",
      }} />
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Why Orvium</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", marginTop: 12, letterSpacing: "-1px" }}>
            Built for Speed. Priced for Everyone.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {cards.map((c, i) => (
            <div key={i} className={`card-hover fade-up ${inView ? "visible" : ""}`}
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "32px 28px", backdropFilter: "blur(10px)",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s, box-shadow 0.3s ease`,
              }}>
              <div style={{
                width: 52, height: 52, background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: 20,
              }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{c.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{c.desc}</p>
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
    {
      name: "Starter", price: "₹999", tag: "Most Popular",
      features: ["1 Page Website", "Contact Form", "WhatsApp Button", "Mobile Responsive", "Free SSL", "Deployment"],
      color: "#3B82F6", glow: "rgba(59,130,246,0.2)",
    },
    {
      name: "Business", price: "₹2,999", tag: "Best Value",
      features: ["Up to 5 Pages", "Domain Setup Assistance", "Basic SEO", "Contact Forms", "Fast Loading", "Free SSL"],
      color: "#818CF8", glow: "rgba(129,140,248,0.2)",
    },
    {
      name: "Premium", price: "₹4,999+", tag: "Enterprise",
      features: ["Custom Design", "Blog Section", "Analytics Integration", "Advanced SEO", "Priority Support", "Free SSL"],
      color: "#22D3EE", glow: "rgba(34,211,238,0.2)",
    },
  ];
  return (
    <section id="services" style={{ padding: "100px 5vw", background: "rgba(255,255,255,0.01)" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Pricing</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", marginTop: 12, letterSpacing: "-1px" }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: 12, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>No hidden fees. No surprises. Just results.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {plans.map((p, i) => (
            <div key={i} className={`fade-up ${inView ? "visible" : ""}`}
              style={{
                background: "rgba(255,255,255,0.03)", border: `1px solid ${p.color}30`,
                borderRadius: 20, padding: "36px 30px", position: "relative",
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
                boxShadow: i === 0 ? `0 0 40px ${p.glow}` : "none",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 50px ${p.glow}`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = i === 0 ? `0 0 40px ${p.glow}` : "none"}
            >
              <div style={{
                position: "absolute", top: 20, right: 20,
                background: `${p.color}20`, border: `1px solid ${p.color}40`,
                borderRadius: 100, padding: "3px 12px",
                color: p.color, fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
              }}>{p.tag}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{p.name}</h3>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 42, color: p.color, marginBottom: 24, letterSpacing: "-1px" }}>{p.price}</div>
              <div style={{ marginBottom: 28 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: p.color, fontSize: 14 }}>✓</span>
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in the ${p.name} plan at ${p.price}`} target="_blank" rel="noreferrer"
                style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  background: `linear-gradient(135deg,${p.color},${p.color}cc)`,
                  color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  fontSize: 14, padding: "13px 24px", borderRadius: 10,
                  transition: "all 0.2s", boxShadow: `0 4px 20px ${p.glow}`,
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
    <section style={{ padding: "100px 5vw" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>How It Works</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", marginTop: 12, letterSpacing: "-1px" }}>
            From Contact to Live in 2 Hours
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 0, position: "relative" }}>
          <div style={{
            position: "absolute", top: 36, left: "12.5%", right: "12.5%", height: 1,
            background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.4),transparent)",
            display: "none",
          }} className="process-line" />
          {steps.map((s, i) => (
            <div key={i} className={`fade-up ${inView ? "visible" : ""}`}
              style={{
                textAlign: "center", padding: "0 20px", position: "relative",
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", top: 32, right: 0, width: "50%", height: 1,
                  background: "linear-gradient(90deg,rgba(59,130,246,0.3),transparent)",
                }} />
              )}
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                background: "rgba(59,130,246,0.12)", border: "2px solid rgba(59,130,246,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#3B82F6",
                boxShadow: "0 0 24px rgba(59,130,246,0.15)",
              }}>{s.num}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
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
    { name: "Spice Garden", cat: "Restaurant", color: "#EF4444", emoji: "🍽️" },
    { name: "FitZone Gym", cat: "Gym", color: "#F59E0B", emoji: "💪" },
    { name: "Luxe Salon", cat: "Salon", color: "#EC4899", emoji: "✂️" },
    { name: "Prime Realty", cat: "Real Estate", color: "#10B981", emoji: "🏠" },
    { name: "Vogue Store", cat: "Clothing Brand", color: "#8B5CF6", emoji: "👗" },
    { name: "Dev Portfolio", cat: "Portfolio", color: "#3B82F6", emoji: "💻" },
  ];
  return (
    <section id="portfolio" style={{ padding: "100px 5vw", background: "rgba(255,255,255,0.01)" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Portfolio</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", marginTop: 12, letterSpacing: "-1px" }}>
            Our Recent Work
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: 12, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>Each website built with precision and purpose.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
          {projects.map((p, i) => (
            <div key={i} className={`fade-up ${inView ? "visible" : ""}`}
              style={{
                borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
                height: 220,
              }}
              onMouseEnter={e => {
                e.currentTarget.querySelector(".overlay").style.opacity = "1";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector(".overlay").style.opacity = "0";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{
                width: "100%", height: "100%",
                background: `linear-gradient(135deg,${p.color}22 0%,${p.color}08 100%)`,
                border: `1px solid ${p.color}30`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>{p.emoji}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 19, color: "#fff" }}>{p.name}</h3>
                <span style={{ color: p.color, fontSize: 12, fontWeight: 600, letterSpacing: 1, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>{p.cat}</span>
              </div>
              <div className="overlay" style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(135deg,${p.color}dd,${p.color}99)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: 0, transition: "opacity 0.3s ease",
              }}>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=I want a website like your ${p.name} demo`} target="_blank" rel="noreferrer"
                  style={{
                    background: "#fff", color: "#111", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: 13, padding: "10px 24px", borderRadius: 8,
                    textDecoration: "none", letterSpacing: 0.3,
                  }}>View Project →</a>
              </div>
            </div>
          ))}
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
    <section id="testimonials" style={{ padding: "100px 5vw" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Testimonials</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", marginTop: 12, letterSpacing: "-1px" }}>
            What Clients Say
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} className={`card-hover fade-up ${inView ? "visible" : ""}`}
              style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "32px 28px", backdropFilter: "blur(10px)",
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s, box-shadow 0.3s ease`,
              }}>
              <div style={{ color: "#FBBF24", fontSize: 18, marginBottom: 16, letterSpacing: 2 }}>★★★★★</div>
              <p style={{
                color: "rgba(255,255,255,0.7)", fontSize: 14.5, lineHeight: 1.8,
                fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", marginBottom: 24,
              }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "linear-gradient(135deg,#3B82F6,#818CF8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff",
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, fontFamily: "'DM Sans', sans-serif" }}>{t.role}</div>
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
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: "clamp(36px,5vw,60px)", letterSpacing: "-2px",
        background: "linear-gradient(135deg,#60A5FA,#3B82F6)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        lineHeight: 1,
      }}>
        {num}{suffix}
      </div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13.5, marginTop: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3 }}>{label}</div>
    </div>
  );
}

function StatsSection() {
  const [ref, inView] = useInView();
  const stats = [
    { value: 50, suffix: "+", label: "Projects Delivered" },
    { value: 100, suffix: "%", label: "Client Satisfaction" },
    { value: 2, suffix: " Hrs", label: "Average Delivery" },
    { value: 24, suffix: "/7", label: "Support" },
  ];
  return (
    <section style={{ padding: "80px 5vw" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
        borderRadius: 24, padding: "60px 40px",
      }}>
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 40 }}>
          {stats.map((s, i) => (
            <StatCard key={i} {...s} active={inView} />
          ))}
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
    { q: "Is the website mobile friendly?", a: "Absolutely. Every website we build is fully responsive and tested across all screen sizes." },
    { q: "Can I request changes after delivery?", a: "Yes! We offer support and revisions during the setup period to make sure you're 100% satisfied." },
  ];
  return (
    <section id="faq" style={{ padding: "100px 5vw" }}>
      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>FAQ</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", marginTop: 12, letterSpacing: "-1px" }}>
            Common Questions
          </h2>
        </div>
        {faqs.map((f, i) => (
          <div key={i} className={`fade-up ${inView ? "visible" : ""}`}
            style={{
              border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, marginBottom: 10,
              overflow: "hidden", transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              background: open === i ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
            }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: "100%", padding: "20px 24px", display: "flex", justifyContent: "space-between",
              alignItems: "center", background: "none", border: "none", cursor: "pointer",
              color: "#fff", textAlign: "left",
            }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15 }}>{f.q}</span>
              <span style={{
                color: "#3B82F6", fontSize: 20, transition: "transform 0.3s",
                transform: open === i ? "rotate(45deg)" : "none",
                flexShrink: 0, marginLeft: 16,
              }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 24px 20px", color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
                {f.a}
              </div>
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
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone || "Not provided",
          business: form.business || "Not provided",
          message: form.message,
          to_email: EMAIL,
        },
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
    <section id="contact" style={{ padding: "100px 5vw", background: "rgba(255,255,255,0.01)" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }} className={`fade-up ${inView ? "visible" : ""}`}>
          <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Contact</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,48px)", marginTop: 12, letterSpacing: "-1px" }}>
            Get In Touch
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: 12, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>We'll respond within 30 minutes during business hours.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 40 }} className={`fade-up ${inView ? "visible" : ""}`}>
          {/* Contact info */}
          <div>
            <div style={{ marginBottom: 32 }}>
              {[
                { icon: "📞", label: "Phone", value: PHONE_NUMBER, href: `tel:+919999999999` },
                { icon: "✉️", label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
                { icon: "🌐", label: "Website", value: "orvium.in", href: "https://orvium.in" },
              ].map((item, i) => (
                <a key={i} href={item.href} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "18px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                >
                  <div style={{
                    width: 46, height: 46, background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{item.label}</div>
                    <div style={{ color: "#fff", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "#25D366", color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: 13, padding: "12px", borderRadius: 10, textDecoration: "none",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >💬 WhatsApp</a>
              <a href={`tel:+919999999999`} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                color: "#60A5FA", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: 13, padding: "12px", borderRadius: 10, textDecoration: "none",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >📞 Call Now</a>
            </div>
          </div>
          {/* Form */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20, padding: "36px",
          }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>We'll get back to you within 30 minutes.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", business: "", message: "" }); }}
                  style={{ marginTop: 20, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
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
                      <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginBottom: 6 }}>{f.label}</label>
                      <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8, padding: "11px 14px", color: "#fff", fontSize: 14,
                          fontFamily: "'DM Sans', sans-serif", outline: "none",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.5)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 11.5, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginBottom: 6 }}>Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your project..."
                    rows={4}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8, padding: "11px 14px", color: "#fff", fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical",
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
                <button onClick={handleSubmit} disabled={sending}
                  style={{
                    width: "100%", background: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
                    border: "none", color: "#fff", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: 15, padding: "14px", borderRadius: 10,
                    cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1,
                    boxShadow: "0 8px 30px rgba(59,130,246,0.3)", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { if (!sending) e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}
                >{sending ? "Opening Email..." : "Send Message ✉️"}</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:720px){#contact > div > div:last-child{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

function FinalCTA() {
  const [ref, inView] = useInView();
  return (
    <section style={{ padding: "80px 5vw" }}>
      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}
        className={`fade-up ${inView ? "visible" : ""}`}>
        <div style={{
          background: "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(129,140,248,0.08))",
          border: "1px solid rgba(59,130,246,0.2)", borderRadius: 24, padding: "70px 40px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60, width: 200, height: 200,
            background: "radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)",
            borderRadius: "50%", pointerEvents: "none",
          }} />
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-1px", marginBottom: 16,
          }}>Ready To Take Your<br />Business Online?</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontFamily: "'DM Sans', sans-serif", marginBottom: 36 }}>
            Let's build your website today. Fast, affordable, professional.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`tel:+919999999999`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg,#3B82F6,#1D4ED8)", color: "#fff",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
              padding: "13px 28px", borderRadius: 10, textDecoration: "none",
              boxShadow: "0 6px 24px rgba(59,130,246,0.3)",
            }}>📞 Call Now</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to build my website with Orvium`} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#25D366", color: "#fff",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
              padding: "13px 28px", borderRadius: 10, textDecoration: "none",
              boxShadow: "0 6px 24px rgba(37,211,102,0.3)",
            }}>💬 WhatsApp Us</a>
            <a href={`mailto:${EMAIL}?subject=Website Inquiry`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
              padding: "13px 28px", borderRadius: 10, textDecoration: "none",
            }}>✉️ Send Email</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const scroll = (id) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer style={{
      padding: "60px 5vw 30px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(0,0,0,0.3)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 40, marginBottom: 50 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: "-0.5px", marginBottom: 12 }}>
              <span style={{ color: "#fff" }}>OR</span><span style={{ color: "#3B82F6" }}>VIUM</span><span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 400, letterSpacing: 2, marginLeft: 4 }}>.IN</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13.5, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", maxWidth: 260 }}>
              Get Your Business Online Within 2 Hours. Fast, professional, affordable websites for every business.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[
                { icon: "📸", label: "Instagram", href: "#" },
                { icon: "💼", label: "LinkedIn", href: "#" },
                { icon: "💻", label: "GitHub", href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} title={s.label} style={{
                  width: 38, height: 38, background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, textDecoration: "none", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Navigation</div>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scroll(l)} style={{
                display: "block", background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.45)", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                padding: "5px 0", transition: "color 0.2s", textAlign: "left",
              }}
                onMouseEnter={e => e.target.style.color = "#3B82F6"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
              >{l}</button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Contact</div>
            {[
              { icon: "📞", text: PHONE_NUMBER },
              { icon: "✉️", text: EMAIL },
              { icon: "🌐", text: "orvium.in" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 Orvium.in. All Rights Reserved.
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            Built with ❤️ in India
          </span>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer > div > div:first-child{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}

function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 2000); }, []);
  return (
    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to get my website built with Orvium`}
      target="_blank" rel="noreferrer"
      style={{
        position: "fixed", bottom: 28, right: 24, zIndex: 200,
        width: 58, height: 58, borderRadius: "50%",
        background: "#25D366",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, textDecoration: "none",
        boxShadow: "0 6px 30px rgba(37,211,102,0.45)",
        opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.5)",
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      title="Chat on WhatsApp"
    >💬
      <div style={{
        position: "absolute", inset: -3, borderRadius: "50%",
        border: "2px solid rgba(37,211,102,0.4)",
        animation: "pulse 2s infinite",
      }} />
    </a>
  );
}

export default function App() {
  return (
    <div style={{ background: "#06080F", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <WhySection />
      <ServicesSection />
      <ProcessSection />
      <StatsSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <FinalCTA />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
