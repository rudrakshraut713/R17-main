import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFirestore } from '../../hooks/useFirestore';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Tournament card interface
interface Tournament {
  id: string;
  title: string;
  game: string;
  date: string;
  prize: string;
  slots: string;
  registered?: number;
  image: string;
  description?: string;
}

// Tournament card component
const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    // Hover animation
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
        duration: 0.3
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        duration: 0.3
      });
    });
    
    return () => {
      card.removeEventListener('mouseenter', () => {});
      card.removeEventListener('mouseleave', () => {});
    };
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="tournament-card glass-card" ref={cardRef}>
      <div className="card-image">
        <img src={tournament.image} alt={tournament.title} />
        <div className="prize-badge">{tournament.prize}</div>
      </div>
      <div className="card-content">
        <h3>{tournament.title}</h3>
        <div className="game-info">
          <span className="game-name">{tournament.game}</span>
          <span className="game-date">{formatDate(tournament.date)}</span>
        </div>
        <div className="slots-info">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ 
                width: `${tournament.registered && tournament.slots ? 
                  (tournament.registered / parseInt(tournament.slots)) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <span className="slots-text">
            {tournament.registered || 0} / {tournament.slots} slots filled
          </span>
        </div>
        <button className="btn btn-primary register-btn">Register Now</button>
      </div>
      
      <style>{`
        .tournament-card {
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }
        
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .tournament-card:hover .card-image img {
          transform: scale(1.1);
        }
        
        .prize-badge {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          background: var(--accent-red);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          font-weight: bold;
          box-shadow: 0 2px 10px rgba(255, 107, 107, 0.4);
        }
        
        .card-content {
          padding: var(--spacing-lg);
        }
        
        .card-content h3 {
          margin-bottom: var(--spacing-sm);
          font-size: 1.5rem;
        }
        
        .game-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
          color: var(--text-secondary);
        }
        
        .slots-info {
          margin-bottom: var(--spacing-lg);
        }
        
        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: var(--spacing-xs);
        }
        
        .progress {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-teal), var(--accent-blue));
          border-radius: 4px;
        }
        
        .slots-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .register-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

// Registration form component
const RegistrationForm = ({ onClose }: { onClose: () => void }) => {
  const formRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!formRef.current) return;
    
    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out"
    });
  }, []);
  
  return (
    <div className="registration-form-container" onClick={onClose}>
      <div className="registration-form glass-card" ref={formRef} onClick={e => e.stopPropagation()}>
        <h2>Tournament Registration</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your full name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="gamertag">Gamer Tag</label>
            <input type="text" id="gamertag" placeholder="Enter your gamer tag" required />
          </div>
          <div className="form-group">
            <label htmlFor="discord">Discord Username</label>
            <input type="text" id="discord" placeholder="Enter your Discord username" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
      
      <style>{`
        .registration-form-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-md);
        }
        
        .registration-form {
          width: 100%;
          max-width: 500px;
          padding: var(--spacing-xl);
        }
        
        .registration-form h2 {
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }
        
        .form-group {
          margin-bottom: var(--spacing-md);
        }
        
        label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
        }
        
        input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: inherit;
        }
        
        input:focus {
          outline: none;
          border-color: var(--accent-blue);
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: var(--spacing-lg);
        }
      `}</style>
    </div>
  );
};

// Main tournament section component
const TournamentSection = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  // Fetch tournaments from Firestore
  const { documents: tournaments, loading, error } = useFirestore<Tournament>('tournaments');
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      
      // Cards stagger animation
      gsap.from(".tournament-card", {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out"
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, [tournaments]);
  
  return (
    <section className="tournament-section" ref={sectionRef} id="tournaments">
      <div className="container">
        <h2 ref={headingRef}>Upcoming <span className="gradient-text">Tournaments</span></h2>
        <div className="tournaments-grid" ref={cardsRef}>
          {loading ? (
            <div className="loading-message">Loading tournaments...</div>
          ) : error ? (
            <div className="error-message">Error loading tournaments: {error}</div>
          ) : tournaments.length === 0 ? (
            <div className="no-tournaments">
              <p>No tournaments available at the moment.</p>
              <p>Check back soon for exciting gaming events!</p>
            </div>
          ) : (
            tournaments.map(tournament => (
              <TournamentCard 
                key={tournament.id} 
                tournament={tournament} 
              />
            ))
          )}
        </div>
        <div className="view-all-container">
          <button className="btn btn-secondary view-all-btn">View All Tournaments</button>
        </div>
      </div>
      
      {showRegistration && <RegistrationForm onClose={() => setShowRegistration(false)} />}
      
      <style>{`
        .tournament-section {
          padding: var(--spacing-xl) 0;
        }
        
        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: var(--spacing-xl);
        }
        
        .tournaments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        .view-all-container {
          text-align: center;
        }
        
        .view-all-btn {
          padding: 0.75rem 2rem;
        }

        .loading-message, .error-message, .no-tournaments {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--text-secondary);
        }

        .error-message {
          color: var(--accent-red);
        }

        .no-tournaments p {
          margin-bottom: var(--spacing-sm);
        }
        
        @media (max-width: 1024px) {
          .tournaments-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 480px) {
          .tournaments-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default TournamentSection;