import React from "react";
import { Meta, StoryFn } from "@storybook/react"; // Use StoryFn
import { Checkbox } from "./checkbox";

export default {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered", // Center the checkbox in the Storybook preview
  },
} as Meta;

// Template for Checkbox component
const Template: StoryFn = (args) => <Checkbox {...args} />;

export const DefaultCheckbox = Template.bind({});
DefaultCheckbox.args = {
  children: "Default Checkbox",
};

export const CheckedCheckbox = Template.bind({});
CheckedCheckbox.args = {
  defaultChecked: true,
  children: "Checked Checkbox",
};

export const DisabledCheckbox = Template.bind({});
DisabledCheckbox.args = {
  disabled: true,
  children: "Disabled Checkbox",
};

export const CustomStyledCheckbox = Template.bind({});
CustomStyledCheckbox.args = {
  className: "bg-gray-200 border-gray-500",
  children: "Custom Styled Checkbox",
};
