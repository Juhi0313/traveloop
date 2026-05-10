import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({ children, className = '', hover = false, onClick, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-[#e2e8f0] shadow-sm
        ${hover ? 'transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-[#0d61a3]/20' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: 'blue' | 'coral' | 'teal' | 'gold';
}) {
  const gradients = {
    blue: 'from-[#0d61a3] to-[#00b4d8]',
    coral: 'from-[#ff6b6b] to-[#ffb347]',
    teal: 'from-[#00b4d8] to-[#26cec3]',
    gold: 'from-[#f59e0b] to-[#ffb347]',
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center text-white flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-[#1e293b]">{value}</p>
        {subtitle && <p className="text-xs text-[#94a3b8] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
