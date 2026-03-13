import type { Meta, StoryObj } from "@storybook/react";
import Card from "./card";
import appDevelopment from "@/assets/images/icon-app.svg";
import webDevelopment from "@/assets/images/icon-dev.svg";

// Default metadata
const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    heading: "Default Heading",
    content: "This is a default card content.",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ✅ Card with Bootstrap Icon
export const WithIcon: Story = {
  args: {
    image: "bi-phone",
    heading: "Mobile Card",
    content: "This card uses a Bootstrap icon.",
    classNames: {
      icon: "text-5xl text-black",
      card: "bg-white hover:shadow-lg transition-shadow duration-300",
      heading: "text-xl font-bold text-gray-800",
      content: "text-gray-700",
    },
  },
};

// ✅ Card with Imported Image
export const WithImage: Story = {
  args: {
    image: appDevelopment,
    heading: "App Development",
    content: "Professional development of Android & iOS apps.",
    classNames: {
      card: "bg-[#202022] text-white hover:shadow-xl transition-shadow duration-300",
      heading: "text-lg font-bold",
      content: "text-gray-300",
    },
  },
};

// ✅ Product Variant (Image top → Heading → Description)
export const ProductCard: Story = {
  args: {
    variant: "product",
    image: webDevelopment,
    heading: "Product Card",
    content: "This is a product-style card with vertical layout.",
    classNames: {
      card: "bg-white text-center hover:shadow-xl transition duration-300",
      heading: "text-lg font-bold text-gray-900",
      content: "text-gray-600",
    },
  },
};

// ✅ Multiple Cards (Grid Example)
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <Card
        image={appDevelopment}
        heading="Mobile Apps"
        content="Build high quality apps."
        classNames={{
          card: "bg-[#202022] shadow-md hover:shadow-lg transition duration-300",
          heading: "text-xl font-semibold",
          content: "text-indigo-100",
        }}
      />
      <Card
        image={webDevelopment}
        heading="Web Development"
        content="Professional web apps & sites."
        classNames={{
          card: "bg-[#202022] shadow-md hover:shadow-lg transition duration-300",
          heading: "text-xl font-semibold",
          content: "text-indigo-100",
        }}
      />
    </div>
  ),
};

// ✅ Mixed Variants Grid
export const MixedGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card
        variant="default"
        image={appDevelopment}
        heading="Default Layout"
        content="Horizontal style card."
        classNames={{
          card: "bg-white shadow-md hover:shadow-lg transition duration-300",
          heading: "text-lg font-semibold",
          content: "text-gray-700",
        }}
      />
      <Card
        variant="product"
        image={webDevelopment}
        heading="Product Layout"
        content="Vertical product-style card."
        classNames={{
          card: "bg-indigo-50 shadow-md hover:shadow-lg transition duration-300",
          heading: "text-lg font-semibold text-indigo-700",
          content: "text-gray-700",
        }}
      />
    </div>
  ),
};
