// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts Principales
import AppLayout from './components/AppLayout'; // Layout general con Sidebar
import HotelManageLayout from './components/HotelManageLayout'; // Layout para gestionar UN hotel

// Vistas/Componentes de Página y Formularios
import Dashboard from './components/Dashboard'; // Página de inicio
import HotelList from './components/HotelList'; // Lista de hoteles
import HotelForm from './components/HotelForm'; // Formulario para Crear (y ¿Editar?) Hotel
import HotelDetailsView from './components/HotelDetailsView'; // Vista de Detalles del Hotel
import RoomForm from './components/RoomForm'; // Formulario de Habitaciones
import ContactForm from './components/ContactForm'; // Formulario de Contactos
import AddressForm from './components/AddressForm'; // Formulario de Dirección
import AmenityForm from './components/AmenityForm'; // Formulario de Amenities
import MediaForm from './components/MediaForm'; // Formulario de Media (Placeholder o implementado)
import FloorPlanForm from './components/FloorPlanForm'; // <-- Formulario de Planos (Nuevo/Actualizado)

// --- Importar Placeholders para Formularios Futuros ---
// import MediaTypeForm from './components/MediaTypeForm';       // Global?
// import AmenityTypeForm from './components/AmenityTypeForm';   // Global?
// import RoomTypeForm from './components/RoomTypeForm';       // Global?
// -------------------------------------------------------

// Componente simple para 404
const NotFound = () => (
  <div style={{ marginTop: '2rem' }}>
    <h2>404 - Página no encontrada</h2>
  </div>
);
const HotelSubSectionNotFound = () => (
  <div style={{ marginTop: '2rem' }}>
    <h3>Sección de hotel no encontrada</h3>
    <p>Seleccione una opción válida en las pestañas.</p>
  </div>
);

function App() {
  // No hay lógica de estado o envío aquí

  return (
    <Routes>
      {/* Ruta Raíz: Aplica AppLayout a todas las rutas anidadas */}
      <Route path="/" element={<AppLayout />}>
        {/* Ruta Índice: Muestra el Dashboard por defecto en "/" */}
        <Route index element={<Dashboard />} />
        {/* Ruta para la lista de Hoteles */}
        <Route path="hotels" element={<HotelList />} />
        {/* Agrupación de rutas bajo "/hotel" */}
        <Route path="hotel">
          {/* Ruta para crear un nuevo hotel */}
          <Route path="new" element={<HotelForm />} />

          {/* Ruta para gestionar un hotel específico por su ID */}
          {/* Renderiza HotelManageLayout, que contiene sub-navegación (Tabs) y su propio Outlet */}
          <Route path=":hotelId" element={<HotelManageLayout />}>
            {/* Rutas anidadas que se renderizan en el Outlet de HotelManageLayout */}
            {/* Ruta Índice para :hotelId (muestra detalles por defecto) */}
            <Route index element={<HotelDetailsView />} />
            {/* Rutas para cada sección gestionable del hotel */}
            <Route path="rooms" element={<RoomForm />} />
            <Route path="contacts" element={<ContactForm />} />
            <Route path="address" element={<AddressForm />} />
            <Route path="amenities" element={<AmenityForm />} />
            <Route path="media" element={<MediaForm />} />
            <Route path="floorplans" element={<FloorPlanForm />} />{' '}
            {/* <-- RUTA AÑADIDA/VERIFICADA */}
            {/* ... Añadir aquí rutas para otras entidades relacionadas con Hotel ... */}
            {/* Ruta comodín para sub-secciones inválidas dentro de un hotel */}
            <Route path="*" element={<HotelSubSectionNotFound />} />
          </Route>

          {/* Ruta comodín si se intenta acceder a /hotel/ sin 'new' o un ID */}
          {/* Podríamos redirigir a /hotels o mostrar un error */}
          <Route path="*" element={<NotFound />} />
        </Route>{' '}
        {/* Fin de la agrupación /hotel */}
        {/* --- Rutas Globales para Tipos (Ejemplo) --- */}
        {/* Estas irían aquí si son globales, no dentro de /hotel/:hotelId */}
        {/* <Route path="settings"> */}
        {/* <Route path="mediatypes" element={<MediaTypeForm />} /> */}
        {/* <Route path="amenitytypes" element={<AmenityTypeForm />} /> */}
        {/* <Route path="roomtypes" element={<RoomTypeForm />} /> */}
        {/* </Route> */}
        {/* ------------------------------------------- */}
        {/* Ruta Comodín Principal: Para cualquier otra ruta no definida */}
        <Route path="*" element={<NotFound />} />
      </Route>{' '}
      {/* Fin de la ruta raíz con AppLayout */}
    </Routes>
  );
}

export default App;
