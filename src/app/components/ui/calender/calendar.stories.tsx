import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Calendar } from "./calendar";
import { DateRange } from "react-day-picker"; // ✅ Import DateRange type

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    onSelect: { action: "date selected" },
  },
  decorators: [
    (Story) => (
      <div className="p-5 bg-white dark:bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export default meta; // ✅ Required Default Export

type Story = StoryObj<typeof Calendar>;

// ✅ **Single Date Selection Fix**
const SingleDateTemplate = () => {
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(date) => {
        console.log("Selected date:", date); // ✅ Debugging log
        setSelected(date);
      }}
    />
  );
};

export const SingleDate: Story = {
  render: () => <SingleDateTemplate />,
};

// ✅ **Multiple Dates Selection Fix**
const MultipleDatesTemplate = () => {
  const [selected, setSelected] = useState<Date[]>([]);

  return (
    <Calendar
      mode="multiple"
      selected={selected}
      onSelect={(dates) => {
        console.log("Selected dates:", dates); // ✅ Debugging log
        setSelected(dates || []); // ✅ Ensure it always has an array
      }}
    />
  );
};

export const MultipleDates: Story = {
  render: () => <MultipleDatesTemplate />,
};

// ✅ **Range Selection Fix**
const RangeSelectionTemplate = () => {
  const [selected, setSelected] = useState<DateRange | undefined>(undefined);

  return (
    <Calendar
      mode="range"
      selected={selected}
      onSelect={(range) => {
        console.log("Selected range:", range); // ✅ Debugging log
        setSelected(range); // ✅ Allow undefined as valid state
      }}
    />
  );
};

export const RangeSelection: Story = {
  render: () => <RangeSelectionTemplate />,
};
