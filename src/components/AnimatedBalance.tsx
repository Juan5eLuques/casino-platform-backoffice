import { useEffect, useState } from 'react';

interface AnimatedBalanceProps {
   value: number;
   duration?: number;
   className?: string;
   prefix?: string;
}

export function AnimatedBalance({ 
   value, 
   duration = 1000, 
   className = '',
   prefix = '$'
}: AnimatedBalanceProps) {
   const [displayValue, setDisplayValue] = useState(value);
   const [isAnimating, setIsAnimating] = useState(false);
   const [animationClass, setAnimationClass] = useState('');

   useEffect(() => {
      const startValue = displayValue;
      const endValue = value;
      const difference = endValue - startValue;

      if (difference === 0) return;

      // Determinar la clase de animación según si aumenta o disminuye
      if (difference > 0) {
         setAnimationClass('balance-increase');
      } else {
         setAnimationClass('balance-decrease');
      }

      setIsAnimating(true);
      const startTime = Date.now();

      const animate = () => {
         const currentTime = Date.now();
         const elapsed = currentTime - startTime;
         const progress = Math.min(elapsed / duration, 1);

         // Easing function (ease-out)
         const easeOut = 1 - Math.pow(1 - progress, 3);
         const currentValue = startValue + (difference * easeOut);

         setDisplayValue(currentValue);

         if (progress < 1) {
            requestAnimationFrame(animate);
         } else {
            setDisplayValue(endValue);
            setIsAnimating(false);
            // Remover la clase de animación después de que termine
            setTimeout(() => setAnimationClass(''), 300);
         }
      };

      requestAnimationFrame(animate);
   }, [value, duration]);

   return (
      <span 
         className={`${className} ${isAnimating ? 'animate-balance' : ''} ${animationClass}`}
      >
         {prefix}{displayValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
         })}
      </span>
   );
}
