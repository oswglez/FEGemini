// src/keycloak.js
import Keycloak from 'keycloak-js';

// Configuración con variables (mejor si usas variables de entorno .env)
const keycloakConfig = {
  url: 'http://localhost:8080/', // URL de tu servidor Keycloak (OJO: Keycloak suele correr en 8080 o 8443)
  realm: 'HotelApp', // Reemplaza con el nombre EXACTO de tu Realm
  clientId: 'expectra-fe-client', // Reemplaza con el Client ID EXACTO que creaste para React
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
