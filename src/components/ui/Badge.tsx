import type { ReactNode } from 'react';

type BadgeVariant = 'blue' | 'green' | 'coral' | 'gold' | 'gray' | 'purple' | 'teal';

const variantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  coral: 'bg-red-100 text-red-600',
  gold: 'bg-amber-100 text-amber-700',
  gray: 'bg-slate-100 text-slate-600',
  purple: 'bg-purple-100 text-purple-700',
  teal: 'bg-cyan-100 text-cyan-700',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export const activityTypeColors: Record<string, BadgeVariant> = {
  sightseeing: 'blue',
  food: 'gold',
  adventure: 'coral',
  culture: 'purple',
  shopping: 'green',
  nightlife: 'teal',
  nature: 'green',
};
