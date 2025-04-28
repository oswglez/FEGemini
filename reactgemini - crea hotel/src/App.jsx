// En tu página o componente principal donde quieras mostrar el formulario
import React from 'react';
import HotelForm from './components/HotelForm'; // Ajusta la ruta
import './App.css';
import '@carbon/styles/css/styles.css';

function App() {
  const handleCreateHotel = async (hotelData) => {
    console.log('Enviando datos del nuevo hotel:', hotelData);
    // Lógica para enviar a la API (POST)
    try {
      // const response = await fetch('/api/hotels', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(hotelData),
      // });
      // if (!response.ok) throw new Error('Error al crear hotel');
      // const result = await response.json();
      // console.log('Hotel creado:', result);
      // // Redirigir, mostrar mensaje de éxito, etc.
      alert('Hotel creado (simulado). Ver consola.');
    } catch (error) {
      console.error('Error al crear hotel:', error);
      // Mostrar mensaje de error al usuario
      alert('Error al crear hotel.');
    }
  };

  // Si fueras a editar, necesitarías obtener los datos iniciales
  // const initialHotelData = { ... }; // Datos obtenidos de la API
  // const handleUpdateHotel = async (hotelData) => { ... } // Lógica PUT/PATCH

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Formulario de Hotel</h1>
      <HotelForm onSubmit={handleCreateHotel} />

      {/* Para editar: */}
      {/* <h1>Editar Hotel</h1> */}
      {/* <HotelForm onSubmit={handleUpdateHotel} initialData={initialHotelData} /> */}
    </div>
  );
}

export default App;
