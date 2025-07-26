import React from "react";
import './Button.css';

const Button = ({ children, text, icon ,className, color = "#002855", size = "md", onClick, ...props }) => {
  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  return (
    <button 
      dir="auto"
      style={{ backgroundColor: color }}
      className={`btn-base ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children || text}
      {icon && <span className="icon-wrap">{icon}</span>}
    </button>
  );
};

export default Button;
