// src/components/HotelList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Usar Link normal aquí
import { Loading, InlineNotification, Button } from '@carbon/react';

// Estilos (sin cambios)
const actionContainerStyle = { flexShrink: 0 };
const hotelInfoStyle = { flexGrow: 1, marginRight: '1rem', textAlign: 'left' };
const idStyle = { color: '#aeaeae', marginLeft: '0.5rem', fontSize: '0.9em' };

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch hotels logic (sin cambios)
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8090/api/hotels');
        if (!response.ok) {
          throw new Error(
            `HTTP Error ${response.status}: ${
              response.statusText || 'Could not fetch list'
            }`
          );
        }
        const data = await response.json();
        setHotels(data || []);
      } catch (err) {
        setError(err.message || 'Could not load hotel list.');
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
      <h2>Hotel List</h2>
      {loading && (
        <Loading description="Loading hotels..." withOverlay={false} />
      )}
      {!loading && error && (
        <InlineNotification
          kind="error"
          title="Error Loading List"
          subtitle={error}
          onClose={() => setError(null)}
          lowContrast
          style={{ marginBottom: '1rem' }}
        />
      )}
      {!loading && !error && (
        <div style={{ marginTop: '1rem' }}>
          {hotels.length === 0 ? (
            <p>No hotels registered yet.</p>
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
                  <div style={hotelInfoStyle}>
                    <strong>{hotel.hotelName || 'Unknown Name'}</strong>
                    <span style={idStyle}> (ID: {hotel.hotelId}) </span>
                  </div>
                  <div style={actionContainerStyle}>
                    {/* --- MODIFICACIÓN AQUÍ: Añadir prop 'state' --- */}
                    <Link
                      to={`/hotel/${hotel.hotelId}`}
                      state={{ hotelName: hotel.hotelName }} // <--- Pasar el nombre aquí
                      style={{ textDecoration: 'none' }}
                    >
                      <Button size="sm" kind="tertiary">
                        {' '}
                        Select{' '}
                      </Button>
                    </Link>
                    {/* ------------------------------------------ */}
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
