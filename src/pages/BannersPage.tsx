import { useState, useCallback } from 'react';
import { Upload, Trash2, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import {
   useBrandAssets,
   useUploadBanner,
   useDeleteBanner,
   usePublishConfig,
} from '@/hooks';
import { Button, Card, Alert } from '@/components/ui';
import type { BannerSection } from '@/types';

const SECTION_LABELS: Record<BannerSection, string> = {
   home: 'Inicio',
   slots: 'Tragamonedas',
   'live-casino': 'Casino en Vivo',
};

const MAX_BANNERS_PER_SECTION = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function BannersPage() {
   const [selectedSection, setSelectedSection] = useState<BannerSection>('home');
   const [dragOver, setDragOver] = useState(false);
   const [uploadError, setUploadError] = useState<string | null>(null);

   const { data: assets, isLoading, error } = useBrandAssets();
   const uploadMutation = useUploadBanner();
   const deleteMutation = useDeleteBanner();
   const publishMutation = usePublishConfig();

   const banners = assets?.banners || { home: [], slots: [], liveCasino: [] };
   const currentBanners = banners[selectedSection === 'live-casino' ? 'liveCasino' : selectedSection] || [];

   const validateFile = (file: File): string | null => {
      if (file.size > MAX_FILE_SIZE) {
         return 'El archivo es muy grande (máximo 5MB)';
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
         return 'Formato no permitido. Usa JPG, PNG, GIF o WebP';
      }
      if (currentBanners.length >= MAX_BANNERS_PER_SECTION) {
         return `Máximo ${MAX_BANNERS_PER_SECTION} banners por sección`;
      }
      return null;
   };

   const handleUpload = useCallback(async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploadError(null);
      const file = files[0];

      const error = validateFile(file);
      if (error) {
         setUploadError(error);
         return;
      }

      try {
         await uploadMutation.mutateAsync({ section: selectedSection, file });
      } catch (err: any) {
         setUploadError(err.message || 'Error al subir banner');
      }
   }, [selectedSection, uploadMutation, currentBanners.length]);

   const handleDelete = async (url: string) => {
      if (!confirm('¿Eliminar este banner?')) return;

      const fileName = url.split('/').pop();
      if (!fileName) return;

      try {
         await deleteMutation.mutateAsync({ section: selectedSection, fileName });
      } catch (err: any) {
         alert(err.message || 'Error al eliminar banner');
      }
   };

   const handlePublish = async () => {
      if (!confirm('¿Publicar la configuración actual? Esto actualizará el sitio de jugadores.')) return;

      try {
         const result = await publishMutation.mutateAsync();
         alert(`Configuración publicada exitosamente\nURL: ${result.configUrl}`);
      } catch (err: any) {
         alert(err.message || 'Error al publicar configuración');
      }
   };

   const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleUpload(e.dataTransfer.files);
   }, [handleUpload]);

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
            Error al cargar banners: {error.message}
         </Alert>
      );
   }

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
               <h1 className="text-xl sm:text-2xl font-bold text-primary">Banners Promocionales</h1>
               <p className="text-sm text-secondary mt-1">
                  Gestiona las imágenes del sitio de jugadores
               </p>
            </div>
            <Button
               onClick={handlePublish}
               variant="success"
               disabled={publishMutation.isPending}
               loading={publishMutation.isPending}
               className="w-full sm:w-auto"
            >
               Publicar Cambios
            </Button>
         </div>

         {/* Section Tabs */}
         <Card>
            <div className="flex overflow-x-auto border-b border-default">
               {(Object.keys(SECTION_LABELS) as BannerSection[]).map((section) => {
                  const count = banners[section === 'live-casino' ? 'liveCasino' : section]?.length || 0;
                  return (
                     <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                        className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                           selectedSection === section
                              ? 'text-brand-secondary border-b-2 border-brand-secondary'
                              : 'text-secondary hover:text-primary'
                        }`}
                     >
                        {SECTION_LABELS[section]} ({count}/{MAX_BANNERS_PER_SECTION})
                     </button>
                  );
               })}
            </div>

            {/* Upload Zone */}
            <div className="p-4 sm:p-6">
               <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors ${
                     dragOver
                        ? 'border-brand-secondary bg-surface-hover'
                        : 'border-default hover:border-brand-secondary'
                  } ${currentBanners.length >= MAX_BANNERS_PER_SECTION ? 'opacity-50 pointer-events-none' : ''}`}
               >
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-tertiary" />
                  <p className="text-sm sm:text-base text-primary font-medium mb-2">
                     Arrastra imágenes aquí o selecciona un archivo
                  </p>
                  <p className="text-xs sm:text-sm text-secondary mb-4">
                     JPG, PNG, GIF, WebP • Máximo 5MB
                  </p>
                  <input
                     type="file"
                     accept={ALLOWED_TYPES.join(',')}
                     onChange={(e) => handleUpload(e.target.files)}
                     disabled={currentBanners.length >= MAX_BANNERS_PER_SECTION || uploadMutation.isPending}
                     className="hidden"
                     id="banner-upload"
                  />
                  <Button
                     onClick={() => document.getElementById('banner-upload')?.click()}
                     variant="secondary"
                     disabled={currentBanners.length >= MAX_BANNERS_PER_SECTION || uploadMutation.isPending}
                     className="w-full sm:w-auto"
                  >
                     Seleccionar Archivo
                  </Button>
               </div>

               {uploadError && (
                  <Alert variant="error" className="mt-4">
                     <AlertCircle className="w-4 h-4" />
                     {uploadError}
                  </Alert>
               )}

               {uploadMutation.isSuccess && (
                  <Alert variant="success" className="mt-4">
                     <CheckCircle className="w-4 h-4" />
                     Banner subido exitosamente
                  </Alert>
               )}
            </div>
         </Card>

         {/* Banner List */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentBanners.length === 0 ? (
               <div className="col-span-full">
                  <Card className="p-8 sm:p-12 text-center">
                     <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-tertiary" />
                     <p className="text-sm sm:text-base text-secondary">
                        No hay banners en esta sección
                     </p>
                  </Card>
               </div>
            ) : (
               currentBanners.map((url, index) => (
                  <Card key={url} className="overflow-hidden">
                     <div className="aspect-video bg-tertiary relative group">
                        <img
                           src={url}
                           alt={`Banner ${index + 1}`}
                           className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Button
                              onClick={() => handleDelete(url)}
                              variant="danger"
                              disabled={deleteMutation.isPending}
                              className="gap-2"
                           >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                           </Button>
                        </div>
                     </div>
                     <div className="p-3 sm:p-4">
                        <p className="text-xs text-secondary truncate">{url.split('/').pop()}</p>
                     </div>
                  </Card>
               ))
            )}
         </div>
      </div>
   );
}
