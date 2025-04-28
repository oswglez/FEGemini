import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Dropdown,
  TextArea,
  NumberInput,
  Button,
  Grid,
  Column,
  InlineNotification, // Para mostrar mensajes de éxito/error
  Theme, // Para aplicar temas de Carbon (opcional pero recomendado)
} from '@carbon/react';
// Asegúrate de importar los estilos de Carbon en tu archivo principal (index.js o App.js)
// import '@carbon/styles/css/styles.css';
// O si usas Sass: import './index.scss'; // Donde importas los estilos de Carbon

// Puedes usar fetch nativo o una librería como axios
// import axios from 'axios';

function HotelForm() {
  // --- Estado del Formulario ---
  const [formData, setFormData] = useState({
    hotelChain: '',
    hotelBrand: '',
    hotelName: '',
    localPhone: '',
    celularPhone: '',
    pmsVendor: '',
    pmsHotelId: '', // Se manejará como string en el input, se parseará a número al enviar
    pmsToken: '',
    crsVendor: '',
    crsHotelId: '', // Opcional
    crsToken: '', // Opcional
    disclaimer: '',
    totalFloors: 1, // Valor inicial razonable
    totalRooms: 1, // Valor inicial razonable
    floorPlans: [''], // Array para URLs, inicializado para 1 piso
  });

  const [errors, setErrors] = useState({}); // Estado para errores de validación
  const [loading, setLoading] = useState(false); // Estado para indicar carga durante el envío
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  // --- Datos de Ejemplo para Dropdowns ---
  // (En una app real, estos vendrían de tu base de datos/API)
  const chainItems = [
    { id: 'chain-demo-1', text: 'Cadena Demo Alfa' },
    { id: 'chain-demo-2', text: 'Cadena Demo Beta' },
  ];
  const brandItems = [
    { id: 'brand-demo-1', text: 'Marca Demo Uno' },
    { id: 'brand-demo-2', text: 'Marca Demo Dos' },
  ];
  const pmsVendorItems = [
    { id: 'pms-vendor-x', text: 'Proveedor PMS X' },
    { id: 'pms-vendor-y', text: 'Proveedor PMS Y' },
  ];
  const crsVendorItems = [
    { id: 'crs-vendor-a', text: 'Proveedor CRS A' },
    { id: 'crs-vendor-b', text: 'Proveedor CRS B' },
  ];

  // --- Efecto para Sincronizar los Inputs de Floor Plans con totalFloors ---
  useEffect(() => {
    const numFloors = parseInt(formData.totalFloors, 10) || 0; // Asegurarse que es un número >= 0

    if (numFloors >= 0) {
      setFormData((prev) => {
        const currentPlans = prev.floorPlans;
        const newPlans = Array(numFloors).fill(''); // Crear array del tamaño correcto

        // Preservar URLs existentes si el número de pisos disminuye o se mantiene
        for (let i = 0; i < Math.min(numFloors, currentPlans.length); i++) {
          newPlans[i] = currentPlans[i];
        }
        return { ...prev, floorPlans: newPlans };
      });
      // Limpiar error general de floorPlans si se ajusta la cantidad
      if (errors.floorPlans) {
        setErrors((prev) => ({ ...prev, floorPlans: undefined }));
      }
    } else {
      // Si el número es inválido (ej. negativo), limpiar los planos
      setFormData((prev) => ({ ...prev, floorPlans: [] }));
    }
  }, [formData.totalFloors]); // Se ejecuta cada vez que totalFloors cambia

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
    // Usar el 'id' del item como valor
    const value = selectedItem ? selectedItem.id : '';
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Carbon NumberInput pasa un objeto evento y un objeto dirección/valor
  const handleNumberInputChange = (field, event, direction) => {
    // El valor puede ser string o number, asegurémonos que sea consistente
    const value = event.target.value !== '' ? Number(event.target.value) : '';
    // O usar el valor directo que a veces pasa Carbon:
    // const value = direction?.value !== undefined ? direction.value : '';
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFloorPlanChange = (index, value) => {
    setFormData((prev) => {
      const newFloorPlans = [...prev.floorPlans];
      newFloorPlans[index] = value;
      return { ...prev, floorPlans: newFloorPlans };
    });
    // Limpiar error específico de este input de plano
    const errorKey = `floorPlans[${index}]`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
    // Limpiar error general de planos si se empieza a llenar
    if (errors.floorPlans && value.trim() !== '') {
      // Podríamos añadir lógica para quitar el error general si todos están llenos
    }
  };

  // --- Validación ---
  const validateForm = () => {
    const newErrors = {};
    const {
      hotelChain,
      hotelBrand,
      hotelName,
      localPhone,
      celularPhone,
      pmsVendor,
      pmsHotelId,
      pmsToken,
      disclaimer,
      totalFloors,
      totalRooms,
      floorPlans,
      crsHotelId, // Validar CRS ID si existe
    } = formData;

    // Campos obligatorios (excluyendo CRS)
    if (!hotelChain) newErrors.hotelChain = 'La cadena es obligatoria.';
    if (!hotelBrand) newErrors.hotelBrand = 'La marca es obligatoria.';
    if (!hotelName.trim())
      newErrors.hotelName = 'El nombre del hotel es obligatorio.';
    if (!localPhone.trim())
      newErrors.localPhone = 'El teléfono local es obligatorio.';
    if (!celularPhone.trim())
      newErrors.celularPhone = 'El teléfono celular es obligatorio.';
    if (!pmsVendor) newErrors.pmsVendor = 'El proveedor PMS es obligatorio.';
    if (!pmsHotelId.toString().trim())
      newErrors.pmsHotelId = 'El ID de hotel PMS es obligatorio.';
    if (!pmsToken.trim()) newErrors.pmsToken = 'El token PMS es obligatorio.';
    if (!disclaimer.trim())
      newErrors.disclaimer = 'El disclaimer es obligatorio.';
    if (totalFloors === '' || totalFloors === null || totalFloors < 1)
      newErrors.totalFloors = 'El total de pisos debe ser al menos 1.';
    if (totalRooms === '' || totalRooms === null || totalRooms < 1)
      newErrors.totalRooms = 'El total de habitaciones debe ser al menos 1.';

    // Validaciones de formato (básicas)
    const localPhonePattern = /^[\d\s-()]*$/; // Permite números, espacios, guiones, paréntesis
    if (localPhone && !localPhonePattern.test(localPhone)) {
      newErrors.localPhone = 'Formato de teléfono local inválido.';
    }
    const celularPhonePattern = /^\+\d[\d\s]*$/; // Debe empezar con '+' seguido de números (y opcionalmente espacios)
    if (celularPhone && !celularPhonePattern.test(celularPhone)) {
      newErrors.celularPhone = 'Formato inválido. Ej: +598 99123456';
    }

    // Validaciones numéricas
    if (pmsHotelId && !/^\d+$/.test(pmsHotelId.toString())) {
      newErrors.pmsHotelId = 'El ID de hotel PMS debe ser numérico.';
    }
    if (crsHotelId && !/^\d+$/.test(crsHotelId.toString())) {
      // Validar sólo si se ingresó algo
      newErrors.crsHotelId = 'El ID de hotel CRS debe ser numérico.';
    }

    // Validación de Floor Plans (URLs obligatorias si hay pisos)
    const numFloors = parseInt(totalFloors, 10) || 0;
    let floorPlanErrorFound = false;
    if (numFloors > 0) {
      for (let i = 0; i < numFloors; i++) {
        if (!floorPlans[i] || !floorPlans[i].trim()) {
          newErrors[`floorPlans[${i}]`] = `La URL para el piso ${
            i + 1
          } es obligatoria.`;
          floorPlanErrorFound = true;
        }
        // Opcional: Validación de formato URL más estricta
        // try { new URL(floorPlans[i]); } catch (_) { newErrors[`floorPlans[${i}]`] = `URL inválida para piso ${i+1}.`; floorPlanErrorFound = true; }
      }
    }
    if (floorPlanErrorFound)
      newErrors.floorPlans =
        'Por favor, complete todas las URLs de los planos.'; // Mensaje general

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True si no hay errores
  };

  // --- Manejador de Envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null); // Limpiar estado previo

    if (!validateForm()) {
      console.log('Errores de validación:', errors);
      // Scroll to first error? (Advanced)
      return; // Detener si hay errores
    }

    setLoading(true);

    // Preparar el payload para la API
    // Asegurarse que los IDs y números sean del tipo correcto (Long/Integer -> Number en JS)
    console.log('formData:', formData);
    const payload = {
      hotelChain:
        chainItems.find((item) => item.id === formData.hotelChain)?.text || '',
      hotelBrand:
        brandItems.find((item) => item.id === formData.hotelBrand)?.text || '',
      hotelName: formData.hotelName,
      localPhone: formData.localPhone,
      celularPhone: formData.celularPhone,
      pmsVendor:
        pmsVendorItems.find((item) => item.id === formData.pmsVendor)?.text ||
        '',
      pmsHotelId: parseInt(formData.pmsHotelId, 10), // Convertir a número
      pmsToken: formData.pmsToken,
      // Incluir datos CRS solo si existen (ej: si se seleccionó vendor)
      ...(formData.crsVendor && {
        // Si hay crsVendor, incluir el objeto crsData
        crsVendor:
          crsVendorItems.find((item) => item.id === formData.crsVendor)?.text ||
          '',
        // Convertir a número si existe, sino omitir la propiedad
        ...(formData.crsHotelId && {
          crsHotelId: parseInt(formData.crsHotelId, 10),
        }),
        ...(formData.crsToken && { crsToken: formData.crsToken }), // Incluir si existe
      }),
      disclaimer: formData.disclaimer,
      totalFloors: parseInt(formData.totalFloors, 10),
      totalRooms: parseInt(formData.totalRooms, 10),
      // Enviar solo las URLs correspondientes al número de pisos
      floorPlans: formData.floorPlans.slice(
        0,
        parseInt(formData.totalFloors, 10) || 0
      ),
    };

    console.log('Enviando payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('http://localhost:8090/api/hotels/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Aquí irían otros headers si son necesarios (ej: Authorization)
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Intentar obtener mensaje de error del cuerpo de la respuesta
        let errorMsg = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || JSON.stringify(errorData);
        } catch (e) {
          errorMsg += ` - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      // Éxito
      const result = await response.json(); // O .text() si la API no devuelve JSON
      console.log('Hotel creado:', result);
      setSubmitStatus('success');
      // Opcional: Resetear formulario
      // setFormData({ ...initialState });
      // setErrors({});
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
      // Mostrar error específico de la API si es posible
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'Ocurrió un error al crear el hotel.',
      }));
    } finally {
      setLoading(false);
    }
  };

  // --- Estilos y Renderizado ---

  // Estilo para el contenedor principal con el fondo y fuente solicitados
  const formContainerStyle = {
    backgroundColor: '#5331FA', // Fondo solicitado
    padding: '2rem', // Espaciado interno
    color: 'white', // Color de texto general
    fontFamily: 'Roboto, sans-serif', // Fuente solicitada
  };

  // Estilos para forzar inputs oscuros y texto blanco si el tema no es suficiente
  // ¡Usar con precaución! Puede ser frágil a actualizaciones de Carbon.
  // Preferible usar temas (g90, g100) o customización de Sass si es posible.
  const inputStyleOverrides = `
    .cds--form-item .cds--text-input,
    .cds--form-item .cds--text-area__wrapper .cds--text-area,
    .cds--form-item .cds--number input[type=number],
    .cds--form-item .cds--list-box__field { /* Para el Dropdown */
      background-color: #393939 !important; /* $gray-80 (dark grey) */
      color: white !important;
      border-bottom-color: #8d8d8d !important; /* $gray-60 */
    }
    .cds--form-item .cds--text-input:focus,
    .cds--form-item .cds--text-area:focus,
    .cds--form-item .cds--number input[type=number]:focus,
    .cds--form-item .cds--list-box__field:focus,
    .cds--list-box--expanded .cds--list-box__field { /* Dropdown abierto */
       outline: 2px solid #0f62fe !important; /* $focus */
       outline-offset: -2px;
    }
     /* Iconos y texto dentro de componentes */
    .cds--form-item .cds--label,
    .cds--form-item .cds--form__helper-text,
    .cds--form-item .cds--form-requirement,
    .cds--form-item .cds--list-box__menu-icon svg,
    .cds--form-item .cds--number__controls button svg {
      color: white !important;
      fill: white !important;
    }
    .cds--form-item .cds--form-requirement { /* Mensaje de error específico */
       color: #ffb3b8 !important; /* $support-error */
    }
    /* Fondo de la lista desplegable */
    .cds--list-box__menu {
        background-color: #393939 !important;
    }
    .cds--list-box__menu-item:hover {
         background-color: #4d4d4d !important;
    }
     .cds--list-box__menu-item--highlighted {
         background-color: #6f6f6f !important;
     }

    /* Controles NumberInput */
    .cds--number .cds--number__controls button {
        background-color: #4d4d4d !important;
    }
     .cds--number .cds--number__controls button:hover {
         background-color: #6f6f6f !important;
     }
  `;

  return (
    // Aplicar un tema oscuro de Carbon puede ayudar con los estilos
    // <Theme theme="g100"> {/* O g90 */}
    <div style={formContainerStyle}>
      {/* Inyectar los overrides de CSS */}
      <style>{inputStyleOverrides}</style>

      <Form onSubmit={handleSubmit}>
        <Grid>
          <Column lg={16} md={8} sm={4} style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'white' }}>Registrar Nuevo Hotel</h2>
          </Column>

          {/* Columna Izquierda: Info Principal */}
          <Column lg={8} md={4} sm={4}>
            <FormGroup legendText="Información Principal">
              <Dropdown
                id="hotelChain"
                name="hotelChain" // Coincide con el estado
                titleText="Cadena Hotelera (Obligatorio)"
                label="Seleccione una cadena" // Placeholder
                items={chainItems}
                itemToString={(item) => (item ? item.text : '')}
                onChange={(selection) =>
                  handleDropdownChange('hotelChain', selection)
                }
                selectedItem={
                  chainItems.find((item) => item.id === formData.hotelChain) ||
                  null
                }
                invalid={!!errors.hotelChain}
                invalidText={errors.hotelChain}
                light // Usar 'light' prop puede ser contraproducente con fondo oscuro, probar sin ella si los overrides no funcionan
              />
              <Dropdown
                id="hotelBrand"
                name="hotelBrand"
                titleText="Marca Hotelera (Obligatorio)"
                label="Seleccione una marca"
                items={brandItems}
                itemToString={(item) => (item ? item.text : '')}
                onChange={(selection) =>
                  handleDropdownChange('hotelBrand', selection)
                }
                selectedItem={
                  brandItems.find((item) => item.id === formData.hotelBrand) ||
                  null
                }
                invalid={!!errors.hotelBrand}
                invalidText={errors.hotelBrand}
              />
              <TextInput
                id="hotelName"
                name="hotelName"
                labelText="Nombre del Hotel (Obligatorio)"
                value={formData.hotelName}
                onChange={handleChange}
                invalid={!!errors.hotelName}
                invalidText={errors.hotelName}
              />
              <TextInput
                id="localPhone"
                name="localPhone"
                labelText="Teléfono Local (Obligatorio)"
                value={formData.localPhone}
                onChange={handleChange}
                invalid={!!errors.localPhone}
                invalidText={errors.localPhone}
                helperText="Formato local Ej: 24001234"
              />
              <TextInput
                id="celularPhone"
                name="celularPhone"
                labelText="Teléfono Celular (Obligatorio)"
                value={formData.celularPhone}
                onChange={handleChange}
                invalid={!!errors.celularPhone}
                invalidText={errors.celularPhone}
                helperText="Incluir código país Ej: +59899123456"
              />
              <NumberInput
                id="totalFloors"
                name="totalFloors"
                label="Total de Pisos (Obligatorio)"
                min={1} // Mínimo 1
                step={1}
                value={formData.totalFloors}
                // onChange necesita ambos args en v11: (event, { value, direction })
                onChange={(e, { value }) =>
                  handleNumberInputChange('totalFloors', e, { value })
                } // Pasar evento y objeto valor
                invalid={!!errors.totalFloors}
                invalidText={errors.totalFloors}
                allowEmpty={false} // No permitir vacío explícitamente
              />
              <NumberInput
                id="totalRooms"
                name="totalRooms"
                label="Total de Habitaciones (Obligatorio)"
                min={1}
                step={1}
                value={formData.totalRooms}
                onChange={(e, { value }) =>
                  handleNumberInputChange('totalRooms', e, { value })
                }
                invalid={!!errors.totalRooms}
                invalidText={errors.totalRooms}
                allowEmpty={false}
              />
              <TextArea
                id="disclaimer"
                name="disclaimer"
                labelText="Disclaimer (Obligatorio)"
                value={formData.disclaimer}
                onChange={handleChange}
                invalid={!!errors.disclaimer}
                invalidText={errors.disclaimer}
                rows={4}
                helperText="Texto largo descriptivo."
              />
            </FormGroup>
          </Column>

          {/* Columna Derecha: PMS y CRS */}
          <Column lg={8} md={4} sm={4}>
            <FormGroup legendText="Datos PMS (Obligatorio)">
              <Dropdown
                id="pmsVendor"
                name="pmsVendor"
                titleText="Proveedor PMS"
                label="Seleccione un proveedor"
                items={pmsVendorItems}
                itemToString={(item) => (item ? item.text : '')}
                onChange={(selection) =>
                  handleDropdownChange('pmsVendor', selection)
                }
                selectedItem={
                  pmsVendorItems.find(
                    (item) => item.id === formData.pmsVendor
                  ) || null
                }
                invalid={!!errors.pmsVendor}
                invalidText={errors.pmsVendor}
              />
              <TextInput
                id="pmsHotelId"
                name="pmsHotelId"
                labelText="ID Hotel en PMS"
                value={formData.pmsHotelId}
                onChange={handleChange}
                invalid={!!errors.pmsHotelId}
                invalidText={errors.pmsHotelId}
                helperText="Debe ser numérico."
              />
              <TextInput
                id="pmsToken"
                name="pmsToken"
                labelText="Token PMS"
                // type="password" // Descomentar si es información sensible
                value={formData.pmsToken}
                onChange={handleChange}
                invalid={!!errors.pmsToken}
                invalidText={errors.pmsToken}
              />
            </FormGroup>

            <FormGroup legendText="Datos CRS (Opcional)">
              <Dropdown
                id="crsVendor"
                name="crsVendor"
                titleText="Proveedor CRS"
                label="Seleccione un proveedor (opcional)"
                items={crsVendorItems}
                itemToString={(item) => (item ? item.text : '')}
                onChange={(selection) =>
                  handleDropdownChange('crsVendor', selection)
                }
                selectedItem={
                  crsVendorItems.find(
                    (item) => item.id === formData.crsVendor
                  ) || null
                }
                // No marcar como inválido si está vacío
                invalid={!!errors.crsVendor}
                invalidText={errors.crsVendor}
              />
              <TextInput
                id="crsHotelId"
                name="crsHotelId"
                labelText="ID Hotel en CRS"
                value={formData.crsHotelId}
                onChange={handleChange}
                invalid={!!errors.crsHotelId}
                invalidText={errors.crsHotelId}
                helperText="Debe ser numérico si se ingresa."
              />
              <TextInput
                id="crsToken"
                name="crsToken"
                labelText="Token CRS"
                // type="password"
                value={formData.crsToken}
                onChange={handleChange}
                invalid={!!errors.crsToken}
                invalidText={errors.crsToken}
              />
            </FormGroup>
          </Column>

          {/* Fila Inferior: Floor Plans */}
          <Column lg={16} md={8} sm={4}>
            <FormGroup legendText="Planos de Piso (URLs)">
              {/* Mensaje de error general para planos */}
              {errors.floorPlans &&
                !errors.api && ( // No mostrar si hay error de API
                  <p
                    className="cds--form-requirement"
                    style={{ marginBottom: '1rem', color: '#ffb3b8' }}
                  >
                    {errors.floorPlans}
                  </p>
                )}
              {/* Renderizar inputs dinámicamente */}
              {formData.floorPlans.map((planUrl, index) => (
                <TextInput
                  key={`floorplan-${index}`} // Key única para React
                  id={`floorPlan-${index}`}
                  name={`floorPlan-${index}`} // Útil para debug, no usado en handler
                  labelText={`URL Piso ${index + 1} (Obligatorio)`}
                  value={planUrl}
                  onChange={(e) => handleFloorPlanChange(index, e.target.value)}
                  invalid={!!errors[`floorPlans[${index}]`]}
                  invalidText={errors[`floorPlans[${index}]`]}
                  style={{ marginBottom: '1rem' }} // Espacio entre inputs de planos
                />
              ))}
              {/* Mensaje si no hay pisos */}
              {(parseInt(formData.totalFloors, 10) || 0) <= 0 && (
                <p
                  className="cds--form__helper-text"
                  style={{ color: 'white' }}
                >
                  Ajuste el 'Total de Pisos' a 1 o más para añadir URLs.
                </p>
              )}
            </FormGroup>
          </Column>

          {/* Área de Envío y Notificaciones */}
          <Column lg={16} md={8} sm={4}>
            {/* Notificación de Éxito */}
            {submitStatus === 'success' && (
              <InlineNotification
                kind="success"
                title="Éxito!"
                subtitle="Hotel creado correctamente."
                onClose={() => setSubmitStatus(null)} // Permitir cerrar la notificación
                lowContrast // Mejor visibilidad en fondos oscuros
                style={{ marginBottom: '1rem' }}
              />
            )}
            {/* Notificación de Error */}
            {submitStatus === 'error' && (
              <InlineNotification
                kind="error"
                title="Error"
                subtitle={
                  errors.api ||
                  'No se pudo crear el hotel. Verifique los datos o intente más tarde.'
                }
                onClose={() => {
                  setSubmitStatus(null);
                  setErrors((prev) => ({ ...prev, api: undefined }));
                }}
                lowContrast
                style={{ marginBottom: '1rem' }}
              />
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Create Hotel'}
            </Button>
          </Column>
        </Grid>
      </Form>
    </div>
    // </Theme>
  );
}

export default HotelForm;
