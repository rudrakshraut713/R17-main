import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import gsap from 'gsap';

interface Blog {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  imageUrl?: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Blog>({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    image: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const formRef = useRef<HTMLFormElement>(null);
  const { documents, addDocument, updateDocument, deleteDocument } = useFirestore<Blog>('blogs');
  const { uploadFile, progress } = useStorage('blog-images');

  // Update local state when Firestore documents change
  useEffect(() => {
    if (documents.length > 0) {
      setBlogs(documents);
    }
  }, [documents]);

  // Update progress state when upload progress changes
  useEffect(() => {
    setUploadProgress(progress);
  }, [progress]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.imageUrl || '';
      
      // Upload image if selected
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }
      
      const blogData = {
        ...formData,
        imageUrl,
      };
      
      if (isEditing && selectedBlog?.id) {
        // Update existing blog
        await updateDocument(selectedBlog.id, blogData);
      } else {
        // Add new blog
        await addDocument(blogData);
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      date: blog.date,
      author: blog.author,
      image: blog.image,
      imageUrl: blog.imageUrl,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      await deleteDocument(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      image: '',
    });
    setSelectedBlog(null);
    setIsEditing(false);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="blog-management">
      <div className="management-header">
        <h2>Blog Management</h2>
        <button 
          className="new-blog-button"
          onClick={() => setIsEditing(true)}
        >
          New Blog Post
        </button>
      </div>

      {isEditing ? (
        <form ref={formRef} onSubmit={handleSubmit} className="blog-form glass-card">
          <h3>{selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
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
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>
          
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
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={2}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Featured Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
            )}
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={formData.imageUrl} alt="Preview" />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-button">
              {selectedBlog ? 'Update' : 'Publish'}
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
        <div className="blogs-list">
          {blogs.length === 0 ? (
            <p className="no-blogs">No blog posts yet. Create your first one!</p>
          ) : (
            blogs.map(blog => (
              <div key={blog.id} className="blog-item glass-card">
                <div className="blog-item-content">
                  <h3>{blog.title}</h3>
                  <p className="blog-meta">
                    {blog.date} | By {blog.author}
                  </p>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                </div>
                <div className="blog-item-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(blog)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => blog.id && handleDelete(blog.id)}
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
        .blog-management {
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

        .new-blog-button {
          padding: var(--spacing-sm) var(--spacing-md);
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-teal));
          border: none;
          border-radius: var(--border-radius-sm);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .blogs-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .blog-item {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-md);
        }

        .blog-item-content {
          flex: 1;
        }

        .blog-item h3 {
          color: var(--accent-blue);
          margin-bottom: var(--spacing-xs);
        }

        .blog-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .blog-excerpt {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .blog-item-actions {
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

        .no-blogs {
          text-align: center;
          color: var(--text-secondary);
          padding: var(--spacing-xl);
        }

        .blog-form {
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .blog-form h3 {
          color: var(--accent-blue);
          margin-bottom: var(--spacing-lg);
        }

        .form-group {
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

        .progress-bar {
          margin-top: var(--spacing-sm);
          height: 20px;
          background: rgba(30, 30, 30, 0.6);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, var(--accent-blue), var(--accent-teal));
          transition: width 0.3s ease;
        }

        .progress-bar span {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.8rem;
        }

        .image-preview {
          margin-top: var(--spacing-sm);
          max-width: 200px;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          height: auto;
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

export default BlogManagement;