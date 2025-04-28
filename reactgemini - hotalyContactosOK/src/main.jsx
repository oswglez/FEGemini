// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- Importar BrowserRouter
import App from './App';
// Importa los estilos globales de Carbon aquí si no lo has hecho ya
import '@carbon/styles/css/styles.css';
// Importa tu App.css si tienes estilos globales personalizados
import './App.css';
// Asegúrate que la fuente Roboto esté cargada (via index.html o CSS)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolver App con BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
