import { useState, useRef, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import gsap from 'gsap';

interface TournamentRegistrationProps {
  tournamentId: string;
  tournamentName: string;
  onClose: () => void;
}

interface RegistrationData {
  tournamentId: string;
  playerName: string;
  email: string;
  gamertag: string;
  platform: string;
  team?: string;
}

const TournamentRegistration = ({ tournamentId, tournamentName, onClose }: TournamentRegistrationProps) => {
  const [formData, setFormData] = useState<Omit<RegistrationData, 'tournamentId'>>({
    playerName: '',
    email: '',
    gamertag: '',
    platform: 'PC',
    team: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { addDocument, error } = useFirestore<RegistrationData>('registrations');

  // GSAP animation on mount
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDocument({
        tournamentId,
        ...formData
      });
      setSubmitSuccess(true);
      
      // Animate success message
      gsap.to(formRef.current, {
        opacity: 0.5,
        duration: 0.3
      });
      
      // Close form after delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-overlay">
      <div className="registration-modal glass-card">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Register for {tournamentName}</h2>
        
        {submitSuccess ? (
          <div className="success-message">
            <h3>Registration Successful!</h3>
            <p>Thank you for registering. We'll contact you with further details.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="playerName">Full Name</label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gamertag">Gamertag</label>
              <input
                type="text"
                id="gamertag"
                name="gamertag"
                value={formData.gamertag}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="platform">Platform</label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="team">Team Name (Optional)</label>
              <input
                type="text"
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
              />
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Now'}
            </button>
          </form>
        )}
        
        <style jsx>{`
          .registration-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          
          .registration-modal {
            width: 90%;
            max-width: 500px;
            padding: var(--spacing-xl);
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .close-button {
            position: absolute;
            top: var(--spacing-md);
            right: var(--spacing-md);
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--accent-red);
            cursor: pointer;
          }
          
          h2 {
            margin-bottom: var(--spacing-lg);
            color: var(--accent-blue);
            text-align: center;
          }
          
          .form-group {
            margin-bottom: var(--spacing-md);
          }
          
          label {
            display: block;
            margin-bottom: var(--spacing-xs);
            color: var(--text-primary);
          }
          
          input, select {
            width: 100%;
            padding: var(--spacing-sm);
            background: rgba(30, 30, 30, 0.6);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius-sm);
            color: var(--text-primary);
            font-size: 1rem;
          }
          
          .submit-button {
            width: 100%;
            padding: var(--spacing-md);
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-teal));
            border: none;
            border-radius: var(--border-radius-sm);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: transform var(--transition-fast);
            margin-top: var(--spacing-md);
          }
          
          .submit-button:hover {
            transform: translateY(-2px);
          }
          
          .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          .error-message {
            color: var(--accent-red);
            margin-top: var(--spacing-sm);
          }
          
          .success-message {
            text-align: center;
            animation: fadeIn 0.5s ease-in-out;
          }
          
          .success-message h3 {
            color: var(--accent-teal);
            margin-bottom: var(--spacing-md);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default TournamentRegistration;