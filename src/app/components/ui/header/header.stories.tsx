import { Meta, StoryObj } from "@storybook/react";
import { Header, HeaderProps } from "./header";

export default {
  title: "UI/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["web", "dashboard"],
      },
    },
  },
} as Meta<HeaderProps>;

export const Web: StoryObj<HeaderProps> = {
  args: {
    variant: "web",
  },
};

export const Dashboard: StoryObj<HeaderProps> = {
  args: {
    variant: "dashboard",
  },
};
