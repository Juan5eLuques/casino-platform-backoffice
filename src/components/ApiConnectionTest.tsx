import { useState } from 'react';
import { apiClient } from '@/api/client';
import { getDynamicBrandConfig, getBrandInfo } from '@/config/brand.config';

interface ApiTestResult {
  apiHealth?: string;
  brandResolution?: string;
  currentDomain?: string;
  apiBaseUrl?: string;
  currentBrand?: any;
  brandsCount?: number;
  error?: string;
  stack?: string;
}

export function ApiConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<ApiTestResult | null>(null);

  const testConnection = async () => {
    setStatus('testing');
    try {
      const config = getDynamicBrandConfig();

      // Test 1: Verificar que la API responde
      const healthUrl = config.api.baseURL.replace('/api/v1', '/health');
      const healthResponse = await fetch(healthUrl);
      if (!healthResponse.ok) throw new Error('API not responding');

      // Test 2: Verificar brand resolution automática
      const brandsResponse = await apiClient.get('/admin/operators?page=1&limit=20');

      // Test 3: Verificar que podemos obtener el brand actual
      const currentBrandResponse = await apiClient.get('/admin/brands/current');

      setResult({
        apiHealth: 'OK',
        brandResolution: 'Automática por URL',
        currentDomain: config.domain,
        apiBaseUrl: config.api.baseURL,
        brandsCount: brandsResponse.data.brands?.length || 0,
        currentBrand: currentBrandResponse.data,
      });
      setStatus('success');
    } catch (error: any) {
      setResult({
        error: error.message,
        stack: error.response?.data || error.stack,
      });
      setStatus('error');
    }
  };

  // Solo mostrar en desarrollo
  if (!getDynamicBrandConfig().dev.isDevelopment) return null;

  const config = getDynamicBrandConfig();
  const brandInfo = getBrandInfo();

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-md">
      <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
        🔌 API Multi-Tenant Test
      </h3>

      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 space-y-1">
        <div><strong>Dominio:</strong> {config.domain}</div>
        <div><strong>API:</strong> {config.api.baseURL}</div>
        {brandInfo && (
          <>
            <div><strong>Brand:</strong> {brandInfo.name} ({brandInfo.code})</div>
            <div><strong>ID:</strong> {brandInfo.id}</div>
          </>
        )}
      </div>

      <button
        onClick={testConnection}
        disabled={status === 'testing'}
        className={`px-3 py-1 text-white rounded text-sm font-medium ${status === 'testing'
          ? 'bg-gray-400 cursor-not-allowed'
          : status === 'success'
            ? 'bg-green-500 hover:bg-green-600'
            : status === 'error'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        {status === 'testing' ? '🔄 Testing...' :
          status === 'success' ? '✅ Test API' :
            status === 'error' ? '❌ Test API' : '🧪 Test API'}
      </button>

      {result && (
        <div className="mt-3">
          <div className={`text-xs p-2 rounded ${status === 'success'
            ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}>
            <pre className="overflow-auto max-h-32 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        <strong>Multi-tenant:</strong> Backend resuelve por URL base
      </div>
    </div>
  );
}