"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  className?: string; // allow custom styles
}

interface HeaderProps {
  left: string | JSX.Element;     
  navLinks?: NavLink[];           
  rightButtons?: React.ReactNode[]; // full custom components, not just labels
  headerClassName?: string;       // custom header styles
  navClassName?: string;          // custom nav wrapper
  mobileMenuClassName?: string;   // custom mobile dropdown
}

const Header: React.FC<HeaderProps> = ({
  left,
  navLinks = [],
  rightButtons = [],
  headerClassName = "flex items-center justify-between mt-5 px-6 py-3 bg-transparent relative font-poppins",
  navClassName = "flex space-x-6",
  mobileMenuClassName = "absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start p-4 space-y-4 md:hidden"
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={headerClassName}>
      {/* Left */}
      <div className="flex items-center text-xl font-bold">
        {typeof left === "string" ? (
          <h1 className="uppercase text-[#000000]">{left}</h1>
        ) : (
          left
        )}
      </div>

      {/* Desktop Nav */}
      <nav className={`hidden md:${navClassName}`}>
        {navLinks.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={item.className || "text-black hover:text-indigo-500 transition"}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Desktop Buttons */}
      <div className="hidden md:flex space-x-3">
        {rightButtons.map((btn, index) => (
          <div key={index}>{btn}</div> // already a full component
        ))}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className={mobileMenuClassName}>
          {navLinks.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={item.className || "w-full text-gray-700 hover:text-indigo-500 transition"}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <div className="w-full flex flex-col space-y-2">
            {rightButtons.map((btn, index) => (
              <div
                key={index}
                onClick={() => setMenuOpen(false)} // still close menu when clicked
              >
                {btn}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
