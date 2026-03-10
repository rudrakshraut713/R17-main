import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import { compressImageToBase64 } from '../../utils/imageUtils';
import gsap from 'gsap';

interface AboutContent {
  id?: string;
  title: string;
  content: string;
  mission: string;
  vision: string;
  image: string;
}

const AboutManagement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingAbout, setExistingAbout] = useState<AboutContent | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const { uploadFile } = useStorage('about');
  const { documents, addDocument, updateDocument } = useFirestore<AboutContent>('about');

  // Load existing about content if available
  useEffect(() => {
    if (documents && documents.length > 0) {
      const about = documents[0];
      setExistingAbout(about);
      setTitle(about.title);
      setContent(about.content);
      setMission(about.mission);
      setVision(about.vision);
      setImage(about.image);
    }
  }, [documents]);

  // Animation for form elements
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.querySelectorAll('input, textarea, button'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 }
      );
    }
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      try {
        // 使用压缩功能并预览图片
        const base64Image = await compressImageToBase64(file, 800, 800, 0.8);
        setImage(base64Image);
        console.log('Image preview generated with compression');
      } catch (error) {
        console.error('Error generating image preview:', error);
        
        // 回退到标准预览方法
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = image;
      
      // 如果选择了新图片，使用压缩后的Base64图像
      if (imageFile) {
        // 直接使用已经压缩的Base64图像
        // 不需要再次调用uploadFile，因为handleImageChange已经处理了压缩
        console.log('Using compressed Base64 image');
      }
      
      const aboutData: AboutContent = {
        title,
        content,
        mission,
        vision,
        image: imageUrl
      };
      
      if (existingAbout) {
        // Update existing about content
        await updateDocument(existingAbout.id!, aboutData);
      } else {
        // Add new about content
        await addDocument(aboutData);
      }
      
      alert('About section updated successfully!');
    } catch (error) {
      console.error('Error saving about content:', error);
      alert('Failed to save about content. Please try again.');
    }
  };

  return (
    <div className="about-management">
      <h2>Manage About Section</h2>
      
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="mission">Our Mission</label>
          <textarea
            id="mission"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            rows={4}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="vision">Our Vision</label>
          <textarea
            id="vision"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            rows={4}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">About Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" />
            </div>
          )}
        </div>
        
        <button type="submit" className="btn btn-primary">
          {existingAbout ? 'Update About Section' : 'Create About Section'}
        </button>
      </form>
      
      <style jsx>{`
        .about-management {
          padding: 2rem;
        }
        
        h2 {
          margin-bottom: 2rem;
          color: var(--primary-color);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-color);
          font-size: 1rem;
        }
        
        .image-preview {
          margin-top: 1rem;
          max-width: 300px;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .image-preview img {
          width: 100%;
          height: auto;
        }
        
        button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AboutManagement;