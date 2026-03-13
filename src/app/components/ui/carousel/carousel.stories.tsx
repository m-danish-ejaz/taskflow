import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Button } from "@/app/components/ui/button/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

export default {
  title: "Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered", // Center the carousel in the Storybook preview
  },
} as Meta;

// Template for the Carousel component
const Template: StoryFn = (args) => (
  <Carousel {...args}>
    <CarouselPrevious />
    <CarouselContent>
      <CarouselItem>
        <div className="p-4 bg-blue-200">Item 1</div>
      </CarouselItem>
      <CarouselItem>
        <div className="p-4 bg-blue-300">Item 2</div>
      </CarouselItem>
      <CarouselItem>
        <div className="p-4 bg-blue-400">Item 3</div>
      </CarouselItem>
    </CarouselContent>
    <CarouselNext />
  </Carousel>
);

export const HorizontalCarousel = Template.bind({});
HorizontalCarousel.args = {
  orientation: "horizontal", // Horizontal carousel orientation
};

export const VerticalCarousel = Template.bind({});
VerticalCarousel.args = {
  orientation: "vertical", // Vertical carousel orientation
};

export const CustomCarouselItems = Template.bind({});
CustomCarouselItems.args = {
  orientation: "horizontal", // Horizontal carousel with customized items
  children: (
    <>
      <CarouselPrevious />
      <CarouselContent>
        <CarouselItem>
          <div className="p-4 bg-green-200">Custom Item 1</div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-4 bg-green-300">Custom Item 2</div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-4 bg-green-400">Custom Item 3</div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-4 bg-green-500">Custom Item 4</div>
        </CarouselItem>
      </CarouselContent>
      <CarouselNext />
    </>
  ),
};

export const DisabledNavigation = Template.bind({});
DisabledNavigation.args = {
  orientation: "horizontal", // Horizontal carousel with disabled navigation
  children: (
    <>
      <CarouselPrevious />
      <CarouselContent>
        <CarouselItem>
          <div className="p-4 bg-red-200">Item 1</div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-4 bg-red-300">Item 2</div>
        </CarouselItem>
      </CarouselContent>
      <CarouselNext />
    </>
  ),
};
