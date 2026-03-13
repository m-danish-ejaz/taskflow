import React from "react";
import DynamicForm from "./DynamicForm";
import { DynamicFormProps } from "./models/DynamicFormProps";
import { Meta, StoryFn } from "@storybook/react";

// Dummy field data for testing
const fields = [
  {
    modelName: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
    required: true,
  },
  {
    modelName: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    modelName: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Enter your message",
    required: false,
  },
  {
    modelName: "subscribe",
    label: "Subscribe to newsletter",
    type: "checkbox",
    required: false,
  },
  {
    modelName: "file",
    label: "Upload",
    type: "file",
    required: false,
  },
];

// Dummy submit handler function
const handleSubmit = (formData: Record<string, any>) => {
  console.log("Form submitted:", formData);
};

export default {
  title: "Components/DynamicForm",
  component: DynamicForm,
} as Meta;

// Default Story
const Template: StoryFn<DynamicFormProps> = (args) => <DynamicForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  fields: fields,
  className: "max-w-lg mx-auto", // Tailwind class for center alignment
  onSubmit: handleSubmit,
  buttonTitle: "Submit",
  buttonClassName: "bg-blue-500 text-white px-6 py-2 rounded",
};
