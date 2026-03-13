import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta: Meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is React?</AccordionTrigger>
        <AccordionContent>
          React is a JavaScript library for building user interfaces. It is
          maintained by Meta and a community of developers.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What is Radix UI?</AccordionTrigger>
        <AccordionContent>
          Radix UI is an open-source library of accessible, unstyled UI
          components for React.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const MultipleItems: Story = {
  render: () => (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Storybook?</AccordionTrigger>
        <AccordionContent>
          Storybook is a tool for developing UI components in isolation. It
          makes building UI components faster and easier.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Why use Storybook?</AccordionTrigger>
        <AccordionContent>
          Storybook provides a sandbox to build and test components without
          affecting the app’s main UI.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I customize Accordion styles?</AccordionTrigger>
        <AccordionContent>
          Yes, you can customize the styles of the Accordion by using Tailwind
          utility classes or custom CSS in combination with the `className`
          prop.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const NestedAccordion: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="parent-item-1">
        <AccordionTrigger>Parent Item</AccordionTrigger>
        <AccordionContent>
          <Accordion type="multiple">
            <AccordionItem value="nested-item-1">
              <AccordionTrigger>Nested Item 1</AccordionTrigger>
              <AccordionContent>
                This is the content for Nested Item 1.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nested-item-2">
              <AccordionTrigger>Nested Item 2</AccordionTrigger>
              <AccordionContent>
                This is the content for Nested Item 2.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="parent-item-2">
        <AccordionTrigger>Another Parent Item</AccordionTrigger>
        <AccordionContent>
          This is the content for another parent item.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const CustomizedStyles: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-red-500">
          Customized Trigger
        </AccordionTrigger>
        <AccordionContent className="bg-gray-100 text-gray-700">
          This accordion has customized styles for the trigger and content.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-blue-500">
          Another Customized Trigger
        </AccordionTrigger>
        <AccordionContent className="bg-blue-100 text-blue-700">
          You can apply any styles you want using the `className` prop.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
