import React from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: 'primary' | 'secondary' | 'danger' | 'success';
   size?: 'sm' | 'md' | 'lg';
   loading?: boolean;
   children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
      const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

      const variantClasses = {
         primary: 'bg-btn-primary-bg hover:bg-btn-primary-bg-hover active:bg-btn-primary-bg-active text-btn-primary-text border border-btn-primary-border hover:border-btn-primary-border-hover',
         secondary: 'bg-btn-secondary-bg hover:bg-btn-secondary-bg-hover active:bg-btn-secondary-bg-active text-btn-secondary-text border border-btn-secondary-border hover:border-btn-secondary-border-hover',
         danger: 'bg-btn-danger-bg hover:bg-btn-danger-bg-hover active:bg-btn-danger-bg-active text-btn-danger-text border border-btn-danger-border hover:border-btn-danger-border-hover',
         success: 'bg-btn-success-bg hover:bg-btn-success-bg-hover active:bg-btn-success-bg-active text-btn-success-text border border-btn-success-border hover:border-btn-success-border-hover',
      };

      const sizeClasses = {
         sm: 'px-3 py-1.5 text-sm',
         md: 'px-4 py-2 text-sm',
         lg: 'px-6 py-3 text-base',
      };

      return (
         <button
            ref={ref}
            className={cn(
               baseClasses,
               variantClasses[variant],
               sizeClasses[size],
               className
            )}
            disabled={disabled || loading}
            {...props}
         >
            {loading && (
               <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle
                     className="opacity-25"
                     cx="12"
                     cy="12"
                     r="10"
                     stroke="currentColor"
                     strokeWidth="4"
                     fill="none"
                  />
                  <path
                     className="opacity-75"
                     fill="currentColor"
                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
               </svg>
            )}
            {children}
         </button>
      );
   }
);

Button.displayName = 'Button';

export { Button };