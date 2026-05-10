import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'coral';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const styles: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-[#0d61a3] to-[#00b4d8] text-white hover:from-[#064a87] hover:to-[#0096b5] shadow-md hover:shadow-lg',
  secondary: 'bg-[#f1f5f9] text-[#1e293b] hover:bg-[#e2e8f0]',
  outline: 'border-2 border-[#0d61a3] text-[#0d61a3] hover:bg-[#0d61a3] hover:text-white bg-transparent',
  ghost: 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b] bg-transparent',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
  coral: 'bg-gradient-to-r from-[#ff6b6b] to-[#ffb347] text-white hover:from-[#f83f3f] hover:to-[#f59e0b] shadow-md hover:shadow-lg',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2 rounded-xl gap-2',
  lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="flex-shrink-0">{iconRight}</span>
      )}
    </button>
  );
}
