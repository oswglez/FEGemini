// src/components/AddressForm.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  FormGroup,
  TextInput,
  Dropdown,
  Button,
  Grid,
  Column,
  InlineNotification,
  Loading,
} from '@carbon/react';

// Estado inicial para limpiar el formulario
const initialAddressState = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  addressType: '',
};

// Datos de ejemplo para Dropdowns (Reemplazar/Cargar desde API si es necesario)
const countryItems = [
  { id: 'UY', text: 'Uruguay' },
  { id: 'AR', text: 'Argentina' },
  { id: 'BR', text: 'Brasil' },
  { id: 'US', text: 'United States' },
  // ...añadir más países
];

const addressTypeItems = [
  { id: 'PRIMARY', text: 'Principal' },
  { id: 'MAILING', text: 'Correspondencia' },
  { id: 'BILLING', text: 'Facturación' },
  { id: 'OTHER', text: 'Otro' },
];

function AddressForm() {
  // Seguimos necesitando hotelId del contexto de la página actual
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialAddressState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [lastSavedInfo, setLastSavedInfo] = useState('');

  // --- Manejadores (sin cambios) ---
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

  // --- Validación (sin cambios) ---
  const validateForm = () => {
    const newErrors = {};
    // --- ¡AJUSTA ESTOS CAMPOS REQUERIDOS SEGÚN TU ENTIDAD ADDRESS! ---
    if (!formData.street.trim()) newErrors.street = 'La calle es obligatoria.';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria.';
    if (!formData.country) newErrors.country = 'El país es obligatorio.';
    // ...más validaciones...

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setLastSavedInfo('');

    if (!validateForm() || !hotelId) {
      // Asegurarse que hotelId existe
      if (!hotelId)
        setError((prev) => ({
          ...prev,
          api: 'No se pudo determinar el ID del hotel desde la URL.',
        }));
      return;
    }

    setLoading(true);

    // --- ¡AJUSTA EL PAYLOAD A LOS CAMPOS DE TU ENTIDAD ADDRESS! ---
    const payload = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      addressType: formData.addressType,
      // --- AÑADIR hotelId AL PAYLOAD ---
      // Asumiendo que el backend espera un campo 'hotelId' o similar
      // El nombre exacto dependerá de tu DTO/Entity en el backend
      hotelId: parseInt(hotelId, 10), // Asegurarse que sea número
      // ----------------------------------
    };

    // --- URL CORREGIDA ---
    const apiUrl = `http://localhost:8090/api/addresses`;
    console.log(
      `Enviando Payload a ${apiUrl}:`,
      JSON.stringify(payload, null, 2)
    );

    try {
      const response = await fetch(apiUrl, {
        // Usar la URL corregida
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

      const savedAddress = await response.json();
      console.log('Dirección guardada:', savedAddress);
      setSubmitStatus('success');
      setLastSavedInfo(`${formData.street}, ${formData.city}`);
      setFormData(initialAddressState);
      setErrors({});
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      setSubmitStatus('error');
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'Ocurrió un error al guardar la dirección.',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    // El Theme g100 y el layout base vienen de AppLayout -> HotelManageLayout -> Outlet
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>
        Añadir Dirección al Hotel ID: {hotelId}
      </h3>

      <Form onSubmit={handleSubmit}>
        <Grid>
          {/* Columnas y Campos del Formulario (sin cambios respecto a la versión anterior) */}
          {/* Columna 1 */}
          <Column lg={8} md={6} sm={4}>
            <FormGroup legendText="Dirección">
              <TextInput
                id="street"
                name="street"
                labelText="Calle y Número (Obligatorio)"
                value={formData.street}
                onChange={handleChange}
                invalid={!!errors.street}
                invalidText={errors.street}
              />
              <TextInput
                id="city"
                name="city"
                labelText="Ciudad (Obligatorio)"
                value={formData.city}
                onChange={handleChange}
                invalid={!!errors.city}
                invalidText={errors.city}
              />
              <TextInput
                id="state"
                name="state"
                labelText="Estado / Provincia"
                value={formData.state}
                onChange={handleChange}
                invalid={!!errors.state}
                invalidText={errors.state}
              />
            </FormGroup>
          </Column>
          {/* Columna 2 */}
          <Column lg={8} md={6} sm={4}>
            <FormGroup legendText="Detalles Adicionales">
              <TextInput
                id="postalCode"
                name="postalCode"
                labelText="Código Postal"
                value={formData.postalCode}
                onChange={handleChange}
                invalid={!!errors.postalCode}
                invalidText={errors.postalCode}
              />
              <Dropdown
                id="country"
                name="country"
                titleText="País (Obligatorio)"
                label="Seleccione un país"
                items={countryItems}
                itemToString={(item) => (item ? item.text : '')}
                onChange={({ selectedItem }) =>
                  handleDropdownChange('country', { selectedItem })
                }
                selectedItem={
                  countryItems.find((item) => item.id === formData.country) ||
                  null
                }
                invalid={!!errors.country}
                invalidText={errors.country}
              />
              <Dropdown
                id="addressType"
                name="addressType"
                titleText="Tipo de Dirección (Opcional)"
                label="Seleccione un tipo"
                items={addressTypeItems}
                itemToString={(item) => (item ? item.text : '')}
                onChange={({ selectedItem }) =>
                  handleDropdownChange('addressType', { selectedItem })
                }
                selectedItem={
                  addressTypeItems.find(
                    (item) => item.id === formData.addressType
                  ) || null
                }
              />
            </FormGroup>
          </Column>
          {/* Área de Envío */}
          <Column lg={16} md={8} sm={4} style={{ marginTop: '2rem' }}>
            {loading && (
              <Loading
                description="Guardando dirección..."
                withOverlay={false}
              />
            )}
            {!loading && submitStatus === 'success' && (
              <InlineNotification
                kind="success"
                title="Éxito!"
                subtitle={`Dirección "${lastSavedInfo}" guardada. Lista para la siguiente.`}
                onClose={() => setSubmitStatus(null)}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}
            {!loading && submitStatus === 'error' && (
              <InlineNotification
                kind="error"
                title="Error al guardar"
                subtitle={errors.api || 'No se pudo guardar la dirección.'}
                onClose={() => {
                  setSubmitStatus(null);
                  setErrors((prev) => ({ ...prev, api: undefined }));
                }}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Dirección'}
            </Button>
          </Column>
        </Grid>
      </Form>
    </div>
  );
}

export default AddressForm;
