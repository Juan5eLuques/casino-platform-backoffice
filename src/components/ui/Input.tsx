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
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
               </label>
            )}
            <input
               ref={ref}
               className={cn(
                  'block w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-1',
                  error
                     ? 'border-danger-300 dark:border-danger-600 bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-danger-500 focus:ring-danger-500'
                     : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400',
                  className
               )}
               {...props}
            />
            {error && (
               <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                  {error}
               </p>
            )}
            {helper && !error && (
               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {helper}
               </p>
            )}
         </div>
      );
   }
);

Input.displayName = 'Input';

export { Input };