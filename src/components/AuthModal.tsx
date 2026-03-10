import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      try {
        await register(email, password);
        onClose();
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
    } else {
      try {
        await login(email, password);
        onClose();
      } catch (err) {
        setError('Invalid email or password');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="auth-switch"
              onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>

        <style>{`
          .auth-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: var(--spacing-lg);
          }

          .auth-modal {
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 400px;
            padding: var(--spacing-xl);
            position: relative;
          }

          .auth-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-lg);
          }

          .auth-header h2 {
            margin: 0;
            color: var(--accent-teal);
          }

          .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all var(--transition-fast);
          }

          .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
          }

          .error-message {
            background: rgba(255, 107, 107, 0.2);
            color: var(--accent-red);
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            margin-bottom: var(--spacing-md);
            text-align: center;
            border: 1px solid rgba(255, 107, 107, 0.3);
          }

          .form-group {
            margin-bottom: var(--spacing-md);
          }

          label {
            display: block;
            margin-bottom: var(--spacing-xs);
            color: var(--text-primary);
            font-weight: 500;
          }

          input {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            font-size: 1rem;
            transition: all var(--transition-fast);
          }

          input:focus {
            outline: none;
            border-color: var(--accent-teal);
            background: rgba(255, 255, 255, 0.15);
          }

          .auth-submit {
            width: 100%;
            margin-top: var(--spacing-md);
          }

          .auth-footer {
            margin-top: var(--spacing-lg);
            text-align: center;
          }

          .auth-footer p {
            color: var(--text-secondary);
            margin: 0;
          }

          .auth-switch {
            background: none;
            border: none;
            color: var(--accent-blue);
            cursor: pointer;
            text-decoration: underline;
            font-size: inherit;
          }

          .auth-switch:hover {
            color: var(--accent-teal);
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthModal;
