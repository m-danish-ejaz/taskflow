import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Components/Button", // Add a title for better organization in Storybook
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    primary: true, // Example prop, update based on your Button component
    label: "Click Me", // This should match the required props of the Button
    size: "medium", // Example prop
    backgroundColor: "#1ea7fd", // Example prop
  },
};
