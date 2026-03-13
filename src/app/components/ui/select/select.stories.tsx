import { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
} from "@/app/components/ui/select/select";

export default {
  title: "Example/Select",
  component: Select,
  tags: ["autodocs"],
  subcomponents: {
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectLabel,
    SelectGroup,
  },
} as Meta;

export const Basic: StoryObj = {
  render: () => (
    <Select defaultValue="item1">
      <SelectTrigger aria-label="Select an item">
        <SelectValue placeholder="Choose an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select an Item</SelectLabel>
          <SelectItem value="item1">Item 1</SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
          <SelectItem value="item3">Item 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithDisabledItems: StoryObj = {
  render: () => (
    <Select defaultValue="item2">
      <SelectTrigger aria-label="Select an item">
        <SelectValue placeholder="Choose an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select an Item</SelectLabel>
          <SelectItem value="item1" disabled>
            Item 1 (Disabled)
          </SelectItem>
          <SelectItem value="item2">Item 2</SelectItem>
          <SelectItem value="item3">Item 3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// Add more stories to cover different states, configurations or visual variations
