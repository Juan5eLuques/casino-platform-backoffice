import React from 'react';
import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   error?: string;
   helper?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
   ({ className, label, error, helper, ...props }, ref) => {
      return (
         <div className="w-full">
            {label && (
               <label className="block text-sm font-medium text-secondary mb-1">
                  {label}
               </label>
            )}
            <input
               ref={ref}
               className={cn(
                  'block w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-1',
                  error
                     ? 'border-border-error bg-background-input text-primary placeholder:text-tertiary focus:border-status-error focus:ring-status-error'
                     : 'border-border-input bg-background-input text-primary placeholder:text-tertiary focus:border-brand-primary focus:ring-brand-primary',
                  className
               )}
               {...props}
            />
            {error && (
               <p className="mt-1 text-sm text-status-error">
                  {error}
               </p>
            )}
            {helper && !error && (
               <p className="mt-1 text-sm text-tertiary">
                  {helper}
               </p>
            )}
         </div>
      );
   }
);

Input.displayName = 'Input';

export { Input };