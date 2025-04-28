// src/components/HotelList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Importaciones de Carbon
import { Loading, InlineNotification, Button } from '@carbon/react'; // Añadido Button

// Estilos (puedes moverlos a CSS)
const hotelInfoStyle = {
  flexGrow: 1, // Ocupa espacio disponible
  marginRight: '1rem', // Espacio antes del botón
  textAlign: 'left', // Asegurar alineación izquierda (aunque suele ser por defecto)
};

const idStyle = {
  color: '#ccc',
  marginLeft: '0.5rem',
  fontSize: '0.9em',
};

// Estilo para el contenedor del botón (si es necesario)
const actionContainerStyle = {
  flexShrink: 0, // Evitar que el botón se encoja
};

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8090/api/hotels');
        if (!response.ok) {
          throw new Error(
            `Error HTTP ${response.status}: ${
              response.statusText || 'No se pudo obtener la lista'
            }`
          );
        }
        const data = await response.json();
        setHotels(data || []);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la lista de hoteles.');
        console.error('Error fetching hotels:', err);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div>
      <h2>Lista de Hoteles</h2>

      {loading && (
        <Loading description="Cargando hoteles..." withOverlay={false} />
      )}

      {!loading && error && (
        <InlineNotification
          kind="error"
          title="Error al cargar"
          subtitle={error}
          onClose={() => setError(null)}
          lowContrast
          style={{ marginBottom: '1rem' }}
        />
      )}

      {!loading && !error && (
        <div style={{ marginTop: '1rem' }}>
          {hotels.length === 0 ? (
            <p>No hay hoteles registrados.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {hotels.map((hotel) => (
                <li
                  key={hotel.hotelId}
                  style={{
                    border: '1px solid #555',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {/* Información del Hotel (Alineada a la izquierda por defecto) */}
                  <div style={hotelInfoStyle}>
                    <strong>{hotel.hotelName || 'Nombre Desconocido'}</strong>
                    <span style={idStyle}>(ID: {hotel.hotelId})</span>
                    {/* Podrías añadir más info aquí si la necesitas */}
                  </div>

                  {/* Contenedor para el Botón de Acción */}
                  <div style={actionContainerStyle}>
                    {/* Botón "Seleccionar" que navega a la gestión del hotel */}
                    <Link
                      to={`/hotel/${hotel.hotelId}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button size="sm" kind="tertiary">
                        {' '}
                        {/* Puedes cambiar kind a 'primary' si prefieres */}
                        Seleccionar
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default HotelList;
