import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
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
         </ThemeProvider>
      </BrowserRouter>
   </QueryClientProvider>
);