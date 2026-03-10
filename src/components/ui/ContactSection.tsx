import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFirestore } from '../../hooks/useFirestore';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const { addDocument } = useFirestore<ContactMessage>('contact-messages');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Animate section on scroll
    gsap.fromTo(
      section.querySelector('.contact-title'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      section.querySelector('.contact-form'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      section.querySelector('.contact-info'),
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const contactMessage: ContactMessage = {
        name,
        email,
        subject,
        message,
        date: new Date().toISOString()
      };
      
      await addDocument(contactMessage);
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitted(true);
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit your message. Please try again.');
    }
  };

  return (
    <section ref={sectionRef} className="contact-section section" id="contact">
      <div className="container">
        <h2 className="section-title contact-title">Contact Us</h2>
        
        <div className="contact-grid">
          <div className="contact-form-container">
            {submitted ? (
              <div className="success-message glass-card">
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            ) : (
              <form ref={formRef} className="contact-form glass-card" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            )}
          </div>
          
          <div className="contact-info glass-card">
            <h3>Get In Touch</h3>
            <p>Have questions about tournaments, sponsorships, or just want to say hello? Reach out to us!</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <span className="icon">📧</span>
                <span>info@r17gaming.com</span>
              </div>
              
              <div className="contact-item">
                <span className="icon">📱</span>
                <span>+1 (555) 123-4567</span>
              </div>
              
              <div className="contact-item">
                <span className="icon">📍</span>
                <span>123 Gaming Street, E-Sports City</span>
              </div>
            </div>
            
            <div className="social-links">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Discord</a>
              <a href="#" className="social-link">Twitch</a>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .contact-section {
          padding: 6rem 0;
          position: relative;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 3rem;
          margin-top: 3rem;
        }
        
        .contact-form-container,
        .contact-info {
          padding: 2rem;
          border-radius: 1rem;
        }
        
        .contact-form {
          padding: 2rem;
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
        
        .contact-info h3 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        .contact-info p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        
        .contact-details {
          margin-bottom: 2rem;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          width: 2rem;
          text-align: center;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
        }
        
        .social-link {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          background: var(--primary-color);
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .social-link:hover {
          background: var(--secondary-color);
          transform: translateY(-3px);
        }
        
        .success-message {
          text-align: center;
          padding: 3rem;
        }
        
        .success-message h3 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;