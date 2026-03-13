import React from "react";
import { HeaderOption } from "./header";

interface Props {
  options?: HeaderOption[];
  activeOption?: string;
  optionClassName?: string;
  onOptionClick?: (href: string) => void;
}

export const HeaderNav: React.FC<Props> = ({
  options,
  activeOption,
  optionClassName,
  onOptionClick,
}) => {
  // Default nav options (from old Header.tsx)
  const defaultOptions: HeaderOption[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];

  const finalOptions = options && options.length > 0 ? options : defaultOptions;

  const defaultOptionClasses =
    "text-sm font-medium text-black hover:text-gray-700 transition-colors duration-200";

  return (
    <nav className="flex gap-6">
      {finalOptions.map((opt) => (
        <a
          key={opt.href}
          href={opt.href}
          onClick={(e) => {
            e.preventDefault();
            onOptionClick?.(opt.href);
          }}
          className={`${optionClassName || defaultOptionClasses} ${
            activeOption === opt.href ? "border-b-2 border-black font-semibold pb-1" : ""
          }`}
        >
          {opt.label}
        </a>
      ))}
    </nav>
  );
};
