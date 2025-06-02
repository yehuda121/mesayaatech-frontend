// components/Button.jsx
import React from "react";

const Button = ({ children, text, color = "#002855", size = "md", onClick, ...props }) => {
  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  return (
    <button
      className={`rounded-lg shadow-md font-bold transition-all duration-200
        ${sizeClasses[size]} text-white hover:opacity-80`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      {...props}
    >
      {children || text}
    </button>
  );
};

export default Button;
