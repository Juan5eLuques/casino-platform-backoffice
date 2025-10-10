import React from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
   size?: 'sm' | 'md' | 'lg';
   loading?: boolean;
   children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
      const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed';

      const variantClasses = {
         primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
         secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-gray-500',
         danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500',
         success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
         warning: 'bg-warning-600 hover:bg-warning-700 text-white focus:ring-warning-500',
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