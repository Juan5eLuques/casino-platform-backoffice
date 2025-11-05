import React from 'react';
import { cn } from '@/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
   return (
      <div
         className={cn(
            'bg-surface-card rounded-xl shadow-theme-sm border border-border-DEFAULT',
            className
         )}
         {...props}
      >
         {children}
      </div>
   );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
   return (
      <div
         className={cn('px-6 py-4 border-b border-border-DEFAULT', className)}
         {...props}
      >
         {children}
      </div>
   );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
   return (
      <div className={cn('px-6 py-4', className)} {...props}>
         {children}
      </div>
   );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
   return (
      <div
         className={cn('px-6 py-4 border-t border-border-DEFAULT', className)}
         {...props}
      >
         {children}
      </div>
   );
}