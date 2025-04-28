// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts Principales
import AppLayout from './components/AppLayout';
import HotelManageLayout from './components/HotelManageLayout';

// Vistas/Componentes de Página y Formularios
import Dashboard from './components/Dashboard';
import HotelList from './components/HotelList';
import HotelForm from './components/HotelForm';
import HotelDetailsView from './components/HotelDetailsView';
import RoomForm from './components/RoomForm';
import ContactForm from './components/ContactForm';
import AddressForm from './components/AddressForm';
import AmenityForm from './components/AmenityForm';
import MediaForm from './components/MediaForm';
import FloorPlanForm from './components/FloorPlanForm';
import TypesManagementPage from './components/TypesManagementPage'; // <-- Importar nuevo componente

// Placeholders de Formularios de Tipos (usados dentro de TypesManagementPage)
import AmenityTypeForm from './components/AmenityTypeForm';
import MediaTypeForm from './components/MediaTypeForm';
import RoomTypeForm from './components/RoomTypeForm';

// Componentes 404 (sin cambios)
const NotFound = () => (
  <div style={{ marginTop: '2rem' }}>
    <h2>404 - Page Not Found</h2>
  </div>
);
const HotelSubSectionNotFound = () => (
  <div style={{ marginTop: '2rem' }}>
    <h3>Hotel section not found</h3>
    <p>Please select a valid option from the tabs.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {' '}
        {/* Layout Principal */}
        <Route index element={<Dashboard />} />
        <Route path="hotels" element={<HotelList />} />
        <Route path="hotel">
          {' '}
          {/* Grupo Hotel */}
          <Route path="new" element={<HotelForm />} />
          <Route path=":hotelId" element={<HotelManageLayout />}>
            {' '}
            {/* Layout Gestión Hotel */}
            <Route index element={<HotelDetailsView />} />
            <Route path="rooms" element={<RoomForm />} />
            <Route path="contacts" element={<ContactForm />} />
            <Route path="address" element={<AddressForm />} />
            <Route path="amenities" element={<AmenityForm />} />
            <Route path="media" element={<MediaForm />} />
            <Route path="floorplans" element={<FloorPlanForm />} />
            <Route path="*" element={<HotelSubSectionNotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* --- NUEVA RUTA PARA GESTIÓN DE TIPOS --- */}
        <Route path="types" element={<TypesManagementPage />} />
        {/* --------------------------------------- */}
        {/* Rutas globales para Settings (si las necesitas más adelante) */}
        {/* <Route path="settings"> ... </Route> */}
        {/* Ruta Comodín Principal */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
