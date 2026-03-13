"use client";
import React from "react";

const generatePixels = (count: number, color: string) =>
    Array.from({ length: count }, () => (Math.random() < 0.1 ? "#ffffff" : color));

interface CircleProps {
    size?: number;        // circle diameter
    pixelSize?: number;   // each pixel size
    color?: string;       // main fill color
    blur?: number;        // blur intensity
    className?: string;   // custom Tailwind classes (like absolute top-10 left-20)
}

const Circle: React.FC<CircleProps> = ({
    size = 200,
    pixelSize = 10,
    color = "#FF7478",
    blur = 20,
    className = "",
}) => {
    const pixelsPerRow = Math.floor(size / pixelSize);
    const pixelColors = generatePixels(pixelsPerRow * pixelsPerRow, color);

    return (
        <div
            style={{
                width: size,
                height: size,
                backgroundColor: color,
                filter: `blur(${blur}px)`,
                borderRadius: "50%",
            }}
            className={`absolute overflow-hidden flex items-center justify-center ${className}`}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${pixelsPerRow}, ${pixelSize}px)`,
                    gridTemplateRows: `repeat(${pixelsPerRow}, ${pixelSize}px)`,
                }}
            >
                {pixelColors.map((pixelColor, i) => {
                    const row = Math.floor(i / pixelsPerRow);
                    const col = i % pixelsPerRow;
                    const cx = pixelsPerRow / 2;
                    const cy = pixelsPerRow / 2;
                    const dist = Math.sqrt((row - cy) ** 2 + (col - cx) ** 2);

                    return (
                        <div
                            key={i}
                            style={{
                                width: pixelSize,
                                height: pixelSize,
                                backgroundColor: pixelColor,
                                opacity: dist < pixelsPerRow / 2 ? 1 : 0,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Circle;
