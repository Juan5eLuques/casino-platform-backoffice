/**
 * Sistema de Theming Multi-Brand
 * 
 * Define la estructura completa de tokens de color y variables de tema
 * para soportar múltiples marcas (multi-brand) con modo claro/oscuro.
 */

/**
 * Configuración de colores para botones
 */
export interface ButtonColors {
   background: string;
   backgroundHover: string;
   backgroundActive: string;
   text: string;
   textHover: string;
   border: string;
   borderHover: string;
}

/**
 * Estados de botones por tipo
 */
export interface ButtonTheme {
   primary: ButtonColors;
   secondary: ButtonColors;
   danger: ButtonColors;
   success: ButtonColors;
   ghost: ButtonColors;
   outline: ButtonColors;
}

/**
 * Colores de identidad de marca
 */
export interface BrandColors {
   primary: string;      // Color principal de la marca
   primaryHover: string; // Hover del color principal
   primaryActive: string; // Active del color principal
   secondary: string;    // Color secundario
   secondaryHover: string;
   secondaryActive: string;
   accent: string;       // Color de acento
   accentHover: string;
   accentActive: string;
}

/**
 * Backgrounds del sistema
 */
export interface BackgroundColors {
   primary: string;      // Fondo principal (body)
   secondary: string;    // Fondo secundario (cards, paneles)
   tertiary: string;     // Fondo terciario (hover states, subtle)
   inverse: string;      // Fondo inverso (modals, tooltips)
   elevated: string;     // Elementos elevados con sombra
   sunken: string;       // Elementos hundidos (inputs, textareas)
}

/**
 * Surfaces - elementos elevados
 */
export interface SurfaceColors {
   default: string;      // Surface por defecto
   elevated: string;     // Surface elevado (cards con shadow)
   sunken: string;       // Surface hundido (inputs)
   overlay: string;      // Overlay para modals/dialogs
   hover: string;        // Hover state de surfaces
   active: string;       // Active state de surfaces
}

/**
 * Colores de texto
 */
export interface TextColors {
   primary: string;      // Texto principal (headings, body)
   secondary: string;    // Texto secundario (descriptions, labels)
   tertiary: string;     // Texto terciario (placeholders, disabled)
   inverse: string;      // Texto sobre fondos oscuros
   disabled: string;     // Texto deshabilitado
   link: string;         // Enlaces
   linkHover: string;    // Enlaces hover
   linkActive: string;   // Enlaces active
   muted: string;        // Texto muted/subtle
}

/**
 * Colores de bordes
 */
export interface BorderColors {
   default: string;      // Bordes por defecto
   subtle: string;       // Bordes sutiles (dividers)
   strong: string;       // Bordes fuertes (emphasis)
   focus: string;        // Bordes de foco (inputs, buttons)
   hover: string;        // Bordes en hover
   active: string;       // Bordes en active
   error: string;        // Bordes de error
   success: string;      // Bordes de éxito
}

/**
 * Estados semánticos del sistema
 */
export interface StatusColors {
   success: {
      default: string;
      hover: string;
      text: string;
      background: string;
      border: string;
   };
   warning: {
      default: string;
      hover: string;
      text: string;
      background: string;
      border: string;
   };
   error: {
      default: string;
      hover: string;
      text: string;
      background: string;
      border: string;
   };
   info: {
      default: string;
      hover: string;
      text: string;
      background: string;
      border: string;
   };
}

/**
 * Sombras del sistema
 */
export interface ShadowConfig {
   sm: string;
   md: string;
   lg: string;
   xl: string;
   '2xl': string;
   inner: string;
}

/**
 * Esquema de tema completo para un brand
 */
export interface BrandTheme {
   // Metadata
   name: string;
   brandId: string;
   version: string;

   // Colores de identidad
   brand: BrandColors;

   // Backgrounds
   background: BackgroundColors;

   // Surfaces
   surface: SurfaceColors;

   // Botones
   button: ButtonTheme;

   // Textos
   text: TextColors;

   // Borders
   border: BorderColors;

   // Estados semánticos
   status: StatusColors;

   // Overlays
   overlay: {
      backdrop: string;      // Backdrop para modals
      scrim: string;         // Scrim para drawers
      tooltip: string;       // Fondo de tooltips
   };

   // Shadows
   shadow: ShadowConfig;

   // Gradients (opcional)
   gradient?: {
      primary: string;
      secondary: string;
      accent: string;
   };
}

/**
 * Par de temas claro/oscuro
 */
export interface ThemeMode {
   light: BrandTheme;
   dark: BrandTheme;
}

/**
 * Configuración completa de tema para un brand
 */
export interface BrandThemeConfig {
   brandId: string;
   brandName: string;
   themes: ThemeMode;
   defaultMode: 'light' | 'dark';
}

/**
 * Contexto de tema activo
 */
export interface ThemeContextValue {
   theme: BrandTheme;
   mode: 'light' | 'dark';
   brandId: string;
   setMode: (mode: 'light' | 'dark') => void;
   switchBrand: (brandId: string) => void;
}

/**
 * Tipo para definir nuevos temas
 */
export type ThemeDefinition = Omit<BrandTheme, 'name' | 'brandId' | 'version'>;

/**
 * Utilidad para validar contraste de colores (WCAG)
 */
export interface ContrastValidation {
   ratio: number;
   passes: {
      aa: boolean;       // WCAG AA (4.5:1 para texto normal)
      aaLarge: boolean;  // WCAG AA para texto grande (3:1)
      aaa: boolean;      // WCAG AAA (7:1 para texto normal)
      aaaLarge: boolean; // WCAG AAA para texto grande (4.5:1)
   };
}
