import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFirestore } from "../../hooks/useFirestore";
import gsap from "gsap";
import "./Footer.css";

interface FooterData {
  id?: string;
  logo: string;
  tagline: string;
  platformLinks: { label: string; url: string }[];
  companyLinks: { label: string; url: string }[];
  supportLinks: { label: string; url: string }[];
  copyright: string;
  builtWith: string;
}

interface FooterProps {
  isAdmin?: boolean;
  onSave?: (data: FooterData) => void;
}

const Footer: React.FC<FooterProps> = ({ isAdmin = false, onSave }) => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FooterData | null>(null);

  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { documents, addDocument, updateDocument } =
    useFirestore<FooterData>("footer");

  // Check if user is admin
  const isUserAdmin = isAdmin || user?.email === "admin@r17.com";

  // Default footer data from image (without social links)
  const defaultData: FooterData = {
    id: "footer-1",
    logo: "R17",
    tagline:
      "The world's premier competitive gaming platform. Home to millions of warriors, hundreds of tournaments, and the most intense esports action on the planet.",
    platformLinks: [
      { label: "All Games", url: "#games" },
      { label: "Tournaments", url: "#tournaments" },
      { label: "Leaderboard", url: "#leaderboard" },
      { label: "Live Matches", url: "#live" },
      { label: "Prize Pool", url: "#prize" },
    ],
    companyLinks: [
      { label: "About R17", url: "#about" },
      { label: "Careers", url: "#careers" },
      { label: "Press Kit", url: "#press" },
      { label: "Partners", url: "#partners" },
      { label: "Blog", url: "#blog" },
    ],
    supportLinks: [
      { label: "Help Center", url: "#help" },
      { label: "Terms of Service", url: "#terms" },
      { label: "Privacy Policy", url: "#privacy" },
      { label: "Contact Us", url: "#contact" },
    ],
    copyright: "© 2025 R17 Gaming. Built with ❤️ for warriors.",
    builtWith: "Built with ❤️ for warriors",
  };

  // Load footer data
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
      // Logo animation
      gsap.from(logoRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      // Links animation
      gsap.from(linksRef.current?.children || [], {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

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
      console.error("Error saving footer data:", error);
    }
  };

  const handleChange = (field: keyof FooterData, value: any) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleLinkChange = (
    section: "platformLinks" | "companyLinks" | "supportLinks",
    index: number,
    field: "label" | "url",
    value: string,
  ) => {
    if (editData) {
      const updatedLinks = [...editData[section]];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      setEditData({ ...editData, [section]: updatedLinks });
    }
  };

  if (!editData) return null;

  return (
    <footer className="footer" ref={footerRef}>
      {/* Background Effects */}
      <div className="footer-bg-gradient"></div>
      <div className="footer-particles"></div>

      <div className="footer-container">
        {/* Admin Controls */}
        {isUserAdmin && !isEditing && (
          <button className="admin-edit-btn" onClick={handleEdit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 3l4 4-7 7H10v-4l7-7z" strokeWidth="2" />
              <path d="M4 20h16" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Edit Footer
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

        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Logo Section */}
          <div className="footer-logo-section" ref={logoRef}>
            {isEditing ? (
              <div className="edit-field">
                <label>Logo Text</label>
                <input
                  type="text"
                  value={editData.logo}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  placeholder="Logo"
                />
              </div>
            ) : (
              <div className="footer-logo">
                <span className="logo-text">{editData.logo}</span>
                <div className="logo-glow"></div>
              </div>
            )}

            {isEditing ? (
              <div className="edit-field">
                <label>Tagline</label>
                <textarea
                  value={editData.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="Tagline"
                  rows={3}
                />
              </div>
            ) : (
              <p className="footer-tagline">{editData.tagline}</p>
            )}
          </div>

          {/* Links Sections */}
          <div className="footer-links-grid" ref={linksRef}>
            {/* Platform Links */}
            <div className="footer-column">
              <h3 className="column-title">PLATFORM</h3>
              {isEditing ? (
                <div className="edit-links">
                  {editData.platformLinks.map((link, index) => (
                    <div key={index} className="edit-link-item">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          handleLinkChange(
                            "platformLinks",
                            index,
                            "label",
                            e.target.value,
                          )
                        }
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(
                            "platformLinks",
                            index,
                            "url",
                            e.target.value,
                          )
                        }
                        placeholder="URL"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="footer-links">
                  {editData.platformLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.url} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Company Links */}
            <div className="footer-column">
              <h3 className="column-title">COMPANY</h3>
              {isEditing ? (
                <div className="edit-links">
                  {editData.companyLinks.map((link, index) => (
                    <div key={index} className="edit-link-item">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          handleLinkChange(
                            "companyLinks",
                            index,
                            "label",
                            e.target.value,
                          )
                        }
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(
                            "companyLinks",
                            index,
                            "url",
                            e.target.value,
                          )
                        }
                        placeholder="URL"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="footer-links">
                  {editData.companyLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.url} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Support Links */}
            <div className="footer-column">
              <h3 className="column-title">SUPPORT</h3>
              {isEditing ? (
                <div className="edit-links">
                  {editData.supportLinks.map((link, index) => (
                    <div key={index} className="edit-link-item">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          handleLinkChange(
                            "supportLinks",
                            index,
                            "label",
                            e.target.value,
                          )
                        }
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(
                            "supportLinks",
                            index,
                            "url",
                            e.target.value,
                          )
                        }
                        placeholder="URL"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="footer-links">
                  {editData.supportLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.url} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="bottom-content">
            {isEditing ? (
              <div className="edit-field">
                <label>Copyright Text</label>
                <input
                  type="text"
                  value={editData.copyright}
                  onChange={(e) => handleChange("copyright", e.target.value)}
                  placeholder="Copyright"
                />
              </div>
            ) : (
              <p className="copyright">{editData.copyright}</p>
            )}

            {isUserAdmin && !isEditing && (
              <button
                className="admin-link"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="footer-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-dots"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
