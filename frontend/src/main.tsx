import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { App } from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster richColors position="top-right" toastOptions={{ style: { background: '#0f172a', border: '1px solid rgba(255,255,255,.1)', color: 'white' } }} />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
