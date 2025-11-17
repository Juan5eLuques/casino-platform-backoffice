import { useState, useEffect } from 'react';
import { Palette, RefreshCw, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
   useBrandAssets,
   useUpdateColors,
   usePublishConfig,
} from '@/hooks';
import { Button, Card, Alert } from '@/components/ui';
import type { ColorPalette } from '@/types';

const DEFAULT_COLORS: ColorPalette = {
   '--color-primary': '#ffb300',
   '--color-secondary': '#2196f3',
   '--color-accent': '#e91e63',
   '--color-background': '#121212',
   '--color-surface': '#1e1e1e',
   '--color-text': '#ffffff',
   '--color-text-secondary': '#b0b0b0',
   '--color-success': '#4caf50',
   '--color-error': '#f44336',
   '--color-warning': '#ff9800',
};

const COLOR_DESCRIPTIONS: Record<string, string> = {
   '--color-primary': 'Color principal del brand',
   '--color-secondary': 'Color secundario',
   '--color-accent': 'Color de acento',
   '--color-background': 'Fondo principal',
   '--color-surface': 'Fondo de tarjetas',
   '--color-text': 'Texto principal',
   '--color-text-secondary': 'Texto secundario',
   '--color-success': 'Estado éxito',
   '--color-error': 'Estado error',
   '--color-warning': 'Estado advertencia',
};

export default function ColorsPage() {
   const { data: assets, isLoading, error } = useBrandAssets();
   const updateMutation = useUpdateColors();
   const publishMutation = usePublishConfig();

   const [colors, setColors] = useState<ColorPalette>(DEFAULT_COLORS);
   const [hasChanges, setHasChanges] = useState(false);

   useEffect(() => {
      if (assets?.colors && Object.keys(assets.colors).length > 0) {
         setColors({ ...DEFAULT_COLORS, ...assets.colors });
         applyColorsToPreview(assets.colors);
      }
   }, [assets]);

   const applyColorsToPreview = (colorPalette: ColorPalette) => {
      Object.entries(colorPalette).forEach(([key, value]) => {
         if (value) {
            document.documentElement.style.setProperty(key, value);
         }
      });
   };

   const handleColorChange = (varName: string, value: string) => {
      const newColors = { ...colors, [varName]: value };
      setColors(newColors);
      setHasChanges(true);
      applyColorsToPreview(newColors);
   };

   const handleReset = () => {
      if (!confirm('¿Restaurar colores por defecto?')) return;
      setColors(DEFAULT_COLORS);
      applyColorsToPreview(DEFAULT_COLORS);
      setHasChanges(true);
   };

   const handleSave = async () => {
      try {
         await updateMutation.mutateAsync(colors);
         setHasChanges(false);
      } catch (err: any) {
         alert(err.message || 'Error al guardar colores');
      }
   };

   const handlePublish = async () => {
      if (hasChanges) {
         alert('Por favor guarda los cambios antes de publicar');
         return;
      }

      if (!confirm('¿Publicar la configuración actual? Esto actualizará el frontend de jugadores.')) return;

      try {
         const result = await publishMutation.mutateAsync();
         alert(`Configuración publicada exitosamente!\n\nURL: ${result.configUrl}`);
      } catch (err: any) {
         alert(err.message || 'Error al publicar configuración');
      }
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-brand-secondary" />
         </div>
      );
   }

   if (error) {
      return (
         <Alert variant="error">
            <AlertCircle className="w-4 h-4" />
            Error al cargar colores: {error.message}
         </Alert>
      );
   }

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
               <h1 className="text-xl sm:text-2xl font-bold text-primary">Paleta de Colores</h1>
               <p className="text-sm text-secondary mt-1">
                  Personaliza los colores del sitio de jugadores
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
               <Button
                  onClick={handleReset}
                  variant="secondary"
                  className="gap-2 w-full sm:w-auto"
               >
                  <RefreshCw className="w-4 h-4" />
                  Restaurar
               </Button>
               <Button
                  onClick={handleSave}
                  variant="primary"
                  disabled={!hasChanges || updateMutation.isPending}
                  loading={updateMutation.isPending}
                  className="gap-2 w-full sm:w-auto"
               >
                  <Save className="w-4 h-4" />
                  Guardar
               </Button>
               <Button
                  onClick={handlePublish}
                  variant="success"
                  disabled={hasChanges || publishMutation.isPending}
                  loading={publishMutation.isPending}
                  className="w-full sm:w-auto"
               >
                  Publicar
               </Button>
            </div>
         </div>

         {hasChanges && (
            <Alert variant="warning">
               <AlertCircle className="w-4 h-4" />
               Tienes cambios sin guardar. No olvides guardar antes de publicar.
            </Alert>
         )}

         {updateMutation.isSuccess && (
            <Alert variant="success">
               <CheckCircle className="w-4 h-4" />
               Colores guardados exitosamente
            </Alert>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Color Pickers */}
            <Card>
               <div className="p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                     <Palette className="w-5 h-5" />
                     Variables CSS
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                     {Object.entries(colors).map(([varName, value]) => (
                        <div key={varName} className="flex items-center gap-4">
                           <div className="flex-shrink-0">
                              <input
                                 type="color"
                                 value={value || '#000000'}
                                 onChange={(e) => handleColorChange(varName, e.target.value)}
                                 className="w-12 h-12 rounded cursor-pointer border-2 border-default"
                              />
                           </div>
                           <div className="flex-1 min-w-0">
                              <label className="block text-sm font-medium text-primary mb-1">
                                 {varName}
                              </label>
                              <p className="text-xs text-secondary mb-1">
                                 {COLOR_DESCRIPTIONS[varName] || 'Color personalizado'}
                              </p>
                              <input
                                 type="text"
                                 value={value || ''}
                                 onChange={(e) => handleColorChange(varName, e.target.value)}
                                 placeholder="#000000"
                                 className="w-full px-3 py-2 text-sm border border-default rounded-lg focus:border-brand-secondary focus:outline-none bg-tertiary text-primary font-mono"
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </Card>

            {/* Preview */}
            <div className="space-y-4 sm:space-y-6">
               <Card>
                  <div className="p-4 sm:p-6">
                     <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
                        Vista Previa
                     </h2>
                     <div
                        className="rounded-lg p-6 space-y-4"
                        style={{
                           backgroundColor: colors['--color-background'],
                           color: colors['--color-text'],
                        }}
                     >
                        <div
                           className="p-4 rounded-lg"
                           style={{ backgroundColor: colors['--color-surface'] }}
                        >
                           <h3 className="font-bold mb-2" style={{ color: colors['--color-text'] }}>
                              Título de Ejemplo
                           </h3>
                           <p style={{ color: colors['--color-text-secondary'] }}>
                              Este es un texto secundario de ejemplo
                           </p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                           <button
                              className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                              style={{
                                 backgroundColor: colors['--color-primary'],
                                 color: colors['--color-text'],
                              }}
                           >
                              Botón Primario
                           </button>
                           <button
                              className="px-4 py-2 rounded-lg font-medium transition-colors"
                              style={{
                                 backgroundColor: colors['--color-secondary'],
                                 color: colors['--color-text'],
                              }}
                           >
                              Botón Secundario
                           </button>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                           <button
                              className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm"
                              style={{
                                 backgroundColor: colors['--color-success'],
                                 color: colors['--color-text'],
                              }}
                           >
                              Éxito
                           </button>
                           <button
                              className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm"
                              style={{
                                 backgroundColor: colors['--color-error'],
                                 color: colors['--color-text'],
                              }}
                           >
                              Error
                           </button>
                           <button
                              className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm"
                              style={{
                                 backgroundColor: colors['--color-warning'],
                                 color: colors['--color-text'],
                              }}
                           >
                              Advertencia
                           </button>
                        </div>

                        <div
                           className="p-4 rounded-lg border-l-4"
                           style={{
                              backgroundColor: colors['--color-surface'],
                              borderColor: colors['--color-accent'],
                           }}
                        >
                           <p style={{ color: colors['--color-text'] }}>
                              💡 Este es un mensaje de ejemplo con color de acento
                           </p>
                        </div>
                     </div>
                  </div>
               </Card>

               <Card>
                  <div className="p-4 sm:p-6">
                     <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
                        Información
                     </h2>
                     <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-secondary">
                        <p>
                           • Los colores se aplican mediante CSS variables
                        </p>
                        <p>
                           • Los cambios se previsualizan en tiempo real
                        </p>
                        <p>
                           • Guarda antes de publicar al frontend
                        </p>
                        <p>
                           • Puedes usar HEX, RGB o nombres de colores CSS
                        </p>
                     </div>
                  </div>
               </Card>
            </div>
         </div>
      </div>
   );
}
