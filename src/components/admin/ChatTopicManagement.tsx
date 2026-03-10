import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';

interface ChatTopic {
  id?: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  imageUrl?: string;
}

const ChatTopicManagement = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [topics, setTopics] = useState<ChatTopic[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { documents, addDocument, updateDocument, deleteDocument } = useFirestore<ChatTopic>('chat-topics');
  const { uploadFile, deleteFile } = useStorage();

  // Load topics
  useEffect(() => {
    if (documents) {
      const sortedTopics = [...documents].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTopics(sortedTopics);
    }
  }, [documents]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setCurrentId(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (image) {
        const uploadResult = await uploadFile(image, 'chat-topic-images');
        if (uploadResult.url) {
          imageUrl = uploadResult.url;
        }
      }
      
      if (isEditing && currentId) {
        // Update existing topic
        const updatedTopic: Partial<ChatTopic> = {
          title,
          description,
        };
        
        if (imageUrl) {
          updatedTopic.imageUrl = imageUrl;
        }
        
        await updateDocument(currentId, updatedTopic);
      } else {
        // Create new topic
        const newTopic: ChatTopic = {
          title,
          description,
          createdAt: new Date().toISOString(),
          createdBy: 'Admin',
        };
        
        if (imageUrl) {
          newTopic.imageUrl = imageUrl;
        }
        
        await addDocument(newTopic);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving topic:', error);
    }
  };

  // Edit topic
  const handleEdit = (topic: ChatTopic) => {
    setTitle(topic.title);
    setDescription(topic.description);
    setImagePreview(topic.imageUrl || null);
    setIsEditing(true);
    setCurrentId(topic.id || null);
  };

  // Delete topic
  const handleDelete = async (id: string, imageUrl?: string) => {
    if (!window.confirm('Are you sure you want to delete this topic? All messages in this topic will also be deleted.')) {
      return;
    }
    
    try {
      await deleteDocument(id);
      
      // Delete image if exists
      if (imageUrl) {
        await deleteFile(imageUrl);
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  return (
    <div className="chat-topic-management">
      <h2>Manage Chat Topics</h2>
      
      <div className="topic-form glass-card">
        <h3>{isEditing ? 'Edit Topic' : 'Create New Topic'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Topic Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
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
          
          <div className="form-group">
            <label htmlFor="image">Topic Image (Optional)</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Topic' : 'Create Topic'}
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
      
      <div className="topics-list">
        <h3>Existing Topics</h3>
        {topics.length === 0 ? (
          <p className="no-topics">No topics created yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.id}>
                  <td>
                    {topic.imageUrl ? (
                      <img 
                        src={topic.imageUrl} 
                        alt={topic.title} 
                        className="topic-thumbnail" 
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{topic.title}</td>
                  <td>{topic.description}</td>
                  <td>{new Date(topic.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => handleEdit(topic)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => topic.id && handleDelete(topic.id, topic.imageUrl)}
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
        .chat-topic-management {
          padding: 2rem;
        }
        
        h2 {
          margin-bottom: 2rem;
          color: var(--primary-color);
        }
        
        .topic-form {
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        
        input, textarea {
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
        
        .image-preview {
          margin-top: 1rem;
          max-width: 200px;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .image-preview img {
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
        
        .topic-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 0.25rem;
        }
        
        .no-image {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
          font-size: 0.7rem;
          text-align: center;
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
        
        .no-topics {
          padding: 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ChatTopicManagement;