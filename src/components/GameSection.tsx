import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./GameSection.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface GameCard {
  title: string;
  description: string;
  rating: number;
  reviewCount: string;
  tags: string[];
  badge?: string;
  isFeatured?: boolean;
}

const GameSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const games: GameCard[] = [
    {
      title: "SHADOW REALM",
      description:
        "Build agent-based tactical shooters with destructible environments and real-time ranked matchmaking.",
      rating: 4.9,
      reviewCount: "1,000+",
      tags: ["Tactical", "Multiplayer", "Ranked"],
    },
    {
      title: "NEON STRIKE",
      description:
        "B2P player drop-in battle royale set in a neon-lit cyberpunk metropolis. Post-paced, no respawns.",
      rating: 4.7,
      reviewCount: "1,000+",
      tags: ["Battle Royale", "Cyberpunk", "Fast-paced"],
    },
    {
      title: "VOID PROTOCOL",
      description:
        "Modular open-world RPG across 5 post-occupationist continents. TRP: Hours of content.",
      rating: 4.8,
      reviewCount: "1,000+",
      tags: ["VR", "RPG", "Open World"],
      badge: "VR",
    },
    {
      title: "IRON LEGION",
      description:
        "Non-frills competitive PvE walkthrough servers, arcades, and the fairest railing system built.",
      rating: 4.6,
      reviewCount: "1,000+",
      tags: ["PvE", "Competitive", "Arcade"],
    },
    {
      title: "PHANTOM ARENA",
      description:
        "No frills competitive PvE walkthrough servers, arcades, and the fairest railing system built.",
      rating: 4.5,
      reviewCount: "1,000+",
      tags: ["PvP", "Arena", "Competitive"],
    },
  ];

  useEffect(() => {
    // First, ensure cards are visible by default
    if (cardsRef.current) {
      cardsRef.current.forEach((card) => {
        if (card) {
          gsap.set(card, { opacity: 1, y: 0 });
        }
      });
    }

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Subtitle animation
      gsap.from(subtitleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      // Set initial states for cards animation
      gsap.set(cardsRef.current.filter(Boolean), {
        opacity: 0,
        y: 60,
      });

      // Cards stagger animation
      gsap.to(cardsRef.current.filter(Boolean), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Function to render stars based on rating
  const renderStars = (rating: number): JSX.Element[] => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars: JSX.Element[] = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="star filled">
            ★
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="star">
            ☆
          </span>,
        );
      }
    }

    return stars;
  };

  return (
    <section className="game-section" ref={sectionRef}>
      {/* Background Elements */}
      <div className="game-bg-gradient"></div>
      <div className="game-particles"></div>

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 ref={titleRef} className="section-title">
            <span className="title-accent">#</span> FEATURED GAMES
          </h2>
          <p ref={subtitleRef} className="section-subtitle">
            Choose your battlefields. Each title demands a different kind of
            warfare.
          </p>
          <div className="title-divider">
            <span className="divider-line"></span>
            <span className="divider-icon">⚡</span>
            <span className="divider-line"></span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="games-grid">
          {games.map((game, index) => (
            <div
              key={game.title}
              className={`game-card ${index === games.length - 1 ? "featured" : ""}`}
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <div className="card-content">
                {/* Game Badge */}
                {game.badge && (
                  <div className="game-badge">
                    <span className="badge-text">{game.badge}</span>
                  </div>
                )}

                {/* Game Title */}
                <h3 className="game-title">{game.title}</h3>

                {/* Game Description */}
                <p className="game-description">{game.description}</p>

                {/* Game Tags */}
                <div className="game-tags">
                  {game.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Game Rating */}
                <div className="game-rating">
                  <div className="stars">{renderStars(game.rating)}</div>
                  <span className="rating-value">
                    {game.rating.toFixed(1)} / 5
                  </span>
                  <span className="rating-divider">•</span>
                  <span className="review-count">
                    ({game.reviewCount} reviews)
                  </span>
                </div>

                {/* Game CTA */}
                {/* <button className="game-cta">
                  <span>Play Now</span>
                  <svg
                    className="cta-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button> */}
              </div>

              {/* Card Hover Effect */}
              <div className="card-glow"></div>
              <div className="card-corner top-left"></div>
              <div className="card-corner top-right"></div>
              <div className="card-corner bottom-left"></div>
              <div className="card-corner bottom-right"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameSection;
