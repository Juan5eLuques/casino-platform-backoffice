import React from 'react';
import { cn } from '@/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
   variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral';
   size?: 'sm' | 'md' | 'lg';
   children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
   ({ className, variant = 'neutral', size = 'md', children, ...props }, ref) => {
      const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-colors duration-200';

      const variantClasses = {
         success: 'bg-status-success-bg text-status-success-text border border-status-success-border',
         error: 'bg-status-error-bg text-status-error-text border border-status-error-border',
         warning: 'bg-status-warning-bg text-status-warning-text border border-status-warning-border',
         info: 'bg-status-info-bg text-status-info-text border border-status-info-border',
         neutral: 'bg-surface-elevated text-secondary border border-border-DEFAULT',
      };

      const sizeClasses = {
         sm: 'px-2 py-0.5 text-xs',
         md: 'px-2.5 py-1 text-sm',
         lg: 'px-3 py-1.5 text-base',
      };

      return (
         <span
            ref={ref}
            className={cn(
               baseClasses,
               variantClasses[variant],
               sizeClasses[size],
               className
            )}
            {...props}
         >
            {children}
         </span>
      );
   }
);

Badge.displayName = 'Badge';
