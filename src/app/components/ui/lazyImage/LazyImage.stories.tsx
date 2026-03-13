import { Meta, StoryObj } from "@storybook/react";

import sampleImage from "@/assets/images/iceBg.jpg"; // Replace with an actual image
import thumbImage from "@/assets/images/iceBg-small.jpg"; // Replace with a smaller thumbnail
import LazyImage from "./lazyImage";

const meta: Meta<typeof LazyImage> = {
  title: "Components/LazyImage",
  component: LazyImage,
  args: {
    src: sampleImage, // Replace with a real image path
    thumb: thumbImage, // Replace with a real thumbnail path
    alt: "Sample Lazy Loaded Image",
    className: "w-64 h-64 rounded-md object-cover", // Adjust styling as needed
  },
  argTypes: {
    onClick: { action: "clicked" }, // Adds click action in Storybook UI
    onLoad: { action: "image loaded" }, // Logs when the image loads
  },
};

export default meta;

type Story = StoryObj<typeof LazyImage>;

export const Default: Story = {};
