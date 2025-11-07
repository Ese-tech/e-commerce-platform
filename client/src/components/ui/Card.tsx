import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'silk' | 'nude' | 'dark';
  hover?: boolean;
  glow?: boolean;
}

const Card = ({ 
  children, 
  className = '', 
  variant = 'default', 
  hover = true,
  glow = false 
}: CardProps) => {
  const baseClasses = "rounded-lg shadow-md transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white dark:bg-gray-800 border border-nude-200 dark:border-dark-700",
    gold: "bg-gradient-to-br from-gold-50 to-nude-100 dark:from-dark-800 dark:to-dark-900 border border-gold-200 dark:border-gold-700",
    silk: "bg-gradient-to-br from-accent-50 to-accent-100 dark:from-dark-800 dark:to-dark-900 border border-accent-200 dark:border-accent-700",
    nude: "bg-gradient-to-br from-nude-50 to-nude-100 dark:from-dark-800 dark:to-dark-900 border border-nude-200 dark:border-nude-700",
    dark: "bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700"
  };
  
  const hoverClasses = hover 
    ? "hover:shadow-lg hover:shadow-gold-500/20 dark:hover:shadow-gold-400/20 hover:-translate-y-1" 
    : "";
  
  const glowClasses = glow 
    ? "animate-glow" 
    : "";

  return (
    <div 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${hoverClasses} 
        ${glowClasses} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;