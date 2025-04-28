// src/components/HotelForm.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  // Theme, // Theme comes from AppLayout
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

// Initial state object for the form fields
const initialHotelState = {
  hotelChain: '',
  hotelBrand: '',
  hotelName: '',
  localPhone: '',
  cellPhone: '', // Renamed from celularPhone
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

// Sample data for Dropdowns (Text translated)
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
  // --- State and Hooks ---
  const { hotelId: hotelIdFromUrl } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!hotelIdFromUrl;
  // TODO: Add useEffect to load hotel data if isEditMode is true

  const [formData, setFormData] = useState(initialHotelState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  const handleNumberInputChange = (fieldName, value) => {
    const numericValue = value !== '' ? Number(value) : '';
    setFormData((prev) => ({ ...prev, [fieldName]: numericValue }));
    if (errors[fieldName])
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  // --- Validation ---
  const validateForm = () => {
    const newErrors = {};
    const {
      hotelChain,
      hotelBrand,
      hotelName,
      localPhone,
      cellPhone, // Use cellPhone here
      pmsVendor,
      pmsHotelId,
      pmsToken,
      disclaimer,
      totalFloors,
      totalRooms,
      crsHotelId,
    } = formData;

    // Required field checks (translated messages)
    if (!hotelChain) newErrors.hotelChain = 'Hotel chain is required.';
    if (!hotelBrand) newErrors.hotelBrand = 'Hotel brand is required.';
    if (!hotelName.trim()) newErrors.hotelName = 'Hotel name is required.';
    if (!localPhone.trim()) newErrors.localPhone = 'Local phone is required.';
    if (!cellPhone.trim()) newErrors.cellPhone = 'Cell phone is required.'; // cellPhone validation
    if (!pmsVendor) newErrors.pmsVendor = 'PMS provider is required.';
    if (!pmsHotelId.toString().trim())
      newErrors.pmsHotelId = 'PMS Hotel ID is required.';
    if (!pmsToken.trim()) newErrors.pmsToken = 'PMS token is required.';
    if (!disclaimer.trim()) newErrors.disclaimer = 'Disclaimer is required.';
    if (totalFloors === '' || totalFloors === null || totalFloors < 1)
      newErrors.totalFloors = 'Total floors must be at least 1.';
    if (totalRooms === '' || totalRooms === null || totalRooms < 1)
      newErrors.totalRooms = 'Total rooms must be at least 1.';

    // Format validations (patterns remain the same, messages translated)
    const localPhonePattern = /^[\d\s-()]*$/;
    if (localPhone && !localPhonePattern.test(localPhone)) {
      newErrors.localPhone = 'Invalid local phone format.';
    }
    const cellPhonePattern = /^\+\d[\d\s]*$/; // Starts with +, digits, optional spaces
    if (cellPhone && !cellPhonePattern.test(cellPhone)) {
      newErrors.cellPhone = 'Invalid format. Ex: +1 555 1234567'; // Updated helper text idea
    }

    // Numeric checks (messages translated)
    if (pmsHotelId && !/^\d+$/.test(pmsHotelId.toString())) {
      newErrors.pmsHotelId = 'PMS Hotel ID must be numeric.';
    }
    if (crsHotelId && !/^\d+$/.test(crsHotelId.toString())) {
      newErrors.crsHotelId = 'CRS Hotel ID must be numeric.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    if (!validateForm()) {
      console.log('Validation Errors:', errors);
      return;
    }
    setLoading(true);

    // Find selected objects to get text values
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

    // Prepare payload (sending text for dropdowns, check field names)
    const payload = {
      hotelChain: selectedChainObject ? selectedChainObject.text : '',
      hotelBrand: selectedBrandObject ? selectedBrandObject.text : '',
      hotelName: formData.hotelName,
      localPhone: formData.localPhone,
      celularPhone: formData.cellPhone, // Ensure backend expects 'celularPhone' or update to 'cellPhone' here too
      // Or maybe the backend field is cellPhone: formData.cellPhone,
      pmsVendor: selectedPmsVendorObject ? selectedPmsVendorObject.text : '',
      pmsHotelId: parseInt(formData.pmsHotelId, 10),
      pmsToken: formData.pmsToken,
      ...(formData.crsVendor && {
        crsVendor: selectedCrsVendorObject ? selectedCrsVendorObject.text : '',
        ...(formData.crsHotelId && {
          crsHotelId: parseInt(formData.crsHotelId, 10),
        }),
        ...(formData.crsToken && { crsToken: formData.crsToken }),
      }),
      disclaimer: formData.disclaimer,
      totalFloors: parseInt(formData.totalFloors, 10),
      totalRooms: parseInt(formData.totalRooms, 10),
    };

    // TODO: Adjust endpoint and method if in edit mode
    const apiUrl = 'http://localhost:8090/api/hotels/'; // Creation endpoint
    const method = 'POST';

    console.log(
      `Sending Payload to ${apiUrl}:`,
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
          // Use errorData.message if backend provides it, otherwise stringify
          errorMsg = errorData.message || JSON.stringify(errorData);
        } catch (err) {
          // If response is not JSON or empty, use statusText
          console.warn('Could not parse error response as JSON:', err);
          errorMsg += ` - ${response.statusText}`;
        }
        throw new Error(errorMsg); // Throw the constructed error message
      }

      const result = await response.json();
      console.log('Hotel created/updated:', result);
      setSubmitStatus('success');

      // Redirect after creating
      if (method === 'POST' && result?.hotelId) {
        navigate(`/hotel/${result.hotelId}`); // Navigate to the management page
      } else {
        // Potentially clear form if needed after edit, or show persistent message
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      setSubmitStatus('error');
      // Set API error message for display in notification
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'An unexpected error occurred.',
      }));
    } finally {
      setLoading(false);
    }
  };

  // --- JSX with Translated Labels ---
  return (
    <div>
      <h2 style={{ marginBottom: '2rem', textAlign: 'left' }}>
        Hotel Data Registration/Update {/* Title translated */}
      </h2>

      <Form onSubmit={handleSubmit}>
        <Grid>
          {/* --- Section: General Hotel Information --- */}
          <Column lg={16} md={8} sm={4} style={{ marginBottom: '1rem' }}>
            <h4
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #555',
                paddingBottom: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              General Hotel Information
            </h4>
          </Column>
          <Column lg={5} md={8} sm={4}>
            <Dropdown
              id="hotelChain"
              name="hotelChain"
              titleText="Hotel Chain"
              label="Select..." // Translated
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
              light
            />
          </Column>
          <Column lg={5} md={8} sm={4}>
            <Dropdown
              id="hotelBrand"
              name="hotelBrand"
              titleText="Hotel Brand"
              label="Select..." // Translated
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
              light
            />
          </Column>
          <Column lg={6} md={8} sm={4}>
            <TextInput
              id="hotelName"
              name="hotelName"
              labelText="Hotel Name" // Translated
              value={formData.hotelName}
              onChange={handleChange}
              invalid={!!errors.hotelName}
              invalidText={errors.hotelName}
              light
            />
          </Column>

          {/* --- Section: Contact Information --- */}
          <Column
            lg={16}
            md={8}
            sm={4}
            style={{ marginTop: '2rem', marginBottom: '1rem' }}
          >
            <h4
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #555',
                paddingBottom: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              Contact Information
            </h4>
          </Column>
          <Column lg={8} md={8} sm={4}>
            <TextInput
              id="localPhone"
              name="localPhone"
              labelText="Local Phone" // Translated
              value={formData.localPhone}
              onChange={handleChange}
              invalid={!!errors.localPhone}
              invalidText={errors.localPhone}
              placeholder="(xxx) xxx-xxxx"
              light
            />
          </Column>
          <Column lg={8} md={8} sm={4}>
            <TextInput
              id="cellPhone"
              name="cellPhone"
              labelText="Cell Phone" // Translated and name changed
              value={formData.cellPhone}
              onChange={handleChange}
              invalid={!!errors.cellPhone}
              invalidText={errors.cellPhone} // Use cellPhone error key
              placeholder="(xxx) xxx-xxxx"
              helperText="Include country code"
              light // Translated
            />
          </Column>

          {/* --- Section: Property Management System (PMS) Information --- */}
          <Column
            lg={16}
            md={8}
            sm={4}
            style={{ marginTop: '2rem', marginBottom: '1rem' }}
          >
            <h4
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #555',
                paddingBottom: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              Property Management System (PMS) Information
            </h4>
          </Column>
          <Column lg={5} md={8} sm={4}>
            <Dropdown
              id="pmsVendor"
              name="pmsVendor"
              titleText="PMS Provider"
              label="Select..." // Translated
              items={pmsVendorItems}
              itemToString={(item) => (item ? item.text : '')}
              onChange={(selection) =>
                handleDropdownChange('pmsVendor', selection)
              }
              selectedItem={
                pmsVendorItems.find((item) => item.id === formData.pmsVendor) ||
                null
              }
              invalid={!!errors.pmsVendor}
              invalidText={errors.pmsVendor}
              light
            />
          </Column>
          <Column lg={5} md={8} sm={4}>
            <TextInput
              id="pmsHotelId"
              name="pmsHotelId"
              labelText="Hotel ID in PMS" // Translated
              value={formData.pmsHotelId}
              onChange={handleChange}
              invalid={!!errors.pmsHotelId}
              invalidText={errors.pmsHotelId}
              light
            />
          </Column>
          <Column lg={6} md={8} sm={4}>
            <TextInput
              id="pmsToken"
              name="pmsToken"
              labelText="PMS Token"
              type="password" // Translated
              value={formData.pmsToken}
              onChange={handleChange}
              invalid={!!errors.pmsToken}
              invalidText={errors.pmsToken}
              light
            />
          </Column>

          {/* --- Section: Central Reservation System (CRS) Information --- */}
          <Column
            lg={16}
            md={8}
            sm={4}
            style={{ marginTop: '2rem', marginBottom: '1rem' }}
          >
            <h4
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #555',
                paddingBottom: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              Central Reservation System (CRS) Information
            </h4>
          </Column>
          <Column lg={5} md={8} sm={4}>
            <Dropdown
              id="crsVendor"
              name="crsVendor"
              titleText="CRS Provider"
              label="Select..." // Translated
              items={crsVendorItems}
              itemToString={(item) => (item ? item.text : '')}
              onChange={(selection) =>
                handleDropdownChange('crsVendor', selection)
              }
              selectedItem={
                crsVendorItems.find((item) => item.id === formData.crsVendor) ||
                null
              }
              invalid={!!errors.crsVendor}
              invalidText={errors.crsVendor}
              light
            />
          </Column>
          <Column lg={5} md={8} sm={4}>
            <TextInput
              id="crsHotelId"
              name="crsHotelId"
              labelText="Hotel ID in CRS" // Translated
              value={formData.crsHotelId}
              onChange={handleChange}
              invalid={!!errors.crsHotelId}
              invalidText={errors.crsHotelId}
              light
            />
          </Column>
          <Column lg={6} md={8} sm={4}>
            <TextInput
              id="crsToken"
              name="crsToken"
              labelText="CRS Token"
              type="password" // Translated
              value={formData.crsToken}
              onChange={handleChange}
              invalid={!!errors.crsToken}
              invalidText={errors.crsToken}
              light
            />
          </Column>

          {/* --- Section: Additional Information --- */}
          <Column
            lg={16}
            md={8}
            sm={4}
            style={{ marginTop: '2rem', marginBottom: '1rem' }}
          >
            <h4
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #555',
                paddingBottom: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              Additional Information
            </h4>
          </Column>
          <Column lg={8} md={8} sm={4}>
            <NumberInput
              id="totalFloors"
              name="totalFloors"
              label="Total Floors"
              min={1}
              step={1} // Translated
              value={formData.totalFloors}
              onChange={(e, { value }) =>
                handleNumberInputChange('totalFloors', value)
              }
              invalid={!!errors.totalFloors}
              invalidText={errors.totalFloors}
              allowEmpty={false}
              light
            />
          </Column>
          <Column lg={8} md={8} sm={4}>
            <NumberInput
              id="totalRooms"
              name="totalRooms"
              label="Total Rooms"
              min={1}
              step={1} // Translated
              value={formData.totalRooms}
              onChange={(e, { value }) =>
                handleNumberInputChange('totalRooms', value)
              }
              invalid={!!errors.totalRooms}
              invalidText={errors.totalRooms}
              allowEmpty={false}
              light
            />
          </Column>

          {/* --- Section: Disclaimer --- */}
          <Column
            lg={16}
            md={8}
            sm={4}
            style={{ marginTop: '2rem', marginBottom: '1rem' }}
          >
            <h4
              style={{
                textAlign: 'left',
                borderBottom: '1px solid #555',
                paddingBottom: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              Disclaimer
            </h4>
          </Column>
          <Column lg={16} md={8} sm={4}>
            <TextArea
              id="disclaimer"
              name="disclaimer"
              labelText="Disclaimer" // Translated
              value={formData.disclaimer}
              onChange={handleChange}
              invalid={!!errors.disclaimer}
              invalidText={errors.disclaimer}
              rows={4}
              light
            />
          </Column>

          {/* --- Submission Area & Notifications --- */}
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
            {loading && (
              <Loading description="Saving hotel..." withOverlay={false} />
            )}{' '}
            {/* Translated */}
            {submitStatus === 'success' && (
              <InlineNotification
                kind="success"
                title="Success!"
                subtitle="Hotel saved successfully. Redirecting..."
                onClose={() => setSubmitStatus(null)}
                lowContrast
                style={{ marginBottom: '1rem' }}
              /> // Translated
            )}
            {submitStatus === 'error' && (
              <InlineNotification
                kind="error"
                title="Save Error"
                subtitle={errors.api || 'Could not save hotel.'}
                onClose={() => {
                  setSubmitStatus(null);
                  setErrors((prev) => ({ ...prev, api: undefined }));
                }}
                lowContrast
                style={{ marginBottom: '1rem' }}
              /> // Translated
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Hotel'}{' '}
              {/* Translated - TODO: Adjust text for edit mode */}
            </Button>
          </Column>
        </Grid>
      </Form>
    </div>
  );
}

// --- Keep the same handlers logic (already English or standard names) ---
// const handleChange = (e) => { ... };
// const handleDropdownChange = (field, { selectedItem }) => { ... };
// const handleNumberInputChange = (fieldName, value) => { ... };
// const validateForm = () => { ... };
// ------------------------------------------------------

export default HotelForm;
