import { useState, useEffect } from "react";
import { LazyImageProps } from "@/app/Models/lazyImagesProps";

const LazyImage = ({
  src,
  thumb,
  alt,
  className,
  onClick,
  onLoad,
}: LazyImageProps) => {
  // Resolve `src` and `thumb` to their string values if they are StaticImageData
  const resolvedSrc = typeof src === "object" && src !== null ? src.src : src;
  const resolvedThumb =
    typeof thumb === "object" && thumb !== null ? thumb.src : thumb;

  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    resolvedThumb
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (resolvedSrc) {
      const img = new Image();
      img.src = resolvedSrc;
      img.onload = () => {
        setCurrentSrc(resolvedSrc);
        setIsLoading(false);
        if (onLoad) onLoad(); // Trigger the onLoad callback once the image is fully loaded
      };
    }
  }, [resolvedSrc, onLoad]);

  if (!currentSrc) {
    return null; // or a placeholder component
  }

  return (
    <img
      src={currentSrc}
      alt={alt || ""}
      className={`transition-all duration-1000 ease-in-out ${className || ""} ${
        isLoading ? "blur-lg animate-pulse" : "blur-0"
      }`}
      onClick={onClick}
    />
  );
};

export default LazyImage;
