import { useState, useEffect, useRef } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";
import gsap from "gsap";
import "./Community.css";

interface Testimonial {
  id?: string;
  name: string;
  username: string;
  game: string;
  gameIcon?: string;
  avatar?: string;
  rating: number;
  text: string;
  highlight: string;
  platform?: string;
  isFeatured?: boolean;
}

interface CommunityProps {
  isAdmin?: boolean;
  onSave?: (testimonials: Testimonial[]) => void;
}

const Community: React.FC<CommunityProps> = ({ isAdmin = false, onSave }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTestimonials, setEditTestimonials] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    name: "",
    username: "",
    game: "",
    gameIcon: "🎮",
    avatar: "",
    rating: 5,
    text: "",
    highlight: "",
    platform: "",
    isFeatured: false
  });

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { documents } = useFirestore<Testimonial>("testimonials");

  // Check if user is admin
  const isUserAdmin = isAdmin || user?.email === 'admin@r17.com';

  // Demo data from image - exactly 6 testimonials
  const demoTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Zephyrx",
      username: "@zephyrx_pro",
      game: "Shadow Realm",
      gameIcon: "👻",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      text: "R7 completely changed how I approach competitive gaming. The tournament system is flawless and prize payouts are always on time. Addicted since day one.",
      highlight: "tournament system is flawless",
      platform: "Shadow Realm"
    },
    {
      id: "2",
      name: "NovaBurst",
      username: "novaburst.eu",
      game: "Cyber Siege",
      gameIcon: "🤖",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 5,
      text: "Nothing comes close to the competition here. I've been in esports for 8 years and R17 has the best infrastructure I've ever played on. Period.",
      highlight: "best infrastructure I've ever played on",
      platform: "Cyber Siege"
    },
    {
      id: "3",
      name: "KryptonPeak",
      username: "@kryptonpeak",
      game: "Iron Legion",
      gameIcon: "⚔️",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      text: "I went from casual to winning my first $10K tournament in three months. The ranked system genuinely pushes you to improve every single match.",
      highlight: "winning my first $10K tournament",
      platform: "Iron Legion"
    },
    {
      id: "4",
      name: "SolarWarden",
      username: "@solarwarden",
      game: "Neon Strike",
      gameIcon: "⚡",
      avatar: "https://i.pravatar.cc/150?img=4",
      rating: 4,
      text: "The matchmaking is incredibly fair. Never felt thrown into impossible games. Steady climb up the leaderboard since joining six months ago.",
      highlight: "incredibly fair matchmaking",
      platform: "Neon Strike"
    },
    {
      id: "5",
      name: "VoidHunter",
      username: "voidhunter.de",
      game: "Void Protocol",
      gameIcon: "🌌",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      text: "Community events, weekly tournaments, daily challenges - there's always something happening. This platform has everything a competitive player needs.",
      highlight: "everything a competitive player needs",
      platform: "Void Protocol"
    },
    {
      id: "6",
      name: "PhantomAce",
      username: "@phantomace_in",
      game: "Phantom Arena",
      gameIcon: "👤",
      avatar: "https://i.pravatar.cc/150?img=6",
      rating: 5,
      text: "As a streamer, the spectator mode is unreal. My viewers see live stats in real-time. Completely game-changing feature I haven't seen built this well anywhere else.",
      highlight: "spectator mode is unreal",
      platform: "Phantom Arena"
    }
  ];

  // Initialize with demo data immediately
  useEffect(() => {
    if (documents && documents.length > 0) {
      setTestimonials(documents);
      setEditTestimonials(documents);
    } else {
      setTestimonials(demoTestimonials);
      setEditTestimonials(demoTestimonials);
    }
  }, [documents]);

  // Filter testimonials
  const filteredTestimonials = (isEditing ? editTestimonials : testimonials).filter(t => {
    if (activeFilter === "all") return true;
    return t.game.toLowerCase().includes(activeFilter.toLowerCase()) || 
           t.platform?.toLowerCase().includes(activeFilter.toLowerCase());
  });

  // Auto-slide effect
  useEffect(() => {
    if (filteredTestimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredTestimonials.length]);

  // Slide animation
  useEffect(() => {
    if (cardsWrapperRef.current && filteredTestimonials.length > 0) {
      gsap.to(cardsWrapperRef.current, {
        x: `-${currentIndex * 100}%`,
        duration: 0.8,
        ease: "power3.inOut"
      });
    }
  }, [currentIndex, filteredTestimonials.length]);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
      });

      gsap.from(cardsContainerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Render stars
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  // Admin functions
  const handleEdit = () => {
    setEditTestimonials(JSON.parse(JSON.stringify(testimonials)));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditTestimonials(testimonials);
    setIsEditing(false);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSave = async () => {
    try {
      for (const testimonial of editTestimonials) {
        if (testimonial.id) {
          // await updateDocument(testimonial.id, testimonial);
        } else {
          // await addDocument(testimonial);
        }
      }
      
      setTestimonials(editTestimonials);
      setIsEditing(false);
      setEditingId(null);
      setShowAddForm(false);
      
      if (onSave) {
        onSave(editTestimonials);
      }
    } catch (error) {
      console.error('Error saving testimonials:', error);
    }
  };

  const handleTestimonialChange = (id: string, field: keyof Testimonial, value: any) => {
    setEditTestimonials(prev => 
      prev.map(t => t.id === id ? { ...t, [field]: value } : t)
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setEditTestimonials(prev => prev.filter(t => t.id !== id));
      if (currentIndex >= editTestimonials.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  const handleAdd = () => {
    if (!newTestimonial.name || !newTestimonial.text || !newTestimonial.game) {
      alert('Please fill in all required fields');
      return;
    }

    const testimonialToAdd: Testimonial = {
      ...newTestimonial as Testimonial,
      id: Date.now().toString(),
      rating: newTestimonial.rating || 5
    };

    setEditTestimonials(prev => [...prev, testimonialToAdd]);
    setShowAddForm(false);
    setNewTestimonial({
      name: "",
      username: "",
      game: "",
      gameIcon: "🎮",
      avatar: "",
      rating: 5,
      text: "",
      highlight: "",
      platform: "",
      isFeatured: false
    });
  };

  // Get unique games for filter
  const uniqueGames = Array.from(new Set(testimonials.map(t => t.game)));

  return (
    <section className="community" ref={sectionRef}>
      {/* Background Effects */}
      <div className="community-bg-gradient"></div>
      <div className="community-particles"></div>

      <div className="community-container">
        {/* Header */}
        <div className="community-header">
          <h2 ref={titleRef} className="community-title">
            <span className="title-accent">#</span> COMMUNITY
          </h2>
          <p ref={subtitleRef} className="community-subtitle">
            WHAT PLAYERS SAY
          </p>
          <div className="title-divider">
            <span className="divider-line"></span>
            <span className="divider-icon">💬</span>
            <span className="divider-line"></span>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Players
            </button>
            {uniqueGames.map(game => (
              <button
                key={game}
                className={`filter-btn ${activeFilter === game ? 'active' : ''}`}
                onClick={() => setActiveFilter(game)}
              >
                {game}
              </button>
            ))}
          </div>

          {/* Admin Controls */}
          {isUserAdmin && !isEditing && (
            <button className="admin-edit-btn" onClick={handleEdit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 3l4 4-7 7H10v-4l7-7z" strokeWidth="2"/>
                <path d="M4 20h16" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Edit Testimonials
            </button>
          )}

          {isUserAdmin && isEditing && (
            <div className="admin-edit-bar">
              <button className="admin-save-btn" onClick={handleSave}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Save Changes
              </button>
              <button className="admin-cancel-btn" onClick={handleCancel}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Cancel
              </button>
              <button className="admin-add-btn" onClick={() => setShowAddForm(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Add Testimonial
              </button>
            </div>
          )}
        </div>

        {/* Add Form */}
        {isUserAdmin && showAddForm && (
          <div className="add-form">
            <h3>Add New Testimonial</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  placeholder="Player name"
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={newTestimonial.username}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, username: e.target.value })}
                  placeholder="@username or username"
                />
              </div>
              <div className="form-group">
                <label>Game *</label>
                <input
                  type="text"
                  value={newTestimonial.game}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, game: e.target.value })}
                  placeholder="Game name"
                />
              </div>
              <div className="form-group">
                <label>Game Icon</label>
                <input
                  type="text"
                  value={newTestimonial.gameIcon}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, gameIcon: e.target.value })}
                  placeholder="🎮"
                />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="text"
                  value={newTestimonial.avatar}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar: e.target.value })}
                  placeholder="Avatar image URL"
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Testimonial Text *</label>
                <textarea
                  value={newTestimonial.text}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                  placeholder="What they say..."
                  rows={3}
                />
              </div>
              <div className="form-group full-width">
                <label>Highlight Text</label>
                <input
                  type="text"
                  value={newTestimonial.highlight}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, highlight: e.target.value })}
                  placeholder="Highlighted part of the text"
                />
              </div>
              <div className="form-group full-width">
                <label>Platform</label>
                <input
                  type="text"
                  value={newTestimonial.platform}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, platform: e.target.value })}
                  placeholder="Platform/Game"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="form-save-btn" onClick={handleAdd}>
                Add Testimonial
              </button>
              <button className="form-cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Sliding Cards - Always Visible */}
        {filteredTestimonials.length > 0 && (
          <div className="cards-container" ref={cardsContainerRef}>
            <div className="cards-wrapper" ref={cardsWrapperRef}>
              {(isEditing ? editTestimonials : testimonials)
                .filter(t => activeFilter === "all" || t.game === activeFilter)
                .map((testimonial, idx) => (
                <div 
                  key={testimonial.id} 
                  className={`testimonial-card ${isEditing && editingId === testimonial.id ? 'editing' : ''}`}
                >
                  {isEditing && (
                    <div className="card-admin-controls">
                      <button 
                        className="card-edit-btn"
                        onClick={() => setEditingId(testimonial.id!)}
                      >
                        ✎
                      </button>
                      <button 
                        className="card-delete-btn"
                        onClick={() => handleDelete(testimonial.id!)}
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {isEditing && editingId === testimonial.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => handleTestimonialChange(testimonial.id!, 'name', e.target.value)}
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={testimonial.username}
                        onChange={(e) => handleTestimonialChange(testimonial.id!, 'username', e.target.value)}
                        placeholder="Username"
                      />
                      <input
                        type="text"
                        value={testimonial.game}
                        onChange={(e) => handleTestimonialChange(testimonial.id!, 'game', e.target.value)}
                        placeholder="Game"
                      />
                      <select
                        value={testimonial.rating}
                        onChange={(e) => handleTestimonialChange(testimonial.id!, 'rating', parseInt(e.target.value))}
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                      </select>
                      <textarea
                        value={testimonial.text}
                        onChange={(e) => handleTestimonialChange(testimonial.id!, 'text', e.target.value)}
                        placeholder="Testimonial text"
                        rows={3}
                      />
                      <input
                        type="text"
                        value={testimonial.highlight}
                        onChange={(e) => handleTestimonialChange(testimonial.id!, 'highlight', e.target.value)}
                        placeholder="Highlight"
                      />
                      <button 
                        className="edit-done-btn"
                        onClick={() => setEditingId(null)}
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Rating */}
                      <div className="card-rating">
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Testimonial Text */}
                      <p className="card-text">
                        {testimonial.text.split(testimonial.highlight).map((part, i, arr) => {
                          if (i < arr.length - 1) {
                            return (
                              <span key={i}>
                                {part}
                                <span className="text-highlight">{testimonial.highlight}</span>
                              </span>
                            );
                          }
                          return part;
                        })}
                      </p>

                      {/* Player Info */}
                      <div className="player-info">
                        <div className="player-avatar">
                          {testimonial.avatar ? (
                            <img src={testimonial.avatar} alt={testimonial.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {testimonial.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="player-details">
                          <h4 className="player-name">{testimonial.name}</h4>
                          <p className="player-username">{testimonial.username}</p>
                          <p className="player-game">
                            <span className="game-icon">{testimonial.gameIcon || '🎮'}</span>
                            {testimonial.game}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Slide Indicators - Exactly 6 dots for 6 testimonials */}
            <div className="slide-indicators">
              {filteredTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              className="nav-arrow prev"
              onClick={() => setCurrentIndex(prev => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length)}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button 
              className="nav-arrow next"
              onClick={() => setCurrentIndex(prev => (prev + 1) % filteredTestimonials.length)}
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Community;