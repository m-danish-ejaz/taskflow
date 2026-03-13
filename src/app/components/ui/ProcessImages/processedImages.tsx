const resizeImage = (src: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      } else {
        resolve(src);
      }
    };
    img.src = src;
  });
};

const processImages = async (images: string[], width: number, height: number): Promise<string[]> => {
  const processedImages = await Promise.all(images.map(src => resizeImage(src, width, height)));
  return processedImages;
};
export default processImages;