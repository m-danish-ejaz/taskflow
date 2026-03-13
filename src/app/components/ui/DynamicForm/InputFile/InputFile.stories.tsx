import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { InputProps } from "../models/inputModel"; // Adjust the path accordingly
import FileInput from "./InputFile";

export default {
  title: "Components/FileInput",
  component: FileInput,
} as Meta;

const Template: StoryFn<InputProps> = (args) => <FileInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  field: {
    modelName: "fileUploader",
    label: "Upload Files",
    className: "flex items-center gap-3",
    uploaderPlaceholder: "Click to upload",
    uploaderNote: "You can upload multiple files.",
    uploaderNoteClass: "text-sm text-gray-500 mt-2",
    type: "file",
  },
  onChange: (modelName: string, value: File[]) => console.log(modelName, value),
};
