/**
 * Environment Configuration with Validation
 * Centralized env management with type safety and validation
 */

interface EnvConfig {
  // Supabase
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  
  // Firebase Auth
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  
  // Vertex AI / Google Cloud
  VITE_VERTEX_AI_ENDPOINT: string;
  VITE_VERTEX_AI_PROJECT_ID: string;
  VITE_VERTEX_AI_LOCATION: string;
  
  // Feature flags
  VITE_ENABLE_AI_MATCHMAKER: boolean;
  VITE_ENABLE_REALTIME_SYNC: boolean;
  VITE_ENABLE_ANALYTICS: boolean;
  
  // App
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
  VITE_APP_ENV: 'development' | 'staging' | 'production';
}

// Default values for development (non-sensitive)
const DEV_DEFAULTS: Partial<EnvConfig> = {
  VITE_APP_NAME: 'EventOS AI',
  VITE_APP_VERSION: '2.4.0',
  VITE_APP_ENV: 'development',
  VITE_ENABLE_AI_MATCHMAKER: true,
  VITE_ENABLE_REALTIME_SYNC: true,
  VITE_ENABLE_ANALYTICS: false,
};

/**
 * Get validated environment configuration
 */
export function getEnvConfig(): EnvConfig {
  const env = import.meta.env;
  const isDev = env.DEV;
  
  // In development, use defaults for optional vars
  const config: EnvConfig = {
    // Supabase (required for production)
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL || (isDev ? '' : ''),
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || (isDev ? '' : ''),
    
    // Firebase (required for auth)
    VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY || '',
    VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID || '',
    VITE_FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    VITE_FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    VITE_FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID || '',
    
    // Vertex AI
    VITE_VERTEX_AI_ENDPOINT: env.VITE_VERTEX_AI_ENDPOINT || '',
    VITE_VERTEX_AI_PROJECT_ID: env.VITE_VERTEX_AI_PROJECT_ID || '',
    VITE_VERTEX_AI_LOCATION: env.VITE_VERTEX_AI_LOCATION || 'us-central1',
    
    // Feature flags
    VITE_ENABLE_AI_MATCHMAKER: env.VITE_ENABLE_AI_MATCHMAKER === 'true' || isDev,
    VITE_ENABLE_REALTIME_SYNC: env.VITE_ENABLE_REALTIME_SYNC === 'true' || isDev,
    VITE_ENABLE_ANALYTICS: env.VITE_ENABLE_ANALYTICS === 'true',
    
    // App
    VITE_APP_NAME: env.VITE_APP_NAME || DEV_DEFAULTS.VITE_APP_NAME!,
    VITE_APP_VERSION: env.VITE_APP_VERSION || DEV_DEFAULTS.VITE_APP_VERSION!,
    VITE_APP_ENV: (env.VITE_APP_ENV as EnvConfig['VITE_APP_ENV']) || DEV_DEFAULTS.VITE_APP_ENV!,
  };
  
  return config;
}

/**
 * Check if all required production env vars are set
 */
export function checkRequiredEnvVars(): { valid: boolean; missing: string[]; warnings: string[] } {
  const config = getEnvConfig();
  const missing: string[] = [];
  const warnings: string[] = [];
  
  // Required for production
  const requiredForProd = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
  ];
  
  // Optional but recommended
  const recommended = [
    'VITE_VERTEX_AI_ENDPOINT',
    'VITE_VERTEX_AI_PROJECT_ID',
  ];
  
  if (config.VITE_APP_ENV === 'production') {
    for (const key of requiredForProd) {
      if (!config[key as keyof EnvConfig]) {
        missing.push(key);
      }
    }
  }
  
  for (const key of recommended) {
    if (!config[key as keyof EnvConfig]) {
      warnings.push(`${key} not set - AI features will use mock data`);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
    warnings
  };
}

/**
 * Get Firebase config object
 */
export function getFirebaseConfig() {
  const config = getEnvConfig();
  return {
    apiKey: config.VITE_FIREBASE_API_KEY,
    authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: config.VITE_FIREBASE_PROJECT_ID,
    storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: config.VITE_FIREBASE_APP_ID,
  };
}

/**
 * Get Supabase config
 */
export function getSupabaseConfig() {
  const config = getEnvConfig();
  return {
    url: config.VITE_SUPABASE_URL,
    anonKey: config.VITE_SUPABASE_ANON_KEY,
  };
}

/**
 * Get Vertex AI config
 */
export function getVertexAIConfig() {
  const config = getEnvConfig();
  return {
    endpoint: config.VITE_VERTEX_AI_ENDPOINT,
    projectId: config.VITE_VERTEX_AI_PROJECT_ID,
    location: config.VITE_VERTEX_AI_LOCATION,
  };
}

export const env = getEnvConfig();