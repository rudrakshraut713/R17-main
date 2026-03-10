import { useState, useEffect, lazy, Suspense } from 'react';
import Navigation from './components/layout/Navigation';
import Hero from './components/layout/Hero';
import TournamentSection from './components/ui/TournamentSection';
import BlogSection from './components/ui/BlogSection';
import AboutSection from './components/ui/AboutSection';
import ContactSection from './components/ui/ContactSection';
import CommunityChat from './components/CommunityChat';
import LiveStreaming from './components/LiveStreaming';
import { auth } from './firebase/config';

// Lazy load components for performance optimization
const ThreeBackground = lazy(() => import('./components/three/ThreeBackground'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const AdminSetup = lazy(() => import('./components/AdminSetup'));

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin and auto-redirect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
      setIsLoading(false);
      
      // Auto-redirect admin users to admin panel
      if (user && !showAdminSetup) {
        setShowAdminPanel(true);
      }
    });

    return () => unsubscribe();
  }, [showAdminSetup]);

  // Check URL for admin setup
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('setup') === 'admin') {
      setShowAdminSetup(true);
    }
  }, []);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Lazy loaded Three.js background */}
      <Suspense fallback={<div className="loading-background"></div>}>
        <ThreeBackground />
      </Suspense>

      {/* Main content */}
      {showAdminSetup ? (
        <Suspense fallback={<div className="loading">Loading admin setup...</div>}>
          <AdminSetup />
        </Suspense>
      ) : showAdminPanel && isAdmin ? (
        <Suspense fallback={<div className="loading">Loading admin panel...</div>}>
          <AdminPanel onBackToWebsite={() => setShowAdminPanel(false)} />
        </Suspense>
      ) : (
        <>
          <Navigation />
          <main>
            <Hero />
            <TournamentSection />
            <BlogSection />
            <LiveStreaming />
            <CommunityChat />
            <AboutSection />
            <ContactSection />
          </main>
          <footer>
            <div className="container">
              <div className="footer-content">
                <div className="footer-logo">
                  <span className="gradient-text">R17 Gaming</span>
                  <p>The ultimate gaming community platform.</p>
                </div>
                <div className="footer-links">
                  <div className="footer-column">
                    <h4>Navigation</h4>
                    <ul>
                      <li><a href="#home">Home</a></li>
                      <li><a href="#tournaments">Tournaments</a></li>
                      <li><a href="#blog">Blog</a></li>
                      <li><a href="#about">About</a></li>
                    </ul>
                  </div>
                  <div className="footer-column">
                    <h4>Legal</h4>
                    <ul>
                      <li><a href="#terms">Terms of Service</a></li>
                      <li><a href="#privacy">Privacy Policy</a></li>
                      <li><a href="#cookies">Cookie Policy</a></li>
                    </ul>
                  </div>
                  <div className="footer-column">
                    <h4>Connect</h4>
                    <ul>
                      <li><a href="#discord">Discord</a></li>
                      <li><a href="#twitter">Twitter</a></li>
                      <li><a href="#instagram">Instagram</a></li>
                      <li><a href="#youtube">YouTube</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2023 R17 Gaming. All rights reserved.</p>
                {isAdmin && !showAdminPanel && (
                  <button 
                    className="admin-link"
                    onClick={() => setShowAdminPanel(true)}
                  >
                    Admin Panel
                  </button>
                )}
              </div>
            </div>
          </footer>
        </>
      )}

      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        main {
          flex: 1;
        }

        .loading-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--bg-dark);
          z-index: -1;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-size: 1.5rem;
          color: var(--accent-blue);
        }

        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-dark);
        }

        footer {
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
          padding: var(--spacing-xl) 0 var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }

        .footer-content {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        .footer-logo {
          flex: 1;
          min-width: 250px;
        }

        .footer-logo span {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: var(--spacing-sm);
          display: inline-block;
        }

        .footer-logo p {
          color: var(--text-secondary);
          margin-top: var(--spacing-sm);
        }

        .footer-links {
          flex: 2;
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xl);
        }

        .footer-column {
          flex: 1;
          min-width: 150px;
        }

        .footer-column h4 {
          margin-bottom: var(--spacing-md);
          color: var(--accent-teal);
        }

        .footer-column ul {
          list-style: none;
        }

        .footer-column li {
          margin-bottom: var(--spacing-sm);
        }

        .footer-column a {
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }

        .footer-column a:hover {
          color: var(--accent-red);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--glass-border);
          color: var(--text-secondary);
        }

        .admin-link {
          background: none;
          border: none;
          color: var(--accent-blue);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .admin-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: var(--spacing-lg);
          }

          .footer-links {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
