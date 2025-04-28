// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout'; // Importar el Layout
import Dashboard from './components/Dashboard';
import HotelForm from './components/HotelForm';
import ContactForm from './components/ContactForm';
import AddressForm from './components/AddressForm';
import AmenityForm from './components/AmenityForm';
import FloorPlanForm from './components/FloorPlanForm';
import MediaForm from './components/MediaForm';
import RoomForm from './components/RoomForm';
import MediaTypeForm from './components/MediaTypeForm';
import AmenityTypeForm from './components/AmenityTypeForm';
import RoomTypeForm from './components/RoomTypeForm';
// No necesitamos './App.css' aquí a menos que tenga estilos específicos para App
// No necesitamos importar '@carbon/styles/css/styles.css' aquí si ya está en main.jsx

function App() {
  // Ya no necesitamos la lógica de handleCreateHotel aquí
  // Los formularios manejan su propio envío

  return (
    <Routes>
      {/* Usar AppLayout como ruta padre */}
      <Route path="/" element={<AppLayout />}>
        {/* Rutas hijas que se renderizarán dentro del <Outlet> de AppLayout */}
        {/* 'index' define el componente por defecto para la ruta padre ('/') */}
        <Route index element={<Dashboard />} />
        <Route path="hotel" element={<HotelForm />} />
        <Route path="contact" element={<ContactForm />} />
        <Route path="address" element={<AddressForm />} />
        <Route path="amenity" element={<AmenityForm />} />
        <Route path="floorplan" element={<FloorPlanForm />} />
        <Route path="media" element={<MediaForm />} />
        <Route path="room" element={<RoomForm />} />
        <Route path="mediatype" element={<MediaTypeForm />} />
        <Route path="amenitytype" element={<AmenityTypeForm />} />
        <Route path="roomtype" element={<RoomTypeForm />} />

        {/* Ruta comodín para páginas no encontradas, también dentro del layout */}
        <Route
          path="*"
          element={
            <div>
              <h2>404 - Página no encontrada</h2>
            </div>
          }
        />
      </Route>
      {/* Aquí podrías tener otras rutas que NO usen AppLayout si fuera necesario */}
    </Routes>
  );
}

export default App;
