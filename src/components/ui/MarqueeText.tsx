import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MarqueeTextProps {
  text: string;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  repeat?: number;
  gap?: number;
}

const MarqueeText = ({ 
  text, 
  speed = 50, 
  direction = 'left', 
  className = '', 
  repeat = 4,
  gap = 40
}: MarqueeTextProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!marqueeRef.current || !contentRef.current) return;
    
    const marqueeContent = contentRef.current;
    const contentWidth = marqueeContent.offsetWidth;
    
    // Create animation
    const directionMultiplier = direction === 'left' ? -1 : 1;
    const duration = contentWidth / speed;
    
    gsap.to(marqueeContent, {
      x: directionMultiplier * contentWidth,
      duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % contentWidth)
      }
    });
    
    return () => {
      gsap.killTweensOf(marqueeContent);
    };
  }, [text, speed, direction]);
  
  // Create repeated text with gaps
  const repeatedText = Array(repeat).fill(null).map((_, index) => (
    <span key={index} style={{ marginRight: `${gap}px` }}>{text}</span>
  ));
  
  return (
    <div className={`marquee-container ${className}`} ref={marqueeRef}>
      <div className="marquee-content" ref={contentRef}>
        {repeatedText}
      </div>
      
      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }
        
        .marquee-content {
          display: inline-block;
          will-change: transform;
        }
        
        .marquee-content span {
          display: inline-block;
          font-weight: bold;
          background: linear-gradient(90deg, #4dabf7, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(77, 171, 247, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;