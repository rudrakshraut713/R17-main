import { useState, useEffect, lazy, Suspense } from "react";
import Navigation from "./components/layout/Navigation";
import Hero from "./components/layout/Hero";
import TournamentSection from "./components/ui/TournamentSection";
// import BlogSection from "./components/ui/BlogSection";
import AboutSection from "./components/ui/AboutSection";
import ContactSection from "./components/ui/ContactSection";
// import CommunityChat from "./components/CommunityChat";
// import LiveStreaming from "./components/LiveStreaming";
import { auth } from "./firebase/config";
import GameSection from "./components/GameSection";
import GlobalLeaderboard from "./components/GlobalLeaderboard";
import Community from "./components/Community";
import Newsletter from "./components/Newsletter";
import Footer from "./components/ui/Footer";
import CustomCursor from "./components/CustomCursor";
import AnnouncementBar from "./components/ui/AnnouncementBar";

// Lazy load components for performance optimization
// const ThreeBackground = lazy(
//   () => import("./components/three/ThreeBackground"),
// );
const AdminPanel = lazy(() => import("./components/admin/AdminPanel"));
const AdminSetup = lazy(() => import("./components/AdminSetup"));

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
    if (urlParams.get("setup") === "admin") {
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
      {/* <Suspense fallback={<div className="loading-background"></div>}>
        <ThreeBackground />
      </Suspense> */}

      {/* Main content */}
      {showAdminSetup ? (
        <Suspense
          fallback={<div className="loading">Loading admin setup...</div>}
        >
          <AdminSetup />
        </Suspense>
      ) : showAdminPanel && isAdmin ? (
        <Suspense
          fallback={<div className="loading">Loading admin panel...</div>}
        >
          <AdminPanel onBackToWebsite={() => setShowAdminPanel(false)} />
        </Suspense>
      ) : (
        <>
          <CustomCursor />
          <Navigation />
          <main>
            <Hero />
            <AnnouncementBar speed={25} pauseOnHover={true} />
            <TournamentSection />
            <GameSection />
            {/* <BlogSection /> */}
            <GlobalLeaderboard />
            {/* <LiveStreaming /> */}
            {/* <CommunityChat /> */}
            <AboutSection />
            <Community />
            <Newsletter />
            <ContactSection />
            <Footer />
          </main>
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
      `}</style>
    </div>
  );
}

export default App;
