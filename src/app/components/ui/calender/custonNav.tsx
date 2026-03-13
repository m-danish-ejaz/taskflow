import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CustomNav({ onPreviousClick, onNextClick }: any) {
  return (
    <div className="flex items-center justify-between w-full">
      <button
        type="button"
        onClick={onPreviousClick}
        className="p-2 rounded-md bg-transparent hover:bg-gray-200"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onNextClick}
        className="p-2 rounded-md bg-transparent hover:bg-gray-200"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
