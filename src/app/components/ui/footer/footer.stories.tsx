import type { Meta, StoryObj } from "@storybook/react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Footer from "./footer";


const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    logoText: "Debt Calculator",
    address: "Level 1, 12 Sample St, Sydney NSW 2000",
    contactPhone: "1800 123 4567",
    contactEmail: "support@debtcalculator.com",
    socialLinks: [
      { icon: <FaFacebookF />, href: "#" },
      { icon: <FaInstagram />, href: "#" },
      { icon: <FaTwitter />, href: "#" },
    ],
    links: {
      column1: [
        { label: "Help Center", href: "#" },
        { label: "FAQs", href: "#" },
        { label: "Blog Posts", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "About Us", href: "#" },
      ],
      column2: [
        { label: "Careers", href: "#" },
        { label: "Community Forum", href: "#" },
        { label: "User Guide", href: "#" },
        { label: "Feedback", href: "#" },
        { label: "Affiliate Program", href: "#" },
      ],
    },
    bottomLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookies Settings", href: "#" },
    ],
    companyName: "Debt Calculator",
    classNames: {
      footer: "shadow-lg", // custom class for styling in story
    },
  },
};
