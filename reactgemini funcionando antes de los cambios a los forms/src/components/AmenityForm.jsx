// src/components/AmenityForm.jsx
import React, { useState } from 'react'; // No necesitamos useEffect aquí ahora
import { useParams } from 'react-router-dom';
import {
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
} from '@carbon/react';

// Estado inicial
const initialAmenityState = {
  amenityCode: '',
  amenityType: '', // Guardaremos 'WIFI', 'TV', etc.
  amenityDescription: '',
};

// --- Opciones FIJAS para AmenityType ---
// Asegúrate que los 'id' coincidan con los valores de tu Enum Java/Postgres
// y el 'text' sea lo que quieres mostrar al usuario.
const amenityTypeItems = [
  { id: 'WIFI', text: 'WIFI' },
  { id: 'TV', text: 'TV' },
  { id: 'AIR_CONDITIONING', text: 'AIR_CONDITIONING' },
  // Añade otros tipos fijos que tengas definidos si es necesario
];
// -------------------------------------

function AmenityForm() {
  const { hotelId } = useParams(); // ID del hotel para asociar el amenity

  const [formData, setFormData] = useState(initialAmenityState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [lastSavedInfo, setLastSavedInfo] = useState('');

  // --- ESTADOS para carga dinámica REMOVIDOS ---
  // const [amenityTypeOptions, setAmenityTypeOptions] = useState([]);
  // const [loadingOptions, setLoadingOptions] = useState(true);
  // const [optionsError, setOptionsError] = useState(null);
  // -------------------------------------------

  // --- useEffect para cargar opciones REMOVIDO ---

  // --- Handlers (sin cambios) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDropdownChange = (field, { selectedItem }) => {
    const value = selectedItem ? selectedItem.id : '';
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNumberInputChange = (fieldName, valueAsString) => {
    setFormData((prev) => ({ ...prev, [fieldName]: valueAsString }));
    if (errors[fieldName])
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  // --- Validación (sin cambios) ---
  const validateForm = () => {
    const newErrors = {};
    const { amenityCode, amenityType, amenityDescription } = formData;

    const parsedCode = parseInt(amenityCode, 10);
    if (amenityCode === '' || isNaN(parsedCode) || parsedCode <= 0) {
      newErrors.amenityCode =
        'El código es obligatorio y debe ser un entero positivo.';
    }
    if (!amenityType) {
      newErrors.amenityType = 'El tipo de amenity es obligatorio.';
    }
    if (!amenityDescription.trim()) {
      newErrors.amenityDescription = 'La descripción es obligatoria.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Envío (sin cambios en la lógica principal) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setLastSavedInfo('');

    if (!validateForm() || !hotelId) {
      if (!hotelId)
        setErrors((prev) => ({
          ...prev,
          api: 'No se pudo determinar el ID del hotel.',
        }));
      return;
    }

    setLoading(true);

    // Preparar payload (sin hotelId, ya que va en la URL como query param)
    const payload = {
      amenityCode: parseInt(formData.amenityCode, 10),
      amenityType: formData.amenityType, // Enviar string 'WIFI', 'TV'...
      amenityDescription: formData.amenityDescription,
    };

    // Construir URL con Query Parameter
    const apiUrl = `http://localhost:8090/api/amenities?hotelId=${hotelId}`;
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

      const savedAmenity = await response.json();
      console.log('Amenity guardado:', savedAmenity);
      setSubmitStatus('success');
      setLastSavedInfo(
        `Código ${formData.amenityCode}: ${formData.amenityDescription}`
      );
      setFormData(initialAmenityState); // Limpiar para siguiente entrada
      setErrors({});
    } catch (error) {
      console.error('Error al guardar amenity:', error);
      setSubmitStatus('error');
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'Ocurrió un error al guardar el amenity.',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>
        Añadir Amenity al Hotel ID: {hotelId}
      </h3>

      {/* --- Ya no es necesario mostrar error de carga de opciones --- */}

      <Form onSubmit={handleSubmit}>
        <Grid>
          <Column lg={8} md={6} sm={4}>
            <FormGroup legendText="Detalles del Amenity">
              <NumberInput
                id="amenityCode"
                name="amenityCode"
                label="Código Amenity (Obligatorio)"
                min={1}
                step={1}
                value={formData.amenityCode}
                onChange={(e, { value }) =>
                  handleNumberInputChange('amenityCode', String(value))
                }
                invalid={!!errors.amenityCode}
                invalidText={errors.amenityCode}
                allowEmpty={false}
              />
              <Dropdown
                id="amenityType"
                name="amenityType"
                titleText="Tipo Amenity (Obligatorio)"
                label="Seleccione un tipo" // Label estático de nuevo
                items={amenityTypeItems} // <-- Usar la lista FIJA
                itemToString={(item) => (item ? item.text : '')}
                onChange={({ selectedItem }) =>
                  handleDropdownChange('amenityType', { selectedItem })
                }
                selectedItem={
                  amenityTypeItems.find(
                    (item) => item.id === formData.amenityType
                  ) || null
                }
                invalid={!!errors.amenityType}
                invalidText={errors.amenityType}
                // Ya no necesita estar deshabilitado por carga de opciones
              />
              <TextInput
                id="amenityDescription"
                name="amenityDescription"
                labelText="Descripción (Obligatoria)"
                value={formData.amenityDescription}
                onChange={handleChange}
                invalid={!!errors.amenityDescription}
                invalidText={errors.amenityDescription}
              />
            </FormGroup>
          </Column>

          {/* Área de Envío y Notificaciones */}
          <Column lg={16} md={8} sm={4} style={{ marginTop: '2rem' }}>
            {loading && (
              <Loading description="Guardando amenity..." withOverlay={false} />
            )}
            {!loading && submitStatus === 'success' && (
              <InlineNotification
                kind="success"
                title="Éxito!"
                subtitle={`Amenity "${lastSavedInfo}" guardado. Listo para el siguiente.`}
                onClose={() => setSubmitStatus(null)}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}
            {!loading && submitStatus === 'error' && (
              <InlineNotification
                kind="error"
                title="Error al guardar"
                subtitle={errors.api || 'No se pudo guardar el amenity.'}
                onClose={() => {
                  setSubmitStatus(null);
                  setErrors((prev) => ({ ...prev, api: undefined }));
                }}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}
            {/* El botón ya no necesita estar deshabilitado por la carga de opciones */}
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Amenity'}
            </Button>
          </Column>
        </Grid>
      </Form>
    </div>
  );
}

export default AmenityForm;
