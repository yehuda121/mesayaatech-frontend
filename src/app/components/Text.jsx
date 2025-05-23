// components/Typography.jsx
import React from "react";
import COLORS from "./Color";

const Typography = ({ children, size = "md", color = "dark", weight = "normal" }) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const weightClasses = {
    normal: "font-normal",
    bold: "font-bold",
    light: "font-light",
  };

  return (
    <p className={`${sizeClasses[size]} ${weightClasses[weight]}`} style={{ color: COLORS[color] }}>
      {children}
    </p>
  );
};

export default Typography;
