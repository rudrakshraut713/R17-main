import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // First, ensure the title is visible by default
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 1, y: 0 });
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set(heroRef.current, {
        perspective: 1000,
        transformStyle: "preserve-3d",
      });

      gsap.fromTo(
        bgRef.current,
        { scale: 1.2 },
        { scale: 1, duration: 2, ease: "power2.out" },
      );

      // Set initial states for animation but ensure they don't hide content
      gsap.set(titleRef.current, { opacity: 0, y: 100 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 50 });
      gsap.set(statsRef.current, { opacity: 0, y: 40 });
      gsap.set(buttonRef.current, { opacity: 0, y: 30, scale: 0.8 });

      // Animate in with a small delay to ensure DOM is ready
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.8",
        )
        .to(
          statsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        );

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: "20%",
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div
        ref={bgRef}
        className="hero-bg"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />

      <div ref={overlayRef} className="hero-overlay" />

      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          DOMINATE THE ARENA
        </h1>

        <p ref={subtitleRef} className="hero-subtitle">
          Elite competitive gaming. Forge your legacy. Rise through the ranks
          and claim glory in the world's most intense tournaments.
        </p>

        {/* Stats Grid - Perfectly Centered */}
        <div ref={statsRef} className="stats-wrapper">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">4.2M</span>
              <span className="stat-label">ACTIVE PLAYERS</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">$2.8M</span>
              <span className="stat-label">PRIZE POOL</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">340+</span>
              <span className="stat-label">TOURNAMENTS</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {/* <div ref={buttonRef} className="button-wrapper">
          <button className="btn-view-tournaments">
            VIEW TOURNAMENTS
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
