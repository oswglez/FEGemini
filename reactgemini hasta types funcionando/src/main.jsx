// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- Import BrowserRouter
import App from './App';

// Import global Carbon styles here if not already done elsewhere (best practice: once here)
import '@carbon/styles/css/styles.css';
// Import your App.css for custom global styles
import './App.css';
// Ensure Roboto font is loaded (via index.html or CSS)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap App with BrowserRouter to enable routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
