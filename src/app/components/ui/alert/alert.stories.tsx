import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta: Meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="h-5 w-5" />
      <div>
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is a default alert for general information.
        </AlertDescription>
      </div>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTriangle className="h-5 w-5" />
      <div>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          This is a destructive alert indicating an error.
        </AlertDescription>
      </div>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
      <CheckCircle className="h-5 w-5" />
      <div>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your operation was successful! Everything is good to go.
        </AlertDescription>
      </div>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
      <AlertTriangle className="h-5 w-5" />
      <div>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Be cautious! This action might have unintended consequences.
        </AlertDescription>
      </div>
    </Alert>
  ),
};

export const Custom: Story = {
  render: () => (
    <Alert className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700">
      <XCircle className="h-5 w-5" />
      <div>
        <AlertTitle>Custom Alert</AlertTitle>
        <AlertDescription>
          This is a custom-styled alert. You can use your own colors and styles.
        </AlertDescription>
      </div>
    </Alert>
  ),
};
