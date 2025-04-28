// src/components/Sidebar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Importar NavLink para estilo activo

// Estilos básicos (puedes mejorar con CSS o Carbon)
const sidebarStyle = {
  width: '250px',
  background: '#3d1fcc', // Púrpura algo más oscuro
  padding: '1rem',
  height: '100vh',
  overflowY: 'auto',
};

const navListStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const linkStyle = {
  display: 'block',
  color: 'white',
  textDecoration: 'none',
  padding: '0.75rem 1rem', // Un poco más de padding
  marginBottom: '0.5rem',
  borderRadius: '4px', // Bordes redondeados
  transition: 'background-color 0.2s ease', // Transición suave
};

// Estilo para el enlace activo usando NavLink
// Se aplica cuando la ruta coincide EXACTAMENTE (o parcialmente si se configura)
const activeStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Un fondo blanco semitransparente
  fontWeight: 'bold',
};

function Sidebar() {
  return (
    <div style={sidebarStyle}>
      <h3
        style={{
          color: 'white',
          borderBottom: '1px solid #7a60f5',
          paddingBottom: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        Gestión Hotelera
      </h3>
      <nav>
        <ul style={navListStyle}>
          <li>
            {/* Usamos NavLink para poder aplicar estilo al enlace activo */}
            <NavLink
              to="/hotels" // Ruta para listar hoteles
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeStyle : {}), // Combina estilos si está activo
              })}
            >
              Listar Hoteles
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hotel/new" // Ruta para crear un nuevo hotel
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeStyle : {}),
              })}
            >
              Crear Nuevo Hotel
            </NavLink>
          </li>
          {/* Puedes añadir un enlace al Dashboard/Inicio si quieres */}
          <li>
            <NavLink
              to="/" // Ruta para el dashboard
              end // 'end' asegura que solo esté activo en la ruta EXACTA "/"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeStyle : {}),
              })}
            >
              Inicio / Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
