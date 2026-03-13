import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useAuth } from "../../hooks/useAuth";
import AuthModal from "../AuthModal";
import "./Navigation.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const { user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle menu animations
  useEffect(() => {
    if (!menuRef.current) return;

    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        // Animate menu in
        gsap.to(menuRef.current, {
          x: "0%",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        });

        // Animate menu items
        gsap.fromTo(
          ".mobile-menu li",
          {
            opacity: 0,
            x: 50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3,
          },
        );
      } else {
        // Animate menu out
        gsap.to(menuRef.current, {
          x: "100%",
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  // Initial animation for nav items
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate logo
      gsap.from(logoRef.current, {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Animate nav items
      gsap.from(navItemsRef.current.filter(Boolean), {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });

      // Animate auth buttons
      gsap.from(".auth-buttons", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power2.out",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Hover animations for nav items
  const handleNavHover = (index: number, isEnter: boolean) => {
    if (navItemsRef.current[index]) {
      gsap.to(navItemsRef.current[index], {
        y: isEnter ? -2 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const navItems = [
    { label: "GAMES", href: "#games" },
    { label: "TOURNAMENTS", href: "#tournaments" },
    { label: "LEADERBOARD", href: "#leaderboard" },
    { label: "COMMUNITY", href: "#community" },
    { label: "NEWSLETTER", href: "#newsletter" },
  ];

  return (
    <nav ref={navRef} className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container">
        <div className="logo" ref={logoRef}>
          <span className="gradient-text">R17</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          {navItems.map((item, index) => (
            <li
              key={item.label}
              ref={(el) => (navItemsRef.current[index] = el)}
              onMouseEnter={() => handleNavHover(index, true)}
              onMouseLeave={() => handleNavHover(index, false)}
            >
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        {/* Auth Button */}
        <div className="auth-buttons">
          {user ? (
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn-pury"
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
            >
              <span className="btn-pury-text">Login</span>
              <svg
                className="btn-pury-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M13 7l5 5-5 5M6 12h12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div className="mobile-menu" ref={menuRef}>
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            {user ? (
              <li className="mobile-user-item">
                <div className="mobile-user-menu">
                  <span className="user-email">{user.email}</span>
                  <button className="btn btn-secondary" onClick={logout}>
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <li className="mobile-pury-item">
                <button
                  className="btn-pury mobile-pury"
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="btn-pury-text">Login</span>
                  <svg
                    className="btn-pury-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M13 7l5 5-5 5M6 12h12"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </nav>
  );
};

export default Navigation;
