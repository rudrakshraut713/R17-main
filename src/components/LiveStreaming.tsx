import { useState, useEffect, useRef } from "react";
import { useFirestore } from "../hooks/useFirestore";
import gsap from "gsap";
import "./LiveStreaming.css";

interface Stream {
  id?: string;
  title: string;
  description: string;
  streamUrl: string;
  game: string;
  gameIcon?: string;
  streamer: string;
  streamerAvatar?: string;
  thumbnailUrl?: string;
  isLive: boolean;
  viewerCount: number;
  startTime: string;
  tags?: string[];
  tournament?: string;
}

const LiveStreaming = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");

  const sectionRef = useRef<HTMLDivElement>(null);
  const mainStreamRef = useRef<HTMLDivElement>(null);
  const streamListRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { documents, loading: firestoreLoading } =
    useFirestore<Stream>("streams");

  // Load streams
  useEffect(() => {
    if (documents && documents.length > 0) {
      const liveStreams = documents.filter((stream) => stream.isLive);
      const upcomingStreams = documents.filter((stream) => !stream.isLive);

      const sortedStreams = [
        ...liveStreams.sort((a, b) => b.viewerCount - a.viewerCount),
        ...upcomingStreams.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ),
      ];

      setStreams(sortedStreams);

      if (sortedStreams.length > 0 && !activeStream) {
        setActiveStream(sortedStreams[0]);
      }
    } else {
      // Demo data
      const demoStreams: Stream[] = [
        {
          id: "1",
          title: "R17 Championship Finals",
          description:
            "The ultimate showdown between Team Alpha and Team Omega for the R17 Championship title and $100,000 prize pool!",
          streamUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
          game: "Valorant",
          gameIcon: "🔫",
          streamer: "R17Official",
          streamerAvatar: "https://i.pravatar.cc/150?img=1",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
          isLive: true,
          viewerCount: 15245,
          startTime: new Date().toISOString(),
          tags: ["Finals", "Tournament", "Championship"],
          tournament: "R17 Championship",
        },
        {
          id: "2",
          title: "Pro Scrims - Team Tactics",
          description:
            "Professional teams practicing new strategies and team compositions ahead of the major tournament.",
          streamUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
          game: "League of Legends",
          gameIcon: "⚔️",
          streamer: "ProLeagueTV",
          streamerAvatar: "https://i.pravatar.cc/150?img=2",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
          isLive: true,
          viewerCount: 8876,
          startTime: new Date().toISOString(),
          tags: ["Scrims", "Practice", "Pro Play"],
          tournament: "Pro League",
        },
        {
          id: "3",
          title: "Regional Qualifiers - EU West",
          description:
            "Regional qualifiers for the upcoming international tournament. Top 2 teams advance to the grand finals.",
          streamUrl: "https://www.youtube.com/embed/DWcJFNfaw9c",
          game: "Counter-Strike 2",
          gameIcon: "🎯",
          streamer: "ESportsCentral",
          streamerAvatar: "https://i.pravatar.cc/150?img=3",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
          isLive: true,
          viewerCount: 6543,
          startTime: new Date().toISOString(),
          tags: ["Qualifiers", "EU", "CS2"],
          tournament: "World Championship",
        },
        {
          id: "4",
          title: "Upcoming: Regional Qualifiers - NA East",
          description:
            "North American regional qualifiers for the international tournament.",
          streamUrl: "https://www.youtube.com/embed/DWcJFNfaw9c",
          game: "Counter-Strike 2",
          gameIcon: "🎯",
          streamer: "ESportsCentral",
          streamerAvatar: "https://i.pravatar.cc/150?img=4",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
          isLive: false,
          viewerCount: 0,
          startTime: new Date(Date.now() + 86400000).toISOString(),
          tags: ["Qualifiers", "NA", "CS2"],
          tournament: "World Championship",
        },
        {
          id: "5",
          title: "Upcoming: R17 Show Match",
          description:
            "Special show match featuring top streamers and pro players.",
          streamUrl: "https://www.youtube.com/embed/DWcJFNfaw9c",
          game: "Valorant",
          gameIcon: "🔫",
          streamer: "R17Official",
          streamerAvatar: "https://i.pravatar.cc/150?img=5",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
          isLive: false,
          viewerCount: 0,
          startTime: new Date(Date.now() + 172800000).toISOString(),
          tags: ["Show Match", "Celebrity", "Fun"],
          tournament: "R17 Special",
        },
      ];

      setStreams(demoStreams);
      setActiveStream(demoStreams[0]);
    }
    setLoading(firestoreLoading);
  }, [documents]);

  // Filter streams
  const filteredStreams = streams.filter((stream) => {
    if (filter === "live") return stream.isLive;
    if (filter === "upcoming") return !stream.isLive;
    return true;
  });

  // GSAP animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(mainStreamRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      });

      if (streamListRef.current && filteredStreams.length > 0) {
        gsap.from(streamListRef.current.children, {
          x: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredStreams, loading]);

  // Format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date
  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Format viewer count
  const formatViewers = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="live-streaming loading">
        <div className="loading-spinner"></div>
        <p>Loading streams...</p>
      </div>
    );
  }

  return (
    <section className="live-streaming" ref={sectionRef}>
      {/* Background Effects */}
      <div className="stream-bg-gradient"></div>
      <div className="stream-particles"></div>

      <div className="live-container">
        {/* Header */}
        <div className="stream-header" ref={titleRef}>
          <div className="header-content">
            <h2 className="section-title">
              <span className="title-accent">⚡</span> LIVE & UPCOMING
            </h2>
            <p className="section-subtitle">
              Watch the best tournaments, matches, and streams live
            </p>
            <div className="title-divider">
              <span className="divider-line"></span>
              <span className="divider-icon">🎮</span>
              <span className="divider-line"></span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Streams
            </button>
            <button
              className={`filter-btn ${filter === "live" ? "active" : ""}`}
              onClick={() => setFilter("live")}
            >
              <span className="live-dot"></span>
              Live Now
            </button>
            <button
              className={`filter-btn ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              <span className="upcoming-icon">📅</span>
              Upcoming
            </button>
          </div>
        </div>

        {/* Streaming Content */}
        {activeStream && (
          <div className="streaming-container">
            {/* Main Stream */}
            <div className="main-stream" ref={mainStreamRef}>
              <div className="stream-video">
                <iframe
                  src={activeStream.streamUrl}
                  title={activeStream.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                {/* Overlay Badges */}
                <div className="video-overlay">
                  {activeStream.isLive ? (
                    <div className="live-badge">
                      <span className="live-indicator"></span>
                      LIVE
                    </div>
                  ) : (
                    <div className="upcoming-badge">
                      <span className="upcoming-indicator">📅</span>
                      STARTS {formatDate(activeStream.startTime).toUpperCase()}
                    </div>
                  )}

                  <div className="stream-stats">
                    {activeStream.isLive ? (
                      <div className="viewer-count">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            strokeWidth="2"
                          />
                          <circle cx="12" cy="12" r="3" strokeWidth="2" />
                        </svg>
                        {formatViewers(activeStream.viewerCount)} watching
                      </div>
                    ) : (
                      <div className="start-time">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path d="M12 6v6l4 2" strokeWidth="2" />
                        </svg>
                        {formatTime(activeStream.startTime)}
                      </div>
                    )}

                    {activeStream.tournament && (
                      <div className="tournament-badge">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" />
                          <path d="M2 17l10 5 10-5" strokeWidth="2" />
                          <path d="M2 12l10 5 10-5" strokeWidth="2" />
                        </svg>
                        {activeStream.tournament}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="stream-info">
                <div className="streamer-info">
                  {activeStream.streamerAvatar && (
                    <img
                      src={activeStream.streamerAvatar}
                      alt={activeStream.streamer}
                      className="streamer-avatar"
                    />
                  )}
                  <div className="streamer-details">
                    <h3 className="stream-title">{activeStream.title}</h3>
                    <div className="stream-meta">
                      <span className="game">
                        <span className="game-icon">
                          {activeStream.gameIcon || "🎮"}
                        </span>
                        {activeStream.game}
                      </span>
                      <span className="streamer-name">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                            strokeWidth="2"
                          />
                          <circle cx="12" cy="7" r="4" strokeWidth="2" />
                        </svg>
                        {activeStream.streamer}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="stream-description">{activeStream.description}</p>

                {activeStream.tags && (
                  <div className="stream-tags">
                    {activeStream.tags.map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stream List */}
            <div className="stream-list-container">
              <div className="stream-list-header">
                <h3>
                  {filter === "live"
                    ? "🔴 LIVE STREAMS"
                    : filter === "upcoming"
                      ? "📅 UPCOMING"
                      : "📺 ALL STREAMS"}
                </h3>
                <span className="stream-count">{filteredStreams.length}</span>
              </div>

              <div className="stream-list" ref={streamListRef}>
                {filteredStreams.length === 0 ? (
                  <div className="no-streams">
                    <p>No streams available</p>
                  </div>
                ) : (
                  filteredStreams.map((stream) => (
                    <div
                      key={stream.id}
                      className={`stream-item ${activeStream?.id === stream.id ? "active" : ""}`}
                      onClick={() => setActiveStream(stream)}
                    >
                      <div className="stream-thumbnail">
                        <img src={stream.thumbnailUrl} alt={stream.title} />

                        {/* Thumbnail Overlay */}
                        <div className="thumbnail-overlay">
                          {stream.isLive ? (
                            <div className="thumbnail-live">
                              <span className="live-dot"></span>
                              LIVE
                            </div>
                          ) : (
                            <div className="thumbnail-upcoming">
                              {formatDate(stream.startTime)}
                            </div>
                          )}

                          {stream.isLive && (
                            <div className="thumbnail-viewers">
                              {formatViewers(stream.viewerCount)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="stream-item-info">
                        <h4 className="stream-item-title">{stream.title}</h4>

                        <div className="stream-item-meta">
                          <span className="item-game">
                            <span className="game-icon">
                              {stream.gameIcon || "🎮"}
                            </span>
                            {stream.game}
                          </span>
                          <span className="item-streamer">
                            {stream.streamer}
                          </span>
                        </div>

                        {stream.tournament && (
                          <div className="item-tournament">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            </svg>
                            {stream.tournament}
                          </div>
                        )}
                      </div>

                      {/* Active Indicator */}
                      {activeStream?.id === stream.id && (
                        <div className="active-indicator"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveStreaming;
