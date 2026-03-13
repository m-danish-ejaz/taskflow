"use client";

import React from "react";

interface FooterProps {
  logoText: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  /** Array of social icons (React elements, e.g. <FaFacebookF />) with href */
  socialLinks?: { icon: React.ReactNode; href: string }[];
  links: {
    column1: { label: string; href: string }[];
    column2: { label: string; href: string }[];
  };
  bottomLinks: { label: string; href: string }[];
  companyName: string;
  classNames: {
    footer: string;
  };
}

const Footer: React.FC<FooterProps> = ({
  logoText,
  address,
  contactPhone,
  contactEmail,
  socialLinks = [],
  links,
  bottomLinks,
  companyName,
  classNames = {},
}) => {
  return (
    <footer
      className={`bg-[#62362b] text-white py-[4rem] px-[3rem] font-poppins ${
        classNames.footer
      }`}
    >
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 justify-between md:grid-cols-3 gap-10">
        {/* Upper Footer left side*/}
        <div className="flex flex-col gap-y-8">
          <h2 className="text-3xl font-semibold">{logoText}</h2>

          <div className="mt-3">
            <h3 className="text-sm font-semibold mb-1">Address:</h3>
            <p className="text-sm font-light">{address}</p>
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-semibold mb-1">Contact:</h3>
            <p className="text-sm">
              <a href={`tel:${contactPhone}`} className="hover:underline">
                {contactPhone}
              </a>
            </p>
            <p className="text-sm">
              <a href={`mailto:${contactEmail}`} className="hover:underline">
                {contactEmail}
              </a>
            </p>
          </div>

          {/* Socials */}
          {socialLinks.length > 0 && (
            <div className="flex space-x-4 text-lg mt-3">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="hover:text-gray-300 transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Upper Footer Right side*/}
        <div className="md:col-span-2 flex justify-end gap-x-12">
          {/* Links Column 1 */}
          <div >
            <ul className="space-y-3">
              {links.column1.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="hover:underline text-sm font-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="ml-[5rem]">
            <ul className="space-y-3">
              {links.column2.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="hover:underline text-sm font-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 mt-10 pt-10 flex flex-col mx-[3.25rem] md:flex-row justify-between items-center text-xs text-gray-200">
        <p>
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-3 md:mt-0">
          {bottomLinks.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="underline hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
