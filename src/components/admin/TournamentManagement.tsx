import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import gsap from 'gsap';

interface Tournament {
  id?: string;
  title: string;
  game: string;
  date: string;
  prize: string;
  slots: string;
  description?: string;
  image: string;
}

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Tournament>({
    title: '',
    game: '',
    date: new Date().toISOString().split('T')[0],
    prize: '',
    slots: '',
    description: '',
    image: '',
  });
  
  const formRef = useRef<HTMLFormElement>(null);
  const { documents, addDocument, updateDocument, deleteDocument } = useFirestore<Tournament>('tournaments');

  // Update local state when Firestore documents change
  useEffect(() => {
    if (documents.length > 0) {
      setTournaments(documents);
    }
  }, [documents]);

  // GSAP animation for form
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4 }
      );
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedTournament?.id) {
        // Update existing tournament
        await updateDocument(selectedTournament.id, formData);
      } else {
        // Add new tournament
        await addDocument(formData);
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving tournament:', error);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setFormData({
      title: tournament.title,
      game: tournament.game,
      date: tournament.date,
      prize: tournament.prize,
      slots: tournament.slots,
      description: tournament.description || '',
      image: tournament.image,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      await deleteDocument(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      game: '',
      date: new Date().toISOString().split('T')[0],
      prize: '',
      slots: '',
      description: '',
      image: '',
    });
    setSelectedTournament(null);
    setIsEditing(false);
  };

  return (
    <div className="tournament-management">
      <div className="management-header">
        <h2>Tournament Management</h2>
        <button 
          className="new-tournament-button"
          onClick={() => setIsEditing(true)}
        >
          New Tournament
        </button>
      </div>

      {isEditing ? (
        <form ref={formRef} onSubmit={handleSubmit} className="tournament-form glass-card">
          <h3>{selectedTournament ? 'Edit Tournament' : 'Create New Tournament'}</h3>
          
          <div className="form-group">
            <label htmlFor="title">Tournament Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="game">Game</label>
            <input
              type="text"
              id="game"
              name="game"
              value={formData.game}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="prize">Prize Pool</label>
              <input
                type="text"
                id="prize"
                name="prize"
                value={formData.prize}
                onChange={handleInputChange}
                required
                placeholder="e.g. $5,000"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="slots">Slots</label>
              <input
                type="text"
                id="slots"
                name="slots"
                value={formData.slots}
                onChange={handleInputChange}
                required
                placeholder="e.g. 32 teams"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-button">
              {selectedTournament ? 'Update' : 'Create'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="tournaments-list">
          {tournaments.length === 0 ? (
            <p className="no-tournaments">No tournaments yet. Create your first one!</p>
          ) : (
            tournaments.map(tournament => (
              <div key={tournament.id} className="tournament-item glass-card">
                <div className="tournament-item-content">
                  <h3>{tournament.title}</h3>
                  <div className="tournament-meta">
                    <span className="game">{tournament.game}</span>
                    <span className="date">{tournament.date}</span>
                    <span className="prize">{tournament.prize}</span>
                  </div>
                  {tournament.description && (
                    <p className="tournament-description">{tournament.description}</p>
                  )}
                </div>
                <div className="tournament-item-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(tournament)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => tournament.id && handleDelete(tournament.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        .tournament-management {
          padding: var(--spacing-lg);
        }

        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .management-header h2 {
          color: var(--accent-blue);
        }

        .new-tournament-button {
          padding: var(--spacing-sm) var(--spacing-md);
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-teal));
          border: none;
          border-radius: var(--border-radius-sm);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .tournaments-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .tournament-item {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-md);
        }

        .tournament-item-content {
          flex: 1;
        }

        .tournament-item h3 {
          color: var(--accent-blue);
          margin-bottom: var(--spacing-xs);
        }

        .tournament-meta {
          display: flex;
          gap: var(--spacing-md);
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .tournament-meta .game {
          color: var(--accent-red);
          font-weight: 500;
        }

        .tournament-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .tournament-item-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .edit-button, .delete-button {
          padding: var(--spacing-xs) var(--spacing-sm);
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .edit-button {
          background: var(--accent-blue);
          color: white;
        }

        .delete-button {
          background: var(--accent-red);
          color: white;
        }

        .no-tournaments {
          text-align: center;
          color: var(--text-secondary);
          padding: var(--spacing-xl);
        }

        .tournament-form {
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .tournament-form h3 {
          color: var(--accent-blue);
          margin-bottom: var(--spacing-lg);
        }

        .form-group {
          margin-bottom: var(--spacing-md);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        label {
          display: block;
          margin-bottom: var(--spacing-xs);
          color: var(--text-primary);
        }

        input, textarea {
          width: 100%;
          padding: var(--spacing-sm);
          background: rgba(30, 30, 30, 0.6);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-sm);
          color: var(--text-primary);
          font-size: 1rem;
        }

        textarea {
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }

        .save-button, .cancel-button {
          padding: var(--spacing-sm) var(--spacing-lg);
          border: none;
          border-radius: var(--border-radius-sm);
          font-weight: bold;
          cursor: pointer;
        }

        .save-button {
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-teal));
          color: white;
          flex: 1;
        }

        .cancel-button {
          background: rgba(30, 30, 30, 0.6);
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default TournamentManagement;