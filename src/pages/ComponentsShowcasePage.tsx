import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/Modal';
import { useTheme } from '@/config/themes';

export function ComponentsShowcasePage() {
   const { theme, mode, brandId, setMode } = useTheme();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [showAlert, setShowAlert] = useState(true);

   return (
      <div className="min-h-screen bg-background-DEFAULT p-6 space-y-8">
         {/* Header */}
         <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h1 className="text-3xl font-bold text-primary">
                     Showcase de Componentes
                  </h1>
                  <p className="text-secondary mt-2">
                     Sistema de theming multi-brand - {brandId} ({mode} mode)
                  </p>
               </div>

               <div className="flex gap-3">
                  <Button
                     variant={mode === 'light' ? 'primary' : 'secondary'}
                     onClick={() => setMode('light')}
                  >
                     ☀️ Light
                  </Button>
                  <Button
                     variant={mode === 'dark' ? 'primary' : 'secondary'}
                     onClick={() => setMode('dark')}
                  >
                     🌙 Dark
                  </Button>
               </div>
            </div>

            {/* Alerts Section */}
            {showAlert && (
               <div className="space-y-4 mb-8">
                  <Alert
                     variant="success"
                     title="¡Migración exitosa!"
                     description="Todos los componentes ahora usan el sistema de theming."
                     dismissible
                     onDismiss={() => setShowAlert(false)}
                  />
               </div>
            )}

            {/* Buttons Section */}
            <Card className="mb-8">
               <CardHeader>
                  <h2 className="text-xl font-semibold text-primary">Buttons</h2>
                  <p className="text-sm text-secondary">Todas las variantes adaptándose al tema</p>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="flex flex-wrap gap-3">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="success">Success</Button>
                        <Button variant="warning">Warning</Button>
                        <Button variant="danger">Danger</Button>
                     </div>

                     <div className="flex flex-wrap gap-3">
                        <Button variant="primary" size="sm">Small</Button>
                        <Button variant="primary" size="md">Medium</Button>
                        <Button variant="primary" size="lg">Large</Button>
                     </div>

                     <div className="flex flex-wrap gap-3">
                        <Button variant="primary" loading>Loading...</Button>
                        <Button variant="secondary" disabled>Disabled</Button>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Badges Section */}
            <Card className="mb-8">
               <CardHeader>
                  <h2 className="text-xl font-semibold text-primary">Badges</h2>
                  <p className="text-sm text-secondary">Estados con colores temáticos</p>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="flex flex-wrap gap-3">
                        <Badge variant="success">Success</Badge>
                        <Badge variant="error">Error</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge variant="neutral">Neutral</Badge>
                     </div>

                     <div className="flex flex-wrap gap-3">
                        <Badge variant="success" size="sm">Small</Badge>
                        <Badge variant="info" size="md">Medium</Badge>
                        <Badge variant="warning" size="lg">Large</Badge>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Forms Section */}
            <Card className="mb-8">
               <CardHeader>
                  <h2 className="text-xl font-semibold text-primary">Forms</h2>
                  <p className="text-sm text-secondary">Inputs con theming consistente</p>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4 max-w-md">
                     <Input
                        label="Email"
                        type="email"
                        placeholder="ejemplo@casino.com"
                        helper="Ingresa tu email corporativo"
                     />

                     <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                     />

                     <Input
                        label="Usuario"
                        placeholder="Ingresa tu usuario"
                        error="Este campo es requerido"
                     />
                  </div>
               </CardContent>
               <CardFooter>
                  <div className="flex gap-3">
                     <Button variant="primary">Guardar</Button>
                     <Button variant="secondary">Cancelar</Button>
                  </div>
               </CardFooter>
            </Card>

            {/* Alerts Section */}
            <Card className="mb-8">
               <CardHeader>
                  <h2 className="text-xl font-semibold text-primary">Alerts</h2>
                  <p className="text-sm text-secondary">Notificaciones con estados visuales</p>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <Alert
                        variant="success"
                        title="Operación exitosa"
                        description="Los cambios se guardaron correctamente en el sistema."
                     />

                     <Alert
                        variant="error"
                        title="Error de validación"
                        description="Por favor revisa los campos marcados en rojo."
                     />

                     <Alert
                        variant="warning"
                        title="Advertencia"
                        description="Esta acción no se puede deshacer. ¿Estás seguro?"
                     />

                     <Alert
                        variant="info"
                        title="Información"
                     >
                        <p>Puedes personalizar completamente los temas desde <code className="bg-surface-elevated px-2 py-0.5 rounded">src/config/themes</code></p>
                     </Alert>
                  </div>
               </CardContent>
            </Card>

            {/* Modal Section */}
            <Card className="mb-8">
               <CardHeader>
                  <h2 className="text-xl font-semibold text-primary">Modal</h2>
                  <p className="text-sm text-secondary">Overlays con backdrop temático</p>
               </CardHeader>
               <CardContent>
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                     Abrir Modal
                  </Button>
               </CardContent>
            </Card>

            {/* Theme Info */}
            <Card>
               <CardHeader>
                  <h2 className="text-xl font-semibold text-primary">Theme Info</h2>
                  <p className="text-sm text-secondary">Información del tema actual</p>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <span className="text-tertiary">Brand:</span>
                        <span className="ml-2 font-medium text-primary">{brandId}</span>
                     </div>
                     <div>
                        <span className="text-tertiary">Mode:</span>
                        <span className="ml-2 font-medium text-primary">{mode}</span>
                     </div>
                     <div>
                        <span className="text-tertiary">Primary Color:</span>
                        <div
                           className="ml-2 inline-block w-6 h-6 rounded border border-border-DEFAULT"
                           style={{ backgroundColor: theme.brand.primary }}
                        />
                     </div>
                     <div>
                        <span className="text-tertiary">Background:</span>
                        <div
                           className="ml-2 inline-block w-6 h-6 rounded border border-border-DEFAULT"
                           style={{ backgroundColor: theme.background.primary }}
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Modal Component */}
         <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Modal con Theming"
            description="Este modal se adapta automáticamente al tema activo"
            size="lg"
            footer={
               <>
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                     Cancelar
                  </Button>
                  <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                     Confirmar
                  </Button>
               </>
            }
         >
            <div className="space-y-4">
               <p className="text-secondary">
                  Todos los componentes dentro del modal también usan el sistema de theming.
               </p>

               <div className="flex flex-wrap gap-2">
                  <Badge variant="success">Activo</Badge>
                  <Badge variant="info">Pendiente</Badge>
                  <Badge variant="warning">Atención</Badge>
               </div>

               <Input
                  label="Campo de ejemplo"
                  placeholder="Escribe algo..."
                  helper="Los inputs también están temáticos"
               />
            </div>
         </Modal>
      </div>
   );
}
