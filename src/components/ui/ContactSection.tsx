import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuth } from "../../hooks/useAuth";
import "./ContactSection.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read?: boolean;
  replied?: boolean;
}

interface ContactSectionProps {
  isAdmin?: boolean;
  onSave?: (data: any) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  isAdmin = false,
  onSave,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "info@r17gaming.com",
    phone: "+1 (555) 123-4567",
    address: "123 Gaming Street, E-Sports City, EC 12345",
    discord: "https://discord.gg/r17gaming",
    twitter: "https://twitter.com/r17gaming",
    twitch: "https://twitch.tv/r17gaming",
    youtube: "https://youtube.com/r17gaming",
  });

  const [editInfo, setEditInfo] = useState(contactInfo);

  const { addDocument } = useFirestore<ContactMessage>("contact-messages");
  const { user } = useAuth();

  // Check if user is admin
  const isUserAdmin = isAdmin || user?.email === "admin@r17.com";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        ease: "power3.out",
      });

      // Form animation
      gsap.from(formRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        ease: "power3.out",
      });

      // Info animation
      gsap.from(infoRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        ease: "power3.out",
      });

      // Map animation
      gsap.from(mapRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contactMessage: ContactMessage = {
        name,
        email,
        subject,
        message,
        date: new Date().toISOString(),
        read: false,
        replied: false,
      };

      await addDocument(contactMessage);

      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitted(true);
      setLoading(false);

      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to submit your message. Please try again.");
      setLoading(false);
    }
  };

  // Admin functions
  const handleEdit = () => {
    setEditInfo(contactInfo);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setContactInfo(editInfo);
    setIsEditing(false);
    if (onSave) {
      onSave(editInfo);
    }
  };

  const handleInfoChange = (field: keyof typeof contactInfo, value: string) => {
    setEditInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="contact-section" ref={sectionRef} id="contact">
      {/* Background Effects */}
      <div className="contact-bg-gradient"></div>
      <div className="contact-particles"></div>

      <div className="contact-container">
        {/* Header */}
        <div className="contact-header" ref={titleRef}>
          <h2 className="section-title">
            <span className="title-accent">//</span> GET IN TOUCH
          </h2>
          <p className="section-subtitle">
            Have questions? Want to collaborate? We'd love to hear from you.
          </p>
          <div className="title-divider">
            <span className="divider-line"></span>
            <span className="divider-icon">📬</span>
            <span className="divider-line"></span>
          </div>
        </div>

        {/* Admin Controls */}
        {isUserAdmin && !isEditing && (
          <button className="admin-edit-btn" onClick={handleEdit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 3l4 4-7 7H10v-4l7-7z" strokeWidth="2" />
              <path d="M4 20h16" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Edit Contact Info
          </button>
        )}

        {isUserAdmin && isEditing && (
          <div className="admin-edit-bar">
            <button className="admin-save-btn" onClick={handleSave}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Save Changes
            </button>
            <button className="admin-cancel-btn" onClick={handleCancel}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Cancel
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-wrapper" ref={formRef}>
            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours.
                </p>
                <div className="success-glow"></div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3 className="form-title">SEND US A MESSAGE</h3>

                <div className="form-group">
                  <label htmlFor="name">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                        strokeWidth="2"
                      />
                      <circle cx="12" cy="7" r="4" strokeWidth="2" />
                    </svg>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                  <div className="input-border"></div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        strokeWidth="2"
                      />
                      <path d="M22 6l-10 7L2 6" strokeWidth="2" />
                    </svg>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <div className="input-border"></div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                        strokeWidth="2"
                      />
                      <circle cx="12" cy="10" r="3" strokeWidth="2" />
                    </svg>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                    required
                  />
                  <div className="input-border"></div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        strokeWidth="2"
                      />
                    </svg>
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your inquiry..."
                    rows={5}
                    required
                  ></textarea>
                  <div className="input-border"></div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <div className="loader">
                      <div className="loader-dot"></div>
                      <div className="loader-dot"></div>
                      <div className="loader-dot"></div>
                    </div>
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <svg
                        className="btn-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                          strokeWidth="2"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <p className="form-disclaimer">
                  <span className="disclaimer-icon">🔒</span>
                  Your information is secure and will never be shared.
                </p>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="contact-info-wrapper" ref={infoRef}>
            <div className="contact-info-card">
              <h3 className="info-title">⚡ REACH OUT TO US</h3>

              {isEditing ? (
                <div className="edit-info-form">
                  <div className="edit-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editInfo.email}
                      onChange={(e) =>
                        handleInfoChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div className="edit-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={editInfo.phone}
                      onChange={(e) =>
                        handleInfoChange("phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="edit-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={editInfo.address}
                      onChange={(e) =>
                        handleInfoChange("address", e.target.value)
                      }
                    />
                  </div>
                  <div className="edit-group">
                    <label>Discord</label>
                    <input
                      type="text"
                      value={editInfo.discord}
                      onChange={(e) =>
                        handleInfoChange("discord", e.target.value)
                      }
                    />
                  </div>
                  <div className="edit-group">
                    <label>Twitter</label>
                    <input
                      type="text"
                      value={editInfo.twitter}
                      onChange={(e) =>
                        handleInfoChange("twitter", e.target.value)
                      }
                    />
                  </div>
                  <div className="edit-group">
                    <label>Twitch</label>
                    <input
                      type="text"
                      value={editInfo.twitch}
                      onChange={(e) =>
                        handleInfoChange("twitch", e.target.value)
                      }
                    />
                  </div>
                  <div className="edit-group">
                    <label>YouTube</label>
                    <input
                      type="text"
                      value={editInfo.youtube}
                      onChange={(e) =>
                        handleInfoChange("youtube", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="info-items">
                    <div className="info-item">
                      <div className="info-icon">📧</div>
                      <div className="info-content">
                        <span className="info-label">Email</span>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="info-value"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">📱</div>
                      <div className="info-content">
                        <span className="info-label">Phone</span>
                        <a
                          href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                          className="info-value"
                        >
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">📍</div>
                      <div className="info-content">
                        <span className="info-label">Address</span>
                        <span className="info-value">
                          {contactInfo.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="social-section">
                    <h4 className="social-title">JOIN OUR COMMUNITY</h4>
                    <div className="social-grid">
                      <a
                        href={contactInfo.discord}
                        className="social-card discord"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22 24l-5.25-5.25 1.5-1.5L22 21.75V24zM2 24v-2.25l3.75-3.75 1.5 1.5L4 24H2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        </svg>
                        <span>Discord</span>
                      </a>
                      <a
                        href={contactInfo.twitter}
                        className="social-card twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                        </svg>
                        <span>Twitter</span>
                      </a>
                      <a
                        href={contactInfo.twitch}
                        className="social-card twitch"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.86L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43v7.86z" />
                        </svg>
                        <span>Twitch</span>
                      </a>
                      <a
                        href={contactInfo.youtube}
                        className="social-card youtube"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.5 6.19a2.79 2.79 0 0 0-1.96-1.96C19.76 4 12 4 12 4s-7.76 0-9.54.23A2.79 2.79 0 0 0 .5 6.19 29.1 29.1 0 0 0 0 12a29.1 29.1 0 0 0 .5 5.81 2.79 2.79 0 0 0 1.96 1.96C4.24 20 12 20 12 20s7.76 0 9.54-.23a2.79 2.79 0 0 0 1.96-1.96A29.1 29.1 0 0 0 24 12a29.1 29.1 0 0 0-.5-5.81zM9.55 15.42V8.58L15.91 12l-6.36 3.42z" />
                        </svg>
                        <span>YouTube</span>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Response Badge */}
            <div className="response-badge">
              <div className="badge-glow"></div>
              <span className="badge-icon">⚡</span>
              <div className="badge-text">
                <strong>Average response time</strong>
                <span>&lt; 2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
