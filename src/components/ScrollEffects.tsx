import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ScrollEffects = () => {
  useEffect(() => {
    // 创建GSAP上下文以便正确清理
    const ctx = gsap.context(() => {
      // 为标题添加3D视差效果
      const titles = document.querySelectorAll('.section-title');
      titles.forEach(title => {
        gsap.fromTo(
          title,
          { 
            opacity: 0,
            scale: 0.8,
            rotationX: 45,
            y: 100
          },
          {
            opacity: 1,
            scale: 1,
            rotationX: 0,
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: title,
              start: 'top bottom-=100',
              end: 'bottom center',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // 为游戏卡片添加出现效果
      const gameCards = document.querySelectorAll('.game-card');
      gameCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            rotationY: 15,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=50',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // 为英雄部分添加视差效果
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        const heroImage = heroSection.querySelector('.hero-image img');
        const heroContent = heroSection.querySelector('.hero-content');
        
        if (heroImage && heroContent) {
          // 图片浮动效果
          gsap.to(heroImage, {
            y: -80,
            scale: 1.1,
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            }
          });
          
          // 内容视差效果
          gsap.to(heroContent, {
            y: 80,
            opacity: 0.8,
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            }
          });
        }
      }

      // 为关于部分添加分段显示效果
      const aboutSection = document.querySelector('.about-section');
      if (aboutSection) {
        const aboutElements = aboutSection.querySelectorAll('.about-content, .about-image, .value-card');
        
        aboutElements.forEach((element, index) => {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              x: index % 2 === 0 ? -50 : 50,
              rotateZ: index % 2 === 0 ? -5 : 5
            },
            {
              opacity: 1,
              x: 0,
              rotateZ: 0,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start: 'top bottom-=100',
                end: 'bottom center',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });
      }

      // 为锦标赛部分添加爆炸效果
      const tournamentSection = document.querySelector('.tournaments-section');
      if (tournamentSection) {
        const tournamentItems = tournamentSection.querySelectorAll('.tournament-item');
        
        tournamentItems.forEach((item) => {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              scale: 0.5
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'elastic.out(1, 0.5)',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom-=50',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });
      }

      // 为页脚添加波浪效果
      const footer = document.querySelector('footer');
      if (footer) {
        const footerElements = footer.querySelectorAll('h3, .footer-links, .social-links');
        
        footerElements.forEach((element, index) => {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: 30
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: footer,
                start: 'top bottom-=100',
                toggleActions: 'play none none none'
              }
            }
          );
        });
      }

      // 为所有按钮添加悬停效果
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power1.out'
          });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power1.in'
          });
        });
      });
    });

    // 清理函数
    return () => ctx.revert();
  }, []);

  return null; // 这是一个纯功能组件，不渲染任何内容
};

export default ScrollEffects;