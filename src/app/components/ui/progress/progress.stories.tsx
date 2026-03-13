import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@/app/components/ui/progress/progress"; // Adjust the import path as needed

// Typing for your component props
type ProgressProps = React.ComponentPropsWithoutRef<typeof Progress>;

export default {
  title: "Example/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      defaultValue: 50,
      className: { control: "text" },
    },
    // You can add more argTypes if your Progress component accepts more props
  },
} as Meta<ProgressProps>;

export const Basic: StoryObj<ProgressProps> = {
  args: {
    value: 50,
  },
};

export const Empty: StoryObj<ProgressProps> = {
  args: {
    value: 0,
  },
};

export const Full: StoryObj<ProgressProps> = {
  args: {
    value: 100,
  },
};

// You can continue to add more stories to demonstrate different states or styles
