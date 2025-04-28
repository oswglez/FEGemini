import React, { useState, useEffect } from 'react';

// --- Componente Principal de la Aplicación ---
function App() {
  // --- Estados ---
  const [hoveredApartment, setHoveredApartment] = useState(null); // ID del apartamento sobre el que se pasa el mouse
  const [selectedApartment, setSelectedApartment] = useState(null); // ID del apartamento seleccionado
  const [apartmentColors, setApartmentColors] = useState({}); // Objeto para almacenar los colores de cada apartamento
  const [selectedColor, setSelectedColor] = useState('#fde047'); // Color por defecto para pintar (amarillo)

  // --- Datos de Ejemplo ---
  // Deberás reemplazar esto con los datos reales de tus apartamentos
  // La clave debe coincidir con el 'id' de cada elemento <path>, <rect>, <polygon> o <g> en tu SVG que representa un apartamento.
  const apartmentData = {

  
    '171': {
      width:"18.485624",
      height:"8.8293772",
      x:"35.329723",
      y:"63.949787",
      ry:"0.083806038",
      label:"Room 171",
      name: 'Apartamento 101',
      area: '50m²',
      details: 'Vista a la piscina, 1 dormitorio',
      desc:"Standard room, partial ocean view, close to stairs",
    },
    '169': {
      name: 'Apartamento 102',
      area: '65m²',
      details: 'Balcón, 2 dormitorios',
      width:"18.485624",
    height:"8.8293772",
    x:"35.588512",
    y:"73.084633",
    ry:"0.083806038",
    label="Room 169",
    desc:"Standard room, partial ocean view, close to stairs",
    },
    '167': {
      name: 'Apartamento 103',
      area: '45m²',
      details: 'Estudio, vista al jardín',
      width:"18.485624",
      height:"8.8293772",
      x:"35.485332",
      y:"82.520157",
      ry:"0.083806038",
      label:"Room 167",
      desc:"Standard room, partial ocean view, close to stairs",
    },
    // Agrega aquí todos tus apartamentos con sus IDs correspondientes del SVG
    // Ejemplo si usaste Inkscape para dibujar encima y le diste IDs:
    // 'room173': { name: 'Habitación 173', area: '20m²', details: 'Estándar' },
    // 'room172': { name: 'Habitación 172', area: '20m²', details: 'Estándar' },
  };

  // --- Paleta de Colores ---
  const colorPalette = ['#fde047', '#86efac', '#93c5fd']; // Amarillo, Verde, Azul

  // --- Manejadores de Eventos ---

  // Al pasar el mouse sobre un apartamento
  const handleMouseEnter = (e) => {
    const id = e.target.id;
    // Solo activa el hover si el elemento tiene un ID que existe en nuestros datos
    if (apartmentData[id]) {
      setHoveredApartment(id);
    }
  };

  // Al quitar el mouse de un apartamento
  const handleMouseLeave = () => {
    setHoveredApartment(null);
  };

  // Al hacer clic en un elemento del SVG
  const handleClick = (e) => {
    const id = e.target.id;
    // Solo selecciona si el elemento tiene un ID que existe en nuestros datos
    if (apartmentData[id]) {
      setSelectedApartment(id);
      // Aplica el color seleccionado al apartamento clickeado
      setApartmentColors((prevColors) => ({
        ...prevColors,
        [id]: selectedColor,
      }));
    } else {
      // Si se hace clic en el SVG pero fuera de un apartamento conocido, deselecciona
      // Verifica que el clic no fue sobre un elemento ya coloreado o seleccionado para evitar deselección accidental
      if (e.target.tagName === 'svg' || !apartmentData[e.target.id]) {
        setSelectedApartment(null);
      }
    }
  };

  // Al seleccionar un color de la paleta
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Si ya hay un apartamento seleccionado, aplica el nuevo color inmediatamente
    if (selectedApartment) {
      setApartmentColors((prevColors) => ({
        ...prevColors,
        [selectedApartment]: color,
      }));
    }
  };

  // --- Renderizado ---
  return (
    <div className="flex flex-col md:flex-row h-screen font-sans bg-gray-100">
      {/* --- Panel de Información y Controles (Izquierda o Arriba en móvil) --- */}
      <div className="w-full md:w-1/4 p-6 bg-white shadow-lg rounded-lg m-4 space-y-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Plano del Hotel
        </h1>

        {/* --- Selección de Color --- */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Seleccionar Color:
          </h2>
          <div className="flex space-x-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color
                    ? 'border-black ring-2 ring-offset-1 ring-black'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Seleccionar color ${color}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Color actual:{' '}
            <span className="font-semibold" style={{ color: selectedColor }}>
              {selectedColor}
            </span>
          </p>
        </div>

        {/* --- Información del Apartamento --- */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Información:
          </h2>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[100px]">
            {hoveredApartment && apartmentData[hoveredApartment] ? (
              // Muestra info si el mouse está sobre un apartamento conocido
              <div>
                <p className="font-semibold text-blue-600">
                  {apartmentData[hoveredApartment].name}
                </p>
                <p className="text-sm text-gray-600">
                  Área: {apartmentData[hoveredApartment].area}
                </p>
                <p className="text-sm text-gray-600">
                  Detalles: {apartmentData[hoveredApartment].details}
                </p>
              </div>
            ) : selectedApartment && apartmentData[selectedApartment] ? (
              // Muestra info si hay un apartamento seleccionado
              <div>
                <p className="font-semibold text-green-600">
                  {apartmentData[selectedApartment].name} (Seleccionado)
                </p>
                <p className="text-sm text-gray-600">
                  Área: {apartmentData[selectedApartment].area}
                </p>
                <p className="text-sm text-gray-600">
                  Detalles: {apartmentData[selectedApartment].details}
                </p>
              </div>
            ) : (
              // Mensaje por defecto
              <p className="text-gray-500 italic">
                Pasa el mouse o haz clic en un apartamento.
              </p>
            )}
          </div>
        </div>
        {/* --- Leyenda de Colores Aplicados --- */}
        {Object.keys(apartmentColors).length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Colores Aplicados:
            </h2>
            <ul className="list-none space-y-1">
              {Object.entries(apartmentColors).map(
                ([id, color]) =>
                  // Muestra solo si el ID existe en los datos (evita errores si se eliminan apartamentos)
                  apartmentData[id] && (
                    <li key={id} className="flex items-center text-sm">
                      <span
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                        style={{ backgroundColor: color }}
                      ></span>
                      {apartmentData[id].name}
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
      </div>

      {/* --- Visualizador del SVG (Derecha o Abajo en móvil) --- */}
      <div className="w-full md:w-3/4 p-4 flex items-center justify-center bg-gray-200 rounded-lg m-4 overflow-hidden">
        {/*
          !!! IMPORTANTE !!!
          PEGA TU SVG AQUÍ ABAJO, REEMPLAZANDO EL CONTENIDO DE EJEMPLO.

          Asegúrate de pegar SOLAMENTE desde la etiqueta <svg ...> hasta su cierre </svg>.
          NO INCLUYAS la línea inicial <?xml ... ?> ni <!DOCTYPE ...> si existen en tu archivo.

          Cada elemento que representa un apartamento (probablemente <path>, <rect>, <polygon> o <g> que TÚ CREASTE o identificaste)
          debe tener un 'id' único que coincida con las claves en el objeto `apartmentData`.
          Ejemplo: <rect id="room173" x="..." y="..." width="..." height="..." fill="transparent" />

          AÑADE los manejadores de eventos onMouseEnter y onMouseLeave a CADA elemento interactivo.
          Ejemplo: <rect id="room173" ... onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />

          El manejador onClick={handleClick} se aplica al SVG padre para manejar clics DENTRO de los apartamentos
          y también clics FUERA (para deseleccionar).
        */}
        <svg
          viewBox="0 0 400 300" // Ajusta el viewBox a las dimensiones REALES de tu SVG
          className="max-w-full max-h-full bg-white" // Añadido fondo blanco para mejor visualización
          onClick={handleClick} // Maneja clics en todo el SVG
        >
          {/* --- Inicio: Pega tu SVG Real Aquí --- */}
          {/* El siguiente es solo un EJEMPLO, debes borrarlo y pegar tu SVG */}
          <g>
            <title>Plano del Hotel (Ejemplo)</title>
            {/* Apartamento 101 */}
            <path
              id="apt-101" // ID debe coincidir con apartmentData
              d="M50,50 h100 v80 h-100 z" // Coordenadas de ejemplo
              fill={
                apartmentColors['apt-101'] ||
                (hoveredApartment === 'apt-101' ? '#dbeafe' : '#f3f4f6')
              } // Color dinámico
              stroke="#6b7280" // Borde
              strokeWidth="1"
              onMouseEnter={handleMouseEnter} // Evento al pasar el mouse por encima
              onMouseLeave={handleMouseLeave} // Evento al quitar el mouse
              className="cursor-pointer transition-colors duration-150 ease-in-out"
            />
            <text
              x="100"
              y="95"
              textAnchor="middle"
              fontSize="10"
              fill="#374151"
              pointerEvents="none"
            >
              101
            </text>

            {/* Apartamento 102 */}
            <path
              id="apt-102" // ID debe coincidir con apartmentData
              d="M160,50 h100 v120 h-100 z" // Coordenadas de ejemplo
              fill={
                apartmentColors['apt-102'] ||
                (hoveredApartment === 'apt-102' ? '#dbeafe' : '#f3f4f6')
              } // Color dinámico
              stroke="#6b7280"
              strokeWidth="1"
              onMouseEnter={handleMouseEnter} // Evento al pasar el mouse por encima
              onMouseLeave={handleMouseLeave} // Evento al quitar el mouse
              className="cursor-pointer transition-colors duration-150 ease-in-out"
            />
            <text
              x="210"
              y="115"
              textAnchor="middle"
              fontSize="10"
              fill="#374151"
              pointerEvents="none"
            >
              102
            </text>

            {/* Apartamento 103 */}
            <path
              id="apt-103" // ID debe coincidir con apartmentData
              d="M50,140 h100 v80 h-100 z" // Coordenadas de ejemplo
              fill={
                apartmentColors['apt-103'] ||
                (hoveredApartment === 'apt-103' ? '#dbeafe' : '#f3f4f6')
              } // Color dinámico
              stroke="#6b7280"
              strokeWidth="1"
              onMouseEnter={handleMouseEnter} // Evento al pasar el mouse por encima
              onMouseLeave={handleMouseLeave} // Evento al quitar el mouse
              className="cursor-pointer transition-colors duration-150 ease-in-out"
            />
            <text
              x="100"
              y="185"
              textAnchor="middle"
              fontSize="10"
              fill="#374151"
              pointerEvents="none"
            >
              103
            </text>

            {/* Elemento no interactivo (ej. pasillo) */}
            <rect
              x="150"
              y="130"
              width="10"
              height="90"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="0.5"
            />
          </g>
          {/* --- Fin: Pega tu SVG Real Aquí --- */}
        </svg>
      </div>
    </div>
  );
}

export default App; // Exporta el componente principal
