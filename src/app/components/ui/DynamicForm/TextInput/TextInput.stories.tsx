import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { InputProps } from "../models/inputModel"; // Adjust the path accordingly
import TextInput from "./TextInput";

export default {
  title: "Components/TextInput",
  component: TextInput,
} as Meta;

const Template: StoryFn<InputProps> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  field: {
    modelName: "name",
    label: "Name",
    className: "flex flex-col gap-2",
    type: "text",
    placeholder: "Enter your name",
  },
  value: "",
  onChange: (modelName: string, value: string) => console.log(modelName, value),
};
