'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({
  className = '',
  variant = 'default',
  ...props
}: CardProps) {
  const baseClasses = 'rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200';

  const variants = {
    default: 'border-border',
    elevated: 'border-border shadow-lg hover:shadow-xl',
    outlined: 'border-2 border-dashed border-muted-foreground/25 bg-transparent hover:border-muted-foreground/50',
  };

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    />
  );
}
