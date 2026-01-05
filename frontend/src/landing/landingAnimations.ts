import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all cinematic landing page animations
 * Uses GSAP ScrollTrigger for pinned, scrubbed scroll-driven storytelling
 */
export const initializeLandingAnimations = (): void => {
  // Kill any existing ScrollTriggers to prevent conflicts on re-mount
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Set all elements to their final state without animations
    gsap.set(['.hero-title', '.hero-subtitle', '.hero-buttons', '.hero-3d-element'], {
      opacity: 1,
      y: 0,
    });
    return;
  }

  // Mobile detection for performance optimization
  const isMobile = window.innerWidth < 768;

  // ============================================
  // SECTION 1: HERO ENTRANCE ANIMATION (ON LOAD)
  // ============================================
  const heroTimeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
  });

  // Staggered entrance for hero content
  heroTimeline
    .from('.hero-bg-gradient', {
      opacity: 0,
      scale: 1.1,
      duration: 1.5,
      ease: 'power2.out',
    })
    .from(
      '.hero-3d-element',
      {
        opacity: 0,
        scale: 0.8,
        rotationY: -45,
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=1'
    )
    .from(
      '.hero-title',
      {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power4.out',
      },
      '-=0.6'
    )
    .from(
      '.hero-subtitle',
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
      },
      '-=0.5'
    )
    .from(
      '.hero-buttons .hero-btn',
      {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
      },
      '-=0.4'
    )
    .from(
      '.scroll-indicator',
      {
        opacity: 0,
        y: -10,
        duration: 0.5,
      },
      '-=0.2'
    );

  // 3D element idle floating animation
  gsap.to('.hero-3d-element', {
    y: -15,
    rotationY: '+=5',
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Scroll indicator pulse
  gsap.to('.scroll-indicator', {
    y: 8,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // ============================================
  // SECTION 2: PINNED SCROLL-DRIVEN STORY
  // ============================================
  
  // Pin the story section and create a timeline scrubbed by scroll
  const storyTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.story-section',
      start: 'top top',
      end: '+=300%', // Scroll distance for the pinned section
      pin: true,
      scrub: isMobile ? 0.5 : 1, // Faster scrub on mobile
      anticipatePin: 1,
    },
  });

  // Background transition through scroll stages
  storyTimeline
    // Stage 1: Sky to clouds
    .to('.story-bg-layer-1', { opacity: 0, duration: 1 }, 0)
    .to('.story-bg-layer-2', { opacity: 1, duration: 1 }, 0)
    // Story point 1 entrance
    .from('.story-point-1', { opacity: 0, y: 80, duration: 0.5 }, 0)
    .to('.story-point-1', { opacity: 0, y: -60, duration: 0.5 }, 0.8)
    
    // Stage 2: Clouds to airport
    .to('.story-bg-layer-2', { opacity: 0, duration: 1 }, 1)
    .to('.story-bg-layer-3', { opacity: 1, duration: 1 }, 1)
    // Story point 2 entrance
    .from('.story-point-2', { opacity: 0, y: 80, duration: 0.5 }, 1)
    .to('.story-point-2', { opacity: 0, y: -60, duration: 0.5 }, 1.8)
    
    // Stage 3: Airport to airspace
    .to('.story-bg-layer-3', { opacity: 0, duration: 1 }, 2)
    .to('.story-bg-layer-4', { opacity: 1, duration: 1 }, 2)
    // Story point 3 entrance
    .from('.story-point-3', { opacity: 0, y: 80, duration: 0.5 }, 2)
    .to('.story-point-3', { opacity: 1, duration: 0.5 }, 2.5);

  // Parallax layers during story scroll (only on desktop)
  if (!isMobile) {
    gsap.to('.parallax-cloud-1', {
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top top',
        end: '+=300%',
        scrub: 2,
      },
      x: -300,
      ease: 'none',
    });

    gsap.to('.parallax-cloud-2', {
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top top',
        end: '+=300%',
        scrub: 2,
      },
      x: 200,
      ease: 'none',
    });
  }

  // ============================================
  // SECTION 3: FEATURES REVEAL
  // ============================================

  // Each feature card animates in with parallax depth
  gsap.utils.toArray<HTMLElement>('.feature-item').forEach((feature, index) => {
    const direction = index % 2 === 0 ? -1 : 1;
    
    gsap.from(feature, {
      scrollTrigger: {
        trigger: feature,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 0.8,
      },
      opacity: 0,
      x: direction * 60,
      y: 40,
      ease: 'power2.out',
    });
  });

  // Feature icons subtle float
  gsap.utils.toArray<HTMLElement>('.feature-icon').forEach((icon, index) => {
    gsap.to(icon, {
      y: -8,
      duration: 2 + index * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  // ============================================
  // SECTION 4: FINAL CTA
  // ============================================

  gsap.from('.final-cta-content', {
    scrollTrigger: {
      trigger: '.final-cta-section',
      start: 'top 70%',
      end: 'top 30%',
      scrub: 1,
    },
    opacity: 0,
    y: 60,
    scale: 0.95,
    ease: 'power2.out',
  });

  // Final CTA button pulse effect
  gsap.to('.final-cta-button', {
    boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Background gradient shift at final section
  gsap.to('.final-cta-section', {
    scrollTrigger: {
      trigger: '.final-cta-section',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
    },
    '--gradient-intensity': 1,
    ease: 'none',
  });

  // ============================================
  // FOOTER FADE IN
  // ============================================

  gsap.from('.landing-footer', {
    scrollTrigger: {
      trigger: '.landing-footer',
      start: 'top 95%',
      end: 'top 70%',
      scrub: 0.5,
    },
    opacity: 0,
    y: 30,
    ease: 'power2.out',
  });
};

/**
 * Mouse tracking for 3D hero element
 * Creates subtle rotation based on cursor position
 */
export const initMouseTracking = (containerRef: HTMLElement): (() => void) => {
  const element = containerRef.querySelector('.hero-3d-element') as HTMLElement;
  if (!element) return () => {};

  // Check for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const handleMouseMove = (e: MouseEvent): void => {
    const rect = containerRef.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate offset from center (normalized -1 to 1)
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    // Apply subtle rotation (max ±12 degrees)
    gsap.to(element, {
      rotationY: offsetX * 12,
      rotationX: -offsetY * 8,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = (): void => {
    gsap.to(element, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  containerRef.addEventListener('mousemove', handleMouseMove);
  containerRef.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function
  return () => {
    containerRef.removeEventListener('mousemove', handleMouseMove);
    containerRef.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Cleanup all ScrollTrigger instances
 * Call on component unmount or route change
 */
export const cleanupLandingAnimations = (): void => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.killTweensOf('*');
};

/**
 * Refresh ScrollTrigger calculations
 * Call after dynamic content loads or window resize
 */
export const refreshScrollTrigger = (): void => {
  ScrollTrigger.refresh();
};
