import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { InputProps } from "../models/inputModel"; // Adjust the path accordingly
import TextArea from "./TextArea";

export default {
  title: "Components/TextArea",
  component: TextArea,
} as Meta;

const Template: StoryFn<InputProps> = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {
  field: {
    modelName: "comments",
    label: "Comments",
    className: "flex flex-col gap-2",
    placeholder: "Enter your comments here",
    type: "textarea",
  },
  value: "",
  onChange: (modelName: string, value: string) => console.log(modelName, value),
};
