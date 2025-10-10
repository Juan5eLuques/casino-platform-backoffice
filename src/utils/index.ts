import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
   return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(amount / 100); // Convert from cents to euros
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'datetime' = 'short'): string {
   const dateObj = typeof date === 'string' ? new Date(date) : date;

   if (format === 'datetime') {
      return new Intl.DateTimeFormat('es-ES', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: '2-digit',
         minute: '2-digit',
      }).format(dateObj);
   }

   if (format === 'long') {
      return new Intl.DateTimeFormat('es-ES', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      }).format(dateObj);
   }

   return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
   }).format(dateObj);
}

export function formatNumber(value: number): string {
   return new Intl.NumberFormat('es-ES').format(value);
}

export function getStatusBadgeClass(status: string): string {
   const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

   switch (status.toUpperCase()) {
      case 'ACTIVE':
         return `${baseClasses} bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200`;
      case 'INACTIVE':
         return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200`;
      case 'SUSPENDED':
         return `${baseClasses} bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200`;
      case 'BANNED':
         return `${baseClasses} bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200`;
      case 'MAINTENANCE':
         return `${baseClasses} bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200`;
      default:
         return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200`;
   }
}

export function getRoleBadgeClass(role: string): string {
   const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

   switch (role) {
      case 'SUPER_ADMIN':
         return `${baseClasses} bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200`;
      case 'OPERATOR_ADMIN':
         return `${baseClasses} bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200`;
      case 'CASHIER':
         return `${baseClasses} bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200`;
      default:
         return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200`;
   }
}

export function debounce<T extends (...args: any[]) => any>(
   func: T,
   wait: number
): (...args: Parameters<T>) => void {
   let timeout: NodeJS.Timeout;
   return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
   };
}

export function generatePassword(length = 12): string {
   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
   let password = '';
   for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
   }
   return password;
}

export function copyToClipboard(text: string): Promise<void> {
   if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
   }

   // Fallback for older browsers
   const textArea = document.createElement('textarea');
   textArea.value = text;
   document.body.appendChild(textArea);
   textArea.focus();
   textArea.select();
   try {
      document.execCommand('copy');
   } catch (err) {
      console.error('Failed to copy text: ', err);
   }
   document.body.removeChild(textArea);
   return Promise.resolve();
}

export function validateDomain(domain: string): boolean {
   const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
   return domainRegex.test(domain);
}

export function validateEmail(email: string): boolean {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
}

export function getInitials(name: string): string {
   return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
   if (text.length <= maxLength) return text;
   return text.slice(0, maxLength) + '...';
}

export function isValidUrl(string: string): boolean {
   try {
      new URL(string);
      return true;
   } catch (_) {
      return false;
   }
}

export function calculatePercentageChange(current: number, previous: number): number {
   if (previous === 0) return current > 0 ? 100 : 0;
   return ((current - previous) / previous) * 100;
}