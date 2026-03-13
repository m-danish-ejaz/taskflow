import type { StaticImageData } from "next/image";

export type LazyImageProps = {
  src: string | StaticImageData | undefined;
  thumb?: string | StaticImageData;
  alt?: string;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
};
