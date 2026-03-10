import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../hooks/useAuth';
import gsap from 'gsap';

interface ChatTopic {
  id?: string;
  title: string;
  description: string;
  createdAt: string;
  imageUrl?: string;
}

interface ChatMessage {
  id?: string;
  topicId: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
}

const CommunityChat = () => {
  const [topics, setTopics] = useState<ChatTopic[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { documents: topicDocs, loading: topicsLoading } = useFirestore<ChatTopic>('chat-topics');
  const { 
    documents: messageDocs, 
    addDocument: addMessage 
  } = useFirestore<ChatMessage>('chat-messages');

  // Load topics
  useEffect(() => {
    if (topicDocs) {
      const sortedTopics = [...topicDocs].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTopics(sortedTopics);
      setLoading(topicsLoading);
      
      // Select first topic if none selected
      if (!selectedTopic && sortedTopics.length > 0 && sortedTopics[0].id) {
        setSelectedTopic(sortedTopics[0].id);
      }
    }
  }, [topicDocs, selectedTopic, topicsLoading]);

  // Load messages for selected topic
  useEffect(() => {
    if (messageDocs && selectedTopic) {
      const filteredMessages = messageDocs.filter(msg => msg.topicId === selectedTopic);
      const sortedMessages = [...filteredMessages].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sortedMessages);
    } else {
      setMessages([]);
    }
  }, [messageDocs, selectedTopic]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // GSAP animations
  useEffect(() => {
    if (chatContainerRef.current && !loading) {
      gsap.fromTo(
        chatContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
    
    if (topicsRef.current && topics.length > 0) {
      gsap.fromTo(
        topicsRef.current.children,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.4, 
          stagger: 0.1, 
          ease: 'power2.out' 
        }
      );
    }
  }, [topics, loading]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedTopic || !messageContent.trim()) return;
    
    try {
      const newMessage: ChatMessage = {
        topicId: selectedTopic,
        content: messageContent,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous User',
        userPhotoURL: user.photoURL || undefined
      };
      
      await addMessage(newMessage);
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Check if message is from a new day
  const isNewDay = (index: number, messages: ChatMessage[]) => {
    if (index === 0) return true;
    
    const currentDate = new Date(messages[index].createdAt).toLocaleDateString();
    const prevDate = new Date(messages[index - 1].createdAt).toLocaleDateString();
    
    return currentDate !== prevDate;
  };

  if (loading) {
    return (
      <div className="community-chat loading">
        <div className="loading-spinner"></div>
        <p>Loading chat...</p>
        
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
    <div className="community-chat" ref={chatContainerRef}>
      <h2>Community Chat</h2>
      
      <div className="chat-container">
        {/* Topics sidebar */}
        <div className="topics-sidebar" ref={topicsRef}>
          <h3>Chat Topics</h3>
          
          {topics.length === 0 ? (
            <p className="no-topics">No topics available</p>
          ) : (
            <div className="topics-list">
              {topics.map((topic) => (
                <div 
                  key={topic.id} 
                  className={`topic-item ${selectedTopic === topic.id ? 'active' : ''}`}
                  onClick={() => topic.id && setSelectedTopic(topic.id)}
                >
                  <div className="topic-image">
                    {topic.imageUrl ? (
                      <img src={topic.imageUrl} alt={topic.title} />
                    ) : (
                      <div className="default-image">{topic.title.charAt(0)}</div>
                    )}
                  </div>
                  <div className="topic-info">
                    <h4>{topic.title}</h4>
                    <p>{topic.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Chat area */}
        <div className="chat-area">
          {!selectedTopic ? (
            <div className="no-topic-selected">
              <p>Select a topic to start chatting</p>
            </div>
          ) : (
            <>
              {/* Topic header */}
              <div className="topic-header">
                {topics.find(t => t.id === selectedTopic)?.title || 'Loading...'}
              </div>
              
              {/* Messages */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet. Be the first to start the conversation!</p>
                  </div>
                ) : (
                  <div className="messages-list">
                    {messages.map((message, index) => (
                      <div key={message.id || index}>
                        {isNewDay(index, messages) && (
                          <div className="date-divider">
                            <span>{formatDate(message.createdAt)}</span>
                          </div>
                        )}
                        
                        <div className={`message-item ${message.userId === user?.uid ? 'own-message' : ''}`}>
                          <div className="message-avatar">
                            {message.userPhotoURL ? (
                              <img src={message.userPhotoURL} alt={message.userName} />
                            ) : (
                              <div className="default-avatar">{message.userName.charAt(0)}</div>
                            )}
                          </div>
                          <div className="message-content">
                            <div className="message-header">
                              <span className="message-author">{message.userName}</span>
                              <span className="message-time">{formatTime(message.createdAt)}</span>
                            </div>
                            <div className="message-text">{message.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Message input */}
              {user ? (
                <form className="message-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message..."
                    required
                  />
                  <button type="submit" className="send-button">
                    Send
                  </button>
                </form>
              ) : (
                <div className="login-prompt">
                  <p>Please log in to join the conversation</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .community-chat {
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
        
        .chat-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 1rem;
          height: 600px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        /* Topics sidebar */
        .topics-sidebar {
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          overflow-y: auto;
        }
        
        .topics-sidebar h3 {
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--primary-color);
        }
        
        .topics-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .topic-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .topic-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .topic-item.active {
          background: rgba(var(--primary-rgb), 0.2);
          border-left: 3px solid var(--primary-color);
        }
        
        .topic-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .topic-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .default-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .topic-info h4 {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        
        .topic-info p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }
        
        .no-topics {
          text-align: center;
          padding: 2rem 0;
          color: var(--text-secondary);
        }
        
        /* Chat area */
        .chat-area {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .topic-header {
          padding: 1rem;
          font-weight: bold;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        
        .no-messages, .no-topic-selected {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          text-align: center;
          padding: 0 2rem;
        }
        
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .date-divider {
          text-align: center;
          margin: 1rem 0;
          position: relative;
        }
        
        .date-divider::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 1;
        }
        
        .date-divider span {
          background: rgba(0, 0, 0, 0.5);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          position: relative;
          z-index: 2;
        }
        
        .message-item {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .default-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6b46c1, #3182ce);
          color: white;
          font-weight: bold;
        }
        
        .message-content {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem;
          border-radius: 0.5rem;
          max-width: 80%;
        }
        
        .own-message {
          flex-direction: row-reverse;
        }
        
        .own-message .message-content {
          background: rgba(var(--primary-rgb), 0.2);
        }
        
        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
          font-size: 0.8rem;
        }
        
        .message-author {
          font-weight: bold;
          color: var(--primary-color);
        }
        
        .message-time {
          color: var(--text-secondary);
        }
        
        .message-text {
          word-break: break-word;
        }
        
        .message-form {
          display: flex;
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }
        
        .message-form input {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem 0 0 0.5rem;
          color: var(--text-primary);
        }
        
        .send-button {
          padding: 0.75rem 1.5rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 0 0.5rem 0.5rem 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .send-button:hover {
          background: var(--primary-dark);
        }
        
        .login-prompt {
          padding: 1rem;
          text-align: center;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CommunityChat;