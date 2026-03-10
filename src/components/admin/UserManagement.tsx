import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import gsap from 'gsap';

interface User {
  id?: string;
  email: string;
  username: string;
  role: string;
  registeredDate: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'banned';
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    email: '',
    username: '',
    role: 'user',
    registeredDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });
  
  const formRef = useRef<HTMLFormElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const { documents, updateDocument } = useFirestore<User>('users');

  // Update local state when Firestore documents change
  useEffect(() => {
    if (documents.length > 0) {
      setUsers(documents);
    }
  }, [documents]);

  // GSAP animations
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4 }
      );
    }

    if (tableRef.current && !isEditing) {
      const rows = tableRef.current.querySelectorAll('tr');
      gsap.fromTo(
        rows,
        { opacity: 0, y: 10 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out"
        }
      );
    }
  }, [isEditing, users]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedUser?.id) {
        // Update existing user
        await updateDocument(selectedUser.id, formData);
        
        // Reset form
        resetForm();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      role: user.role,
      registeredDate: user.registeredDate,
      lastLogin: user.lastLogin,
      status: user.status
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      username: '',
      role: 'user',
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });
    setSelectedUser(null);
    setIsEditing(false);
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>User Management</h2>
      </div>

      {isEditing ? (
        <form ref={formRef} onSubmit={handleSubmit} className="user-form glass-card">
          <h3>Edit User</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-button">
              Update User
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
        <div className="users-table-container glass-card">
          {users.length === 0 ? (
            <p className="no-users">No users found in the database.</p>
          ) : (
            <table ref={tableRef} className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.registeredDate}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style jsx>{`
        .user-management {
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

        .users-table-container {
          padding: var(--spacing-md);
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th,
        .users-table td {
          padding: var(--spacing-sm);
          text-align: left;
        }

        .users-table th {
          color: var(--accent-teal);
          font-weight: 600;
          border-bottom: 1px solid var(--glass-border);
        }

        .users-table tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .users-table tr:last-child {
          border-bottom: none;
        }

        .role-badge, .status-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: var(--border-radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .role-badge.admin {
          background-color: rgba(255, 107, 107, 0.2);
          color: var(--accent-red);
        }

        .role-badge.moderator {
          background-color: rgba(78, 205, 196, 0.2);
          color: var(--accent-teal);
        }

        .role-badge.user {
          background-color: rgba(69, 183, 209, 0.2);
          color: var(--accent-blue);
        }

        .status-badge.active {
          background-color: rgba(78, 205, 196, 0.2);
          color: var(--accent-teal);
        }

        .status-badge.inactive {
          background-color: rgba(150, 150, 150, 0.2);
          color: #aaa;
        }

        .status-badge.banned {
          background-color: rgba(255, 107, 107, 0.2);
          color: var(--accent-red);
        }

        .edit-button {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--accent-blue);
          border: none;
          border-radius: var(--border-radius-sm);
          color: white;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .no-users {
          text-align: center;
          color: var(--text-secondary);
          padding: var(--spacing-xl);
        }

        .user-form {
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .user-form h3 {
          color: var(--accent-blue);
          margin-bottom: var(--spacing-lg);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
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

        input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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

export default UserManagement;