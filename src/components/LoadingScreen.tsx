import { useState, useEffect } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showScreen, setShowScreen] = useState(true);

  useEffect(() => {
    // 模拟加载进度
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    // 加载完成后的动画
    if (progress === 100) {
      clearInterval(interval);
      
      // 震撼效果
      gsap.to('.loading-container', {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // 闪光效果
          gsap.to('.loading-flash', {
            opacity: 1,
            duration: 0.2,
            onComplete: () => {
              // 收缩效果
              gsap.to('.loading-container', {
                scale: 0,
                rotation: 10,
                duration: 0.5,
                delay: 0.2,
                ease: 'back.in(1.7)',
                onComplete: () => {
                  setShowScreen(false);
                  onLoadingComplete();
                }
              });
              
              // 闪光消失
              gsap.to('.loading-flash', {
                opacity: 0,
                duration: 0.5
              });
            }
          });
        }
      });
    }

    return () => clearInterval(interval);
  }, [progress, onLoadingComplete]);

  if (!showScreen) return null;

  return (
    <div className="loading-screen">
      <div className="loading-flash"></div>
      <div className="loading-container">
        <div className="loading-logo">
          <span className="r">R</span>
          <span className="number">17</span>
          <span className="gaming">GAMING</span>
        </div>
        
        <div className="loading-progress-container">
          <div 
            className="loading-progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
          <div className="loading-glitch-effect"></div>
        </div>
        
        <div className="loading-text">
          {progress < 100 ? (
            <span>LOADING GAMING EXPERIENCE... {Math.floor(progress)}%</span>
          ) : (
            <span className="ready-text">READY PLAYER ONE</span>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          overflow: hidden;
        }
        
        .loading-flash {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #fff;
          opacity: 0;
          z-index: 10000;
          pointer-events: none;
        }
        
        .loading-container {
          width: 80%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: center center;
        }
        
        .loading-logo {
          font-size: 5rem;
          font-weight: 900;
          margin-bottom: 2rem;
          text-shadow: 0 0 20px rgba(69, 183, 209, 0.7);
          letter-spacing: -2px;
          position: relative;
        }
        
        .r {
          color: #ff6b6b;
        }
        
        .number {
          color: #45b7d1;
          font-style: italic;
        }
        
        .gaming {
          font-size: 2rem;
          color: #fff;
          letter-spacing: 5px;
          position: absolute;
          bottom: -1rem;
          right: 0;
        }
        
        .loading-progress-container {
          width: 100%;
          height: 10px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 20px rgba(69, 183, 209, 0.5);
        }
        
        .loading-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #45b7d1);
          border-radius: 5px;
          transition: width 0.2s ease;
          position: relative;
        }
        
        .loading-progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: progress-shine 1s infinite;
        }
        
        .loading-glitch-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          );
          opacity: 0.3;
          pointer-events: none;
        }
        
        .loading-text {
          color: #fff;
          font-size: 1.2rem;
          font-family: monospace;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        .ready-text {
          color: #45b7d1;
          font-weight: bold;
          font-size: 1.5rem;
          animation: pulse 1s infinite alternate;
        }
        
        @keyframes progress-shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes pulse {
          0% {
            text-shadow: 0 0 5px rgba(69, 183, 209, 0.7);
          }
          100% {
            text-shadow: 0 0 20px rgba(69, 183, 209, 1), 0 0 30px rgba(69, 183, 209, 0.7);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;