import { useTheme } from '@/config/themes';
import { getAvailableBrands } from '@/config/themes/registry';
import { Button } from '@/components/ui/Button';

export function BrandSwitcher() {
   const { brandId, switchBrand, mode, setMode } = useTheme();
   const availableBrands = getAvailableBrands();

   return (
      <div className="fixed bottom-6 right-6 z-50 bg-surface-elevated border border-border-DEFAULT rounded-lg shadow-theme-xl p-4 space-y-4">
         <div>
            <h3 className="text-sm font-semibold text-primary mb-2">
               🎨 Brand Switcher
            </h3>
            <p className="text-xs text-secondary mb-3">
               Cambia entre marcas para ver el theming
            </p>
         </div>

         {/* Brand Selector */}
         <div className="space-y-2">
            <label className="text-xs font-medium text-secondary">
               Marca Actual: <span className="text-primary font-semibold">{brandId}</span>
            </label>
            <div className="flex flex-col gap-2">
               {availableBrands.map((brand) => (
                  <Button
                     key={brand}
                     variant={brandId === brand ? 'primary' : 'secondary'}
                     size="sm"
                     onClick={() => switchBrand(brand)}
                     className="w-full justify-start"
                  >
                     {brand === 'bet30' && '🔴'}
                     {brand === 'pinnacle' && '🟢'}
                     <span className="ml-2 capitalize">{brand}</span>
                     {brandId === brand && ' ✓'}
                  </Button>
               ))}
            </div>
         </div>

         {/* Mode Selector */}
         <div className="space-y-2 pt-3 border-t border-border-DEFAULT">
            <label className="text-xs font-medium text-secondary">
               Modo: <span className="text-primary font-semibold">{mode}</span>
            </label>
            <div className="flex gap-2">
               <Button
                  variant={mode === 'light' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setMode('light')}
                  className="flex-1"
               >
                  ☀️ Light
               </Button>
               <Button
                  variant={mode === 'dark' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setMode('dark')}
                  className="flex-1"
               >
                  🌙 Dark
               </Button>
            </div>
         </div>

         {/* Info */}
         <div className="pt-3 border-t border-border-DEFAULT">
            <p className="text-xs text-tertiary">
               Prueba cambiar de marca y modo para ver cómo se adaptan todos los componentes automáticamente 🎨
            </p>
         </div>
      </div>
   );
}
