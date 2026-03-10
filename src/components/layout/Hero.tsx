import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MarqueeText from '../ui/MarqueeText';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  // Refs for animation targets
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Create GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Initial animations
      const tl = gsap.timeline();
      
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      .from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      }, "-=0.6");
      
      // Floating animation for the gaming character
      gsap.to(imageRef.current, {
        y: "20px",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Parallax scrolling effect
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 200,
        ease: "none"
      });
      
      // Gradient text animation
      gsap.to(".gradient-title", {
        backgroundPosition: "200% center",
        duration: 10,
        repeat: -1,
        ease: "none"
      });
    }, heroRef); // Scope to heroRef
    
    // Cleanup function
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="container">
        <div className="hero-content">
          <div className="marquee-wrapper">
            <MarqueeText text="LEVEL UP YOUR GAMING EXPERIENCE" speed={40} className="hero-marquee" />
          </div>
          <h1 ref={titleRef} className="gradient-title">
            Welcome to <span className="gradient-text">R17 Gaming</span>
          </h1>
          <p ref={subtitleRef}>
            Join the ultimate gaming community and compete in tournaments with players worldwide.
            Experience next-level gaming with our cutting-edge platform.
          </p>
          <div className="cta-buttons" ref={ctaRef}>
            <button className="btn btn-primary btn-animated">Join Tournament</button>
            <button className="btn btn-secondary btn-animated">Explore Games</button>
          </div>
          <div className="marquee-wrapper bottom-marquee">
            <MarqueeText text="TOURNAMENTS • STREAMS • COMMUNITY • EVENTS" speed={30} direction="right" className="hero-marquee" />
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="/gaming-character.svg" 
            alt="Gaming Character" 
            ref={imageRef}
            onError={(e) => {
              // Fallback if image doesn't exist yet
              e.currentTarget.src = "https://placehold.co/400x500/45b7d1/ffffff?text=Gaming+Character";
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: var(--spacing-xl) 0;
        }
        
        .hero-content {
          max-width: 600px;
          z-index: 1;
        }
        
        .gradient-title {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: var(--spacing-lg);
          background: linear-gradient(
            90deg, 
            var(--accent-red), 
            var(--accent-blue), 
            var(--accent-teal), 
            var(--accent-red)
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .hero p {
          font-size: 1.2rem;
          margin-bottom: var(--spacing-lg);
          color: var(--text-secondary);
        }
        
        .cta-buttons {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }
        
        .hero-image {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 40%;
          max-width: 500px;
          z-index: 0;
        }
        
        .hero-image img {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 0 20px rgba(69, 183, 209, 0.3));
        }
        
        @media (max-width: 1024px) {
          .gradient-title {
            font-size: 3rem;
          }
          
          .hero-image {
            width: 35%;
          }
        }
        
        @media (max-width: 768px) {
          .hero {
            text-align: center;
          }
          
          .hero-content {
            max-width: 100%;
          }
          
          .cta-buttons {
            justify-content: center;
          }
          
          .hero-image {
            position: relative;
            width: 70%;
            margin: var(--spacing-xl) auto 0;
          }
        }
        
        @media (max-width: 480px) {
          .gradient-title {
            font-size: 2.5rem;
          }
          
          .cta-buttons {
            flex-direction: column;
          }
          
          .hero-image {
            width: 90%;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;