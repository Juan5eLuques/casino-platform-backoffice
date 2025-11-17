import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/hooks/useAuth';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

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
      <div className="min-h-screen bg-tertiary flex items-center justify-center p-4">
         <div className="w-full max-w-[440px]">
            {/* Logo and Title */}
            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-secondary rounded-xl shadow-lg mb-6">
                  <span className="text-3xl">🎰</span>
               </div>
               <h1 className="text-3xl font-bold text-primary mb-2">
                  Casino Backoffice
               </h1>
               <p className="text-secondary text-sm">
                  Panel de Administración
               </p>
            </div>

            {/* Login Form */}
            <div className="bg-secondary rounded-xl shadow-xl border border-default overflow-hidden">
               <div className="p-8">
                  <div className="mb-6">
                     <h2 className="text-xl font-semibold text-primary">
                        Iniciar Sesión
                     </h2>
                     <p className="text-secondary text-sm mt-1">
                        Ingresa tus credenciales para continuar
                     </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                     {/* Error message */}
                     {loginMutation.isError && (
                        <div className="flex items-start gap-3 p-4 bg-status-error-bg border border-status-error-border rounded-lg">
                           <AlertCircle className="w-5 h-5 text-status-error-text flex-shrink-0 mt-0.5" />
                           <div className="flex-1">
                              <p className="text-sm font-medium text-status-error-text">
                                 Error de autenticación
                              </p>
                              <p className="text-xs text-status-error-text mt-1 opacity-90">
                                 {loginMutation.error?.message || 'Credenciales incorrectas. Verifica tu usuario y contraseña.'}
                              </p>
                           </div>
                        </div>
                     )}

                     <div className="space-y-4">
                        <div className="relative">
                           <div className="absolute left-3 top-9 text-secondary pointer-events-none z-10">
                              <User className="w-5 h-5" />
                           </div>
                           <Input
                              {...register('username')}
                              label="Usuario"
                              type="text"
                              placeholder="Ingresa tu usuario"
                              error={errors.username?.message}
                              className="pl-11 bg-tertiary border-default text-primary placeholder:text-tertiary focus:border-brand-secondary focus:ring-brand-secondary/20"
                              autoComplete="username"
                              autoFocus
                           />
                        </div>

                        <div className="relative">
                           <div className="absolute left-3 top-9 text-secondary pointer-events-none z-10">
                              <Lock className="w-5 h-5" />
                           </div>
                           <Input
                              {...register('password')}
                              label="Contraseña"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Ingresa tu contraseña"
                              error={errors.password?.message}
                              className="pl-11 pr-11 bg-tertiary border-default text-primary placeholder:text-tertiary focus:border-brand-secondary focus:ring-brand-secondary/20"
                              autoComplete="current-password"
                           />
                           <button
                              type="button"
                              className="absolute right-3 top-9 text-secondary hover:text-primary transition-colors z-10"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                           >
                              {showPassword ? (
                                 <EyeOff className="w-5 h-5" />
                              ) : (
                                 <Eye className="w-5 h-5" />
                              )}
                           </button>
                        </div>
                     </div>

                     <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-3 text-base font-semibold shadow-md transition-all duration-200"
                        loading={loginMutation.isPending}
                        disabled={loginMutation.isPending}
                     >
                        {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                     </Button>
                  </form>
               </div>

               {/* Footer */}
               <div className="px-8 py-4 bg-tertiary/50 border-t border-default">
                  <p className="text-xs text-tertiary text-center">
                     © {new Date().getFullYear()} Casino Platform. Todos los derechos reservados.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}