import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { InputProps } from "../models/inputModel"; // Adjust the path accordingly
import CheckboxInput from "./CheckBoxInput";

export default {
  title: "Components/CheckboxInput",
  component: CheckboxInput,
} as Meta;

const Template: StoryFn<InputProps> = (args) => <CheckboxInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  field: {
    modelName: "subscribeNewsletter",
    label: "Subscribe to Newsletter",
    className: "flex items-center gap-2",
    type: "checkbox",
  },
  value: "true", // This simulates that the checkbox is checked (as a string)
  onChange: (modelName: string, value: string) => console.log(modelName, value), // Handle the change event
};
