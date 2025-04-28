// src/components/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet es el placeholder para el contenido de la ruta
import { Theme } from '@carbon/react'; // Importar Theme
import Sidebar from './Sidebar'; // Importar el menú lateral

const layoutContainerStyle = {
  display: 'flex', // Para poner Sidebar y contenido lado a lado
  minHeight: '100vh', // Asegurar altura mínima
};

const contentStyle = {
  flexGrow: 1, // El contenido principal ocupa el espacio restante
  padding: '2rem', // Espaciado interno para el contenido
  backgroundColor: '#5331FA', // Fondo púrpura principal
  fontFamily: 'Roboto, sans-serif', // Fuente principal
  // color: 'white' // No es necesario, Theme g100 lo aplica
};

function AppLayout() {
  return (
    // Aplicar el tema g100 a toda la sección del layout
    <Theme theme="g100">
      <div style={layoutContainerStyle}>
        <Sidebar />
        {/* El contenido de la ruta activa se renderizará aquí */}
        <main style={contentStyle}>
          <Outlet />
        </main>
      </div>
    </Theme>
  );
}

export default AppLayout;
