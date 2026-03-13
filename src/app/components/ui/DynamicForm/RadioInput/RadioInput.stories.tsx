import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { InputProps } from "../models/inputModel"; // Adjust the path accordingly
import RadioInput from "./RadioInput";

export default {
  title: "Components/RadioInput",
  component: RadioInput,
} as Meta;

const Template: StoryFn<InputProps> = (args) => <RadioInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  field: {
    modelName: "paymentMethod",
    label: "Select Payment Method",
    className: "flex flex-col gap-4",
    options: [
      { value: "creditCard", label: "Credit Card" },
      { value: "paypal", label: "PayPal" },
      { value: "bankTransfer", label: "Bank Transfer" },
    ],
    type: "radio",
  },
  value: "paypal", // Default selected value
  onChange: (modelName: string, value: string) => console.log(modelName, value),
};
