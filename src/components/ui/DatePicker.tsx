import { Calendar, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils';

interface DatePickerProps {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   label?: string;
   className?: string;
   disabled?: boolean;
   minDate?: string;
   maxDate?: string;
   id?: string;
}

export function DatePicker({
   value,
   onChange,
   placeholder = 'Seleccionar fecha',
   label,
   className,
   disabled = false,
   minDate,
   maxDate,
   id,
}: DatePickerProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedDate, setSelectedDate] = useState<Date | null>(
      value ? new Date(value) : null
   );
   const [viewDate, setViewDate] = useState<Date>(
      value ? new Date(value) : new Date()
   );
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (value) {
         setSelectedDate(new Date(value));
         setViewDate(new Date(value));
      }
   }, [value]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      };

      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isOpen]);

   const formatDate = (date: Date | null) => {
      if (!date) return '';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
   };

   const formatValueForInput = (date: Date | null) => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
   };

   const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      onChange(formatValueForInput(date));
      setIsOpen(false);
   };

   const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedDate(null);
      onChange('');
   };

   const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      return { daysInMonth, startingDayOfWeek };
   };

   const changeMonth = (increment: number) => {
      const newDate = new Date(viewDate);
      newDate.setMonth(newDate.getMonth() + increment);
      setViewDate(newDate);
   };

   const isDateDisabled = (date: Date) => {
      const dateStr = formatValueForInput(date);
      if (minDate && dateStr < minDate) return true;
      if (maxDate && dateStr > maxDate) return true;
      return false;
   };

   const isToday = (date: Date) => {
      const today = new Date();
      return (
         date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
      );
   };

   const isSameDay = (date1: Date | null, date2: Date) => {
      if (!date1) return false;
      return (
         date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
      );
   };

   const renderCalendar = () => {
      const { daysInMonth, startingDayOfWeek } = getDaysInMonth(viewDate);
      const days = [];

      // Empty cells for days before month starts
      for (let i = 0; i < startingDayOfWeek; i++) {
         days.push(
            <div key={`empty-${i}`} className="aspect-square" />
         );
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
         const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
         const isSelected = isSameDay(selectedDate, date);
         const isTodayDate = isToday(date);
         const isDisabled = isDateDisabled(date);

         days.push(
            <button
               key={day}
               type="button"
               onClick={() => !isDisabled && handleDateSelect(date)}
               disabled={isDisabled}
               className={cn(
                  'aspect-square rounded-lg text-sm font-medium transition-all',
                  'hover:bg-surface-hover active:scale-95',
                  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                  isSelected && 'bg-brand-secondary text-white shadow-md hover:bg-brand-secondary hover:opacity-90',
                  !isSelected && isTodayDate && 'bg-status-info-bg text-brand-secondary font-bold border-2 border-brand-secondary',
                  !isSelected && !isTodayDate && 'text-primary'
               )}
            >
               {day}
            </button>
         );
      }

      return days;
   };

   const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
   ];

   return (
      <div ref={containerRef} className={cn('relative', className)}>
         {label && (
            <label htmlFor={id} className="block text-sm font-medium text-primary mb-1.5">
               {label}
            </label>
         )}

         <div className="relative">
            <button
               type="button"
               id={id}
               onClick={() => !disabled && setIsOpen(!isOpen)}
               disabled={disabled}
               className={cn(
                  'w-full px-3 py-2 text-sm border rounded-lg',
                  'bg-tertiary text-primary border-default',
                  'focus:ring-2 focus:ring-brand-secondary focus:border-transparent',
                  'transition-all duration-200',
                  'flex items-center justify-between gap-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'hover:border-brand-secondary'
               )}
            >
               <span className={cn('truncate', !selectedDate && 'text-tertiary')}>
                  {selectedDate ? formatDate(selectedDate) : placeholder}
               </span>
               <div className="flex items-center gap-1 flex-shrink-0">
                  {selectedDate && !disabled && (
                     <X
                        className="w-4 h-4 text-secondary hover:text-primary transition-colors"
                        onClick={handleClear}
                     />
                  )}
                  <Calendar className="w-4 h-4 text-secondary" />
               </div>
            </button>

            {isOpen && !disabled && (
               <div className="absolute z-50 mt-2 p-4 bg-secondary border border-default rounded-xl shadow-2xl w-80 animate-scale-in">
                  {/* Header with month/year navigation */}
                  <div className="flex items-center justify-between mb-4">
                     <button
                        type="button"
                        onClick={() => changeMonth(-1)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-secondary transition-colors"
                        aria-label="Mes anterior"
                     >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                     </button>

                     <div className="text-center">
                        <div className="text-base font-bold text-primary">
                           {months[viewDate.getMonth()]}
                        </div>
                        <div className="text-sm text-secondary">
                           {viewDate.getFullYear()}
                        </div>
                     </div>

                     <button
                        type="button"
                        onClick={() => changeMonth(1)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-secondary transition-colors"
                        aria-label="Mes siguiente"
                     >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                     </button>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                     {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                        <div
                           key={day}
                           className="text-xs font-semibold text-secondary text-center py-2"
                        >
                           {day}
                        </div>
                     ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                     {renderCalendar()}
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-default">
                     <button
                        type="button"
                        onClick={() => {
                           const today = new Date();
                           handleDateSelect(today);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-brand-secondary hover:bg-surface-hover rounded-lg transition-colors"
                     >
                        Hoy
                     </button>
                     <button
                        type="button"
                        onClick={handleClear}
                        className="px-3 py-1.5 text-xs font-medium text-secondary hover:bg-surface-hover rounded-lg transition-colors"
                     >
                        Limpiar
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
