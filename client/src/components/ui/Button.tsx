import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'gold' | 'silk' | 'nude' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
}

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const variantClasses = {
    primary: "bg-gold-500 hover:bg-gold-600 text-white shadow-md hover:shadow-lg hover:shadow-gold-500/25 focus:ring-gold-500",
    secondary: "bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-lg hover:shadow-accent-500/25 focus:ring-accent-500",
    gold: "bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-white shadow-lg hover:shadow-xl hover:shadow-gold-500/30 focus:ring-gold-500 animate-shimmer bg-size-200",
    silk: "bg-gradient-to-r from-accent-400 to-accent-600 hover:from-accent-500 hover:to-accent-700 text-white shadow-lg hover:shadow-xl hover:shadow-accent-500/30 focus:ring-accent-500",
    nude: "bg-gradient-to-r from-nude-200 to-nude-300 hover:from-nude-300 hover:to-nude-400 text-dark-800 shadow-md hover:shadow-lg focus:ring-nude-400",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500",
    outline: "border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white focus:ring-gold-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;