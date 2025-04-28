// src/components/HotelForm.jsx
import React, { useState /* useEffect fue removido */ } from 'react';
import {
  Theme,
  Form,
  FormGroup,
  TextInput,
  Dropdown,
  TextArea,
  NumberInput,
  Button,
  Grid,
  Column,
  InlineNotification,
} from '@carbon/react';
// Estilos globales de Carbon deben importarse en App.js o index.js
// import '@carbon/styles/css/styles.css';

// fetch o axios para la API
// import axios from 'axios';

function HotelForm() {
  // --- Estado del Formulario (sin floorPlans) ---
  const [formData, setFormData] = useState({
    hotelChain: '',
    hotelBrand: '',
    hotelName: '',
    localPhone: '',
    celularPhone: '',
    pmsVendor: '',
    pmsHotelId: '',
    pmsToken: '',
    crsVendor: '',
    crsHotelId: '',
    crsToken: '',
    disclaimer: '',
    totalFloors: 1,
    totalRooms: 1,
    // floorPlans fue removido de aquí
  });

  const [errors, setErrors] = useState({}); // Estado para errores de validación
  const [loading, setLoading] = useState(false); // Estado para indicar carga durante el envío
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  // --- Datos de Ejemplo para Dropdowns (sin cambios) ---
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

  // --- useEffect para sincronizar floorPlans fue REMOVIDO ---

  // --- Manejadores de Cambios (sin cambios, excepto el de floorPlans que fue removido) ---
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

  const handleNumberInputChange = (fieldName, value) => {
    const numericValue = value !== '' ? Number(value) : '';
    setFormData((prev) => ({ ...prev, [fieldName]: numericValue }));
    if (errors[fieldName])
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  // --- handleFloorPlanChange fue REMOVIDO ---

  // --- Validación (sin validación de floorPlans) ---
  const validateForm = () => {
    const newErrors = {};
    // Desestructurar formData (sin floorPlans)
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
      crsHotelId, // Validar CRS ID si existe
    } = formData;

    // Campos obligatorios (excluyendo CRS y floorPlans)
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

    // Validaciones de formato (sin cambios)
    const localPhonePattern = /^[\d\s-()]*$/;
    if (localPhone && !localPhonePattern.test(localPhone))
      newErrors.localPhone = 'Formato de teléfono local inválido.';
    const celularPhonePattern = /^\+\d[\d\s]*$/;
    if (celularPhone && !celularPhonePattern.test(celularPhone))
      newErrors.celularPhone = 'Formato inválido. Ej: +598 99123456';

    // Validaciones numéricas (sin cambios)
    if (pmsHotelId && !/^\d+$/.test(pmsHotelId.toString()))
      newErrors.pmsHotelId = 'El ID de hotel PMS debe ser numérico.';
    if (crsHotelId && !/^\d+$/.test(crsHotelId.toString()))
      newErrors.crsHotelId = 'El ID de hotel CRS debe ser numérico.';

    // --- Validación de Floor Plans fue REMOVIDA ---

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True si no hay errores
  };

  // --- Manejador de Envío (payload sin floorPlans) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      console.log('Errores de validación:', errors);
      return;
    }

    setLoading(true);
    const selectedChainObject = chainItems.find(
      (item) => item.id === formData.hotelChain
    );
    const selectedBrandObject = brandItems.find(
      (item) => item.id === formData.hotelBrand
    );
    // const selectedPmsVendorObject = pmsVendorItems.find(item => item.id === formData.pmsVendor);
    // const selectedCrsVendorObject = formData.crsVendor ? crsVendorItems.find(item => item.id === formData.crsVendor) : null;

    // Preparar el payload para la API (sin el campo floorPlans)
    const payload = {
      // hotelChain: formData.hotelChain,
      // hotelBrand: formData.hotelBrand,
      hotelChain: selectedChainObject ? selectedChainObject.text : '', // Enviar texto
      hotelBrand: selectedBrandObject ? selectedBrandObject.text : '', // Enviar texto
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
    };

    console.log(
      'Enviando payload (sin floorPlans):',
      JSON.stringify(payload, null, 2)
    );

    try {
      // Usa la URL correcta confirmada para hotels
      const response = await fetch('http://localhost:8090/api/hotels/', {
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
        } catch (e) {
          errorMsg += ` - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }
      const result = await response.json();
      console.log('Hotel creado:', result);
      setSubmitStatus('success');
      // Opcional: Limpiar formulario
      // setFormData({ ...initialStateSinFloorPlans });
      // setErrors({});
    } catch (error) {
      /* ... manejo error fetch ... */
      console.error('Error al crear hotel:', error);
      setSubmitStatus('error');
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'Ocurrió un error al crear el hotel.',
      }));
    } finally {
      setLoading(false);
    }
  };

  // --- Estilos y Renderizado ---
  const formContainerStyle = {
    /* ... sin cambios ... */ backgroundColor: '#5331FA',
    padding: '2rem',
    fontFamily: 'Roboto, sans-serif',
    minHeight: '100vh',
  };

  // --- inputStyleOverrides ya no se usan ---

  return (
    <Theme theme="g100">
      <div style={formContainerStyle}>
        {/* --- No hay bloque <style> --- */}
        <Form onSubmit={handleSubmit}>
          <Grid>
            {/* Título */}
            <Column lg={16} md={8} sm={4} style={{ marginBottom: '2rem' }}>
              <h2>Registrar Nuevo Hotel</h2>
            </Column>

            {/* Columna Izquierda: Info Principal */}
            <Column lg={8} md={8} sm={4}>
              <FormGroup legendText="Información Principal">
                {/* Campos: Dropdowns, TextInputs, NumberInputs, TextArea */}
                {/* (Sin cambios en esta sección) */}
                <Dropdown
                  id="hotelChain"
                  name="hotelChain"
                  titleText="Cadena Hotelera (Obligatorio)"
                  label="Seleccione una cadena"
                  items={chainItems}
                  itemToString={(item) => (item ? item.text : '')}
                  onChange={(selection) =>
                    handleDropdownChange('hotelChain', selection)
                  }
                  selectedItem={
                    chainItems.find(
                      (item) => item.id === formData.hotelChain
                    ) || null
                  }
                  invalid={!!errors.hotelChain}
                  invalidText={errors.hotelChain}
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
                    brandItems.find(
                      (item) => item.id === formData.hotelBrand
                    ) || null
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
                  min={1}
                  step={1}
                  value={formData.totalFloors}
                  onChange={(event, { value }) =>
                    handleNumberInputChange('totalFloors', value)
                  }
                  invalid={!!errors.totalFloors}
                  invalidText={errors.totalFloors}
                  allowEmpty={false}
                />
                <NumberInput
                  id="totalRooms"
                  name="totalRooms"
                  label="Total de Habitaciones (Obligatorio)"
                  min={1}
                  step={1}
                  value={formData.totalRooms}
                  onChange={(event, { value }) =>
                    handleNumberInputChange('totalRooms', value)
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
            <Column lg={8} md={8} sm={4}>
              <FormGroup legendText="Datos PMS (Obligatorio)">
                {/* Campos PMS (sin cambios) */}
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
                  value={formData.pmsToken}
                  onChange={handleChange}
                  invalid={!!errors.pmsToken}
                  invalidText={errors.pmsToken}
                />
              </FormGroup>
              <FormGroup legendText="Datos CRS (Opcional)">
                {/* Campos CRS (sin cambios) */}
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
                  value={formData.crsToken}
                  onChange={handleChange}
                  invalid={!!errors.crsToken}
                  invalidText={errors.crsToken}
                />
              </FormGroup>
            </Column>

            {/* --- Sección Floor Plans fue REMOVIDA --- */}

            {/* Área de Envío y Notificaciones */}
            <Column lg={16} md={8} sm={4} style={{ marginTop: '2rem' }}>
              {/* Notificaciones (sin cambios) */}
              {submitStatus === 'success' && (
                <InlineNotification
                  kind="success"
                  title="Éxito!"
                  subtitle="Hotel creado correctamente."
                  onClose={() => setSubmitStatus(null)}
                  lowContrast
                  style={{ marginBottom: '1rem' }}
                />
              )}
              {submitStatus === 'error' && (
                <InlineNotification
                  kind="error"
                  title="Error"
                  subtitle={errors.api || 'No se pudo crear el hotel.'}
                  onClose={() => {
                    setSubmitStatus(null);
                    setErrors((prev) => ({ ...prev, api: undefined }));
                  }}
                  lowContrast
                  style={{ marginBottom: '1rem' }}
                />
              )}
              {/* Botón (sin cambios) */}
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Create Hotel'}
              </Button>
            </Column>
          </Grid>
        </Form>
      </div>
    </Theme>
  );
}

export default HotelForm;
