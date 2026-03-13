import React from "react";
import { Meta, StoryFn } from "@storybook/react"; // Use StoryFn
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from "./dropdown-menu";

export default {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
} as Meta;

// Template for DropdownMenu
const Template: StoryFn = (args) => (
  <DropdownMenu {...args}>
    <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Item 1</DropdownMenuItem>
      <DropdownMenuItem>Item 2</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Item 3</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const DefaultDropdownMenu = Template.bind({});
DefaultDropdownMenu.args = {};

export const WithCheckboxItems = Template.bind({});
WithCheckboxItems.args = {
  children: (
    <>
      <DropdownMenuTrigger>Open Checkbox Menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked={true}>
          Checkbox Item 1
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Checkbox Item 2</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </>
  ),
};

export const WithRadioItems = Template.bind({});
WithRadioItems.args = {
  children: (
    <>
      <DropdownMenuTrigger>Open Radio Menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioItem value={""}>Radio Item 1</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value={""}>Radio Item 2</DropdownMenuRadioItem>
      </DropdownMenuContent>
    </>
  ),
};

export const WithSubmenu = Template.bind({});
WithSubmenu.args = {
  children: (
    <>
      <DropdownMenuTrigger>Open Submenu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Submenu Item 1</DropdownMenuItem>
            <DropdownMenuItem>Submenu Item 2</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
      </DropdownMenuContent>
    </>
  ),
};

export const WithLabelAndShortcut = Template.bind({});
WithLabelAndShortcut.args = {
  children: (
    <>
      <DropdownMenuTrigger>
        Open Menu with Label and Shortcut
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Label</DropdownMenuLabel>
        <DropdownMenuItem>
          Item with shortcut
          <DropdownMenuShortcut>Ctrl + S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
      </DropdownMenuContent>
    </>
  ),
};
