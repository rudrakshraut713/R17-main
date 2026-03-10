import { useState } from 'react';
import { createAdminUser, createDefaultAdmin } from '../utils/adminUtils';
import type { AdminUser } from '../utils/adminUtils';

const AdminSetup = () => {
  const [formData, setFormData] = useState<AdminUser>({
    email: '',
    password: '',
    displayName: '',
    role: 'admin'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await createAdminUser(formData);
      if (result.success) {
        setMessage('Admin user created successfully!');
        setFormData({
          email: '',
          password: '',
          displayName: '',
          role: 'admin'
        });
      } else {
        setError(result.error || 'Failed to create admin user');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateDefaultAdmin = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await createDefaultAdmin();
      if (result.success) {
        setMessage('Default admin user created successfully! Email: admin@r17gaming.com, Password: admin123456');
      } else {
        setError(result.error || 'Failed to create default admin user');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-setup">
      <div className="setup-container glass-card">
        <h2>Create Admin User</h2>
        <p>Use this form to create the first admin user for your R17 Gaming platform.</p>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              required
              placeholder="Enter admin display name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary setup-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Admin...' : 'Create Admin User'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button 
          className="btn btn-secondary default-admin-btn"
          onClick={handleCreateDefaultAdmin}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Default Admin (admin@r17gaming.com)'}
        </button>

        <div className="setup-info">
          <h3>Instructions:</h3>
          <ol>
            <li>Fill in the admin user details above</li>
            <li>Click "Create Admin User" to create the account</li>
            <li>Use the created credentials to login to the admin panel</li>
            <li>Access the admin panel by logging in and clicking "Admin Panel" in the footer</li>
          </ol>
        </div>
      </div>

      <style>{`
        .admin-setup {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
        }

        .setup-container {
          width: 100%;
          max-width: 500px;
          padding: var(--spacing-xl);
        }

        h2 {
          text-align: center;
          margin-bottom: var(--spacing-sm);
          color: var(--accent-teal);
        }

        p {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
        }

        .success-message {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
          margin-bottom: var(--spacing-md);
          text-align: center;
          border: 1px solid rgba(76, 175, 80, 0.3);
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

        input, select {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 1rem;
          transition: all var(--transition-fast);
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--accent-teal);
          background: rgba(255, 255, 255, 0.15);
        }

        .setup-btn {
          width: 100%;
          margin-top: var(--spacing-md);
        }

        .divider {
          text-align: center;
          margin: var(--spacing-lg) 0;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--glass-border);
        }

        .divider span {
          background: var(--glass-bg);
          padding: 0 var(--spacing-md);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .default-admin-btn {
          width: 100%;
          margin-bottom: var(--spacing-lg);
        }

        .setup-info {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--glass-border);
        }

        .setup-info h3 {
          color: var(--accent-blue);
          margin-bottom: var(--spacing-md);
        }

        .setup-info ol {
          color: var(--text-secondary);
          padding-left: var(--spacing-lg);
        }

        .setup-info li {
          margin-bottom: var(--spacing-sm);
        }
      `}</style>
    </div>
  );
};

export default AdminSetup;
