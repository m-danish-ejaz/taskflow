import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/card/card"; // Adjust the import path as needed

interface CardStoryProps {
  cardProps: React.HTMLAttributes<HTMLDivElement>;
  showHeader: boolean;
  headerClassName?: string;
  showTitle: boolean;
  showDescription: boolean;
  showContent: boolean;
  contentClassName?: string;
  showFooter: boolean;
  footerClassName?: string;
}

export default {
  title: "Example/Card",
  component: Card,
  tags: ["autodocs"],
  subcomponents: {
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
  },
} as Meta<CardStoryProps>;

export const Default: StoryObj<CardStoryProps> = {
  args: {
    cardProps: {},
    showHeader: true,
    headerClassName: "",
    showTitle: true,
    showDescription: true,
    showContent: true,
    contentClassName: "",
    showFooter: true,
    footerClassName: "",
  },
  render: (args) => (
    <Card {...args.cardProps}>
      {args.showHeader && (
        <CardHeader className={args.headerClassName}>
          {args.showTitle && <CardTitle value="Card Title" />}
          {args.showDescription && (
            <CardDescription value="This is a card description." />
          )}
        </CardHeader>
      )}
      {args.showContent && (
        <CardContent className={args.contentClassName}>
          This is the content of the card.
        </CardContent>
      )}
      {args.showFooter && (
        <CardFooter className={args.footerClassName}>
          This is the card footer.
        </CardFooter>
      )}
    </Card>
  ),
};

export const Customized: StoryObj<CardStoryProps> = {
  args: {
    cardProps: { className: "max-w-sm" },
    showHeader: true,
    headerClassName: "bg-blue-500 text-white",
    showTitle: true,
    showDescription: true,
    showContent: true,
    contentClassName: "text-center",
    showFooter: true,
    footerClassName: "justify-end bg-gray-100",
  },
  render: Default.render, // Reuse the render function from Default
};
