import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../hooks/useAuth';
import gsap from 'gsap';

interface TeamListing {
  id?: string;
  teamName: string;
  game: string;
  description: string;
  requirements: string;
  contactInfo: string;
  createdAt: string;
  createdBy: string;
  logoUrl?: string;
}

interface Application {
  id?: string;
  listingId: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  experience: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const TeamRecruitment = () => {
  const [listings, setListings] = useState<TeamListing[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<TeamListing | null>(null);
  const [message, setMessage] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<string[]>([]);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { documents, addDocument } = useFirestore<TeamListing>('team-listings');
  const { addDocument: addApplication } = useFirestore<Application>('team-applications');

  // Load listings
  useEffect(() => {
    if (documents) {
      const sortedListings = [...documents].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setListings(sortedListings);
      
      // Extract unique games
      const uniqueGames = Array.from(new Set(sortedListings.map(listing => listing.game)));
      setGames(uniqueGames);
      
      setLoading(false);
    }
  }, [documents]);

  // Filter listings by game
  const filteredListings = selectedGame === 'all' 
    ? listings 
    : listings.filter(listing => listing.game === selectedGame);

  // GSAP animations
  useEffect(() => {
    if (sectionRef.current && !loading) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
    
    if (listingsRef.current && filteredListings.length > 0) {
      gsap.fromTo(
        listingsRef.current.children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.1, 
          ease: 'power2.out' 
        }
      );
    }
  }, [filteredListings, loading]);

  // Handle application submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedListing) return;
    
    try {
      const newApplication: Application = {
        listingId: selectedListing.id || '',
        userId: user.uid,
        userName: user.displayName || 'Anonymous User',
        userEmail: user.email || '',
        message,
        experience,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await addApplication(newApplication);
      
      // Reset form and close
      setMessage('');
      setExperience('');
      setShowApplicationForm(false);
      
      alert('Your application has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };

  // Open application form
  const openApplicationForm = (listing: TeamListing) => {
    setSelectedListing(listing);
    setShowApplicationForm(true);
  };

  // Demo data for development
  useEffect(() => {
    if (!documents || documents.length === 0) {
      const demoListings: TeamListing[] = [
        {
          id: '1',
          teamName: 'Phoenix Esports',
          game: 'Valorant',
          description: 'Professional Valorant team looking for talented players to join our roster for upcoming tournaments.',
          requirements: 'Immortal rank or higher, 18+ years old, able to practice 4-5 days per week.',
          contactInfo: 'recruitment@phoenixesports.com',
          createdAt: new Date().toISOString(),
          createdBy: 'Admin',
          logoUrl: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=Phoenix'
        },
        {
          id: '2',
          teamName: 'Omega Gaming',
          game: 'League of Legends',
          description: 'Semi-professional LoL team seeking dedicated players for our competitive roster.',
          requirements: 'Diamond rank or higher, good communication skills, team player mentality.',
          contactInfo: 'join@omegagaming.gg',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          createdBy: 'Admin',
          logoUrl: 'https://via.placeholder.com/150/4169E1/FFFFFF?text=Omega'
        },
        {
          id: '3',
          teamName: 'Nexus Force',
          game: 'Counter-Strike 2',
          description: 'Established CS2 team looking for an AWPer and rifler to complete our roster.',
          requirements: 'Level 8+ Faceit, 2+ years competitive experience, able to attend LAN events.',
          contactInfo: 'team@nexusforce.com',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          createdBy: 'Admin',
          logoUrl: 'https://via.placeholder.com/150/32CD32/FFFFFF?text=Nexus'
        },
        {
          id: '4',
          teamName: 'Quantum Esports',
          game: 'Rocket League',
          description: 'Rocket League team seeking a third player to compete in RLCS qualifiers.',
          requirements: 'Grand Champion rank, previous tournament experience preferred.',
          contactInfo: 'recruit@quantumesports.org',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          createdBy: 'Admin',
          logoUrl: 'https://via.placeholder.com/150/9932CC/FFFFFF?text=Quantum'
        }
      ];
      
      setListings(demoListings);
      
      // Extract unique games
      const uniqueGames = Array.from(new Set(demoListings.map(listing => listing.game)));
      setGames(uniqueGames);
      
      setLoading(false);
    }
  }, [documents, addDocument]);

  if (loading) {
    return (
      <div className="team-recruitment loading">
        <div className="loading-spinner"></div>
        <p>Loading team listings...</p>
        
        <style jsx>{`
          .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top-color: var(--primary-color);
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 1rem;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="team-recruitment" ref={sectionRef}>
      <h2>Team Recruitment</h2>
      
      <div className="filters">
        <div className="game-filter">
          <label>Filter by Game:</label>
          <select 
            value={selectedGame} 
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            <option value="all">All Games</option>
            {games.map((game) => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="listings-container" ref={listingsRef}>
        {filteredListings.length === 0 ? (
          <div className="no-listings">
            <p>No team listings available for this game.</p>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div key={listing.id} className="team-card glass-card">
              <div className="team-header">
                {listing.logoUrl ? (
                  <img src={listing.logoUrl} alt={listing.teamName} className="team-logo" />
                ) : (
                  <div className="team-logo-placeholder">
                    {listing.teamName.charAt(0)}
                  </div>
                )}
                <div className="team-info">
                  <h3>{listing.teamName}</h3>
                  <div className="game-badge">{listing.game}</div>
                </div>
              </div>
              
              <div className="team-description">
                <p>{listing.description}</p>
              </div>
              
              <div className="team-requirements">
                <h4>Requirements:</h4>
                <p>{listing.requirements}</p>
              </div>
              
              <div className="team-contact">
                <p><strong>Contact:</strong> {listing.contactInfo}</p>
              </div>
              
              <div className="team-actions">
                {user ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => openApplicationForm(listing)}
                  >
                    Apply to Join
                  </button>
                ) : (
                  <p className="login-prompt">Please log in to apply</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Application Modal */}
      {showApplicationForm && selectedListing && (
        <div className="application-modal">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h3>Apply to {selectedListing.teamName}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowApplicationForm(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="experience">Your Gaming Experience</label>
                <textarea
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Share your rank, previous teams, tournament experience, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message to the Team</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Why do you want to join this team? What can you bring to the roster?"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Submit Application
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowApplicationForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .team-recruitment {
          padding: 2rem;
          margin: 2rem 0;
        }
        
        h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: var(--primary-color);
          font-size: 2.5rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .filters {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
        }
        
        .game-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .game-filter select {
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: var(--text-primary);
        }
        
        .listings-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .team-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        .team-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .team-logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .team-logo-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }
        
        .team-info {
          flex: 1;
        }
        
        .team-info h3 {
          margin: 0 0 0.5rem 0;
          color: var(--primary-color);
        }
        
        .game-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: rgba(var(--primary-rgb), 0.2);
          color: var(--primary-color);
          border-radius: 0.25rem;
          font-size: 0.8rem;
        }
        
        .team-description {
          margin-bottom: 1rem;
        }
        
        .team-requirements {
          margin-bottom: 1rem;
        }
        
        .team-requirements h4 {
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
        }
        
        .team-contact {
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .team-actions {
          margin-top: auto;
          padding-top: 1rem;
        }
        
        .login-prompt {
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .no-listings {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 0.5rem;
          color: var(--text-secondary);
        }
        
        /* Application Modal */
        .application-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .modal-content {
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .modal-header h3 {
          margin: 0;
          color: var(--primary-color);
        }
        
        .close-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        
        textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: var(--text-primary);
          min-height: 120px;
          resize: vertical;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default TeamRecruitment;