import React from 'react';
import { createRoot } from 'react-dom/client';
// FIX: Changed to a named import for App to resolve module resolution errors.
import { App } from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);