import React from "react";
import "../../../styles/glassMorphicCard.css";

interface SocialLink {
  icon: React.ReactNode;  
  href: string;
}

interface GlassMorphicCardProps {
  title: string;
  description: string;
  buttonText: string;
  socialLinks: SocialLink[];
  colors?: { from: string; to: string };   // background gradient
  textColor?: string;                      // content text color
  buttonColor?: string;                    // view more button color
}

const GlassMorphicCard: React.FC<GlassMorphicCardProps> = ({
  title,
  description,
  buttonText,
  socialLinks,
  colors = { from: "rgb(0, 255, 214)", to: "rgb(8, 226, 96)" }, // default colors
  textColor = "#00894d",
  buttonColor = "#00c37b",
}) => {
  return (
    <div className="parent">
      <div
        className="card"
        style={{
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
        }}
      >
        <div className="logo">
          <span className="circle circle1"></span>
          <span className="circle circle2"></span>
          <span className="circle circle3"></span>
          <span className="circle circle4"></span>
          <span className="circle circle5"></span>
        </div>

        <div className="glass"></div>

        <div className="content">
          <span className="title" style={{ color: textColor }}>
            {title}
          </span>
          <span className="text" style={{ color: textColor }}>
            {description}
          </span>
        </div>

        <div className="bottom">
          <div className="social-buttons-container">
            {socialLinks.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="social-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.icon}
              </a>
            ))}
          </div>
          <div className="view-more">
            <button
              className="view-more-button"
              style={{ color: buttonColor }}
            >
              {buttonText}
            </button>
            <i className="bi bi-chevron-down" style={{ color: buttonColor }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassMorphicCard;
