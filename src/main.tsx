import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './config/themes';
import App from './App';
import './index.css';

// Create a client
const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 1000 * 60 * 5, // 5 minutes
         retry: 1,
         refetchOnWindowFocus: false,
      },
      mutations: {
         retry: 1,
      },
   },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
   <QueryClientProvider client={queryClient}>
      <BrowserRouter>
         <ThemeProvider>
            <App />
            <Toaster
               position="top-right"
               toastOptions={{
                  duration: 4000,
                  style: {
                     background: '#1e293b',
                     color: '#f1f5f9',
                     border: '1px solid #334155',
                  },
                  success: {
                     iconTheme: {
                        primary: '#10b981',
                        secondary: '#f1f5f9',
                     },
                  },
                  error: {
                     iconTheme: {
                        primary: '#ef4444',
                        secondary: '#f1f5f9',
                     },
                  },
               }}
            />
         </ThemeProvider>
      </BrowserRouter>
   </QueryClientProvider>
);