import React, { useState } from "react";
import { InputProps } from "../models/inputModel";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { Eye, Upload, X } from "lucide-react";
import { Label } from "../../label/label";
import LazyImage from "../../lazyImage/lazyImage";
import blackBg from "../../../../../assets/images/uploaderThumb/blackBg.jpg";
import "react-image-crop/dist/ReactCrop.css";

const FileInput: React.FC<InputProps> = ({ field, error, onChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null); // State for modal image
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isRequired = field.validators?.some(v => v.type === "required");

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      onChange(field.modelName, [...files, ...newFiles]);
    }
  };

  // Handle custom click on the uploader
  const handleCustomClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file removal
  const handleFileRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(field.modelName, updatedFiles);
  };

  // Open modal with image
  const openImageModal = (fileUrl: string) => {
    setModalImage(fileUrl);
  };

  // Close modal
  const closeModal = () => {
    setModalImage(null);
  };

  const renderThumbnails = () => {
    return files.map((file, index) => {
      const isImage = file.type.startsWith("image/");
      const fileUrl = URL.createObjectURL(file);

      return (
        <div
          key={index} className="relative w-16 h-16 border border-gray-300 rounded-md cursor-pointer group">
          {isImage ? (
            <>
              <LazyImage
                src={fileUrl}
                thumb={blackBg}
                alt={file.name}
                className="object-cover w-full h-full rounded-md"
                onClick={() => openImageModal(fileUrl)} // Open modal on click
              />

              {/* Overlay with Eye Icon */}
              <div
                onClick={() => openImageModal(fileUrl)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
              >
                <Eye />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-[7px] text-wrap text-gray-500">
              {file.name}
            </div>
          )}

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => handleFileRemove(index)}
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-gray-200"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      );
    });
  };

  return (
    <div className={`border-0 mt-6 col-span-full relative ${field.wrapperClass}`}>
      {/* Label */}
      <Label className={`text-sm font-medium ${field.labelClass}`} htmlFor={field.modelName}>
        {field.label} {isRequired && <span className="text-rose-600">*</span>}
      </Label>

      {/* File Uploader */}
      <div className={`${field.inputClass} flex flex-wrap items-center gap-3 rounded-lg `}>
        <div className="flex items-center h-8 rounded-md cursor-pointer w-full justify-center" onClick={handleCustomClick}>
          <div className="flex gap-3">
            <Upload className="text-gray-500 h-4 w-4" />
            <p className="text-xs text-gray-500">{field.uploaderPlaceholder}</p>
          </div>
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {/* Thumbnails */}
      <div className="px-1 py-3 flex gap-4 flex-wrap">{renderThumbnails()}</div>
      <p className={field.uploaderNoteClass}>{field.uploaderNote}</p>

      {/* Modal for Enlarged Image */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative rounded-3xl "
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={(e: { stopPropagation: () => any }) =>
                e.stopPropagation()
              } // Prevent background click
            >
              <button
                onClick={closeModal}
                className="absolute -top-3 -right-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-50"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <LazyImage
                src={modalImage}
                thumb={blackBg}
                alt="Uploaded file"
                className="max-w-full max-h-[90vh] rounded-3xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default FileInput;
