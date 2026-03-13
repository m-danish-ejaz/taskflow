"use client";
import { FC } from "react";
import DynamicForm from "@/app/components/ui/DynamicForm/DynamicForm";
import { DynamicFormProps } from "@/app/components/ui/DynamicForm/models/DynamicFormProps";
import LazyImage from "@/app/components/ui/lazyImage/lazyImage";
import greenBg from "../../../assets/images/greenBg.jpg";
import greenBgSmall from "../../../assets/images/greenBg-small.jpg";

const Login: FC = () => {
  const formFields: DynamicFormProps["fields"] = [
    {
      type: "email",
      modelName: "email",
      label: "E-mail",
      className:
        "border-0 mt-8 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none focus-visible:outline-none",
      validators: [
        {
          type: "required",
          message: "Email is required",
        },
        {
          type: "pattern",
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      ],
    },
    {
      type: "password",
      modelName: "password",
      label: "Password",
      className:
        "border-0 mt-8 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none focus-visible:outline-none",
      validators: [
        {
          type: "required",
          message: "Password is required",
        },
        {
          type: "minLength",
          value: 8,
          message: "Password must be at least 8 characters",
        },
      ],
    },
    {
      modelName: "date",
      label: "Date of Birth",
      type: "date",
      placeholder: "Select your date of birth", 
      className:
        "border-0 mt-8 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none focus-visible:outline-none bg-transparent",
      validators: [{ type: "required", message: "Date of birth is required" }],
    },
    {
      modelName: "country",
      label: "Country",
      type: "select",
      placeholder: "Select your country",
      options: [
        { label: "United States", value: "US" },
        { label: "Canada", value: "CA" },
        { label: "United Kingdom", value: "UK" },
      ],
      className:
        "border-0 mt-8 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none focus-visible:outline-none bg-transparent",
      validators: [{ type: "required", message: "Country is required" }],
    },
    {
      type: "file",
      modelName: "upload",
      label: "Upload your Image",
      uploaderPlaceholder: "Upload",
      className:
        "flex flex-row mt-3 font-montserrat focus-visible:outline-none rounded-2xl",
      validators: [
        {
          type: "required",
          message: "Image is required",
        },
      ],
    },
  ];

  const handleFormSubmit = async (data: Record<string, any>) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <LazyImage
        src={greenBg}
        thumb={greenBgSmall}
        className="absolute w-full h-full object-cover inset-0"
      ></LazyImage>
      <div className="relative z-10 p-10 flex flex-col justify-center items-center w-full h-full">
        <DynamicForm
          fields={formFields}
          onSubmit={handleFormSubmit}
          className={
            "mt-4 w-96 p-8 gap-[0.25rem] rounded-3xl shadow-neon-green border-0 bg-white bg-opacity-5"
          }
          buttonTitle="Submit"
          buttonClassName="shadow-neon-green flex rounded-2xl w-32 mt-12 bg-Awesomegray h-auto col-span-full justify-center hover:bg-white hover:text-black"
        />
      </div>
    </div>
  );
};

export default Login;
