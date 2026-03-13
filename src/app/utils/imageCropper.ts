import { PixelCrop } from "react-image-crop";

export const getCroppedImage = (
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<string | null> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob); // Convert Blob to Data URL
          resolve(url);
        } else {
          resolve(null);
        }
      }, "image/png");
    } else {
      resolve(null);
    }
  });
};
