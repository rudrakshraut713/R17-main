import React, { useEffect, useRef } from "react";
import "./AnnouncementBar.css";

interface AnnouncementBarProps {
  speed?: number; // Animation speed in seconds
  pauseOnHover?: boolean;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  speed = 30,
  pauseOnHover = true,
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marquee2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Adjust animation speed based on prop
    if (marqueeRef.current) {
      marqueeRef.current.style.animation = `marquee ${speed}s linear infinite`;
    }
    if (marquee2Ref.current) {
      marquee2Ref.current.style.animation = `marquee2 ${speed}s linear infinite`;
    }
  }, [speed]);

  const announcements = [
    {
      text: "$2.8M PRIZE POOL",
      type: "highlight",
      badge: "LIVE NOW",
    },
    {
      text: "WORLD CHAMPIONSHIP",
      date: "DEC 2025",
      type: "gold",
    },
    {
      text: "NEW MAPS DROP TODAY",
      type: "normal",
      badge: "HOT",
    },
    {
      text: "REGISTER NOW",
      type: "cta",
      badge: "FREE",
    },
    {
      text: "SEASON 6 NOW LIVE",
      type: "normal",
      badge: "NEW",
    },
  ];

  const renderAnnouncementItem = (
    item: (typeof announcements)[0],
    index: number,
  ) => {
    let textClass = "announcement-item";
    if (item.type === "highlight") textClass += " announcement-highlight";
    if (item.type === "gold") textClass += " announcement-gold";
    if (item.type === "cta") textClass += " announcement-highlight";

    return (
      <div key={index} className={textClass}>
        <span className="announcement-separator"></span>
        <span>{item.text}</span>
        {item.date && <span className="announcement-date">{item.date}</span>}
        {item.badge && <span className="announcement-badge">{item.badge}</span>}
      </div>
    );
  };

  return (
    <div
      className={`announcement-wrapper ${pauseOnHover ? "pause-on-hover" : ""}`}
    >
      {/* First marquee */}
      <div className="announcement-marquee" ref={marqueeRef}>
        <div className="announcement-content">
          {announcements.map((item, index) =>
            renderAnnouncementItem(item, index),
          )}
        </div>
        <div className="announcement-content">
          {announcements.map((item, index) =>
            renderAnnouncementItem(item, index),
          )}
        </div>
      </div>

      {/* Second marquee for seamless loop (optional) */}
      <div
        className="announcement-marquee-2"
        ref={marquee2Ref}
        aria-hidden="true"
      >
        <div className="announcement-content">
          {announcements.map((item, index) =>
            renderAnnouncementItem(item, index),
          )}
        </div>
        <div className="announcement-content">
          {announcements.map((item, index) =>
            renderAnnouncementItem(item, index),
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
