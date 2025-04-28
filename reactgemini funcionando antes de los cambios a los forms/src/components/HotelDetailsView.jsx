// src/components/HotelDetailsView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Loading, // Indicador de carga
  InlineNotification, // Mostrar errores
  Grid, // Para layout
  Column, // Para layout
  StructuredListWrapper, // Opcional: Para mostrar datos clave/valor
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
} from '@carbon/react';

// Estilo simple para las etiquetas de los datos
const labelStyle = {
  fontWeight: 'bold',
  color: '#cdcdcd', // Un gris claro
  marginRight: '0.5rem',
};

// Estilo para los valores
const valueStyle = {
  color: 'white',
};

// Componente helper para mostrar un par Clave/Valor
function DetailItem({ label, value }) {
  // Si el valor es nulo, undefined o vacío, mostrar un guión o nada
  const displayValue =
    value === null || typeof value === 'undefined' || value === ''
      ? '-'
      : String(value);
  return (
    <div style={{ marginBottom: '1rem' }}>
      {' '}
      {/* Espacio entre items */}
      <span style={labelStyle}>{label}:</span>
      <span style={valueStyle}>{displayValue}</span>
    </div>
  );
}

function HotelDetailsView() {
  const { hotelId } = useParams(); // Obtener ID de la URL
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para cargar los datos del hotel específico
    const fetchHotelDetails = async () => {
      if (!hotelId) {
        setError('No se proporcionó un ID de hotel.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // --- LLAMADA A LA API REAL ---
        const response = await fetch(
          `http://localhost:8090/api/hotels/${hotelId}`
        ); // Endpoint para un hotel

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`No se encontró ningún hotel con ID ${hotelId}.`);
          }
          throw new Error(
            `Error HTTP ${response.status}: ${
              response.statusText || 'No se pudieron obtener los detalles'
            }`
          );
        }
        const data = await response.json();
        setHotelData(data); // Guardar los datos del hotel en el estado
      } catch (err) {
        setError(
          err.message || 'No se pudieron cargar los detalles del hotel.'
        );
        console.error(`Error fetching hotel ${hotelId}:`, err);
        setHotelData(null); // Limpiar datos en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId]); // Volver a cargar si el hotelId cambia

  // Renderizado condicional
  if (loading) {
    return (
      <Loading
        description={`Cargando detalles del hotel ID ${hotelId}...`}
        withOverlay={false}
      />
    );
  }

  if (error) {
    return (
      <InlineNotification
        kind="error"
        title="Error al cargar Detalles"
        subtitle={error}
        onClose={() => setError(null)}
        lowContrast
      />
    );
  }

  if (!hotelData) {
    // Esto podría pasar si hubo un error no capturado o la API devolvió null
    return <p>No se encontraron datos para el hotel ID {hotelId}.</p>;
  }

  // Renderizado de los detalles del hotel
  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Detalles del Hotel</h3>
      {/* Usar Grid para organizar la visualización */}
      <Grid>
        {/* Columna 1 */}
        <Column lg={8} md={4} sm={4}>
          <h4
            style={{
              borderBottom: '1px solid #555',
              paddingBottom: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            Información General
          </h4>
          <DetailItem label="Nombre" value={hotelData.hotelName} />
          <DetailItem label="ID" value={hotelData.hotelId} />
          <DetailItem label="Cadena" value={hotelData.hotelChain} />
          <DetailItem label="Marca" value={hotelData.hotelBrand} />
          <DetailItem label="Teléfono Local" value={hotelData.localPhone} />
          <DetailItem label="Teléfono Celular" value={hotelData.celularPhone} />
          <DetailItem label="Total Pisos" value={hotelData.totalFloors} />
          <DetailItem label="Total Habitaciones" value={hotelData.totalRooms} />
        </Column>

        {/* Columna 2 */}
        <Column lg={8} md={4} sm={4}>
          <h4
            style={{
              borderBottom: '1px solid #555',
              paddingBottom: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            Integraciones
          </h4>
          <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>PMS:</p>
          <DetailItem label="Proveedor PMS" value={hotelData.pmsVendor} />
          <DetailItem label="Hotel ID (PMS)" value={hotelData.pmsHotelId} />
          {/* No mostramos el pmsToken por seguridad */}

          <p
            style={{
              color: '#ccc',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            }}
          >
            CRS:
          </p>
          <DetailItem label="Proveedor CRS" value={hotelData.crsVendor} />
          <DetailItem label="Hotel ID (CRS)" value={hotelData.crsHotelId} />
          {/* No mostramos el crsToken por seguridad */}
        </Column>

        {/* Fila para Disclaimer */}
        <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
          <h4
            style={{
              borderBottom: '1px solid #555',
              paddingBottom: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            Disclaimer
          </h4>
          <p style={valueStyle}>{hotelData.disclaimer || '-'}</p>
        </Column>
      </Grid>

      {/* Alternativa usando StructuredList (comentada) */}
      {/*
      <StructuredListWrapper>
        <StructuredListHead>
            <StructuredListRow head>
                <StructuredListCell head>Campo</StructuredListCell>
                <StructuredListCell head>Valor</StructuredListCell>
            </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
            <StructuredListRow>
                <StructuredListCell>Nombre</StructuredListCell>
                <StructuredListCell>{hotelData.hotelName}</StructuredListCell>
            </StructuredListRow>
            <StructuredListRow>
                <StructuredListCell>ID</StructuredListCell>
                <StructuredListCell>{hotelData.hotelId}</StructuredListCell>
            </StructuredListRow>
             // ... más filas ...
        </StructuredListBody>
      </StructuredListWrapper>
      */}
    </div>
  );
}

export default HotelDetailsView;
