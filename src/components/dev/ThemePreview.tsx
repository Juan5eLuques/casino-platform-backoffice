import { useTheme, generateContrastReport } from '@/config/themes';
import { Check, X, Sun, Moon, Palette } from 'lucide-react';

/**
 * Componente para visualizar y testear el tema activo
 */
export function ThemePreview() {
   const { theme, mode, setMode, brandId } = useTheme();

   const contrastReport = generateContrastReport(theme);

   return (
      <div className="min-h-screen bg-bg-primary p-4 sm:p-6 lg:p-8">
         {/* Header */}
         <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className="bg-brand-primary p-3 rounded-xl shadow-lg">
                     <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <h1 className="text-3xl font-bold text-text-primary">Theme Preview</h1>
                     <p className="text-text-secondary">
                        {theme.name} ({brandId}) - v{theme.version}
                     </p>
                  </div>
               </div>

               {/* Mode Toggle */}
               <button
                  onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border-default rounded-lg hover:bg-surface-hover transition-colors"
               >
                  {mode === 'light' ? (
                     <>
                        <Moon className="w-5 h-5 text-text-primary" />
                        <span className="text-text-primary">Dark Mode</span>
                     </>
                  ) : (
                     <>
                        <Sun className="w-5 h-5 text-text-primary" />
                        <span className="text-text-primary">Light Mode</span>
                     </>
                  )}
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brand Colors */}
            <section className="bg-surface-elevated border border-border-default rounded-xl p-6 shadow-theme-md">
               <h2 className="text-xl font-bold text-text-primary mb-4">Brand Colors</h2>
               <div className="space-y-3">
                  <ColorSwatch label="Primary" color={theme.brand.primary} />
                  <ColorSwatch label="Primary Hover" color={theme.brand.primaryHover} />
                  <ColorSwatch label="Secondary" color={theme.brand.secondary} />
                  <ColorSwatch label="Accent" color={theme.brand.accent} />
               </div>
            </section>

            {/* Buttons */}
            <section className="bg-surface-elevated border border-border-default rounded-xl p-6 shadow-theme-md">
               <h2 className="text-xl font-bold text-text-primary mb-4">Buttons</h2>
               <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-btn-primary-bg text-btn-primary-text border border-btn-primary-border rounded-lg hover:bg-btn-primary-bg-hover active:bg-btn-primary-bg-active transition-colors font-medium">
                     Primary Button
                  </button>
                  <button className="w-full px-4 py-2 bg-btn-secondary-bg text-btn-secondary-text border border-btn-secondary-border rounded-lg hover:bg-btn-secondary-bg-hover active:bg-btn-secondary-bg-active transition-colors font-medium">
                     Secondary Button
                  </button>
                  <button className="w-full px-4 py-2 bg-btn-danger-bg text-btn-danger-text border border-btn-danger-border rounded-lg hover:bg-btn-danger-bg-hover active:bg-btn-danger-bg-active transition-colors font-medium">
                     Danger Button
                  </button>
                  <button className="w-full px-4 py-2 bg-btn-success-bg text-btn-success-text border border-btn-success-border rounded-lg hover:bg-btn-success-bg-hover active:bg-btn-success-bg-active transition-colors font-medium">
                     Success Button
                  </button>
                  <button className="w-full px-4 py-2 bg-btn-ghost-bg text-btn-ghost-text rounded-lg hover:bg-btn-ghost-bg-hover active:bg-btn-ghost-bg-active transition-colors font-medium">
                     Ghost Button
                  </button>
                  <button className="w-full px-4 py-2 bg-btn-outline-bg text-btn-outline-text border border-btn-outline-border rounded-lg hover:bg-btn-outline-bg-hover active:bg-btn-outline-bg-active transition-colors font-medium">
                     Outline Button
                  </button>
               </div>
            </section>

            {/* Text Colors */}
            <section className="bg-surface-elevated border border-border-default rounded-xl p-6 shadow-theme-md">
               <h2 className="text-xl font-bold text-text-primary mb-4">Text Hierarchy</h2>
               <div className="space-y-2">
                  <p className="text-text-primary text-lg font-semibold">Primary Text (Headings)</p>
                  <p className="text-text-secondary">Secondary Text (Body, descriptions)</p>
                  <p className="text-text-tertiary text-sm">Tertiary Text (Placeholders, hints)</p>
                  <p className="text-text-muted text-sm">Muted Text (Subtle information)</p>
                  <p className="text-text-disabled text-sm">Disabled Text</p>
                  <p className="text-text-link hover:text-text-link-hover cursor-pointer">
                     Link Text (Clickable)
                  </p>
               </div>
            </section>

            {/* Status */}
            <section className="bg-surface-elevated border border-border-default rounded-xl p-6 shadow-theme-md">
               <h2 className="text-xl font-bold text-text-primary mb-4">Status States</h2>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-status-success-bg border border-status-success-border rounded-lg">
                     <Check className="w-5 h-5 text-status-success" />
                     <span className="text-status-success-text font-medium">Success Message</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-status-warning-bg border border-status-warning-border rounded-lg">
                     <span className="text-xl text-status-warning">⚠️</span>
                     <span className="text-status-warning-text font-medium">Warning Message</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-status-error-bg border border-status-error-border rounded-lg">
                     <X className="w-5 h-5 text-status-error" />
                     <span className="text-status-error-text font-medium">Error Message</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-status-info-bg border border-status-info-border rounded-lg">
                     <span className="text-xl text-status-info">ℹ️</span>
                     <span className="text-status-info-text font-medium">Info Message</span>
                  </div>
               </div>
            </section>

            {/* Surfaces */}
            <section className="bg-surface-elevated border border-border-default rounded-xl p-6 shadow-theme-md">
               <h2 className="text-xl font-bold text-text-primary mb-4">Surfaces</h2>
               <div className="space-y-3">
                  <div className="bg-surface-default border border-border-default p-4 rounded-lg">
                     <p className="text-text-primary font-medium">Default Surface</p>
                  </div>
                  <div className="bg-surface-elevated border border-border-default p-4 rounded-lg shadow-theme-lg">
                     <p className="text-text-primary font-medium">Elevated Surface (with shadow)</p>
                  </div>
                  <div className="bg-surface-sunken border border-border-subtle p-4 rounded-lg">
                     <p className="text-text-primary font-medium">Sunken Surface (inputs)</p>
                  </div>
               </div>
            </section>

            {/* Contrast Report */}
            <section className="bg-surface-elevated border border-border-default rounded-xl p-6 shadow-theme-md">
               <h2 className="text-xl font-bold text-text-primary mb-4">
                  Accessibility (WCAG Contrast)
               </h2>
               <div className="space-y-2 text-sm">
                  {Object.entries(contrastReport).map(([key, validation]) => (
                     <div
                        key={key}
                        className="flex items-center justify-between py-2 border-b border-border-subtle"
                     >
                        <span className="text-text-secondary truncate pr-2">{key}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                           <span className="text-text-tertiary">{validation.ratio.toFixed(2)}:1</span>
                           {validation.passes.aa ? (
                              <Check className="w-4 h-4 text-status-success" />
                           ) : (
                              <X className="w-4 h-4 text-status-error" />
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         </div>
      </div>
   );
}

/**
 * Componente auxiliar para mostrar muestras de color
 */
function ColorSwatch({ label, color }: { label: string; color: string }) {
   return (
      <div className="flex items-center gap-3">
         <div
            className="w-12 h-12 rounded-lg border border-border-default shadow-theme-sm flex-shrink-0"
            style={{ backgroundColor: color }}
         />
         <div className="flex-1">
            <p className="text-text-primary font-medium">{label}</p>
            <p className="text-text-tertiary text-sm font-mono">{color}</p>
         </div>
      </div>
   );
}
