import { Meta, StoryObj } from "@storybook/react";
import { Input, InputProps } from "@/app/components/ui/input/input";

export default {
  title: "Example/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    className: { control: "text" },
    type: {
      control: {
        type: "select",
        options: [
          "text",
          "number",
          "password",
          "email",
          "search",
          "url",
          "date",
        ],
      },
    },
  },
} as Meta<InputProps>;

export const Default: StoryObj<InputProps> = {
  args: {
    placeholder: "Enter text...",
    type: "text",
  },
};

export const Password: StoryObj<InputProps> = {
  args: {
    placeholder: "Enter password",
    type: "password",
  },
};

export const Email: StoryObj<InputProps> = {
  args: {
    placeholder: "Enter email",
    type: "email",
  },
};

export const Date: StoryObj<InputProps> = {
  args: {
    placeholder: "Enter email",
    type: "date",
  },
};

export const Disabled: StoryObj<InputProps> = {
  args: {
    placeholder: "Disabled Input",
    disabled: true,
  },
};

// You can continue to add more stories as needed to cover different states and types
