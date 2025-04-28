// src/components/HotelManageLayout.jsx
import React from 'react'; // No se necesita useState/useEffect para el nombre
import { Outlet, useParams, NavLink, useLocation } from 'react-router-dom'; // Añadir useLocation
import {
  Tabs,
  TabList,
  Tab,
  Loading /* Loading ya no se usa aquí para el nombre */,
} from '@carbon/react';

// Estilos (sin cambios)
const navLinkStyle = {
  textDecoration: 'none',
  display: 'block',
  height: '100%',
};

function HotelManageLayout() {
  const { hotelId } = useParams();
  const location = useLocation(); // Hook para acceder al estado de la ruta

  // --- Obtener nombre del ESTADO DE LA RUTA (location.state) ---
  // Si location.state existe y tiene hotelName, úsalo; sino, usa el ID como fallback.
  const displayName = location.state?.hotelName || `ID ${hotelId}`;
  // Ya NO necesitamos estado local para hotelName, loadingHotel, errorHotel
  // -----------------------------------------------------------

  // --- useEffect para cargar nombre REMOVIDO ---

  // Definición de Tabs (sin cambios)
  const tabs = [
    { path: '', label: 'Details' },
    { path: 'rooms', label: 'Rooms' },
    { path: 'contacts', label: 'Contacts' },
    { path: 'address', label: 'Address' },
    { path: 'amenities', label: 'Amenities' },
    { path: 'media', label: 'Media' },
    { path: 'floorplans', label: 'Floor Plans' },
  ];

  // Lógica para selectedIndex (sin cambios)
  const basePath = `/hotel/${hotelId}`;
  const currentRelativePath = location.pathname.startsWith(basePath)
    ? location.pathname.substring(basePath.length).replace(/^\//, '')
    : '';
  let selectedIndex = tabs.findIndex((tab) => tab.path === currentRelativePath);
  if (selectedIndex === -1) {
    const currentBasePath = currentRelativePath.split('/')[0];
    selectedIndex = tabs.findIndex((tab) => tab.path === currentBasePath);
    if (selectedIndex === -1) {
      selectedIndex = 0;
    }
  }

  return (
    // Asumiendo que Theme g10 ya está aplicado por AppLayout
    <div>
      {/* Título y Contexto */}
      <h2 style={{ marginBottom: '0.5rem' }}>
        {/* --- USAR EL NOMBRE DEL ESTADO DE LA RUTA --- */}
        Managing Hotel: {displayName}
        {/* Ya no hay estado de carga aquí */}
      </h2>
      {/* Ya no hay errorHotel que mostrar aquí */}
      <p style={{ marginBottom: '1.5rem', fontSize: '0.9em', color: '#ddd' }}>
        ID: {hotelId}
      </p>

      {/* Sistema de Pestañas (sin cambios) */}
      <Tabs selectedIndex={selectedIndex} aria-label="Sub-navigation Tabs">
        <TabList activation="manual">
          {tabs.map((tab, index) => {
            const toPath = `${basePath}${tab.path ? `/${tab.path}` : ''}`;
            return (
              <Tab key={tab.path} id={`tab-${index}`} label={tab.label}>
                <NavLink
                  to={toPath}
                  end={tab.path === ''}
                  className="cds--tabs__nav-link"
                  style={navLinkStyle}
                >
                  {tab.label}
                </NavLink>
              </Tab>
            );
          })}
        </TabList>
      </Tabs>

      {/* Área de Contenido - Outlet (sin cambios) */}
      <div style={{ marginTop: '2rem', padding: '1rem 0' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default HotelManageLayout;
