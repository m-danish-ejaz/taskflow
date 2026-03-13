import React from "react";
import { Button } from "../button/button";
import { WebButton } from "./header";

interface Props {
  buttons?: WebButton[];
  onOptionClick?: (href: string) => void;
}

export const HeaderButtons: React.FC<Props> = ({ buttons, onOptionClick }) => {
  // Default buttons (from old Header.tsx)
  const defaultButtons: WebButton[] = [
    { label: "Login", variant: "outline", href: "/login" },
    { label: "Signup", variant: "default", href: "/signup" },
  ];

  const finalButtons = buttons && buttons.length > 0 ? buttons : defaultButtons;

  return (
    <div className="flex items-center gap-3">
      {finalButtons.map((btn, i) => (
        <a
          key={i}
          href={btn.href || "#"}
          onClick={(e) => {
            e.preventDefault();
            if (btn.href) onOptionClick?.(btn.href);
          }}
        >
          <Button variant={btn.variant || "default"} size="sm">
            {btn.label}
          </Button>
        </a>
      ))}
    </div>
  );
};
