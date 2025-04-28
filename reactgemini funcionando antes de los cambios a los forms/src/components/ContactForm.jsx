import React, { useState } from 'react';
import {
  Theme, // Para el tema oscuro g100
  Form, // Contenedor del formulario
  FormGroup, // Agrupador de campos
  TextInput, // Campo de texto
  Dropdown, // Campo de selección
  Button, // Botón de envío
  Grid, // Sistema de grilla para layout
  Column, // Columnas dentro de la grilla
  InlineNotification, // Para mensajes de éxito/error
} from '@carbon/react';
// Asegúrate de importar los estilos globales de Carbon en tu App.js o index.js
// import '@carbon/styles/css/styles.css';

// Puedes usar fetch o axios para la llamada API
// import axios from 'axios';

function ContactForm() {
  // --- Estado del Formulario ---
  const [formData, setFormData] = useState({
    contactTitle: '', // Ej: Mr, Mrs, Manager
    firstName: '', // Nombre
    lastName: '', // Apellido
    contactLocalNumber: '', // Teléfono local
    contactMobileNumber: '', // Celular (con código país)
    contactFaxNumber: '', // Fax
    contactEmail: '', // Correo electrónico
  });

  const [errors, setErrors] = useState({}); // Errores de validación
  const [loading, setLoading] = useState(false); // Estado de carga para el envío
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', o null

  // --- Opciones Fijas para el Dropdown de Título ---
  const titleItems = [
    { id: 'Mr', text: 'Mr' },
    { id: 'Mrs', text: 'Mrs' },
    { id: 'Miss', text: 'Miss' },
    { id: 'Manager', text: 'Manager' },
    { id: 'Seller', text: 'Seller' }, // Corregido de "Seler"
  ];

  // --- Manejadores de Cambios ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDropdownChange = (field, { selectedItem }) => {
    const value = selectedItem ? selectedItem.id : ''; // Usamos el 'id' como valor
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // --- Validación del Formulario ---
  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, contactMobileNumber, contactEmail } = formData;

    // Campos Obligatorios
    if (!firstName.trim()) newErrors.firstName = 'El nombre es obligatorio.';
    if (!lastName.trim()) newErrors.lastName = 'El apellido es obligatorio.';
    if (!contactMobileNumber.trim())
      newErrors.contactMobileNumber = 'El celular de contacto es obligatorio.';
    if (!contactEmail.trim())
      newErrors.contactEmail = 'El email de contacto es obligatorio.';

    // Validación de Formato - Celular (con código país)
    const mobilePattern = /^\+\d[\d\s]*$/; // Simple: empieza con +, luego números y opcionalmente espacios
    if (contactMobileNumber && !mobilePattern.test(contactMobileNumber)) {
      newErrors.contactMobileNumber =
        'Formato inválido. Debe incluir código de país (Ej: +54 11 12345678)';
    }

    // Validación de Formato - Email
    // Usar type="email" en el input ayuda, pero una regex es más segura
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (contactEmail && !emailPattern.test(contactEmail)) {
      newErrors.contactEmail = 'Formato de correo electrónico inválido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  // --- Manejador de Envío a la API ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página
    setSubmitStatus(null); // Limpiar estado de envío previo

    if (!validateForm()) {
      console.log('Errores de validación:', errors);
      return; // Detener si hay errores
    }

    setLoading(true);

    // El payload es directamente el estado del formulario
    const payload = { ...formData };
    console.log(
      'Enviando Payload a /api/contacts:',
      JSON.stringify(payload, null, 2)
    );

    try {
      const response = await fetch('http://localhost:8090/api/contacts', {
        // URL de la API de contactos
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Otros headers si son necesarios
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || JSON.stringify(errorData);
        } catch (e) {
          console.warn(' No se pudo leer la respuesta de la API.', e);
          errorMsg += ` - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      // Éxito
      const result = await response.json(); // Asume que la API devuelve JSON
      console.log('Contacto guardado:', result);
      setSubmitStatus('success');
      // Opcional: Limpiar el formulario después del éxito
      // setFormData({ contactTitle: '', firstName: '', lastName: '', contactLocalNumber: '', contactMobileNumber: '', contactFaxNumber: '', contactEmail: '' });
      // setErrors({});
    } catch (error) {
      console.error('Error al guardar contacto:', error);
      setSubmitStatus('error');
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'Ocurrió un error al guardar el contacto.',
      }));
    } finally {
      setLoading(false);
    }
  };

  // --- Estilos y Renderizado ---
  const formContainerStyle = {
    backgroundColor: '#5331FA', // Fondo púrpura solicitado
    padding: '2rem',
    fontFamily: 'Roboto, sans-serif', // Fuente solicitada
    minHeight: '100vh', // Opcional: para que el fondo ocupe toda la altura
    // color: 'white' // No necesario, Theme g100 lo maneja
  };

  return (
    // Usar Theme g100 para aplicar estilos oscuros a los componentes Carbon
    <Theme theme="g100">
      <div style={formContainerStyle}>
        <Form onSubmit={handleSubmit}>
          <Grid>
            {/* Título del Formulario */}
            <Column lg={16} md={8} sm={4} style={{ marginBottom: '2rem' }}>
              <h2>Contacts</h2> {/* Título solicitado */}
            </Column>

            {/* Columna Izquierda: Datos Personales */}
            <Column lg={8} md={8} sm={4}>
              {' '}
              {/* Ocupa 50% en LG, 100% en MD y SM */}
              <FormGroup legendText="Información Personal">
                <Dropdown
                  id="contactTitle"
                  name="contactTitle"
                  titleText="Título"
                  label="Seleccione un título (opcional)"
                  items={titleItems}
                  itemToString={(item) => (item ? item.text : '')}
                  onChange={(selection) =>
                    handleDropdownChange('contactTitle', selection)
                  }
                  selectedItem={
                    titleItems.find(
                      (item) => item.id === formData.contactTitle
                    ) || null
                  }
                  // No es inválido si está vacío, ya que es opcional
                  invalid={!!errors.contactTitle}
                  invalidText={errors.contactTitle}
                />
                <TextInput
                  id="firstName"
                  name="firstName"
                  labelText="Nombre (Obligatorio)"
                  value={formData.firstName}
                  onChange={handleChange}
                  invalid={!!errors.firstName}
                  invalidText={errors.firstName}
                  // required // Prop HTML5, pero la validación JS es la principal
                />
                <TextInput
                  id="lastName"
                  name="lastName"
                  labelText="Apellido (Obligatorio)"
                  value={formData.lastName}
                  onChange={handleChange}
                  invalid={!!errors.lastName}
                  invalidText={errors.lastName}
                />
                <TextInput
                  id="contactEmail"
                  name="contactEmail"
                  type="email" // Ayuda a la validación en algunos navegadores/móviles
                  labelText="Email (Obligatorio)"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  invalid={!!errors.contactEmail}
                  invalidText={errors.contactEmail}
                />
              </FormGroup>
            </Column>

            {/* Columna Derecha: Números de Contacto */}
            <Column lg={8} md={8} sm={4}>
              <FormGroup legendText="Números de Contacto">
                <TextInput
                  id="contactMobileNumber"
                  name="contactMobileNumber"
                  labelText="Celular (Obligatorio)"
                  value={formData.contactMobileNumber}
                  onChange={handleChange}
                  invalid={!!errors.contactMobileNumber}
                  invalidText={errors.contactMobileNumber}
                  helperText="Incluir código de país Ej: +54 11 12345678"
                />
                <TextInput
                  id="contactLocalNumber"
                  name="contactLocalNumber"
                  labelText="Teléfono Local"
                  value={formData.contactLocalNumber}
                  onChange={handleChange}
                  // No es obligatorio, no necesita marca de inválido si está vacío
                  invalid={!!errors.contactLocalNumber}
                  invalidText={errors.contactLocalNumber}
                />
                <TextInput
                  id="contactFaxNumber"
                  name="contactFaxNumber"
                  labelText="Fax"
                  value={formData.contactFaxNumber}
                  onChange={handleChange}
                  invalid={!!errors.contactFaxNumber}
                  invalidText={errors.contactFaxNumber}
                />
              </FormGroup>
            </Column>

            {/* Área de Envío y Notificaciones */}
            <Column lg={16} md={8} sm={4} style={{ marginTop: '2rem' }}>
              {/* Notificación de Éxito */}
              {submitStatus === 'success' && (
                <InlineNotification
                  kind="success"
                  title="Éxito!"
                  subtitle="Contacto guardado correctamente."
                  onClose={() => setSubmitStatus(null)}
                  lowContrast // Recomendado para temas oscuros
                  style={{ marginBottom: '1rem' }}
                />
              )}
              {/* Notificación de Error */}
              {submitStatus === 'error' && (
                <InlineNotification
                  kind="error"
                  title="Error"
                  subtitle={errors.api || 'No se pudo guardar el contacto.'}
                  onClose={() => {
                    setSubmitStatus(null);
                    setErrors((prev) => ({ ...prev, api: undefined }));
                  }}
                  lowContrast
                  style={{ marginBottom: '1rem' }}
                />
              )}

              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Contacto'}
              </Button>
            </Column>
          </Grid>
        </Form>
      </div>
    </Theme>
  );
}

export default ContactForm;
