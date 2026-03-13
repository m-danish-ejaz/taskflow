import type { Meta, StoryObj } from "@storybook/react";
import GlassMorphicCard from "./glassMorphicCard";

const meta: Meta<typeof GlassMorphicCard> = {
  title: "Components/GlassMorphicCard",
  component: GlassMorphicCard,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    buttonText: { control: "text" },
    colors: {
      control: "object",
      description: "Background gradient colors",
    },
    textColor: { control: "color" },
    buttonColor: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof GlassMorphicCard>;

export const Default: Story = {
  args: {
    title: "Dynamic Card",
    description: "All content is controlled via Storybook props",
    buttonText: "View More",
    socialLinks: [
      { icon: <i className="bi bi-facebook"></i>, href: "https://facebook.com" },
      { icon: <i className="bi bi-twitter"></i>, href: "https://twitter.com" },
      { icon: <i className="bi bi-instagram"></i>, href: "https://instagram.com" },
    ],
    colors: { from: "rgb(0, 255, 214)", to: "rgb(8, 226, 96)" },
    textColor: "#00894d",
    buttonColor: "#00c37b",
  },
};

export const WarmGradient: Story = {
  args: {
    title: "Warm Gradient Card",
    description: "This uses orange gradient colors",
    buttonText: "Explore",
    socialLinks: [
      { icon: <i className="bi bi-youtube"></i>, href: "https://youtube.com" },
      { icon: <i className="bi bi-linkedin"></i>, href: "https://linkedin.com" },
    ],
    colors: { from: "#ff7e5f", to: "#feb47b" },
    textColor: "#222",
    buttonColor: "#ff4500",
  },
};

export const WithImageIcons: Story = {
  args: {
    title: "Custom Icons",
    description: "Here icons are images instead of font-icons",
    buttonText: "Check Now",
    socialLinks: [
      { icon: <img src="https://via.placeholder.com/15" alt="custom" />, href: "#" },
      { icon: <img src="https://via.placeholder.com/15" alt="custom" />, href: "#" },
    ],
    colors: { from: "#4facfe", to: "#00f2fe" },
    textColor: "#003366",
    buttonColor: "#0066cc",
  },
};
