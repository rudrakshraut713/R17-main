import { useState, useEffect, useRef } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";
import gsap from "gsap";
import "./Newsletter.css";

interface NewsletterData {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  placeholder: string;
  buttonText: string;
  disclaimer: string;
  subscriberCount: string;
  successMessage: string;
  errorMessage: string;
  backgroundColor?: string;
  accentColor?: string;
}

interface NewsletterProps {
  isAdmin?: boolean;
  onSave?: (data: NewsletterData) => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ isAdmin = false, onSave }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [subscriberCount, setSubscriberCount] = useState("240K+");

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<NewsletterData | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();

  const { documents, addDocument, updateDocument } =
    useFirestore<NewsletterData>("newsletter");

  // Check if user is admin
  const isUserAdmin = isAdmin || user?.email === "admin@r17.com";

  // Default newsletter data from image
  const defaultData: NewsletterData = {
    id: "newsletter-1",
    title: "STAY IN THE LOOP",
    subtitle: "DON'T MISS A MATCH",
    description:
      "Tournament alerts, patch notes, and exclusive drops – straight to your inbox.",
    placeholder: "your@email.com",
    buttonText: "SUBSCRIBE",
    disclaimer: "No spam. Unsubscribe anytime.",
    subscriberCount: "240K+",
    successMessage: "Thanks for subscribing! Check your email to confirm.",
    errorMessage: "Please enter a valid email address.",
    accentColor: "#ff2233",
  };

  // Load newsletter data
  useEffect(() => {
    if (documents && documents.length > 0) {
      setEditData(documents[0]);
    } else {
      setEditData(defaultData);
    }
  }, [documents]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(contentRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.from(formRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: "back.out(1.7)",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError(editData?.errorMessage || "Please enter a valid email address.");
      return;
    }

    try {
      // Here you would typically send this to your backend
      console.log("Subscribing email:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubscribed(true);
      setError("");
      setEmail("");

      // Update subscriber count (in a real app, this would come from backend)
      if (subscriberCount.includes("K+")) {
        const num = parseInt(subscriberCount.replace("K+", ""));
        setSubscriberCount(`${num + 5}K+`);
      }

      // Reset success message after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  // Admin functions
  const handleEdit = () => {
    if (editData) {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(documents && documents.length > 0 ? documents[0] : defaultData);
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      if (editData.id) {
        await updateDocument(editData.id, editData);
      } else {
        await addDocument(editData);
      }

      setIsEditing(false);
      if (onSave) {
        onSave(editData);
      }
    } catch (error) {
      console.error("Error saving newsletter data:", error);
    }
  };

  const handleChange = (field: keyof NewsletterData, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  if (!editData) return null;

  return (
    <section className="newsletter" ref={sectionRef}>
      {/* Background Effects */}
      <div className="newsletter-bg-gradient"></div>
      <div className="newsletter-particles"></div>

      <div className="newsletter-container">
        {/* Header */}
        <div className="newsletter-header">
          <h2 ref={titleRef} className="newsletter-title">
            <span className="title-accent">//</span> {editData.title}
          </h2>
          <div className="title-divider">
            <span className="divider-line"></span>
            <span className="divider-icon">📧</span>
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
            Edit Newsletter
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
        <div className="newsletter-content" ref={contentRef}>
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Section title"
                />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={editData.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  placeholder="Subtitle"
                />
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Description text"
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label>Placeholder Text</label>
                <input
                  type="text"
                  value={editData.placeholder}
                  onChange={(e) => handleChange("placeholder", e.target.value)}
                  placeholder="Email placeholder"
                />
              </div>
              <div className="form-group">
                <label>Button Text</label>
                <input
                  type="text"
                  value={editData.buttonText}
                  onChange={(e) => handleChange("buttonText", e.target.value)}
                  placeholder="Button text"
                />
              </div>
              <div className="form-group">
                <label>Disclaimer</label>
                <input
                  type="text"
                  value={editData.disclaimer}
                  onChange={(e) => handleChange("disclaimer", e.target.value)}
                  placeholder="Disclaimer text"
                />
              </div>
              <div className="form-group">
                <label>Subscriber Count</label>
                <input
                  type="text"
                  value={editData.subscriberCount}
                  onChange={(e) =>
                    handleChange("subscriberCount", e.target.value)
                  }
                  placeholder="e.g., 240K+"
                />
              </div>
              <div className="form-group">
                <label>Success Message</label>
                <input
                  type="text"
                  value={editData.successMessage}
                  onChange={(e) =>
                    handleChange("successMessage", e.target.value)
                  }
                  placeholder="Success message"
                />
              </div>
              <div className="form-group">
                <label>Error Message</label>
                <input
                  type="text"
                  value={editData.errorMessage}
                  onChange={(e) => handleChange("errorMessage", e.target.value)}
                  placeholder="Error message"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="newsletter-subtitle">{editData.subtitle}</h3>
              <p className="newsletter-description">{editData.description}</p>
            </>
          )}

          {/* Subscription Form */}
          <form
            ref={formRef}
            className={`newsletter-form ${subscribed ? "success" : ""}`}
            onSubmit={handleSubmit}
          >
            {!isEditing && (
              <>
                <div className="form-group">
                  <input
                    type="email"
                    className={`newsletter-input ${error ? "error" : ""}`}
                    placeholder={editData.placeholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    disabled={subscribed}
                  />
                  <button
                    type="submit"
                    className="newsletter-button"
                    disabled={subscribed}
                  >
                    {subscribed ? "✓ SUBSCRIBED" : editData.buttonText}
                    {!subscribed && (
                      <svg
                        className="button-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {error && <p className="error-message">{error}</p>}
                {subscribed && (
                  <p className="success-message">{editData.successMessage}</p>
                )}

                <p className="newsletter-disclaimer">
                  <span className="disclaimer-icon">🔒</span>
                  {editData.disclaimer}
                  <span className="subscriber-count">
                    <span className="count-number">
                      {editData.subscriberCount}
                    </span>{" "}
                    subscribers
                  </span>
                </p>
              </>
            )}
          </form>
        </div>

        {/* Decorative Elements */}
        <div className="newsletter-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
