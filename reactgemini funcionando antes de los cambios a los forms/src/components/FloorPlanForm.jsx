// src/components/FloorPlanForm.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Form,
  FormGroup,
  TextInput,
  NumberInput,
  Button,
  Grid,
  Column,
  InlineNotification,
  Loading,
  IconButton,
} from '@carbon/react';
import { Add, TrashCan } from '@carbon/icons-react';

// Estado inicial para UNA fila de plano
const initialFloorPlanRow = {
  building: '',
  floorNumber: '', // Guardar como string por el input, convertir al enviar
  planUrl: '',
  tempId: Date.now() + Math.random(),
};

function FloorPlanForm() {
  const { hotelId } = useParams();

  const [floorPlans, setFloorPlans] = useState([
    { ...initialFloorPlanRow, tempId: Date.now() }, // Empezar con una fila
  ]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // --- Handlers para la Lista ---
  const handleAddRow = () => {
    setFloorPlans((prev) => [
      ...prev,
      { ...initialFloorPlanRow, tempId: Date.now() },
    ]);
  };

  const handleRemoveRow = (indexToRemove) => {
    setFloorPlans((prev) => prev.filter((_, index) => index !== indexToRemove));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      Object.keys(newErrors)
        .filter((key) => key.startsWith(`floorPlans[${indexToRemove}].`))
        .forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  };

  const handleInputChange = (index, fieldName, value) => {
    setFloorPlans((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [fieldName]: value } : row))
    );
    const errorKey = `floorPlans[${index}].${fieldName}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // --- Validación (para todas las filas) ---
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    floorPlans.forEach((fp, index) => {
      if (!fp.building?.trim()) {
        newErrors[`floorPlans[${index}].building`] = 'Edificio obligatorio.';
        isValid = false;
      }
      const parsedFloor = parseInt(fp.floorNumber, 10);
      if (fp.floorNumber === '' || isNaN(parsedFloor)) {
        newErrors[`floorPlans[${index}].floorNumber`] =
          'Piso obligatorio y numérico.';
        isValid = false;
      }
      if (!fp.planUrl?.trim()) {
        newErrors[`floorPlans[${index}].planUrl`] = 'URL obligatoria.';
        isValid = false;
      } else {
        try {
          new URL(fp.planUrl);
        } catch (_) {
          newErrors[`floorPlans[${index}].planUrl`] =
            'Formato de URL inválido.';
          isValid = false;
        }
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  // --- Envío (envía el array completo) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrors({});

    if (!validateForm() || !hotelId) {
      if (!hotelId)
        setErrors((prev) => ({ ...prev, api: 'ID del hotel no encontrado.' }));
      setSubmitStatus('error');
      return;
    }

    setLoading(true);
    const payload = floorPlans.map((fp) => ({
      building: fp.building,
      floorNumber: parseInt(fp.floorNumber, 10),
      planUrl: fp.planUrl,
    }));

    const apiUrl = `http://localhost:8090/api/floorplan/batch/hotel/${hotelId}`;
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
        let errorMsg = `Error HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || JSON.stringify(errorData);
        } catch (err) {
          errorMsg += ` - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }
      const result = await response.json();
      console.log('Planos guardados:', result);
      setSubmitStatus('success');
      // Limpiar el formulario después del éxito para empezar un nuevo lote
      setFloorPlans([{ ...initialFloorPlanRow, tempId: Date.now() }]);
    } catch (error) {
      console.error('Error al guardar planos:', error);
      setSubmitStatus('error');
      setErrors((prev) => ({
        ...prev,
        api: error.message || 'Ocurrió un error al guardar los planos.',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>
        Gestionar Planos para Hotel ID: {hotelId}
      </h3>
      <Form onSubmit={handleSubmit}>
        {floorPlans.map((fp, index) => (
          <Grid
            key={fp.tempId}
            narrow
            style={{
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px dashed #555',
            }}
          >
            <Column lg={1} md={1} sm={4}>
              <h4 style={{ marginTop: '1.5rem' }}>#{index + 1}</h4>
            </Column>
            <Column lg={4} md={3} sm={4}>
              <TextInput
                id={`fp-building-${index}`}
                name="building"
                labelText="Edificio (Obligatorio)"
                value={fp.building}
                onChange={(e) =>
                  handleInputChange(index, 'building', e.target.value)
                }
                invalid={!!errors[`floorPlans[${index}].building`]}
                invalidText={errors[`floorPlans[${index}].building`]}
                light
              />
            </Column>
            <Column lg={3} md={2} sm={4}>
              <NumberInput
                id={`fp-floor-${index}`}
                name="floorNumber"
                label="Piso (Obligatorio)"
                step={1}
                value={fp.floorNumber}
                onChange={(e, { value }) =>
                  handleInputChange(index, 'floorNumber', String(value))
                }
                invalid={!!errors[`floorPlans[${index}].floorNumber`]}
                invalidText={errors[`floorPlans[${index}].floorNumber`]}
                allowEmpty={false}
                light
              />
            </Column>
            <Column lg={6} md={4} sm={4}>
              <TextInput
                id={`fp-url-${index}`}
                name="planUrl"
                type="url"
                labelText="URL del Plano (Obligatoria)"
                value={fp.planUrl}
                onChange={(e) =>
                  handleInputChange(index, 'planUrl', e.target.value)
                }
                invalid={!!errors[`floorPlans[${index}].planUrl`]}
                invalidText={errors[`floorPlans[${index}].planUrl`]}
                helperText="Ingrese URL completa"
                light
              />
            </Column>
            <Column
              lg={2}
              md={2}
              sm={4}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '0.5rem',
              }}
            >
              {floorPlans.length > 1 && (
                <IconButton
                  kind="danger--ghost"
                  label="Eliminar Fila"
                  onClick={() => handleRemoveRow(index)}
                  disabled={loading}
                  renderIcon={TrashCan}
                  iconDescription="Eliminar Fila"
                  size="md"
                />
              )}
            </Column>
          </Grid>
        ))}
        <Button
          kind="secondary"
          renderIcon={Add}
          iconDescription="Añadir Plano"
          onClick={handleAddRow}
          style={{ marginTop: '1rem' }}
          disabled={loading}
        >
          Añadir Otro Plano
        </Button>
        <div
          style={{
            marginTop: '2rem',
            borderTop: '1px solid #888',
            paddingTop: '1.5rem',
          }}
        >
          {loading && (
            <Loading description="Guardando planos..." withOverlay={false} />
          )}
          {submitStatus === 'success' && (
            <InlineNotification
              kind="success"
              title="Éxito!"
              subtitle={`Lote de ${floorPlans.length} planos procesado correctamente.`}
              onClose={() => setSubmitStatus(null)}
              lowContrast
              style={{ marginBottom: '1rem' }}
            />
          )}
          {submitStatus === 'error' && (
            <InlineNotification
              kind="error"
              title="Error al guardar"
              subtitle={
                errors.api ||
                'No se pudo guardar el lote de planos. Revise los errores en las filas.'
              }
              onClose={() => {
                setSubmitStatus(null);
                setErrors((prev) => ({ ...prev, api: undefined }));
              }}
              lowContrast
              style={{ marginBottom: '1rem' }}
            />
          )}
          <Button type="submit" disabled={loading || floorPlans.length === 0}>
            {loading ? 'Guardando...' : 'Guardar Todos los Planos'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default FloorPlanForm;
