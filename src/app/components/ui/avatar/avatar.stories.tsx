import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta: Meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://via.placeholder.com/40" alt="User Avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarImage
        src="https://randomuser.me/api/portraits/women/44.jpg"
        alt="Jane Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <Avatar className="bg-blue-500">
      <AvatarImage src="" alt="Unavailable Image" />
      <AvatarFallback className="bg-red-500 text-white">NA</AvatarFallback>
    </Avatar>
  ),
};
