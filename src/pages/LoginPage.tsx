import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useLogin } from '@/hooks/useAuth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const loginSchema = z.object({
   username: z.string().min(1, 'El usuario es requerido'),
   password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
   const [showPassword, setShowPassword] = useState(false);
   const loginMutation = useLogin();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
   });

   const onSubmit = async (data: LoginFormData) => {
      try {
         await loginMutation.mutateAsync(data);
      } catch (error) {
         // Error is handled by the mutation
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg-tertiary flex items-center justify-center p-4">
         <div className="w-full max-w-md">
            {/* Logo and Title */}
            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mb-4">
                  <span className="text-2xl font-bold text-white">🎰</span>
               </div>
               <h1 className="text-3xl font-bold text-white mb-2">Casino Backoffice</h1>
               <p className="text-gray-400">Accede a tu panel de administración</p>
            </div>

            {/* Login Form */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
               <CardHeader>
                  <h2 className="text-xl font-semibold text-white text-center">
                     Iniciar Sesión
                  </h2>
               </CardHeader>
               <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                     <div>
                        <Input
                           {...register('username')}
                           label="Usuario"
                           type="text"
                           placeholder="Ingresa tu usuario"
                           error={errors.username?.message}
                           className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                     </div>

                     <div>
                        <div className="relative">
                           <Input
                              {...register('password')}
                              label="Contraseña"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Ingresa tu contraseña"
                              error={errors.password?.message}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                           />
                           <button
                              type="button"
                              className="absolute right-3 top-8 text-gray-400 hover:text-white transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                           >
                              {showPassword ? (
                                 <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                 <EyeIcon className="w-5 h-5" />
                              )}
                           </button>
                        </div>
                     </div>

                     <Button
                        type="submit"
                        className="w-full"
                        loading={loginMutation.isPending}
                        disabled={loginMutation.isPending}
                     >
                        {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                     </Button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                     <p className="text-sm text-gray-300 mb-2 font-medium">
                        💡 Credenciales de demo:
                     </p>
                     <div className="space-y-1 text-xs text-gray-400">
                        <p><strong>Admin:</strong> admin@bet30.local / Admin123!</p>
                        <p><strong>Cajero:</strong> cashier@bet30.local / Cashier123!</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8">
               <p className="text-sm text-gray-500">
                  © 2024 Casino Platform. Todos los derechos reservados.
               </p>
            </div>
         </div>
      </div>
   );
}