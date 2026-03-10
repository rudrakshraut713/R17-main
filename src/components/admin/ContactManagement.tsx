import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import gsap from 'gsap';

interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read?: boolean;
}

const ContactManagement = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  const tableRef = useRef<HTMLTableElement>(null);
  const { documents, updateDocument, deleteDocument } = useFirestore<ContactMessage>('contact-messages');

  // Load messages
  useEffect(() => {
    if (documents) {
      // Sort by date (newest first)
      const sortedMessages = [...documents].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMessages(sortedMessages);
    }
  }, [documents]);

  // Animation for table rows
  useEffect(() => {
    if (tableRef.current && messages.length > 0) {
      gsap.fromTo(
        tableRef.current.querySelectorAll('tbody tr'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.3 }
      );
    }
  }, [messages]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleMarkAsRead = async (message: ContactMessage) => {
    if (!message.id) return;
    
    try {
      await updateDocument(message.id, { ...message, read: true });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await deleteDocument(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="contact-management">
      <h2>Contact Messages</h2>
      
      <div className="messages-container">
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="no-messages">No messages received yet.</p>
          ) : (
            <table ref={tableRef}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr 
                    key={message.id} 
                    className={message.read ? 'read' : 'unread'}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read && message.id) {
                        handleMarkAsRead(message);
                      }
                    }}
                  >
                    <td>{message.name}</td>
                    <td>{message.subject}</td>
                    <td>{formatDate(message.date)}</td>
                    <td>
                      <span className={`status ${message.read ? 'read' : 'unread'}`}>
                        {message.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (message.id) handleDeleteMessage(message.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {selectedMessage && (
          <div className="message-detail glass-card">
            <div className="message-header">
              <h3>{selectedMessage.subject}</h3>
              <div className="message-meta">
                <p>From: {selectedMessage.name} ({selectedMessage.email})</p>
                <p>Date: {formatDate(selectedMessage.date)}</p>
              </div>
            </div>
            <div className="message-body">
              <p>{selectedMessage.message}</p>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .contact-management {
          padding: 2rem;
        }
        
        h2 {
          margin-bottom: 2rem;
          color: var(--primary-color);
        }
        
        .messages-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        th {
          background-color: rgba(0, 0, 0, 0.2);
          font-weight: 600;
        }
        
        tbody tr {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        tr.unread {
          font-weight: 600;
          background-color: rgba(var(--primary-rgb), 0.1);
        }
        
        .status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
        }
        
        .status.unread {
          background-color: var(--primary-color);
          color: white;
        }
        
        .status.read {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .delete-btn {
          background-color: rgba(255, 0, 0, 0.2);
          color: #ff6b6b;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .delete-btn:hover {
          background-color: rgba(255, 0, 0, 0.4);
        }
        
        .message-detail {
          padding: 2rem;
        }
        
        .message-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .message-header h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--primary-color);
        }
        
        .message-meta {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .message-body {
          line-height: 1.6;
        }
        
        .no-messages {
          padding: 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .messages-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactManagement;