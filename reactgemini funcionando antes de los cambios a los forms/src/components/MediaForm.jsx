// src/components/MediaForm.jsx
import React, { useState } from 'react';
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
const initialMediaState = {
  mediaCode: '',
  mediaType: '', // Guardaremos 'IMAGE', 'VIDEO', 'AUDIO'
  mediaDescription: '',
  mediaUrl: '',
};

// Opciones para MediaType (Hardcoded)
// Asegúrate que los 'id' coincidan con tu Enum Java
const mediaTypeItems = [
  { id: 'IMAGE', text: 'Imagen' },
  { id: 'VIDEO', text: 'Video' },
  { id: 'AUDIO', text: 'Audio' },
];

function MediaForm() {
  const { hotelId } = useParams(); // ID del hotel para asociar el media

  const [formData, setFormData] = useState(initialMediaState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [lastSavedInfo, setLastSavedInfo] = useState('');

  // --- Handlers ---
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

  // --- Validación ---
  const validateForm = () => {
    const newErrors = {};
    const { mediaCode, mediaType, mediaDescription, mediaUrl } = formData;

    const parsedCode = parseInt(mediaCode, 10);
    if (mediaCode === '' || isNaN(parsedCode) || parsedCode <= 0) {
      newErrors.mediaCode =
        'El código es obligatorio y debe ser un entero positivo.';
    }
    if (!mediaType) {
      newErrors.mediaType = 'El tipo de media es obligatorio.';
    }
    if (!mediaDescription.trim()) {
      newErrors.mediaDescription = 'La descripción es obligatoria.';
    }
    if (!mediaUrl.trim()) {
      newErrors.mediaUrl = 'La URL es obligatoria.';
    } else {
      // Validación básica de URL (puedes hacerla más estricta si quieres)
      try {
        new URL(mediaUrl); // Intenta crear un objeto URL
      } catch (e) {
        newErrors.mediaUrl = 'El formato de la URL no es válido.' + e.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Envío ---
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

    // Preparar payload (sin hotelId ni roomId en el cuerpo)
    const payload = {
      mediaCode: parseInt(formData.mediaCode, 10),
      mediaType: formData.mediaType, // Enviar string 'IMAGE', 'VIDEO', 'AUDIO'
      mediaDescription: formData.mediaDescription,
      mediaUrl: formData.mediaUrl,
    };

    // --- URL con Query Param hotelId (ASUMIENDO puerto 8090 y que roomId es opcional aquí) ---
    const apiUrl = `http://localhost:8090/api/medias?hotelId=${hotelId}`;
    console.log(
      `Enviando Payload a ${apiUrl}:`,
      JSON.stringify(payload, null, 2)
    );

    try {
      const response = await fetch(apiUrl, {
        method: 'POST', // Asumiendo POST para crear
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
          console.warn(
            'No se pudo parsear la respuesta de error como JSON:',
            err
          );
          errorMsg += ` - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const savedMedia = await response.json();
      console.log('Media guardado:', savedMedia);
      setSubmitStatus('success');
      setLastSavedInfo(
        `Código ${formData.mediaCode}: ${formData.mediaDescription}`
      );
      setFormData(initialMediaState); // Limpiar para siguiente entrada
      setErrors({});
    } catch (error) {
      console.error('Error al guardar media:', error);
      setSubmitStatus('error');
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'Ocurrió un error al guardar el media.',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>
        Añadir Media al Hotel ID: {hotelId}
      </h3>

      <Form onSubmit={handleSubmit}>
        <Grid>
          {/* Layout en dos columnas */}
          <Column lg={8} md={6} sm={4}>
            <FormGroup legendText="Detalles del Media">
              <NumberInput
                id="mediaCode"
                name="mediaCode"
                label="Código Media (Obligatorio)"
                min={1}
                step={1}
                value={formData.mediaCode}
                onChange={(e, { value }) =>
                  handleNumberInputChange('mediaCode', String(value))
                }
                invalid={!!errors.mediaCode}
                invalidText={errors.mediaCode}
                allowEmpty={false}
              />
              <Dropdown
                id="mediaType"
                name="mediaType"
                titleText="Tipo Media (Obligatorio)"
                label="Seleccione un tipo"
                items={mediaTypeItems} // Lista fija
                itemToString={(item) => (item ? item.text : '')}
                onChange={({ selectedItem }) =>
                  handleDropdownChange('mediaType', { selectedItem })
                }
                selectedItem={
                  mediaTypeItems.find(
                    (item) => item.id === formData.mediaType
                  ) || null
                }
                invalid={!!errors.mediaType}
                invalidText={errors.mediaType}
              />
            </FormGroup>
          </Column>

          <Column lg={8} md={6} sm={4}>
            <FormGroup legendText="Información Adicional">
              <TextInput
                id="mediaDescription"
                name="mediaDescription"
                labelText="Descripción (Obligatoria)"
                value={formData.mediaDescription}
                onChange={handleChange}
                invalid={!!errors.mediaDescription}
                invalidText={errors.mediaDescription}
              />
              <TextInput
                id="mediaUrl"
                name="mediaUrl"
                type="url" // Usar tipo URL para validación básica del navegador
                labelText="URL (Obligatoria)"
                value={formData.mediaUrl}
                onChange={handleChange}
                invalid={!!errors.mediaUrl}
                invalidText={errors.mediaUrl}
                helperText="Ingrese una URL completa (ej: https://...)"
              />
            </FormGroup>
          </Column>

          {/* Área de Envío y Notificaciones */}
          <Column lg={16} md={8} sm={4} style={{ marginTop: '2rem' }}>
            {loading && (
              <Loading description="Guardando media..." withOverlay={false} />
            )}
            {!loading && submitStatus === 'success' && (
              <InlineNotification
                kind="success"
                title="Éxito!"
                subtitle={`Media "${lastSavedInfo}" guardado. Listo para el siguiente.`}
                onClose={() => setSubmitStatus(null)}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}
            {!loading && submitStatus === 'error' && (
              <InlineNotification
                kind="error"
                title="Error al guardar"
                subtitle={errors.api || 'No se pudo guardar el media.'}
                onClose={() => {
                  setSubmitStatus(null);
                  setErrors((prev) => ({ ...prev, api: undefined }));
                }}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Media'}
            </Button>
          </Column>
        </Grid>
      </Form>
    </div>
  );
}

export default MediaForm;
