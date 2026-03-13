import React from "react";

interface CardProps {
  image?: string; // URL or Bootstrap icon class
  heading?: string;
  content?: string;
  variant?: "default" | "product"; // 👈 added
  classNames?: {
    card?: string;
    image?: string;
    icon?: string;
    heading?: string;
    content?: string;
    body?: string; // for wrapper
  };
}

const Card: React.FC<CardProps> = ({
  image,
  heading,
  content,
  variant = "default", // 👈 default to old style
  classNames = {},
}) => {
  const defaultHeading = "Default Heading";
  const defaultContent = "This is a default content description for the card.";

  const isBootstrapIcon = typeof image === "string" && image.startsWith("bi-");

  if (variant === "product") {
    // 👇 Product-style card (image top, text below)
    return (
      <div
        className={`shadow-md rounded-xl p-4 flex flex-col items-center gap-4 transform ${classNames.card || ""}`}
      >
        {isBootstrapIcon ? (
          <i
            className={`bi ${image} text-5xl text-indigo-500 ${classNames.icon || ""}`}
          ></i>
        ) : (
          <img
            src={
              typeof image === "string"
                ? image
                : image
                ? (image as any).src || ""
                : "/mnt/data/009868f1-9d39-4259-b337-3f0b677198a6.png"
            }
            alt={heading || defaultHeading}
            className={`w-24 h-24 object-contain ${classNames.image || ""}`}
          />
        )}

        <div className={`flex flex-col items-center text-center ${classNames.body || ""}`}>
          <h5 className={`text-lg font-semibold ${classNames.heading || ""}`}>
            {heading || defaultHeading}
          </h5>
          <p className={`text-black ${classNames.content || ""}`}>
            {content || defaultContent}
          </p>
        </div>
      </div>
    );
  }

  // 👇 Default horizontal card (your old layout)
  return (
    <div
      className={`shadow-md rounded-xl p-4 flex flex-col md:flex-row items-center md:items-start gap-4 transform ${classNames.card || ""}`}
    >
      <div>
        {isBootstrapIcon ? (
          <i className={`bi ${image} ${classNames.icon || ""}`}></i>
        ) : (
          <img
            src={
              typeof image === "string"
                ? image
                : image
                ? (image as any).src || ""
                : "/mnt/data/009868f1-9d39-4259-b337-3f0b677198a6.png"
            }
            alt={heading || defaultHeading}
            className={`w-16 h-16 object-contain ${classNames.image || ""}`}
          />
        )}
      </div>
      <div className={`flex flex-col justify-center ${classNames.body || ""}`}>
        <h5 className={`text-lg font-semibold ${classNames.heading || ""}`}>
          {heading || defaultHeading}
        </h5>
        <p className={`text-black ${classNames.content || ""}`}>
          {content || defaultContent}
        </p>
      </div>
    </div>
  );
};

export default Card;
