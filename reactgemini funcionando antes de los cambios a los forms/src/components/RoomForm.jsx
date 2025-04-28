// src/components/RoomForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Theme,
  Form,
  FormGroup,
  TextInput,
  Dropdown,
  NumberInput,
  Button,
  Grid,
  Column,
  InlineNotification,
  Loading,
  Link,
} from '@carbon/react';

// Estado inicial para limpiar el formulario
const initialRoomState = {
  roomNumber: '',
  roomType: '', // Guardaremos el valor string ('SINGLE', 'DOUBLE', 'SUITE')
  roomName: '',
  roomBuilding: '',
  roomFloor: '',
  roomPrice: '', // Se maneja como string en input, se convierte a float al enviar si existe
};

// --- Opciones para RoomType ---
// Usamos valores en minúscula como ID, y texto capitalizado para mostrar
// Asegúrate que los IDs ('SINGLE', 'DOUBLE', 'SUITE') coincidan con lo que espera tu backend
const roomTypeItems = [
  { id: 'SINGLE', text: 'SINGLE' },
  { id: 'DOUBLE', text: 'DOUBLE' },
  { id: 'SUITE', text: 'SUITE' },
];

function RoomForm() {
  const { hotelId } = useParams(); // Obtener ID del hotel de la URL
  const navigate = useNavigate(); // Para navegación programática (opcional)

  const [formData, setFormData] = useState(initialRoomState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [lastRoomSaved, setLastRoomSaved] = useState(null); // Para mostrar feedback

  // --- Manejadores ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDropdownChange = (field, { selectedItem }) => {
    const value = selectedItem ? selectedItem.id : ''; // Guardar el ID/valor ('single', 'double', ...)
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Handler específico para números, adaptado
  const handleNumberInputChange = (fieldName, valueAsString) => {
    // Guardar como string o número en el estado? Guardemos como string por simplicidad del input
    // La conversión final se hará en el submit
    setFormData((prev) => ({ ...prev, [fieldName]: valueAsString }));
    if (errors[fieldName])
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  // --- Validación ---
  const validateForm = () => {
    const newErrors = {};
    const {
      roomNumber,
      roomType,
      roomName,
      roomBuilding,
      roomFloor,
      roomPrice,
    } = formData;

    // Validar roomNumber (obligatorio, numérico, positivo)
    const parsedRoomNumber = parseInt(roomNumber, 10);
    if (roomNumber === '' || isNaN(parsedRoomNumber) || parsedRoomNumber <= 0) {
      newErrors.roomNumber =
        'El número de habitación es obligatorio y debe ser un entero positivo.';
    }

    // Validar roomType (obligatorio)
    if (!roomType) newErrors.roomType = 'El tipo de habitación es obligatorio.';

    // Validar roomName (obligatorio)
    if (!roomName.trim()) newErrors.roomName = 'El nombre es obligatorio.';

    // Validar roomBuilding (obligatorio)
    if (!roomBuilding.trim())
      newErrors.roomBuilding = 'El edificio es obligatorio.';

    // Validar roomFloor (obligatorio, numérico)
    const parsedFloor = parseInt(roomFloor, 10);
    if (roomFloor === '' || isNaN(parsedFloor)) {
      // Permitimos piso 0 o negativos? Asumamos que sí por ahora.
      newErrors.roomFloor = 'El piso es obligatorio y debe ser numérico.';
    }

    // Validar roomPrice (opcional, pero si existe, debe ser numérico positivo)
    if (roomPrice !== '') {
      const parsedPrice = parseFloat(roomPrice);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        newErrors.roomPrice =
          'Si se ingresa, el precio debe ser un número positivo.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setLastRoomSaved(null);

    if (!validateForm() || !hotelId) {
      if (!hotelId)
        setErrors((prev) => ({
          ...prev,
          api: 'No se pudo determinar el ID del hotel.',
        }));
      return;
    }

    setLoading(true);

    // Preparar payload convirtiendo números
    const payload = {
      roomNumber: parseInt(formData.roomNumber, 10),
      roomType: formData.roomType, // Enviar el string 'SINGLE', 'DOUBLE', 'SUITE'
      roomName: formData.roomName,
      roomBuilding: formData.roomBuilding,
      roomFloor: parseInt(formData.roomFloor, 10),
      // Incluir precio solo si es un número válido
      ...(formData.roomPrice !== '' && !isNaN(parseFloat(formData.roomPrice))
        ? { roomPrice: parseFloat(formData.roomPrice) }
        : {}), // Si no es válido o está vacío, no se incluye la propiedad roomPrice
      // hotelId no va en el payload porque va en la URL
    };

    const apiUrl = `http://localhost:8090/api/rooms/${hotelId}`; // URL dinámica correcta
    console.log(
      `Enviando Payload a ${apiUrl}:`,
      JSON.stringify(payload, null, 2)
    );

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        /* ... manejo error respuesta ... */
        let errorMsg = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || JSON.stringify(errorData);
        } catch (err) {
          errorMsg += ` - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const savedRoom = await response.json();
      console.log('Habitación guardada:', savedRoom);
      setSubmitStatus('success');
      setLastRoomSaved(formData.roomNumber); // Guardar número para feedback

      // Limpiar formulario para la siguiente entrada
      setFormData(initialRoomState);
      setErrors({});
    } catch (error) {
      console.error('Error al guardar habitación:', error);
      setSubmitStatus('error');
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'Ocurrió un error al guardar la habitación.',
      }));
    } finally {
      setLoading(false);
    }
  };

  // --- Estilos y Renderizado ---
  const formContainerStyle = {
    /* ... */
  }; // Mantener si es necesario

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h3>Añadir Habitación al Hotel ID: {hotelId}</h3>
        {/* <Link onClick={() => navigate(`/hotel/${hotelId}`)}>Volver</Link> */}
      </div>

      <Form onSubmit={handleSubmit}>
        <Grid>
          {/* Columna 1 */}
          <Column lg={8} md={6} sm={4}>
            <FormGroup legendText="Detalles de la Habitación">
              <NumberInput
                id="roomNumber"
                name="roomNumber"
                label="Número Habitación (Obligatorio)"
                min={1}
                step={1}
                value={formData.roomNumber}
                // Pasar el valor como string al handler
                onChange={(e, { value }) =>
                  handleNumberInputChange('roomNumber', String(value))
                }
                invalid={!!errors.roomNumber}
                invalidText={errors.roomNumber}
                allowEmpty={false}
              />
              <Dropdown
                id="roomType"
                name="roomType"
                titleText="Tipo Habitación (Obligatorio)"
                label="Seleccione un tipo"
                items={roomTypeItems} // Usar la lista actualizada
                itemToString={(item) => (item ? item.text : '')}
                onChange={({ selectedItem }) =>
                  handleDropdownChange('roomType', { selectedItem })
                }
                selectedItem={
                  roomTypeItems.find((item) => item.id === formData.roomType) ||
                  null
                }
                invalid={!!errors.roomType}
                invalidText={errors.roomType}
              />
              <TextInput
                id="roomName"
                name="roomName"
                labelText="Nombre Habitación (Obligatorio)"
                value={formData.roomName}
                onChange={handleChange}
                invalid={!!errors.roomName}
                invalidText={errors.roomName}
              />
            </FormGroup>
          </Column>

          {/* Columna 2 */}
          <Column lg={8} md={6} sm={4}>
            <FormGroup legendText="Ubicación y Precio">
              <TextInput
                id="roomBuilding"
                name="roomBuilding"
                labelText="Edificio/Sector (Obligatorio)"
                value={formData.roomBuilding}
                onChange={handleChange}
                invalid={!!errors.roomBuilding}
                invalidText={errors.roomBuilding}
              />
              <NumberInput
                id="roomFloor"
                name="roomFloor"
                label="Piso (Obligatorio)"
                step={1}
                value={formData.roomFloor}
                // Pasar el valor como string al handler
                onChange={(e, { value }) =>
                  handleNumberInputChange('roomFloor', String(value))
                }
                invalid={!!errors.roomFloor}
                invalidText={errors.roomFloor}
              />
              <NumberInput
                id="roomPrice"
                name="roomPrice"
                label="Precio (Opcional)"
                step={0.01} // Permitir decimales
                min={0}
                value={formData.roomPrice}
                // Pasar el valor como string al handler
                onChange={(e, { value }) =>
                  handleNumberInputChange('roomPrice', String(value))
                }
                invalid={!!errors.roomPrice}
                invalidText={errors.roomPrice}
              />
            </FormGroup>
          </Column>

          {/* Área de Envío y Notificaciones */}
          <Column lg={16} md={8} sm={4} style={{ marginTop: '2rem' }}>
            {loading && (
              <Loading
                description="Guardando habitación..."
                withOverlay={false}
              />
            )}
            {!loading && submitStatus === 'success' && (
              <InlineNotification
                kind="success"
                title={`Éxito! Habitación ${lastRoomSaved} guardada.`}
                subtitle="Formulario listo para la siguiente habitación."
                onClose={() => setSubmitStatus(null)}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}
            {!loading && submitStatus === 'error' && (
              <InlineNotification
                kind="error"
                title="Error al guardar"
                subtitle={errors.api || 'No se pudo guardar la habitación.'}
                onClose={() => {
                  setSubmitStatus(null);
                  setErrors((prev) => ({ ...prev, api: undefined }));
                }}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar y Añadir Siguiente'}
            </Button>
          </Column>
        </Grid>
      </Form>
    </div>
  );
}

export default RoomForm;
