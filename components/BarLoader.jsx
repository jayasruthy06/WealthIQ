"use client";

import React from "react";
import PropTypes from "prop-types";

export default function BarLoader({ size = "md", text, showText = true }) {
  const sizeConfig = {
    sm: {
      container: "w-8 h-8",
      outer: "w-8 h-8",
      middle: "w-6 h-6",
      inner: "w-4 h-4",
      textSize: "text-xs",
      spacing: "mt-2"
    },
    md: {
      container: "w-12 h-12",
      outer: "w-12 h-12",
      middle: "w-9 h-9",
      inner: "w-6 h-6",
      textSize: "text-sm",
      spacing: "mt-3"
    },
    lg: {
      container: "w-16 h-16",
      outer: "w-16 h-16",
      middle: "w-12 h-12",
      inner: "w-8 h-8",
      textSize: "text-base",
      spacing: "mt-4"
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${config.container}`}>
        {/* Outer ring with gradient */}
        <div
          className={`absolute inset-0 ${config.outer} rounded-full animate-spin`}
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, var(--color-primary) 90deg, transparent 180deg, var(--color-accent) 270deg, transparent 360deg)`,
            animationDuration: "2s"
          }}
        />

        {/* Middle ring */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${config.middle} rounded-full border-2 animate-spin`}
          style={{
            borderColor: "transparent var(--color-primary) transparent var(--color-accent)",
            animationDuration: "1.5s",
            animationDirection: "reverse"
          }}
        />

        {/* Inner pulsing dot */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${config.inner} rounded-full animate-pulse bg-gradient-to-br from-primary to-accent`}
          style={{
            animationDuration: "1s"
          }}
        />

        {/* Glow effect */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${config.outer} rounded-full opacity-30 blur-sm animate-pulse bg-gradient-radial from-primary/20 to-transparent`}
          style={{
            animationDuration: "2s"
          }}
        />
      </div>

      {showText && (
        <div className={`${config.textSize} ${config.spacing} text-foreground font-medium animate-pulse`}>
          {text || "Loading..."}
        </div>
      )}
    </div>
  );
}

BarLoader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  text: PropTypes.string,
  showText: PropTypes.bool
};
