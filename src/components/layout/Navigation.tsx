import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from '../AuthModal';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle menu animations
  useEffect(() => {
    if (!menuRef.current) return;

    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        gsap.to(menuRef.current, {
          x: '0%',
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out'
        });
      } else {
        gsap.to(menuRef.current, {
          x: '100%',
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in'
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  return (
    <nav 
      ref={navRef}
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="container navbar-container">
        <div className="logo">
          <span className="gradient-text">R17 Gaming</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#tournaments">Tournaments</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {user ? (
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </div>
          ) : (
            <>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
              >
                Login
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
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
            <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
            <li><a href="#tournaments" onClick={() => setIsMenuOpen(false)}>Tournaments</a></li>
            <li><a href="#blog" onClick={() => setIsMenuOpen(false)}>Blog</a></li>
            <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
            <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
            {user ? (
              <li>
                <div className="mobile-user-menu">
                  <span className="user-email">{user.email}</span>
                  <button className="btn btn-secondary" onClick={logout}>Logout</button>
                </div>
              </li>
            ) : (
              <>
                <li>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Register
                  </button>
                </li>
              </>
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

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1rem 0;
          transition: all var(--transition-normal);
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .scrolled {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 0;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: var(--spacing-lg);
        }

        .nav-links a {
          color: var(--text-primary);
          font-weight: 500;
          position: relative;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent-teal);
          transition: width var(--transition-normal);
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .auth-buttons {
          display: flex;
          gap: var(--spacing-md);
          align-items: center;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .user-email {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .mobile-user-menu {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
        }

        .menu-toggle span {
          display: block;
          width: 100%;
          height: 3px;
          background: var(--text-primary);
          border-radius: 3px;
          transition: all 0.3s;
        }

        .menu-toggle.active span:first-child {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .menu-toggle.active span:nth-child(2) {
          opacity: 0;
        }

        .menu-toggle.active span:last-child {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 80%;
          max-width: 400px;
          height: 100vh;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          z-index: 1000;
          padding: 6rem var(--spacing-lg) var(--spacing-lg);
          transform: translateX(100%);
          opacity: 0;
          display: none;
        }

        .mobile-menu ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .mobile-menu a {
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .nav-links, .auth-buttons {
            display: none;
          }

          .menu-toggle {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;