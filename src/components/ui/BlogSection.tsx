import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFirestore } from '../../hooks/useFirestore';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Blog interface
interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  image: string;
  imageUrl?: string;
  category?: string;
}

// Blog card component
const BlogCard = ({ post }: { post: Blog }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    // Hover animation
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
        duration: 0.3
      });
      
      // Image zoom effect
      gsap.to(card.querySelector('.card-image img'), {
        scale: 1.1,
        duration: 0.5
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        duration: 0.3
      });
      
      // Reset image zoom
      gsap.to(card.querySelector('.card-image img'), {
        scale: 1,
        duration: 0.5
      });
    });
    
    return () => {
      card.removeEventListener('mouseenter', () => {});
      card.removeEventListener('mouseleave', () => {});
    };
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="blog-card glass-card" ref={cardRef}>
      <div className="card-image">
        <img src={post.image} alt={post.title} />
        <div className="category-badge">{post.category}</div>
      </div>
      <div className="card-content">
        <div className="post-meta">
          <span className="post-date">{formatDate(post.date)}</span>
          <span className="post-author">By {post.author}</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <button className="read-more">Read More</button>
      </div>
      
      <style jsx>{`
        .blog-card {
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }
        
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .category-badge {
          position: absolute;
          top: var(--spacing-md);
          left: var(--spacing-md);
          background: var(--accent-blue);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: bold;
          box-shadow: 0 2px 10px rgba(69, 183, 209, 0.4);
        }
        
        .card-content {
          padding: var(--spacing-lg);
        }
        
        .post-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-sm);
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        .card-content h3 {
          margin-bottom: var(--spacing-sm);
          font-size: 1.3rem;
          line-height: 1.4;
        }
        
        .card-content p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-md);
          line-height: 1.6;
        }
        
        .read-more {
          background: none;
          border: none;
          color: var(--accent-teal);
          font-weight: 600;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: color var(--transition-fast);
        }
        
        .read-more:hover {
          color: var(--accent-red);
        }
        
        .read-more::after {
          content: '→';
          margin-left: 5px;
          transition: transform var(--transition-fast);
        }
        
        .read-more:hover::after {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};

// Main blog section component
const BlogSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  // Fetch blogs from Firestore
  const { documents: blogs, loading, error } = useFirestore<Blog>('blogs');
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      
      // Cards stagger animation
      gsap.from(".blog-card", {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out"
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return (
    <section className="blog-section" ref={sectionRef} id="blog">
      <div className="container">
        <h2 ref={headingRef}>Latest <span className="gradient-text">Gaming News</span></h2>
        <div className="blogs-grid" ref={cardsRef}>
          {loading ? (
            <div className="loading-message">Loading blog posts...</div>
          ) : error ? (
            <div className="error-message">Error loading blog posts: {error}</div>
          ) : blogs.length === 0 ? (
            <div className="no-blogs">
              <p>No blog posts available at the moment.</p>
              <p>Check back soon for the latest gaming news!</p>
            </div>
          ) : (
            blogs.map(post => (
              <BlogCard key={post.id} post={post} />
            ))
          )}
        </div>
        <div className="view-all-container">
          <button className="btn btn-secondary view-all-btn">View All Articles</button>
        </div>
      </div>
      
      <style jsx>{`
        .blog-section {
          padding: var(--spacing-xl) 0;
          background: linear-gradient(180deg, rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 0.8) 100%);
        }
        
        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: var(--spacing-xl);
        }
        
        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        .view-all-container {
          text-align: center;
        }
        
        .view-all-btn {
          padding: 0.75rem 2rem;
        }
        
        .loading-message, .error-message, .no-blogs {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--text-secondary);
        }

        .error-message {
          color: var(--accent-red);
        }

        .no-blogs p {
          margin-bottom: var(--spacing-sm);
        }
        
        @media (max-width: 1024px) {
          .blogs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 480px) {
          .blogs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default BlogSection;