import React from 'react';
import { cn } from '@/utils';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
   variant?: 'success' | 'error' | 'warning' | 'info';
   title?: string;
   description?: string;
   dismissible?: boolean;
   onDismiss?: () => void;
   children?: React.ReactNode;
}

const iconMap = {
   success: CheckCircle2,
   error: XCircle,
   warning: AlertTriangle,
   info: Info,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
   ({ className, variant = 'info', title, description, dismissible, onDismiss, children, ...props }, ref) => {
      const Icon = iconMap[variant];

      const variantClasses = {
         success: 'bg-status-success-bg text-status-success-text border-status-success-border',
         error: 'bg-status-error-bg text-status-error-text border-status-error-border',
         warning: 'bg-status-warning-bg text-status-warning-text border-status-warning-border',
         info: 'bg-status-info-bg text-status-info-text border-status-info-border',
      };

      const iconColorClasses = {
         success: 'text-status-success',
         error: 'text-status-error',
         warning: 'text-status-warning',
         info: 'text-status-info',
      };

      return (
         <div
            ref={ref}
            className={cn(
               'relative rounded-lg border p-4 transition-all duration-200',
               variantClasses[variant],
               className
            )}
            role="alert"
            {...props}
         >
            <div className="flex items-start gap-3">
               {/* Icon */}
               <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColorClasses[variant])} />

               {/* Content */}
               <div className="flex-1 space-y-1">
                  {title && (
                     <h3 className="font-semibold text-sm">
                        {title}
                     </h3>
                  )}
                  {description && (
                     <p className="text-sm opacity-90">
                        {description}
                     </p>
                  )}
                  {children && (
                     <div className="text-sm">
                        {children}
                     </div>
                  )}
               </div>

               {/* Dismiss Button */}
               {dismissible && onDismiss && (
                  <button
                     onClick={onDismiss}
                     className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                     aria-label="Cerrar alerta"
                  >
                     <X className="h-4 w-4" />
                  </button>
               )}
            </div>
         </div>
      );
   }
);

Alert.displayName = 'Alert';
