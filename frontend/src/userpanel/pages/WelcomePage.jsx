import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WelcomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const heroContentRef = useRef(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#00010f";
    if (isLoaded) {
      if (isSignedIn) navigate("/dashboard");
      else setShowContent(true);
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (!showContent || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tlHero = gsap.timeline();
      tlHero
        .from(".title-word", {
          y: 120,
          opacity: 0,
          rotationX: 70,
          stagger: 0.25,
          duration: 1.2,
          ease: "power4.out",
        })
        .from(".hero-glow-ring", {
          scale: 0.4,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.7)",
        }, "-=0.6")
        .from(".hero-tagline", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.4")
        .from(".hero-cta", {
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.3");

      gsap.to(".hero-glow-ring", {
        scale: 1.04,
        boxShadow: "0 0 60px rgba(0,212,255,0.6)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      if (planeRef.current) {
        gsap.to(planeRef.current, {
          x: "130vw",
          duration: 24,
          ease: "none",
          repeat: -1,
        });
      }

      gsap.utils.toArray(".gsap-reveal").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [showContent]);

  if (!isLoaded || (isLoaded && isSignedIn)) return null;

  return (
    <div ref={containerRef} style={styles.pageWrapper}>
      {/* BACKGROUND LAYERS */}
      <div style={styles.fixedBg}>
        <div style={styles.animatedGradient} />
        <div style={styles.vignette} />
        <div style={styles.orbLayer}>
          <div className="orb" style={{ ...styles.orb, ...styles.orb1 }} />
          <div className="orb" style={{ ...styles.orb, ...styles.orb2 }} />
        </div>
      </div>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div className="scanning-line" style={styles.scanningLine} />
        
        <div ref={heroContentRef} style={styles.heroContent}>
          <p style={styles.statusLine}>SYSTEM ONLINE — READY FOR DEPARTURE</p>

          <div className="hero-glow-ring" style={styles.heroGlowRing} />

          <h1 style={styles.mainTitle}>
            <span className="title-word">UDDAAN</span>
            <span style={styles.titleSeparator}></span>
            <span className="title-word">SATHI</span>
          </h1>
          
          <p className="hero-tagline" style={styles.tagline}>
            Intelligent Flight Disruption Recovery & Compensation Management
          </p>

          <div style={styles.btnGroup}>
            {/* WRAPPERS ADDED FOR GSAP TARGETING */}
            <div className="hero-cta">
              <SignInButton mode="modal">
                <button style={styles.primaryBtn}>Passenger Login</button>
              </SignInButton>
            </div>
            <div className="hero-cta">
              <SignUpButton mode="modal">
                <button style={styles.secondaryBtn}>Register Account</button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={styles.section}>
        <div className="gsap-reveal" style={styles.glassLayer}>
          <h2 style={styles.sectionTitle}>Core Features</h2>
          <div style={styles.featureGrid}>
            {features.map((f, i) => (
              <div key={i} className="gsap-reveal" style={styles.card}>
                <div style={styles.cardIcon}>{f.icon}</div>
                <h3 style={styles.cardTitle}>{f.title}</h3>
                <p style={styles.cardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={{ opacity: 0.6, letterSpacing: "4px" }}>
          © 2025 UDDAAN SATHI • Professional Flight Management
        </p>
      </footer>
    </div>
  );
}

const features = [
  { icon: "🔔", title: "Instant Alerts", desc: "Real-time updates on flight status." },
  { icon: "✈️", title: "Rerouting", desc: "Immediate booking across global carriers." },
  { icon: "🏨", title: "Accommodation", desc: "Automated hotel and transport support." },
  { icon: "💰", title: "Compensation", desc: "Swift claims for refunds and delays." },
];

const styles = {
  pageWrapper: {
    color: "#e0f7ff",
    fontFamily: "'Inter', sans-serif",
    background: "#00010f",
    overflowX: "hidden",
    minHeight: "100vh",
  },
  fixedBg: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
  animatedGradient: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 50% 50%, #001a3d 0%, #00010f 100%)",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at center, transparent 20%, #00010f 90%)",
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(60px)",
    background: "rgba(0, 212, 255, 0.15)",
  },
  orb1: { width: "400px", height: "400px", top: "-10%", left: "-10%" },
  orb2: { width: "300px", height: "300px", bottom: "10%", right: "10%" },
  hero: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 10,
  },
  heroContent: {
    textAlign: "center",
    position: "relative",
    zIndex: 20,
    padding: "20px",
  },
  heroGlowRing: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    border: "1px solid rgba(0,212,255,0.2)",
    zIndex: -1,
  },
  mainTitle: {
    fontSize: "clamp(3rem, 10vw, 7rem)",
    fontWeight: "900",
    margin: "0 0 20px 0",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  titleSeparator: { width: "10px" },
  statusLine: { color: "#00d4ff", letterSpacing: "5px", marginBottom: "20px" },
  tagline: { fontSize: "1.2rem", opacity: 0.8, marginBottom: "40px" },
  btnGroup: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    pointerEvents: "auto", // Crucial for button clicks
  },
  primaryBtn: {
    padding: "16px 36px",
    background: "#00d4ff",
    color: "#000",
    border: "none",
    borderRadius: "50px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    boxShadow: "0 0 20px rgba(0,212,255,0.4)",
  },
  secondaryBtn: {
    padding: "16px 36px",
    background: "transparent",
    color: "#00d4ff",
    border: "1px solid #00d4ff",
    borderRadius: "50px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },
  section: {
    padding: "100px 5%",
    position: "relative",
    zIndex: 10,
  },
  glassLayer: {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
    padding: "60px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  sectionTitle: { fontSize: "3rem", textAlign: "center", marginBottom: "50px" },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  card: {
    padding: "30px",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "16px",
    border: "1px solid rgba(0,212,255,0.1)",
  },
  cardIcon: { fontSize: "2.5rem", marginBottom: "15px" },
  cardTitle: { color: "#00d4ff", marginBottom: "10px" },
  cardDesc: { opacity: 0.7, lineHeight: "1.5" },
  footer: { padding: "50px", textAlign: "center" },
};