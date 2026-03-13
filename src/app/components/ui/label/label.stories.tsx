import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/app/components/ui/label/label"; // Adjust the import path as needed

interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
}

export default {
  title: "Example/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" },
    htmlFor: { control: "text" },
    // Add other controls for props your label might receive
  },
} as Meta<LabelProps>;

export const BasicLabel: StoryObj<LabelProps> = {
  args: {
    children: "Basic Label",
    htmlFor: "basic-input",
  },
};

export const DisabledLabel: StoryObj<LabelProps> = {
  args: {
    children: "Disabled Label",
    htmlFor: "disabled-input",
    className: "peer-disabled:opacity-70 peer-disabled:cursor-not-allowed",
  },
};

// Continue adding more stories as needed for other states or variations
