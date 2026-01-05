import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  // Redirect if signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/user/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // GSAP Animations
  useEffect(() => {
    if (!isLoaded || isSignedIn || !mainRef.current) return;

    ScrollTrigger.getAll().forEach(t => t.kill());

    const ctx = gsap.context(() => {
      
      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .fromTo('.hero-buttons', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');

      // Floating animation for decorative element
      gsap.to('.float-element', {
        y: -20,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Scroll indicator bounce
      gsap.to('.scroll-arrow', {
        y: 10,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // PINNED STORY SECTION
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#story-section',
          start: 'top top',
          end: '+=2500',
          pin: true,
          scrub: 0.5,
        }
      });

      storyTl
        // Panel 1 in
        .fromTo('#panel-1', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 }, 0)
        .to('#panel-1', { opacity: 0, y: -60, duration: 1 }, 1)
        // Panel 2 in
        .fromTo('#panel-2', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 }, 1)
        .to('#panel-2', { opacity: 0, y: -60, duration: 1 }, 2)
        // Panel 3 in
        .fromTo('#panel-3', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 }, 2)
        // Background color shift
        .fromTo('#story-section', 
          { background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)' },
          { background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', duration: 1 }, 0)
        .to('#story-section', 
          { background: 'linear-gradient(180deg, #16213e 0%, #0f3460 100%)', duration: 1 }, 1)
        .to('#story-section', 
          { background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)', duration: 1 }, 2);

      // Features animation
      gsap.utils.toArray<HTMLElement>('.feature-box').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // CTA section
      gsap.fromTo('.cta-content',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: '#cta-section',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // CTA button pulse
      gsap.to('.pulse-btn', {
        boxShadow: '0 0 40px rgba(79, 70, 229, 0.6)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, mainRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid #333', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isSignedIn) return null;

  return (
    <div ref={mainRef} style={{ background: '#0a0a1a', color: '#ffffff', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* ========== HERO SECTION ========== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)',
        padding: '0 24px'
      }}>
        {/* Decorative circles */}
        <div className="float-element" style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          pointerEvents: 'none'
        }} />
        <div className="float-element" style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          pointerEvents: 'none',
          animationDelay: '0.5s'
        }} />
        <div style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Content */}
        <h1 className="hero-title" style={{
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          fontWeight: 800,
          textAlign: 'center',
          margin: 0,
          background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em'
        }}>
          UdaanSathi
        </h1>

        <p className="hero-subtitle" style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: 600,
          margin: '24px 0 40px',
          lineHeight: 1.6
        }}>
          Helping passengers navigate flight disruptions with clarity and calm
        </p>

        <div className="hero-buttons" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <SignInButton mode="modal">
            <button style={{
              padding: '16px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              background: '#6366f1',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(99, 102, 241, 0.5)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)'; }}
            >
              Passenger Login
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button style={{
              padding: '16px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#c7d2fe',
              background: 'transparent',
              border: '2px solid #4f46e5',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)'; e.currentTarget.style.borderColor = '#6366f1'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#4f46e5'; }}
            >
              Register Account
            </button>
          </SignUpButton>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint" style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: '#64748b'
        }}>
          <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>Scroll</span>
          <svg className="scroll-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ========== STORY SECTION (PINNED) ========== */}
      <section id="story-section" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)'
      }}>
        {/* Panel 1 */}
        <div id="panel-1" style={{
          position: 'absolute',
          textAlign: 'center',
          padding: '0 24px',
          opacity: 0
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
            Flight cancellations create
          </h2>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: '#ef4444', margin: '8px 0 24px' }}>
            confusion
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>
            Thousands of passengers stranded, uncertain of their next steps.
          </p>
        </div>

        {/* Panel 2 */}
        <div id="panel-2" style={{
          position: 'absolute',
          textAlign: 'center',
          padding: '0 24px',
          opacity: 0
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
            Passengers are left
          </h2>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: '#f59e0b', margin: '8px 0 24px' }}>
            without guidance
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>
            Long queues, endless calls, and missed connections become the norm.
          </p>
        </div>

        {/* Panel 3 */}
        <div id="panel-3" style={{
          position: 'absolute',
          textAlign: 'center',
          padding: '0 24px',
          opacity: 0
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
            UdaanSathi brings
          </h2>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: '#10b981', margin: '8px 0 24px' }}>
            clarity and calm
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>
            Instant alerts, smart rebooking, and support when you need it most.
          </p>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, textAlign: 'center', color: '#ffffff', marginBottom: 16 }}>
            Everything you need
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8', textAlign: 'center', marginBottom: 64, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Built for passengers who demand clarity in chaos.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {/* Feature 1 */}
            <div className="feature-box" style={{
              padding: 32,
              background: 'rgba(30, 30, 50, 0.6)',
              borderRadius: 16,
              border: '1px solid rgba(99, 102, 241, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Real-time Flight Status</h3>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>Live updates on departures, arrivals, and gate changes across all major airlines.</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-box" style={{
              padding: 32,
              background: 'rgba(30, 30, 50, 0.6)',
              borderRadius: 16,
              border: '1px solid rgba(99, 102, 241, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Instant Cancellation Alerts</h3>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>Be the first to know when your flight is delayed or cancelled. No more surprises.</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-box" style={{
              padding: 32,
              background: 'rgba(30, 30, 50, 0.6)',
              borderRadius: 16,
              border: '1px solid rgba(99, 102, 241, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Disaster Mode Assistance</h3>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>Coordinated support during major disruptions. Priority rebooking and accommodation.</p>
            </div>

            {/* Feature 4 */}
            <div className="feature-box" style={{
              padding: 32,
              background: 'rgba(30, 30, 50, 0.6)',
              borderRadius: 16,
              border: '1px solid rgba(99, 102, 241, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                  <path d="M8 3L4 7l4 4" />
                  <path d="M4 7h16" />
                  <path d="M16 21l4-4-4-4" />
                  <path d="M20 17H4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>Alternative Travel Options</h3>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>Seamless rebooking across flights and trains. Your journey continues, disruption-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section id="cta-section" style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #16213e 50%, #0a0a1a 100%)',
        position: 'relative'
      }}>
        <div className="cta-content" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
            Travel disruptions shouldn't
          </h2>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#ffffff', marginBottom: 24 }}>
            disrupt your peace
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: 40, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Join thousands of passengers who travel with confidence, knowing UdaanSathi has their back.
          </p>
          <SignInButton mode="modal">
            <button className="pulse-btn" style={{
              padding: '18px 40px',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              boxShadow: '0 4px 25px rgba(99, 102, 241, 0.4)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Enter UdaanSathi
              <span style={{ marginLeft: 8 }}>→</span>
            </button>
          </SignInButton>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{
        padding: '48px 24px',
        background: '#0a0a1a',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>UdaanSathi</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>Passenger-first disruption support</p>
          </div>
          <nav style={{ display: 'flex', gap: 32 }}>
            <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; }}>About</a>
            <a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; }}>Contact</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; }}>GitHub</a>
          </nav>
          <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>© {new Date().getFullYear()} UdaanSathi</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
