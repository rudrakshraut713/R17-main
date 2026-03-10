import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFirestore } from '../../hooks/useFirestore';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// About content interface
interface AboutContent {
  id: string;
  title: string;
  content: string;
  mission: string;
  vision: string;
  image: string;
}

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { documents, loading: firestoreLoading, error } = useFirestore<AboutContent>('about');

  useEffect(() => {
    if (documents && documents.length > 0) {
      setAboutContent(documents[0]);
    }
    setLoading(firestoreLoading);
  }, [documents, firestoreLoading]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Animate section on scroll
    gsap.fromTo(
      section.querySelector('.about-title'),
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
      section.querySelector('.about-content'),
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
      section.querySelector('.about-image'),
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

    gsap.fromTo(
      section.querySelectorAll('.value-card'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section.querySelector('.values-section'),
          start: 'top 80%',
        },
      }
    );
  }, [aboutContent]);

  return (
    <section ref={sectionRef} className="about-section section" id="about">
      <div className="container">
        <h2 className="section-title about-title">About R17 Gaming</h2>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : aboutContent ? (
          <>
            <div className="about-grid">
              <div className="about-content">
                <h3>{aboutContent.title}</h3>
                <p>{aboutContent.content}</p>
              </div>
              <div className="about-image">
                <img src={aboutContent.image} alt="R17 Gaming Team" />
              </div>
            </div>
            
            <div className="values-section">
              <h3>Our Values</h3>
              <div className="values-grid">
                <div className="value-card glass-card">
                  <h4>Our Mission</h4>
                  <p>{aboutContent.mission}</p>
                </div>
                <div className="value-card glass-card">
                  <h4>Our Vision</h4>
                  <p>{aboutContent.vision}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>About section content will appear here once added by an admin.</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .about-section {
          padding: 6rem 0;
          position: relative;
        }
        
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-top: 3rem;
        }
        
        .about-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .about-content h3 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .about-content p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-color);
        }
        
        .about-image {
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .about-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .about-image:hover img {
          transform: scale(1.05);
        }
        
        .values-section {
          margin-top: 5rem;
        }
        
        .values-section h3 {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .values-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .value-card {
          padding: 2rem;
          border-radius: 1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        .value-card h4 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        .value-card p {
          font-size: 1.1rem;
          line-height: 1.6;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          margin: 2rem 0;
        }
        
        .loading-spinner {
          text-align: center;
          padding: 3rem;
        }
        
        @media (max-width: 768px) {
          .about-grid,
          .values-grid {
            grid-template-columns: 1fr;
          }
          
          .about-image {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;