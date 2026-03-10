import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import gsap from 'gsap';

interface Stream {
  id?: string;
  title: string;
  description: string;
  streamUrl: string;
  game: string;
  streamer: string;
  thumbnailUrl?: string;
  isLive: boolean;
  viewerCount: number;
  startTime: string;
}

const LiveStreaming = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  
  const streamContainerRef = useRef<HTMLDivElement>(null);
  const streamListRef = useRef<HTMLDivElement>(null);
  
  const { documents, loading: firestoreLoading, error } = useFirestore<Stream>('streams');

  // Load streams
  useEffect(() => {
    if (documents) {
      const liveStreams = documents.filter(stream => stream.isLive);
      const upcomingStreams = documents.filter(stream => !stream.isLive);
      
      const sortedStreams = [
        ...liveStreams.sort((a, b) => b.viewerCount - a.viewerCount),
        ...upcomingStreams.sort((a, b) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )
      ];
      
      setStreams(sortedStreams);
      
      if (sortedStreams.length > 0 && !activeStream) {
        setActiveStream(sortedStreams[0]);
      }
    }
    setLoading(firestoreLoading);
  }, [documents, activeStream, firestoreLoading]);

  // GSAP animations
  useEffect(() => {
    if (streamContainerRef.current && !loading) {
      gsap.fromTo(
        streamContainerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
    
    if (streamListRef.current && streams.length > 0) {
      gsap.fromTo(
        streamListRef.current.children,
        { opacity: 0, x: 20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.4, 
          stagger: 0.1, 
          ease: 'power2.out' 
        }
      );
    }
  }, [streams, loading]);

  // Format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Demo data for development
  useEffect(() => {
    if (!documents || documents.length === 0) {
      const demoStreams: Stream[] = [
        {
          id: '1',
          title: 'R17 Championship Finals',
          description: 'Watch the epic showdown between Team Alpha and Team Omega for the R17 Championship title!',
          streamUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
          game: 'Valorant',
          streamer: 'R17Official',
          thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
          isLive: true,
          viewerCount: 1245,
          startTime: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Pro Scrims - Team Tactics',
          description: 'Professional teams practicing new strategies and team compositions.',
          streamUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
          game: 'League of Legends',
          streamer: 'ProLeagueTV',
          thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg',
          isLive: true,
          viewerCount: 876,
          startTime: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Upcoming: Regional Qualifiers',
          description: 'Regional qualifiers for the upcoming international tournament.',
          streamUrl: 'https://www.youtube.com/embed/DWcJFNfaw9c',
          game: 'Counter-Strike 2',
          streamer: 'ESportsCentral',
          thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/maxresdefault.jpg',
          isLive: false,
          viewerCount: 0,
          startTime: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        }
      ];
      
      setStreams(demoStreams);
      setActiveStream(demoStreams[0]);
      setLoading(false);
    }
  }, [documents]);

  if (loading) {
    return (
      <div className="live-streaming loading">
        <div className="loading-spinner"></div>
        <p>Loading streams...</p>
        
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
    <div className="live-streaming" ref={streamContainerRef}>
      <h2>Live Tournament Streams</h2>
      
      <div className="streaming-container">
        {/* Main stream view */}
        {activeStream && (
          <div className="main-stream">
            <div className="stream-video">
              <iframe 
                src={activeStream.streamUrl}
                title={activeStream.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              {activeStream.isLive && (
                <div className="live-badge">
                  <span className="live-indicator"></span>
                  LIVE
                </div>
              )}
              
              <div className="viewer-count">
                {activeStream.isLive ? (
                  <>
                    <i className="fas fa-eye"></i> {activeStream.viewerCount.toLocaleString()}
                  </>
                ) : (
                  <>
                    <i className="fas fa-calendar"></i> {formatDate(activeStream.startTime)} {formatTime(activeStream.startTime)}
                  </>
                )}
              </div>
            </div>
            
            <div className="stream-info">
              <h3>{activeStream.title}</h3>
              <div className="stream-meta">
                <span className="game">{activeStream.game}</span>
                <span className="streamer">{activeStream.streamer}</span>
              </div>
              <p className="description">{activeStream.description}</p>
            </div>
          </div>
        )}
        
        {/* Stream list */}
        <div className="stream-list" ref={streamListRef}>
          <h3>All Streams</h3>
          
          {streams.length === 0 ? (
            <p className="no-streams">No streams available</p>
          ) : (
            <div className="streams">
              {streams.map((stream) => (
                <div 
                  key={stream.id} 
                  className={`stream-item ${activeStream?.id === stream.id ? 'active' : ''}`}
                  onClick={() => setActiveStream(stream)}
                >
                  <div className="stream-thumbnail">
                    <img src={stream.thumbnailUrl} alt={stream.title} />
                    
                    {stream.isLive ? (
                      <div className="thumbnail-live">LIVE</div>
                    ) : (
                      <div className="thumbnail-upcoming">
                        {formatDate(stream.startTime)}
                      </div>
                    )}
                  </div>
                  
                  <div className="stream-item-info">
                    <h4>{stream.title}</h4>
                    <div className="stream-item-meta">
                      <span className="game">{stream.game}</span>
                      <span className="streamer">{stream.streamer}</span>
                    </div>
                    
                    {stream.isLive && (
                      <div className="viewers">
                        <i className="fas fa-eye"></i> {stream.viewerCount.toLocaleString()} viewers
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .live-streaming {
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
        
        .streaming-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        
        /* Main stream */
        .main-stream {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .stream-video {
          position: relative;
          padding-top: 56.25%; /* 16:9 aspect ratio */
        }
        
        .stream-video iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .live-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 0, 0, 0.7);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .live-indicator {
          display: block;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .viewer-count {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
        }
        
        .stream-info {
          padding: 1.5rem;
        }
        
        .stream-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: var(--primary-color);
        }
        
        .stream-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .game {
          background: rgba(var(--primary-rgb), 0.2);
          color: var(--primary-color);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
        }
        
        .streamer {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .description {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        /* Stream list */
        .stream-list {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
        }
        
        .stream-list h3 {
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .streams {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 600px;
          overflow-y: auto;
        }
        
        .stream-item {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .stream-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .stream-item.active {
          background: rgba(var(--primary-rgb), 0.2);
          border-left: 3px solid var(--primary-color);
        }
        
        .stream-thumbnail {
          width: 120px;
          height: 68px;
          border-radius: 0.25rem;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        
        .stream-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .thumbnail-live, .thumbnail-upcoming {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.25rem;
          font-size: 0.7rem;
          text-align: center;
          font-weight: bold;
        }
        
        .thumbnail-live {
          background: rgba(255, 0, 0, 0.7);
          color: white;
        }
        
        .thumbnail-upcoming {
          background: rgba(0, 0, 0, 0.7);
          color: white;
        }
        
        .stream-item-info {
          flex: 1;
          min-width: 0;
        }
        
        .stream-item-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .stream-item-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        
        .stream-item-meta .game {
          font-size: 0.7rem;
          padding: 0.1rem 0.3rem;
        }
        
        .stream-item-meta .streamer {
          font-size: 0.8rem;
        }
        
        .viewers {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .no-streams {
          text-align: center;
          padding: 2rem 0;
          color: var(--text-secondary);
        }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .streaming-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveStreaming;