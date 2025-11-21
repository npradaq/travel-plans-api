Travel Plans API — NestJS, MongoDB, Pruebas, Pipes, Guards y Middleware

Proyecto desarrollado en NestJS siguiendo las prácticas vistas en clase. Incluye consumo de una API externa, persistencia en MongoDB, validación mediante Pipes, middleware de logging, Guards de API Key y pruebas unitarias completas.

Tecnologías utilizadas

- NestJS
- MongoDB + Mongoose
- Axios / HttpModule
- Jest
- Pipes personalizados
- Middleware de logging
- Guards de seguridad (API Key)

Instalación
1. Clonar repositorio

git clone https://github.com/npradaq/travel-plans-api.git
cd travel-plans-api

2. Instalar dependencias

npm install

3. Iniciar MongoDB local

MongoDB Compass o MongoDB Server deben estar corriendo.

4. Ejecutar la aplicación

npm run start:dev

La API estará disponible en: http://localhost:3000


Arquitectura del proyecto

src/
 ├── app.module.ts
 ├── common/
 │   ├── middlewares/
 │   │     └── logging.middleware.ts
 │   ├── guards/
 │   │     └── api-key.guard.ts
 │   └── pipes/
 │         └── country-code.pipe.ts
 ├── countries/
 │   ├── countries.module.ts
 │   ├── countries.service.ts
 │   ├── countries.controller.ts
 │   ├── providers/restcountries.provider.ts
 │   └── schemas/country.schema.ts
 ├── travel-plans/
 │   ├── travel-plans.module.ts
 │   ├── travel-plans.service.ts
 │   ├── travel-plans.controller.ts
 │   ├── pipes/date-range.pipe.ts
 │   └── schemas/travel-plan.schema.ts
 └── test/


Countries API (integración con RestCountries)

La API obtiene información de países consumiendo: https://restcountries.com/v3.1/alpha/{code}

Los países se almacenan en caché (MongoDB) para evitar solicitudes repetidas.

Endpoints principales

GET /countries
Obtiene todos los países almacenados en MongoDB.

GET /countries/:code
Obtiene un país por código alpha-3.

Este endpoint usa CountryCodePipe, que:
- Convierte el código a mayúsculas
- Valida que tenga exactamente tres letras A–Z
- Si es inválido, devuelve un 400 Bad Request

Ejemplo: GET /countries/COL

Travel Plans API
Seguridad con API Key

Todos los endpoints bajo /travel-plans están protegidos por un Guard que valida:
x-api-key: api-key
Si falta o es incorrecta, retorna 401 Unauthorized.


POST /travel-plans

Crea un nuevo plan de viaje.

Este endpoint usa DateRangePipe, que valida:
- startDate y endDate deben ser fechas válidas
- startDate debe ser menor o igual a endDate
- Si la validación falla, retorna 400 Bad Request

Además:
- Valida que el país exista usando CountriesService
- Guarda el plan en MongoDB

Ejemplo de body:
{
  "countryCode": "COL",
  "title": "Viaje a Bogotá",
  "startDate": "2025-03-01",
  "endDate": "2025-03-05",
  "notes": "Visitar Monserrate"
}

GET /travel-plans

Devuelve todos los planes guardados en la base de datos.

Seguridad: API Key Guard

Archivo: src/common/guards/api-key.guard.ts
Valida que el request incluya el header:x-api-key

Si falta o no coincide con la clave definida, retorna 401 Unauthorized.


Middleware de Logging

Archivo: src/common/middlewares/logging.middleware.ts

Registra en consola:
- Método HTTP
- URL
- Timestamp
- Headers
- Body del request (si existe)
- Código de respuesta
- Tiempo total de ejecución en milisegundos

ejemplo:
[Request] POST /travel-plans - 2025-11-20T17:22:11.392Z
[Request Headers] {...}
[Request Body] {...}
[Response] POST /travel-plans - Status: 201 - 12ms


Pruebas Unitarias (Jest)

Las pruebas incluyen:

CountriesService
- Manejo de caché
- Integración con API RestCountries
- Manejo de errores

CountriesController
- Delegación hacia el servicio

TravelPlansService
- Validación del país
- Manejo de fechas
- Persistencia en MongoDB

TravelPlansController
- Delegación
- Verificación de API key

Ejecutar pruebas:
npm run test


Notas finales

El proyecto está preparado siguiendo buenas prácticas de NestJS:
- Arquitectura modular
- Pipes para validación
- Guards de seguridad
- Middleware personalizado
- Consumo de APIs externas
- Manejo adecuado de excepciones
- Pruebas unitarias completas