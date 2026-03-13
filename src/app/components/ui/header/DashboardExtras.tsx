import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../accordion/accordion";
import { ProfileOption } from "./header";

interface Props {
  showSearch?: boolean;
  showNotifications?: boolean;
  profileOptions?: ProfileOption[];
  profileOptionClassName?: string;
}

export const DashboardExtras: React.FC<Props> = ({
  showSearch,
  showNotifications,
  profileOptions,
  profileOptionClassName,
}) => {
  // Default profile options
  const defaultProfileOptions: ProfileOption[] = [
    { label: "Profile", href: "/profile" },
    { label: "Update", href: "/update" },
    { label: "Logout", href: "/logout", className: "text-red-500 hover:text-red-600" },
  ];

  const finalProfileOptions =
    profileOptions && profileOptions.length > 0
      ? profileOptions
      : defaultProfileOptions;

  const defaultProfileClasses = "text-sm text-black hover:text-indigo-600";

  return (
    <div className="flex items-center gap-4">
      {showSearch && (
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      )}
      {showNotifications && (
        <button className="relative text-black">
          🔔
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>
      )}

      <Accordion type="single" collapsible className="w-40">
        <AccordionItem value="profile">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-white">
                JD
              </span>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2 px-2">
              {finalProfileOptions.map((opt) => (
                <li key={opt.href}>
                  <a
                    href={opt.href}
                    className={opt.className || profileOptionClassName || defaultProfileClasses}
                  >
                    {opt.label}
                  </a>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
