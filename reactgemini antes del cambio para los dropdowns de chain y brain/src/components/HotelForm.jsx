// src/components/HotelForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  TextInput,
  Dropdown,
  TextArea,
  NumberInput,
  Button,
  Grid,
  Column,
  InlineNotification,
  Loading,
} from '@carbon/react';

// Estado inicial
const initialHotelState = {
  hotelChain: '',
  hotelBrand: '',
  hotelName: '',
  localPhone: '',
  cellPhone: '',
  pmsVendor: '',
  pmsHotelId: '',
  pmsToken: '',
  crsVendor: '',
  crsHotelId: '',
  crsToken: '',
  disclaimer: '',
  totalFloors: 1,
  totalRooms: 1,
};

// Datos de Ejemplo Dropdowns
const chainItems = [
  { id: 'chain-demo-1', text: 'Demo Chain Alpha' },
  { id: 'chain-demo-2', text: 'Demo Chain Beta' },
];
const brandItems = [
  { id: 'brand-demo-1', text: 'Demo Brand One' },
  { id: 'brand-demo-2', text: 'Demo Brand Two' },
];
const pmsVendorItems = [
  { id: 'pms-vendor-x', text: 'PMS Provider X' },
  { id: 'pms-vendor-y', text: 'PMS Provider Y' },
];
const crsVendorItems = [
  { id: 'crs-vendor-a', text: 'CRS Provider A' },
  { id: 'crs-vendor-b', text: 'CRS Provider B' },
];

function HotelForm() {
  const { hotelId } = useParams();
  const isEditMode = !!hotelId;
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialHotelState);
  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Submit loading
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode); // Initial data loading
  const [initialLoadError, setInitialLoadError] = useState(null);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDropdownChange = (field, { selectedItem }) => {
    const value = selectedItem ? selectedItem.id : '';
    // console.log(`Dropdown Change: Field=${field}, SelectedID=${value}`); // Keep logs if needed
    // console.log('Selected Item Object:', selectedItem);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNumberInputChange = (fieldName, value) => {
    const numericValue =
      value === null || value === '' || typeof value === 'undefined'
        ? ''
        : Number(value);
    if (isNaN(numericValue) && value !== '') {
      setFormData((prev) => ({ ...prev, [fieldName]: value })); // Keep raw value if parsing fails mid-input
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: numericValue })); // Store as number otherwise
    }
    if (errors[fieldName])
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  // --- useEffect para Carga de Datos (con logs de depuración) ---
  useEffect(() => {
    if (isEditMode && hotelId) {
      console.log(`Edit mode. Fetching data for hotel ID: ${hotelId}`);
      setIsLoadingData(true);
      setInitialLoadError(null);
      setErrors({});
      setSubmitStatus(null);
      const fetchHotelData = async () => {
        try {
          const apiUrl = `http://localhost:8090/api/hotels/${hotelId}`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
            if (response.status === 404)
              throw new Error(`Hotel with ID ${hotelId} not found.`);
            throw new Error(
              `Could not fetch hotel data (Status: ${response.status})`
            );
          }
          const fetchedData = await response.json();
          console.log('Fetched data from API:', fetchedData); // DEBUG LOG 1

          const chainId =
            chainItems.find((item) => item.text === fetchedData.hotelChain)
              ?.id || '';
          const brandId =
            brandItems.find((item) => item.text === fetchedData.hotelBrand)
              ?.id || '';
          const pmsVendorId =
            pmsVendorItems.find((item) => item.text === fetchedData.pmsVendor)
              ?.id || '';
          const crsVendorId =
            crsVendorItems.find((item) => item.text === fetchedData.crsVendor)
              ?.id || '';

          console.log('Dropdown Mapping:', {
            /* ... DEBUG LOG 2 ... */
          });

          setFormData({
            hotelChain: chainId,
            hotelBrand: brandId,
            hotelName: fetchedData.hotelName || '',
            localPhone: fetchedData.localPhone || '',
            cellPhone: fetchedData.celularPhone || '', // <<< VERIFICAR NOMBRE CAMPO API
            pmsVendor: pmsVendorId,
            pmsHotelId: fetchedData.pmsHotelId?.toString() || '',
            pmsToken: fetchedData.pmsToken || '',
            crsVendor: crsVendorId,
            crsHotelId: fetchedData.crsHotelId?.toString() || '',
            crsToken: fetchedData.crsToken || '',
            disclaimer: fetchedData.disclaimer || '',
            totalFloors: fetchedData.totalFloors ?? 1,
            totalRooms: fetchedData.totalRooms ?? 1,
          });
        } catch (error) {
          console.error('Error fetching hotel data for edit:', error);
          setInitialLoadError(error.message || 'Failed to load hotel data.');
        } finally {
          setIsLoadingData(false); // <-- ASEGURARSE QUE ESTO SE EJECUTA
          console.log(
            'Finished loading data attempt, isLoadingData set to false'
          ); // DEBUG LOG 3
        }
      };
      fetchHotelData();
    } else {
      setFormData(initialHotelState);
      setIsLoadingData(false);
      setInitialLoadError(null);
      setErrors({});
      setSubmitStatus(null);
    }
  }, [hotelId, isEditMode]);

  // --- Validación (CON LÓGICA) ---
  const validateForm = () => {
    const newErrors = {};
    const {
      hotelChain,
      hotelBrand,
      hotelName,
      localPhone,
      cellPhone,
      pmsVendor,
      pmsHotelId,
      pmsToken,
      disclaimer,
      totalFloors,
      totalRooms,
      crsHotelId,
    } = formData;

    if (!hotelChain) newErrors.hotelChain = 'Hotel chain is required.';
    if (!hotelBrand) newErrors.hotelBrand = 'Hotel brand is required.';
    if (!hotelName.trim()) newErrors.hotelName = 'Hotel name is required.';
    if (!localPhone.trim()) newErrors.localPhone = 'Local phone is required.';
    if (!cellPhone.trim()) newErrors.cellPhone = 'Cell phone is required.';
    if (!pmsVendor) newErrors.pmsVendor = 'PMS provider is required.';
    if (
      !pmsHotelId?.toString().trim() ||
      !/^\d+$/.test(pmsHotelId.toString())
    ) {
      newErrors.pmsHotelId = 'PMS Hotel ID is required and must be numeric.';
    }
    if (!pmsToken.trim()) newErrors.pmsToken = 'PMS token is required.';
    if (!disclaimer.trim()) newErrors.disclaimer = 'Disclaimer is required.';
    if (
      totalFloors === '' ||
      typeof totalFloors !== 'number' ||
      totalFloors < 1
    )
      newErrors.totalFloors = 'Total floors must be at least 1.';
    if (totalRooms === '' || typeof totalRooms !== 'number' || totalRooms < 1)
      newErrors.totalRooms = 'Total rooms must be at least 1.';
    const localPhonePattern = /^[\d\s-()]*$/;
    if (localPhone && !localPhonePattern.test(localPhone)) {
      newErrors.localPhone = 'Invalid local phone format.';
    }
    const cellPhonePattern = /^\+\d[\d\s]*$/;
    if (cellPhone && !cellPhonePattern.test(cellPhone)) {
      newErrors.cellPhone = 'Invalid format. Ex: +1 555 1234567';
    }
    if (crsHotelId?.toString().trim() && !/^\d+$/.test(crsHotelId.toString())) {
      newErrors.crsHotelId = 'CRS Hotel ID must be numeric if entered.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Envío (CON LÓGICA) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    if (!validateForm()) {
      console.log('Validation Errors:', errors);
      return;
    }
    setLoadingSubmit(true);

    const selectedChainObject = chainItems.find(
      (item) => item.id === formData.hotelChain
    );
    const selectedBrandObject = brandItems.find(
      (item) => item.id === formData.hotelBrand
    );
    const selectedPmsVendorObject = pmsVendorItems.find(
      (item) => item.id === formData.pmsVendor
    );
    const selectedCrsVendorObject = formData.crsVendor
      ? crsVendorItems.find((item) => item.id === formData.crsVendor)
      : null;

    const payload = {
      hotelChain: selectedChainObject ? selectedChainObject.text : '',
      hotelBrand: selectedBrandObject ? selectedBrandObject.text : '',
      hotelName: formData.hotelName,
      localPhone: formData.localPhone,
      celularPhone: formData.cellPhone, // <--- VERIFICAR NOMBRE CAMPO BACKEND
      pmsVendor: selectedPmsVendorObject ? selectedPmsVendorObject.text : '',
      pmsHotelId: formData.pmsHotelId
        ? parseInt(formData.pmsHotelId, 10)
        : null,
      pmsToken: formData.pmsToken,
      ...(formData.crsVendor && {
        crsVendor: selectedCrsVendorObject ? selectedCrsVendorObject.text : '',
        crsHotelId: formData.crsHotelId
          ? parseInt(formData.crsHotelId, 10)
          : null,
        crsToken: formData.crsToken,
      }),
      disclaimer: formData.disclaimer,
      totalFloors: formData.totalFloors,
      totalRooms: formData.totalRooms,
    };

    const apiUrl = isEditMode
      ? `http://localhost:8090/api/hotels/${hotelId}`
      : 'http://localhost:8090/api/hotels/';
    const method = isEditMode ? 'PUT' : 'POST';

    console.log(
      `Sending ${method} Payload to ${apiUrl}:`,
      JSON.stringify(payload, null, 2)
    );
    try {
      const response = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let errorMsg = `HTTP Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || JSON.stringify(errorData);
        } catch (err) {
          console.warn('Failed to parse error response as JSON:', err);
          errorMsg += ` - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }
      const result = await response.json();
      console.log(`Hotel ${isEditMode ? 'updated' : 'created'}:`, result);
      setSubmitStatus('success');
      if (method === 'POST' && result?.hotelId) {
        navigate(`/hotel/${result.hotelId}`);
      } else if (method === 'PUT') {
        setErrors({});
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      setSubmitStatus('error');
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'An unexpected error occurred.',
      }));
    } finally {
      setLoadingSubmit(false);
    }
  };

  // --- Pre-cálculo para Dropdowns ---
  const currentChainItem =
    chainItems.find((item) => item.id === formData.hotelChain) || null;
  const currentBrandItem =
    brandItems.find((item) => item.id === formData.hotelBrand) || null;
  const currentPmsVendorItem =
    pmsVendorItems.find((item) => item.id === formData.pmsVendor) || null;
  const currentCrsVendorItem =
    crsVendorItems.find((item) => item.id === formData.crsVendor) || null;

  // --- LOGS DE DEPURACIÓN ---
  // console.log('Calculating selectedItem for render (Chain):', { /* ... */ });
  // console.log('Calculating selectedItem for render (Brand):', { /* ... */ });
  console.log('FORM RENDER CHECK:', {
    isLoadingData,
    loadingSubmit,
    shouldBeDisabled: isLoadingData || loadingSubmit,
  });
  // ---------------------------

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', textAlign: 'left' }}>
        {isEditMode ? `Edit Hotel (ID: ${hotelId})` : 'Register New Hotel'}
      </h2>
      {initialLoadError && <InlineNotification /* ... */ />}
      {isLoadingData && (
        <Loading description="Loading hotel data..." withOverlay={false} />
      )}
      {!initialLoadError && (
        <Form onSubmit={handleSubmit}>
          <fieldset
            disabled={isLoadingData || loadingSubmit}
            style={{ border: 'none', padding: 0, margin: 0 }}
          >
            <Grid>
              {/* Columnas y Campos del Formulario */}
              {/* Asegúrate de que los selectedItem usan las variables precalculadas */}
              {/* Ejemplo: selectedItem={currentChainItem} */}

              {/* --- Sección General --- */}
              <Column lg={16} md={8} sm={4} style={{ marginBottom: '1rem' }}>
                {' '}
                <h4 /*...*/>General Hotel Information</h4>{' '}
              </Column>
              <Column lg={5} md={8} sm={4}>
                {' '}
                <Dropdown
                  id="hotelChain"
                  name="hotelChain"
                  titleText="Hotel Chain"
                  label="Select..."
                  items={chainItems}
                  itemToString={(item) => (item ? item.text : '')}
                  onChange={(selection) =>
                    handleDropdownChange('hotelChain', selection)
                  }
                  selectedItem={currentChainItem}
                  invalid={!!errors.hotelChain}
                  invalidText={errors.hotelChain}
                  light
                />{' '}
              </Column>
              <Column lg={5} md={8} sm={4}>
                {' '}
                <Dropdown
                  id="hotelBrand"
                  name="hotelBrand"
                  titleText="Hotel Brand"
                  label="Select..."
                  items={brandItems}
                  itemToString={(item) => (item ? item.text : '')}
                  onChange={(selection) =>
                    handleDropdownChange('hotelBrand', selection)
                  }
                  selectedItem={currentBrandItem}
                  invalid={!!errors.hotelBrand}
                  invalidText={errors.hotelBrand}
                  light
                />{' '}
              </Column>
              <Column lg={6} md={8} sm={4}>
                {' '}
                <TextInput
                  id="hotelName"
                  name="hotelName"
                  labelText="Hotel Name"
                  value={formData.hotelName}
                  onChange={handleChange}
                  invalid={!!errors.hotelName}
                  invalidText={errors.hotelName}
                  light
                />{' '}
              </Column>
              {/* --- Sección Contacto --- */}
              <Column
                lg={16}
                md={8}
                sm={4}
                style={{ marginTop: '2rem', marginBottom: '1rem' }}
              >
                {' '}
                <h4 /*...*/>Contact Information</h4>{' '}
              </Column>
              <Column lg={8} md={8} sm={4}>
                {' '}
                <TextInput
                  id="localPhone"
                  name="localPhone"
                  labelText="Local Phone"
                  value={formData.localPhone}
                  onChange={handleChange}
                  invalid={!!errors.localPhone}
                  invalidText={errors.localPhone}
                  placeholder="(xxx) xxx-xxxx"
                  light
                />{' '}
              </Column>
              <Column lg={8} md={8} sm={4}>
                {' '}
                <TextInput
                  id="cellPhone"
                  name="cellPhone"
                  labelText="Cell Phone"
                  value={formData.cellPhone}
                  onChange={handleChange}
                  invalid={!!errors.cellPhone}
                  invalidText={errors.cellPhone}
                  placeholder="(xxx) xxx-xxxx"
                  helperText="Include country code"
                  light
                />{' '}
              </Column>
              {/* --- Sección PMS --- */}
              <Column
                lg={16}
                md={8}
                sm={4}
                style={{ marginTop: '2rem', marginBottom: '1rem' }}
              >
                {' '}
                <h4 /*...*/>
                  Property Management System (PMS) Information
                </h4>{' '}
              </Column>
              <Column lg={5} md={8} sm={4}>
                {' '}
                <Dropdown
                  id="pmsVendor"
                  name="pmsVendor"
                  titleText="PMS Provider"
                  label="Select..."
                  items={pmsVendorItems}
                  itemToString={(item) => (item ? item.text : '')}
                  onChange={(selection) =>
                    handleDropdownChange('pmsVendor', selection)
                  }
                  selectedItem={currentPmsVendorItem}
                  invalid={!!errors.pmsVendor}
                  invalidText={errors.pmsVendor}
                  light
                />{' '}
              </Column>
              <Column lg={5} md={8} sm={4}>
                {' '}
                <TextInput
                  id="pmsHotelId"
                  name="pmsHotelId"
                  labelText="Hotel ID in PMS"
                  value={formData.pmsHotelId}
                  onChange={handleChange}
                  invalid={!!errors.pmsHotelId}
                  invalidText={errors.pmsHotelId}
                  light
                />{' '}
              </Column>
              <Column lg={6} md={8} sm={4}>
                {' '}
                <TextInput
                  id="pmsToken"
                  name="pmsToken"
                  labelText="PMS Token"
                  type="password"
                  value={formData.pmsToken}
                  onChange={handleChange}
                  invalid={!!errors.pmsToken}
                  invalidText={errors.pmsToken}
                  light
                />{' '}
              </Column>
              {/* --- Sección CRS --- */}
              <Column
                lg={16}
                md={8}
                sm={4}
                style={{ marginTop: '2rem', marginBottom: '1rem' }}
              >
                {' '}
                <h4 /*...*/>
                  Central Reservation System (CRS) Information
                </h4>{' '}
              </Column>
              <Column lg={5} md={8} sm={4}>
                {' '}
                <Dropdown
                  id="crsVendor"
                  name="crsVendor"
                  titleText="CRS Provider"
                  label="Select..."
                  items={crsVendorItems}
                  itemToString={(item) => (item ? item.text : '')}
                  onChange={(selection) =>
                    handleDropdownChange('crsVendor', selection)
                  }
                  selectedItem={currentCrsVendorItem}
                  invalid={!!errors.crsVendor}
                  invalidText={errors.crsVendor}
                  light
                />{' '}
              </Column>
              <Column lg={5} md={8} sm={4}>
                {' '}
                <TextInput
                  id="crsHotelId"
                  name="crsHotelId"
                  labelText="Hotel ID in CRS"
                  value={formData.crsHotelId}
                  onChange={handleChange}
                  invalid={!!errors.crsHotelId}
                  invalidText={errors.crsHotelId}
                  light
                />{' '}
              </Column>
              <Column lg={6} md={8} sm={4}>
                {' '}
                <TextInput
                  id="crsToken"
                  name="crsToken"
                  labelText="CRS Token"
                  type="password"
                  value={formData.crsToken}
                  onChange={handleChange}
                  invalid={!!errors.crsToken}
                  invalidText={errors.crsToken}
                  light
                />{' '}
              </Column>
              {/* --- Sección Adicional --- */}
              <Column
                lg={16}
                md={8}
                sm={4}
                style={{ marginTop: '2rem', marginBottom: '1rem' }}
              >
                {' '}
                <h4 /*...*/>Additional Information</h4>{' '}
              </Column>
              <Column lg={8} md={8} sm={4}>
                {' '}
                <NumberInput
                  id="totalFloors"
                  name="totalFloors"
                  label="Total Floors"
                  min={1}
                  step={1}
                  value={formData.totalFloors}
                  onChange={(e, { value }) =>
                    handleNumberInputChange('totalFloors', value)
                  }
                  invalid={!!errors.totalFloors}
                  invalidText={errors.totalFloors}
                  allowEmpty={false}
                  light
                />{' '}
              </Column>
              <Column lg={8} md={8} sm={4}>
                {' '}
                <NumberInput
                  id="totalRooms"
                  name="totalRooms"
                  label="Total Rooms"
                  min={1}
                  step={1}
                  value={formData.totalRooms}
                  onChange={(e, { value }) =>
                    handleNumberInputChange('totalRooms', value)
                  }
                  invalid={!!errors.totalRooms}
                  invalidText={errors.totalRooms}
                  allowEmpty={false}
                  light
                />{' '}
              </Column>
              {/* --- Sección Disclaimer --- */}
              <Column
                lg={16}
                md={8}
                sm={4}
                style={{ marginTop: '2rem', marginBottom: '1rem' }}
              >
                {' '}
                <h4 /*...*/>Disclaimer</h4>{' '}
              </Column>
              <Column lg={16} md={8} sm={4}>
                {' '}
                <TextArea
                  id="disclaimer"
                  name="disclaimer"
                  labelText="Disclaimer"
                  value={formData.disclaimer}
                  onChange={handleChange}
                  invalid={!!errors.disclaimer}
                  invalidText={errors.disclaimer}
                  rows={4}
                  light
                />{' '}
              </Column>

              {/* Área de Submit */}
              <Column
                lg={16}
                md={8}
                sm={4}
                style={{
                  marginTop: '2rem',
                  borderTop: '1px solid #888',
                  paddingTop: '1.5rem',
                }}
              >
                {/* ... Notificaciones y Botón ... */}
                {/* Loading para submit */}
                {loadingSubmit && (
                  <Loading description="Saving hotel..." withOverlay={false} />
                )}

                {/* --- NOTIFICACIÓN DE ÉXITO --- */}
                {!loadingSubmit && submitStatus === 'success' && (
                  <InlineNotification
                    kind="success"
                    title="Success!"
                    // El subtítulo cambia según si es edición o creación
                    subtitle={
                      isEditMode
                        ? 'Hotel updated successfully.'
                        : 'Hotel created successfully. Redirecting...'
                    }
                    onClose={() => setSubmitStatus(null)} // Permite cerrar la notificación
                    lowContrast
                    style={{ marginBottom: '1rem' }}
                  />
                )}
                {/* ----------------------------- */}

                {/* Notificación de Error */}
                {!loadingSubmit && submitStatus === 'error' && (
                  <InlineNotification /* ... */ />
                )}

                {/* Botón de Envío */}
                <Button type="submit" disabled={isLoadingData || loadingSubmit}>
                  {loadingSubmit
                    ? 'Saving...'
                    : isEditMode
                    ? 'Save Changes'
                    : 'Create Hotel'}
                </Button>
              </Column>
            </Grid>
          </fieldset>
        </Form>
      )}
    </div>
  );
}
export default HotelForm;
