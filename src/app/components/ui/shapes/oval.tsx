"use client";
import React from "react";

interface OvalProps {
    width?: number;
    height?: number;
    color?: string;
    blur?: number;
    angle?: number;       // rotation angle in degrees
    className?: string; // e.g. "absolute bottom-10 right-20"
}

const Oval: React.FC<OvalProps> = ({
    width = 300,
    height = 150,
    color = "#FF7478",
    blur = 20,
    angle = 0,
    className = "",
}) => {
    return (
        <div
            style={{
                width,
                height,
                backgroundColor: color,
                transform: `rotate(${angle}deg)`,
                filter: `blur(${blur}px)`,
                borderRadius: "50%",
            }}
            className={`absolute ${className}`}
        />
    );
};

export default Oval;
