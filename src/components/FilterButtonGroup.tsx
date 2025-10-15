import { cn } from '@/utils';

interface FilterButtonGroupProps<T extends string> {
   value: T | '';
   onChange: (value: T | '') => void;
   options: { value: T | ''; label: string; icon?: React.ReactNode }[];
   className?: string;
}

export function FilterButtonGroup<T extends string>({
   value,
   onChange,
   options,
   className
}: FilterButtonGroupProps<T>) {
   return (
      <div className={cn(
         'flex flex-wrap gap-1',
         className
      )}>
         {options.map((option) => (
            <button
               key={option.value || 'all'}
               onClick={() => onChange(option.value)}
               className={cn(
                  'px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium',
                  'transition-all duration-200',
                  'border',
                  'flex items-center gap-2',
                  'hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  value === option.value
                     ? 'bg-primary-600 text-white border-primary-600 shadow-md dark:bg-primary-500'
                     : 'bg-white dark:bg-dark-bg-secondary text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
               )}
            >
               {option.icon && (
                  <span className={cn(
                     'w-4 h-4',
                     value === option.value ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                  )}>
                     {option.icon}
                  </span>
               )}
               <span className="whitespace-nowrap">{option.label}</span>
            </button>
         ))}
      </div>
   );
}
