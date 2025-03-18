/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_AUTH_CLIENT_ID: string;
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
