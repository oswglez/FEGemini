// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Opcional: Importar componentes de Carbon para SideNav si prefieres
// import { SideNav, SideNavItems, SideNavLink } from '@carbon/react';

// Estilos básicos para el sidebar (puedes mejorarlos con CSS o Carbon)
const sidebarStyle = {
  width: '250px',
  background: '#3d1fcc', // Un púrpura un poco más oscuro para contraste
  padding: '1rem',
  height: '100vh', // Ocupar toda la altura
  overflowY: 'auto', // Scroll si hay muchos items
};

const linkStyle = {
  display: 'block',
  color: 'white',
  textDecoration: 'none',
  padding: '0.5rem 0',
  marginBottom: '0.5rem',
};

const activeLinkStyle = {
  // Estilo opcional para el link activo (requiere NavLink)
  fontWeight: 'bold',
  // background: '#ffffff20' // ejemplo
};

function Sidebar() {
  // Para usar activeLinkStyle, necesitarías cambiar Link por NavLink
  // e importar NavLink from 'react-router-dom'
  // y usar style={({ isActive }) => isActive ? {...linkStyle, ...activeLinkStyle} : linkStyle}

  return (
    <div style={sidebarStyle}>
      <h3
        style={{
          color: 'white',
          borderBottom: '1px solid white',
          paddingBottom: '0.5rem',
        }}
      >
        Menú
      </h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/" style={linkStyle}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/hotel" style={linkStyle}>
            Hotel
          </Link>
        </li>
        <li>
          <Link to="/contact" style={linkStyle}>
            Contactos
          </Link>
        </li>
        <li>
          <Link to="/address" style={linkStyle}>
            Direcciones
          </Link>
        </li>
        <li>
          <Link to="/floorplan" style={linkStyle}>
            Planos de Piso
          </Link>
        </li>
        <li>
          <Link to="/room" style={linkStyle}>
            Habitaciones
          </Link>
        </li>
        <li>
          <Link to="/roomtype" style={linkStyle}>
            Tipos de Habitación
          </Link>
        </li>
        <li>
          <Link to="/amenity" style={linkStyle}>
            Amenities
          </Link>
        </li>
        <li>
          <Link to="/amenitytype" style={linkStyle}>
            Tipos de Amenity
          </Link>
        </li>
        <li>
          <Link to="/media" style={linkStyle}>
            Media
          </Link>
        </li>
        <li>
          <Link to="/mediatype" style={linkStyle}>
            Tipos de Media
          </Link>
        </li>
        {/* Asegúrate que las rutas coincidan con las definidas en App.jsx */}
      </ul>
    </div>
  );
}

export default Sidebar;
