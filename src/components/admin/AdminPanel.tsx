import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import TournamentManagement from './TournamentManagement';
import BlogManagement from './BlogManagement';
import UserManagement from './UserManagement';
import AboutManagement from './AboutManagement';
import ContactManagement from './ContactManagement';
import ChatTopicManagement from './ChatTopicManagement';
import StreamManagement from './StreamManagement';

interface AdminPanelProps {
  onBackToWebsite?: () => void;
}

const AdminPanel = ({ onBackToWebsite }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('tournaments');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAdmin, isLoading: isAdminLoading } = useAdminAuth();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Render login form
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container glass-card">
          <h2>Admin Dashboard Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
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
                placeholder="Enter password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login to Admin Panel'}
            </button>
          </form>
        </div>

        <style>{`
          .admin-login {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-lg);
          }

          .login-container {
            width: 100%;
            max-width: 400px;
            padding: var(--spacing-xl);
          }

          h2 {
            text-align: center;
            margin-bottom: var(--spacing-lg);
          }

          .error-message {
            background: rgba(255, 107, 107, 0.2);
            color: var(--accent-red);
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            margin-bottom: var(--spacing-md);
            text-align: center;
          }

          .form-group {
            margin-bottom: var(--spacing-md);
          }

          label {
            display: block;
            margin-bottom: var(--spacing-xs);
          }

          input {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-sm);
            color: var(--text-primary);
          }

          .login-btn {
            width: 100%;
            margin-top: var(--spacing-md);
          }
        `}</style>
      </div>
    );
  }

  // Check if user is admin
  if (isAuthenticated && !isAdminLoading && !isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-container glass-card">
          <h2>Access Denied</h2>
          <p>You do not have permission to access the admin panel.</p>
          <p>Only users with admin privileges can access this area.</p>
          {onBackToWebsite && (
            <button className="btn btn-primary back-btn" onClick={onBackToWebsite}>
              Back to Website
            </button>
          )}
          <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <style jsx>{`
          .admin-access-denied {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-lg);
          }
          
          .access-denied-container {
            width: 100%;
            max-width: 500px;
            padding: var(--spacing-xl);
            text-align: center;
          }
          
          h2 {
            color: var(--accent-red);
            margin-bottom: var(--spacing-md);
          }
          
          p {
            margin-bottom: var(--spacing-md);
            color: var(--text-secondary);
          }
          
          .back-btn {
            margin-right: var(--spacing-md);
            margin-top: var(--spacing-lg);
          }
        `}</style>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="admin-actions">
          {onBackToWebsite && (
            <button className="btn btn-secondary back-btn" onClick={onBackToWebsite}>
              Back to Website
            </button>
          )}
          <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'tournaments' ? 'active' : ''}`}
          onClick={() => setActiveTab('tournaments')}
        >
          Tournaments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Posts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button 
          className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Messages
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat Topics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'streams' ? 'active' : ''}`}
          onClick={() => setActiveTab('streams')}
        >
          Live Streams
        </button>
      </div>

      <div className="admin-content glass-card">
        {activeTab === 'tournaments' && <TournamentManagement />}
        {activeTab === 'blogs' && <BlogManagement />}
        {activeTab === 'about' && <AboutManagement />}
        {activeTab === 'contact' && <ContactManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'chat' && <ChatTopicManagement />}
        {activeTab === 'streams' && <StreamManagement />}
      </div>

      <style>{`
        .admin-panel {
          padding: var(--spacing-xl) var(--spacing-md);
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .admin-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .back-btn, .logout-btn {
          padding: var(--spacing-sm) var(--spacing-md);
        }

        .admin-tabs {
          display: flex;
          margin-bottom: var(--spacing-lg);
          border-bottom: 1px solid var(--glass-border);
        }

        .tab-btn {
          padding: var(--spacing-md) var(--spacing-lg);
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-normal);
          position: relative;
        }

        .tab-btn.active {
          color: var(--accent-teal);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--accent-teal);
        }

        .admin-content {
          padding: var(--spacing-lg);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .data-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: var(--spacing-md);
          text-align: left;
          border-bottom: 1px solid var(--glass-border);
        }

        th {
          font-weight: 600;
          color: var(--accent-blue);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-sm);
        }

        .action-btn {
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          cursor: pointer;
          border: none;
          transition: all var(--transition-fast);
        }

        .action-btn.edit {
          background: var(--accent-blue);
          color: white;
        }

        .action-btn.edit:hover {
          background: #3a9ab0;
        }

        .action-btn.delete {
          background: var(--accent-red);
          color: white;
        }

        .action-btn.delete:hover {
          background: #e05555;
        }

        @media (max-width: 768px) {
          .admin-tabs {
            overflow-x: auto;
            white-space: nowrap;
          }

          .tab-btn {
            padding: var(--spacing-md) var(--spacing-md);
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;