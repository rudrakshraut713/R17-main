import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';

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

const StreamManagement = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [game, setGame] = useState('');
  const [streamer, setStreamer] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const { documents, addDocument, updateDocument, deleteDocument } = useFirestore<Stream>('streams');
  const { uploadFile, deleteFile } = useStorage();

  // Load streams
  useEffect(() => {
    if (documents) {
      const sortedStreams = [...documents].sort((a, b) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setStreams(sortedStreams);
    }
  }, [documents]);

  // Handle thumbnail selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setThumbnail(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStreamUrl('');
    setGame('');
    setStreamer('');
    setIsLive(false);
    setViewerCount(0);
    setStartTime('');
    setThumbnail(null);
    setThumbnailPreview(null);
    setIsEditing(false);
    setCurrentId(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let thumbnailUrl = '';
      
      // Upload thumbnail if selected
      if (thumbnail) {
        const uploadResult = await uploadFile(thumbnail, 'stream-thumbnails');
        if (uploadResult.url) {
          thumbnailUrl = uploadResult.url;
        }
      }
      
      if (isEditing && currentId) {
        // Update existing stream
        const updatedStream: Partial<Stream> = {
          title,
          description,
          streamUrl,
          game,
          streamer,
          isLive,
          viewerCount,
          startTime
        };
        
        if (thumbnailUrl) {
          updatedStream.thumbnailUrl = thumbnailUrl;
        }
        
        await updateDocument(currentId, updatedStream);
      } else {
        // Create new stream
        const newStream: Stream = {
          title,
          description,
          streamUrl,
          game,
          streamer,
          isLive,
          viewerCount,
          startTime
        };
        
        if (thumbnailUrl) {
          newStream.thumbnailUrl = thumbnailUrl;
        }
        
        await addDocument(newStream);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving stream:', error);
    }
  };

  // Edit stream
  const handleEdit = (stream: Stream) => {
    setTitle(stream.title);
    setDescription(stream.description);
    setStreamUrl(stream.streamUrl);
    setGame(stream.game);
    setStreamer(stream.streamer);
    setIsLive(stream.isLive);
    setViewerCount(stream.viewerCount);
    setStartTime(stream.startTime);
    setThumbnailPreview(stream.thumbnailUrl || null);
    setIsEditing(true);
    setCurrentId(stream.id || null);
  };

  // Delete stream
  const handleDelete = async (id: string, thumbnailUrl?: string) => {
    if (!window.confirm('Are you sure you want to delete this stream?')) {
      return;
    }
    
    try {
      await deleteDocument(id);
      
      // Delete thumbnail if exists
      if (thumbnailUrl) {
        await deleteFile(thumbnailUrl);
      }
    } catch (error) {
      console.error('Error deleting stream:', error);
    }
  };

  return (
    <div className="stream-management">
      <h2>Manage Live Streams</h2>
      
      <div className="stream-form glass-card">
        <h3>{isEditing ? 'Edit Stream' : 'Create New Stream'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Stream Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="streamUrl">Stream URL (YouTube/Twitch Embed)</label>
              <input
                type="text"
                id="streamUrl"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                required
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="game">Game</label>
              <input
                type="text"
                id="game"
                value={game}
                onChange={(e) => setGame(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="streamer">Streamer/Channel</label>
              <input
                type="text"
                id="streamer"
                value={streamer}
                onChange={(e) => setStreamer(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isLive">Status</label>
              <select
                id="isLive"
                value={isLive ? 'true' : 'false'}
                onChange={(e) => setIsLive(e.target.value === 'true')}
              >
                <option value="true">Live Now</option>
                <option value="false">Upcoming</option>
              </select>
            </div>
            
            {isLive ? (
              <div className="form-group">
                <label htmlFor="viewerCount">Viewer Count</label>
                <input
                  type="number"
                  id="viewerCount"
                  value={viewerCount}
                  onChange={(e) => setViewerCount(parseInt(e.target.value))}
                  min="0"
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="thumbnail">Thumbnail Image</label>
            <input
              type="file"
              id="thumbnail"
              onChange={handleThumbnailChange}
              accept="image/*"
            />
            {thumbnailPreview && (
              <div className="thumbnail-preview">
                <img src={thumbnailPreview} alt="Preview" />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Stream' : 'Create Stream'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="streams-list">
        <h3>Existing Streams</h3>
        {streams.length === 0 ? (
          <p className="no-streams">No streams created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Game</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {streams.map((stream) => (
                <tr key={stream.id}>
                  <td>
                    {stream.thumbnailUrl ? (
                      <img 
                        src={stream.thumbnailUrl} 
                        alt={stream.title} 
                        className="stream-thumbnail" 
                      />
                    ) : (
                      <div className="no-thumbnail">No Image</div>
                    )}
                  </td>
                  <td>{stream.title}</td>
                  <td>{stream.game}</td>
                  <td>
                    <span className={`status-badge ${stream.isLive ? 'live' : 'upcoming'}`}>
                      {stream.isLive ? 'Live' : 'Upcoming'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => handleEdit(stream)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => stream.id && handleDelete(stream.id, stream.thumbnailUrl)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <style>{`
        .stream-management {
          padding: 2rem;
        }
        
        h2 {
          margin-bottom: 2rem;
          color: var(--primary-color);
        }
        
        .stream-form {
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: var(--text-primary);
        }
        
        textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .thumbnail-preview {
          margin-top: 1rem;
          max-width: 200px;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .thumbnail-preview img {
          width: 100%;
          height: auto;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        th {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .stream-thumbnail {
          width: 80px;
          height: 45px;
          object-fit: cover;
          border-radius: 0.25rem;
        }
        
        .no-thumbnail {
          width: 80px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
          font-size: 0.7rem;
          text-align: center;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .status-badge.live {
          background: rgba(255, 0, 0, 0.2);
          color: #ff6b6b;
        }
        
        .status-badge.upcoming {
          background: rgba(0, 128, 255, 0.2);
          color: #63b3ed;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-small {
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
        }
        
        .btn-danger {
          background: rgba(255, 0, 0, 0.2);
          color: #ff6b6b;
        }
        
        .btn-danger:hover {
          background: rgba(255, 0, 0, 0.4);
        }
        
        .no-streams {
          padding: 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default StreamManagement;