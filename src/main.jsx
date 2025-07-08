import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthProvider } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";

//Import TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//Create a Query Client
const queryClient = new QueryClient();

AOS.init();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
