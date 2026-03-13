import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./GlobalLeaderboard.css";

gsap.registerPlugin(ScrollTrigger);

// Types
interface Player {
  id: string;
  rank: number;
  name: string;
  country: string;
  countryCode: string;
  score: number;
  kd: number;
  isActive?: boolean;
}

interface GameStat {
  name: string;
  players: string;
  icon?: string;
}

interface LiveEvent {
  title: string;
  tournaments: number;
  finalsToday: number;
  isLive: boolean;
}

interface LeaderboardData {
  players: Player[];
  topGames: GameStat[];
  liveEvents: LiveEvent[];
}

interface GlobalLeaderboardProps {
  isAdmin?: boolean;
  onSave?: (data: LeaderboardData) => void;
  initialData?: LeaderboardData;
}

const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  isAdmin = false,
  onSave,
  initialData,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  // State for leaderboard data
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>(
    () => {
      if (initialData) return initialData;

      // Default data
      return {
        players: [
          {
            id: "1",
            rank: 1,
            name: "ZephyrX",
            country: "South Korea",
            countryCode: "kr",
            score: 98420,
            kd: 4.8,
            isActive: true,
          },
          {
            id: "2",
            rank: 2,
            name: "NovaBurst",
            country: "Sweden",
            countryCode: "se",
            score: 94105,
            kd: 4.3,
            isActive: true,
          },
          {
            id: "3",
            rank: 3,
            name: "RT7_Ghost",
            country: "Brazil",
            countryCode: "br",
            score: 91692,
            kd: 4.1,
            isActive: true,
          },
          {
            id: "4",
            rank: 4,
            name: "StrikeFury",
            country: "USA",
            countryCode: "us",
            score: 83340,
            kd: 3.9,
            isActive: true,
          },
          {
            id: "5",
            rank: 5,
            name: "VoidHunter",
            country: "Germany",
            countryCode: "de",
            score: 66720,
            kd: 3.7,
            isActive: false,
          },
          {
            id: "6",
            rank: 6,
            name: "PhantomAce",
            country: "Japan",
            countryCode: "jp",
            score: 84120,
            kd: 3.5,
            isActive: true,
          },
        ],
        topGames: [
          { name: "Shadow Realm", players: "1.4M", icon: "👻" },
          { name: "Cyber Siege", players: "583K", icon: "🤖" },
          { name: "Neon Strike", players: "823K", icon: "⚡" },
          { name: "Iron Legion", players: "542K", icon: "⚔️" },
          { name: "Void Protocol", players: "462K", icon: "🌌" },
          { name: "Phantom Arena", players: "233K", icon: "👤" },
        ],
        liveEvents: [
          {
            title: "BABOLIVE",
            tournaments: 34,
            finalsToday: 14,
            isLive: true,
          },
        ],
      };
    },
  );

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<LeaderboardData>(leaderboardData);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editingGame, setEditingGame] = useState<number | null>(null);
  const [editingLive, setEditingLive] = useState(false);

  useEffect(() => {
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

      // Leaderboard animation
      gsap.from(leaderboardRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // Games stats animation
      gsap.from(gamesRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        x: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      });

      // Live events animation
      gsap.from(liveRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleEdit = () => {
    setEditData(leaderboardData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setLeaderboardData(editData);
    setIsEditing(false);
    setEditingPlayer(null);
    setEditingGame(null);
    setEditingLive(false);
    if (onSave) {
      onSave(editData);
    }
  };

  const handleCancel = () => {
    setEditData(leaderboardData);
    setIsEditing(false);
    setEditingPlayer(null);
    setEditingGame(null);
    setEditingLive(false);
  };

  const handlePlayerChange = (
    playerId: string,
    field: keyof Player,
    value: any,
  ) => {
    setEditData((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleGameChange = (
    index: number,
    field: keyof GameStat,
    value: string,
  ) => {
    setEditData((prev) => ({
      ...prev,
      topGames: prev.topGames.map((g, i) =>
        i === index ? { ...g, [field]: value } : g,
      ),
    }));
  };

  const handleLiveChange = (field: keyof LiveEvent, value: any) => {
    setEditData((prev) => ({
      ...prev,
      liveEvents: prev.liveEvents.map((e, i) =>
        i === 0 ? { ...e, [field]: value } : e,
      ),
    }));
  };

  const addNewPlayer = () => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      rank: editData.players.length + 1,
      name: "New Player",
      country: "International",
      countryCode: "int",
      score: 0,
      kd: 0,
      isActive: true,
    };
    setEditData((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
    setEditingPlayer(newPlayer.id);
  };

  const deletePlayer = (playerId: string) => {
    setEditData((prev) => ({
      ...prev,
      players: prev.players
        .filter((p) => p.id !== playerId)
        .map((p, idx) => ({ ...p, rank: idx + 1 })),
    }));
  };

  //   const addNewGame = () => {
  //     const newGame: GameStat = {
  //       name: "New Game",
  //       players: "0",
  //       icon: "🎮",
  //     };
  //     setEditData((prev) => ({
  //       ...prev,
  //       topGames: [...prev.topGames, newGame],
  //     }));
  //     setEditingGame(prev.topGames.length);
  //   };

  const deleteGame = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      topGames: prev.topGames.filter((_, i) => i !== index),
    }));
  };

  // Country flags mapping
  const getCountryFlag = (code: string): string => {
    const flags: Record<string, string> = {
      kr: "🇰🇷",
      se: "🇸🇪",
      br: "🇧🇷",
      us: "🇺🇸",
      de: "🇩🇪",
      jp: "🇯🇵",
      int: "🌐",
    };
    return flags[code] || "🏁";
  };

  return (
    <section className="leaderboard-section" ref={sectionRef}>
      {/* Background Elements */}
      <div className="leaderboard-bg-gradient"></div>
      <div className="leaderboard-particles"></div>

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 ref={titleRef} className="section-title">
            <span className="title-accent">#</span> GLOBAL LEADERBOARD
          </h2>
          <p ref={subtitleRef} className="section-subtitle">
            The best of the best. Where do you stand?
          </p>
          <div className="title-divider">
            <span className="divider-line"></span>
            <span className="divider-icon">🏆</span>
            <span className="divider-line"></span>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && !isEditing && (
          <div className="admin-controls">
            <button className="admin-edit-btn" onClick={handleEdit}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 3l4 4-7 7H10v-4l7-7z" strokeWidth="2" />
                <path d="M4 20h16" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Edit Leaderboard
            </button>
          </div>
        )}

        {isAdmin && isEditing && (
          <div className="admin-edit-bar">
            <button className="admin-save-btn" onClick={handleSave}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Save Changes
            </button>
            <button className="admin-cancel-btn" onClick={handleCancel}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Cancel
            </button>
          </div>
        )}

        <div className="leaderboard-grid">
          {/* Main Leaderboard */}
          <div className="leaderboard-main" ref={leaderboardRef}>
            <div className="leaderboard-header">
              <span className="rank">#</span>
              <span className="player">PLAYER</span>
              <span className="score">SCORE</span>
              <span className="kd">K/D</span>
              {isAdmin && isEditing && <span className="actions">ACTIONS</span>}
            </div>

            <div className="leaderboard-rows">
              {(isEditing ? editData.players : leaderboardData.players).map(
                (player) => (
                  <div
                    key={player.id}
                    className={`leaderboard-row ${player.isActive ? "active" : ""} ${editingPlayer === player.id ? "editing" : ""}`}
                  >
                    <span className="rank">
                      #{player.rank.toString().padStart(2, "0")}
                    </span>

                    <div className="player-info">
                      <span className="player-flag">
                        {getCountryFlag(player.countryCode)}
                      </span>
                      {isEditing && editingPlayer === player.id ? (
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) =>
                            handlePlayerChange(
                              player.id,
                              "name",
                              e.target.value,
                            )
                          }
                          className="edit-input player-name-input"
                          placeholder="Player name"
                        />
                      ) : (
                        <span className="player-name">{player.name}</span>
                      )}
                      <span className="player-country">
                        {isEditing && editingPlayer === player.id ? (
                          <input
                            type="text"
                            value={player.country}
                            onChange={(e) =>
                              handlePlayerChange(
                                player.id,
                                "country",
                                e.target.value,
                              )
                            }
                            className="edit-input country-input"
                            placeholder="Country"
                          />
                        ) : (
                          player.country
                        )}
                      </span>
                    </div>

                    <span className="score">
                      {isEditing && editingPlayer === player.id ? (
                        <input
                          type="number"
                          value={player.score}
                          onChange={(e) =>
                            handlePlayerChange(
                              player.id,
                              "score",
                              parseInt(e.target.value),
                            )
                          }
                          className="edit-input score-input"
                        />
                      ) : (
                        player.score.toLocaleString()
                      )}
                    </span>

                    <span className="kd">
                      {isEditing && editingPlayer === player.id ? (
                        <input
                          type="number"
                          step="0.1"
                          value={player.kd}
                          onChange={(e) =>
                            handlePlayerChange(
                              player.id,
                              "kd",
                              parseFloat(e.target.value),
                            )
                          }
                          className="edit-input kd-input"
                        />
                      ) : (
                        player.kd.toFixed(1)
                      )}
                    </span>

                    {isAdmin && isEditing && (
                      <span className="actions">
                        {editingPlayer === player.id ? (
                          <>
                            <button
                              className="action-btn save"
                              onClick={() => setEditingPlayer(null)}
                            >
                              ✓
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => deletePlayer(player.id)}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="action-btn edit"
                              onClick={() => setEditingPlayer(player.id)}
                            >
                              ✎
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => deletePlayer(player.id)}
                            >
                              ×
                            </button>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>

            {isAdmin && isEditing && (
              <button className="add-player-btn" onClick={addNewPlayer}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M12 5v14M5 12h14"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Add Player
              </button>
            )}
          </div>

          {/* Sidebar */}
          <div className="leaderboard-sidebar">
            {/* Top Games */}
            <div className="top-games" ref={gamesRef}>
              <h3 className="sidebar-title">
                <span className="title-icon">🎮</span>
                TOP GAMES BY ACTIVE PLAYERS
              </h3>
              <div className="games-list">
                {(isEditing ? editData.topGames : leaderboardData.topGames).map(
                  (game, index) => (
                    <div
                      key={game.name}
                      className={`game-item ${editingGame === index ? "editing" : ""}`}
                    >
                      <span className="game-icon">{game.icon || "🎮"}</span>
                      {isEditing && editingGame === index ? (
                        <input
                          type="text"
                          value={game.name}
                          onChange={(e) =>
                            handleGameChange(index, "name", e.target.value)
                          }
                          className="edit-input game-name-input"
                          placeholder="Game name"
                        />
                      ) : (
                        <span className="game-name">{game.name}</span>
                      )}
                      <span className="game-players">
                        {isEditing && editingGame === index ? (
                          <input
                            type="text"
                            value={game.players}
                            onChange={(e) =>
                              handleGameChange(index, "players", e.target.value)
                            }
                            className="edit-input players-input"
                            placeholder="Players"
                          />
                        ) : (
                          game.players
                        )}
                      </span>
                      {isAdmin && isEditing && (
                        <div className="game-actions">
                          {editingGame === index ? (
                            <button
                              className="action-btn save"
                              onClick={() => setEditingGame(null)}
                            >
                              ✓
                            </button>
                          ) : (
                            <button
                              className="action-btn edit"
                              onClick={() => setEditingGame(index)}
                            >
                              ✎
                            </button>
                          )}
                          <button
                            className="action-btn delete"
                            onClick={() => deleteGame(index)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
              {/* {isAdmin && isEditing && (
                <button className="add-game-btn" onClick={addNewGame}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M12 5v14M5 12h14"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add Game
                </button>
              )} */}
            </div>

            {/* Live Events */}
            {/* <div className="live-events" ref={liveRef}>
              <h3 className="sidebar-title">
                <span className="title-icon">🔴</span>
                LIVE RIGHT NOW
              </h3>
              <div className={`live-card ${editingLive ? "editing" : ""}`}>
                <div className="live-badge">LIVE</div>
                {isEditing && editingLive ? (
                  <input
                    type="text"
                    value={editData.liveEvents[0].title}
                    onChange={(e) => handleLiveChange("title", e.target.value)}
                    className="edit-input live-title-input"
                    placeholder="Event title"
                  />
                ) : (
                  <h4 className="live-title">
                    {leaderboardData.liveEvents[0].title}
                  </h4>
                )}
                <div className="live-stats">
                  <div className="live-stat">
                    <span className="stat-value">
                      {isEditing && editingLive ? (
                        <input
                          type="number"
                          value={editData.liveEvents[0].tournaments}
                          onChange={(e) =>
                            handleLiveChange(
                              "tournaments",
                              parseInt(e.target.value),
                            )
                          }
                          className="edit-input stat-input"
                        />
                      ) : (
                        leaderboardData.liveEvents[0].tournaments
                      )}
                    </span>
                    <span className="stat-label">TOURNAMENTS</span>
                  </div>
                  <div className="live-stat">
                    <span className="stat-value">
                      {isEditing && editingLive ? (
                        <input
                          type="number"
                          value={editData.liveEvents[0].finalsToday}
                          onChange={(e) =>
                            handleLiveChange(
                              "finalsToday",
                              parseInt(e.target.value),
                            )
                          }
                          className="edit-input stat-input"
                        />
                      ) : (
                        leaderboardData.liveEvents[0].finalsToday
                      )}
                    </span>
                    <span className="stat-label">FINALS TODAY</span>
                  </div>
                </div>
                {isAdmin && isEditing && (
                  <div className="live-actions">
                    {editingLive ? (
                      <button
                        className="action-btn save"
                        onClick={() => setEditingLive(false)}
                      >
                        ✓
                      </button>
                    ) : (
                      <button
                        className="action-btn edit"
                        onClick={() => setEditingLive(true)}
                      >
                        ✎
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalLeaderboard;
