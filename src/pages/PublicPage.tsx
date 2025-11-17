import { useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import {
   useBrandAssets,
   useUploadMedia,
   useDeleteMedia,
} from '@/hooks';
import { Button, Card, Alert } from '@/components/ui';
import type { MediaType } from '@/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const LOGO_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
const FAVICON_TYPES = ['image/x-icon', 'image/png'];

export default function PublicPage() {
   const [uploadError, setUploadError] = useState<string | null>(null);
   const [uploadingType, setUploadingType] = useState<MediaType | null>(null);

   const { data: assets, isLoading, error } = useBrandAssets();
   const uploadMutation = useUploadMedia();
   const deleteMutation = useDeleteMedia();

   const validateFile = (file: File, type: MediaType): string | null => {
      if (file.size > MAX_FILE_SIZE) {
         return 'El archivo es muy grande (máximo 5MB)';
      }

      const allowedTypes = type === 'logo' ? LOGO_TYPES : FAVICON_TYPES;
      if (!allowedTypes.includes(file.type)) {
         const formats = type === 'logo' 
            ? 'JPG, PNG, SVG o WebP' 
            : 'ICO o PNG';
         return `Formato no permitido. Usa ${formats}`;
      }

      return null;
   };

   const handleUpload = async (type: MediaType, files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploadError(null);
      setUploadingType(type);
      const file = files[0];

      const error = validateFile(file, type);
      if (error) {
         setUploadError(error);
         setUploadingType(null);
         return;
      }

      try {
         await uploadMutation.mutateAsync({ type, file });
         setUploadingType(null);
      } catch (err: any) {
         setUploadError(err.message || `Error al subir ${type}`);
         setUploadingType(null);
      }
   };

   const handleDelete = async (type: MediaType) => {
      if (!confirm(`¿Eliminar ${type === 'logo' ? 'el logo' : 'el favicon'} actual?`)) return;

      try {
         await deleteMutation.mutateAsync(type);
      } catch (err: any) {
         alert(err.message || `Error al eliminar ${type}`);
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
            Error al cargar configuración: {error.message}
         </Alert>
      );
   }

   const logo = assets?.media?.logo;
   const favicon = assets?.media?.favicon;

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header */}
         <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">Identidad Visual</h1>
            <p className="text-sm text-secondary mt-1">
               Gestiona el logo y favicon del backoffice
            </p>
         </div>

         {uploadError && (
            <Alert variant="error">
               <AlertCircle className="w-4 h-4" />
               {uploadError}
            </Alert>
         )}

         {uploadMutation.isSuccess && !uploadError && (
            <Alert variant="success">
               <CheckCircle className="w-4 h-4" />
               Archivo subido exitosamente
            </Alert>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Logo */}
            <Card>
               <div className="p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                     <ImageIcon className="w-5 h-5" />
                     Logotipo
                  </h2>

                  {/* Preview */}
                  {logo ? (
                     <div className="mb-4 sm:mb-6">
                        <div className="border-2 border-default rounded-lg p-4 sm:p-6 bg-tertiary flex items-center justify-center mb-4">
                           <img
                              src={logo}
                              alt="Logo actual"
                              className="max-h-20 sm:max-h-24 max-w-full object-contain"
                           />
                        </div>
                        <Button
                           onClick={() => handleDelete('logo')}
                           variant="danger"
                           disabled={deleteMutation.isPending}
                           className="w-full gap-2"
                        >
                           <Trash2 className="w-4 h-4" />
                           Eliminar
                        </Button>
                     </div>
                  ) : (
                     <div className="mb-4 sm:mb-6 border-2 border-dashed border-default rounded-lg p-6 sm:p-8 text-center bg-tertiary">
                        <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-tertiary" />
                        <p className="text-xs sm:text-sm text-secondary">Sin logotipo configurado</p>
                     </div>
                  )}

                  {/* Upload */}
                  <div>
                     <input
                        type="file"
                        accept={LOGO_TYPES.join(',')}
                        onChange={(e) => handleUpload('logo', e.target.files)}
                        disabled={uploadingType !== null}
                        className="hidden"
                        id="logo-upload"
                     />
                     <Button
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        variant="primary"
                        disabled={uploadingType !== null}
                        loading={uploadingType === 'logo'}
                        className="w-full gap-2"
                     >
                        <Upload className="w-4 h-4" />
                        {logo ? 'Cambiar' : 'Subir'} Logotipo
                     </Button>
                     <p className="text-xs text-secondary mt-2 text-center">
                        JPG, PNG, SVG, WebP • Máximo 5MB
                     </p>
                  </div>
               </div>
            </Card>

            {/* Favicon */}
            <Card>
               <div className="p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                     <ImageIcon className="w-5 h-5" />
                     Favicon
                  </h2>

                  {/* Preview */}
                  {favicon ? (
                     <div className="mb-4 sm:mb-6">
                        <div className="border-2 border-default rounded-lg p-4 sm:p-6 bg-tertiary flex items-center justify-center mb-4">
                           <img
                              src={favicon}
                              alt="Favicon actual"
                              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                           />
                        </div>
                        <Button
                           onClick={() => handleDelete('favicon')}
                           variant="danger"
                           disabled={deleteMutation.isPending}
                           className="w-full gap-2"
                        >
                           <Trash2 className="w-4 h-4" />
                           Eliminar
                        </Button>
                     </div>
                  ) : (
                     <div className="mb-4 sm:mb-6 border-2 border-dashed border-default rounded-lg p-6 sm:p-8 text-center bg-tertiary">
                        <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-tertiary" />
                        <p className="text-xs sm:text-sm text-secondary">Sin favicon configurado</p>
                     </div>
                  )}

                  {/* Upload */}
                  <div>
                     <input
                        type="file"
                        accept={FAVICON_TYPES.join(',')}
                        onChange={(e) => handleUpload('favicon', e.target.files)}
                        disabled={uploadingType !== null}
                        className="hidden"
                        id="favicon-upload"
                     />
                     <Button
                        onClick={() => document.getElementById('favicon-upload')?.click()}
                        variant="primary"
                        disabled={uploadingType !== null}
                        loading={uploadingType === 'favicon'}
                        className="w-full gap-2"
                     >
                        <Upload className="w-4 h-4" />
                        {favicon ? 'Cambiar' : 'Subir'} Favicon
                     </Button>
                     <p className="text-xs text-secondary mt-2 text-center">
                        ICO, PNG (16x16, 32x32) • Máximo 5MB
                     </p>
                  </div>
               </div>
            </Card>
         </div>

         {/* Information */}
         <Card>
            <div className="p-4 sm:p-6">
               <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">Información</h2>
               <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-secondary">
                  <p>
                     • El <strong>logo</strong> se muestra en la barra lateral y el header del backoffice
                  </p>
                  <p>
                     • El <strong>favicon</strong> es el icono que aparece en la pestaña del navegador
                  </p>
                  <p>
                     • Si no configuras un logo, se mostrará el emoji 🎰 por defecto
                  </p>
                  <p>
                     • Los archivos se almacenan en AWS S3 con URLs públicas
                  </p>
                  <p>
                     • Recomendado: Logo en PNG con fondo transparente, Favicon en ICO o PNG 32x32
                  </p>
               </div>
            </div>
         </Card>
      </div>
   );
}
