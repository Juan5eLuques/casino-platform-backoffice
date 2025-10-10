/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly VITE_API_BASE_URL: string;
   readonly VITE_ADMIN_HOST: string;
   readonly VITE_BRAND_CODE: string;
   readonly VITE_BRAND_NAME: string;
   readonly VITE_NODE_ENV: string;
   readonly VITE_ENABLE_API_LOGGING: string;
   readonly VITE_BRAND_ID: string;
   readonly VITE_OPERATOR_ID: string;
}

interface ImportMeta {
   readonly env: ImportMetaEnv;
}