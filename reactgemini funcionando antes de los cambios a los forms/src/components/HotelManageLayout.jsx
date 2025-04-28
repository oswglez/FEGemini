// src/components/HotelManageLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useParams, NavLink, useLocation } from 'react-router-dom';
import { Tabs, TabList, Tab, Loading } from '@carbon/react';

// Estilos básicos para el NavLink dentro del Tab
const navLinkStyle = {
  textDecoration: 'none',
  display: 'block',
  height: '100%',
  // Dejar que Carbon maneje color y padding con la clase cds--tabs__nav-link
};

function HotelManageLayout() {
  const { hotelId } = useParams();
  const location = useLocation();
  const [hotelName, setHotelName] = useState('');
  const [loadingHotel, setLoadingHotel] = useState(false);
  const [errorHotel, setErrorHotel] = useState(null);

  // Opcional: Cargar nombre del hotel para mostrar en el título
  useEffect(() => {
    setLoadingHotel(true);
    setErrorHotel(null);
    // Simulación - Reemplazar con fetch real
    const fetchName = async () => {
      try {
        // const response = await fetch(`http://localhost:8090/api/hotels/${hotelId}`);
        // if(!response.ok) throw new Error('No se pudo cargar nombre hotel');
        // const data = await response.json();
        // setHotelName(data.hotelName || `ID ${hotelId}`);
        await new Promise((resolve) => setTimeout(resolve, 200));
        setHotelName(`Hotel Demo ${hotelId}`); // Placeholder
      } catch (err) {
        setErrorHotel(err.message);
        setHotelName(`ID ${hotelId}`);
      } finally {
        setLoadingHotel(false);
      }
    };
    fetchName();
  }, [hotelId]);

  // Definir las pestañas y sus rutas relativas
  const tabs = [
    { path: '', label: 'Detalles' }, // Ruta índice
    { path: 'rooms', label: 'Habitaciones' },
    { path: 'contacts', label: 'Contactos' },
    { path: 'address', label: 'Dirección' },
    { path: 'amenities', label: 'Amenities' },
    { path: 'media', label: 'Media' },
    { path: 'floorplans', label: 'Planos' }, // <-- PESTAÑA AÑADIDA/VERIFICADA
    // Añade más pestañas aquí si es necesario
  ];

  // Calcular el índice de la pestaña activa basado en la URL actual
  const basePath = `/hotel/${hotelId}`;
  const currentRelativePath = location.pathname.startsWith(basePath)
    ? location.pathname.substring(basePath.length).replace(/^\//, '')
    : '';
  let selectedIndex = tabs.findIndex((tab) => tab.path === currentRelativePath);
  if (selectedIndex === -1) {
    // Si estás en una sub-sub-ruta (ej: /hotel/123/rooms/edit/45), busca el prefijo
    const currentBasePath = currentRelativePath.split('/')[0];
    selectedIndex = tabs.findIndex((tab) => tab.path === currentBasePath);
    if (selectedIndex === -1) {
      selectedIndex = 0; // Default a la primera pestaña (Detalles) si no hay coincidencia
    }
  }

  return (
    <div>
      {/* Título y Contexto */}
      <h2 style={{ marginBottom: '0.5rem' }}>
        Gestionando Hotel:{' '}
        {loadingHotel ? <Loading small withOverlay={false} /> : hotelName}
      </h2>
      {errorHotel && (
        <p style={{ color: 'red', fontSize: '0.8em', marginBottom: '1rem' }}>
          Error cargando nombre: {errorHotel}
        </p>
      )}
      <p style={{ marginBottom: '1.5rem', fontSize: '0.9em', color: '#ddd' }}>
        ID: {hotelId}
      </p>

      {/* Sistema de Pestañas para Sub-Navegación */}
      <Tabs selectedIndex={selectedIndex} aria-label="Sub-navigation Tabs">
        <TabList activation="manual">
          {tabs.map((tab, index) => {
            const toPath = `${basePath}${tab.path ? `/${tab.path}` : ''}`;
            return (
              <Tab key={tab.path} id={`tab-${index}`}>
                <NavLink
                  to={toPath}
                  // 'end' es crucial para la pestaña índice 'Detalles'
                  end={tab.path === ''}
                  className="cds--tabs__nav-link" // Clase Carbon para estilo visual
                  style={navLinkStyle} // Aplicar estilos base
                >
                  {tab.label}
                </NavLink>
              </Tab>
            );
          })}
        </TabList>
      </Tabs>

      {/* Área de Contenido - Outlet */}
      <div style={{ marginTop: '2rem', padding: '1rem 0' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default HotelManageLayout;
