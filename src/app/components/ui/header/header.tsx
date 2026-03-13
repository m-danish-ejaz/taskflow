import React from "react";
import { HeaderButtons } from "./HeaderButtons";
import { HeaderNav } from "./HeaderNav";
import { DashboardExtras } from "./DashboardExtras";

export interface HeaderOption {
  label: string;
  href: string;
}

export interface ProfileOption {
  label: string;
  href: string;
  className?: string;
}

export interface WebButton {
  label: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  href?: string;
}

export interface HeaderProps {
  variant?: "web" | "dashboard";
  logoText?: string;
  options?: HeaderOption[];
  activeOption?: string;
  optionClassName?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  profileOptions?: ProfileOption[];
  profileOptionClassName?: string;
  webButtons?: WebButton[];
  onOptionClick?: (href: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  variant = "web",
  logoText,
  options,
  activeOption,
  optionClassName,
  showSearch = true,
  showNotifications = true,
  profileOptions,
  profileOptionClassName,
  webButtons,
  onOptionClick,
}) => {
  return (
    <header
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 shadow-sm z-50 ${
        variant === "dashboard"
          ? "bg-indigo-100 border-b border-indigo-300"
          : "bg-white"
      }`}
    >
      <div className="flex items-center gap-6">
        <h1
          className={`select-none ${
            variant === "web"
              ? "text-xl font-bold text-black"
              : "text-lg font-semibold text-black"
          }`}
        >
          {logoText || (variant === "web" ? "My Portfolio" : "📊 Dashboard")}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {variant === "web" && (
          <>
            <HeaderNav
              options={options}
              activeOption={activeOption}
              optionClassName={optionClassName}
              onOptionClick={onOptionClick}
            />
            <HeaderButtons buttons={webButtons} onOptionClick={onOptionClick} />
          </>
        )}

        {variant === "dashboard" && (
          <DashboardExtras
            showSearch={showSearch}
            showNotifications={showNotifications}
            profileOptions={profileOptions}
            profileOptionClassName={profileOptionClassName}
          />
        )}
      </div>
    </header>
  );
};
