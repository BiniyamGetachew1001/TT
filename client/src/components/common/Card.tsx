import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'light';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true 
}) => {
  const baseStyles = "rounded-xl border backdrop-blur-md transition-all duration-300";
  
  const variantStyles = {
    default: "bg-background-card border-white/5",
    dark: "bg-surface-dark border-white/5",
    light: "bg-surface-light border-white/10"
  };

  const hoverStyles = hover ? "hover:border-white/10 hover:shadow-lg" : "";

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card; 