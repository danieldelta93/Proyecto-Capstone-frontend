# Proyecto-Capstone

# Vendix --- Sistema de gestión de ventas e inventario

Vendix es un proyecto académico desarrollado para el Proyecto APT de
Ingeniería en Informática de Duoc UC, sede Valparaíso. Su propósito es
apoyar a vendedores ambulantes y pequeñas empresas en la administración
de productos, inventario y ventas.

> **Estado del proyecto:** este repositorio contiene documentación y
> código de frontend y backend en desarrollo. La disponibilidad de cada
> función y la integración entre ambos componentes debe confirmarse
> ejecutando la aplicación. No se debe interpretar una función descrita
> como objetivo como una función ya integrada y validada.

## Objetivo

Desarrollar una aplicación que facilite el registro y seguimiento de
productos, ventas y existencias, y que entregue información útil para
apoyar la gestión cotidiana del negocio.

## Funcionalidades contempladas

-   Inicio de sesión y gestión de cuentas.
-   Administración de productos y precios.
-   Registro de ventas y actualización de existencias.
-   Visualización de estadísticas y reportes.
-   Alertas relacionadas con el inventario.
-   Asistente para consultas sobre los datos del negocio.

La implementación y el estado de integración de cada módulo deben
verificarse en el código y mediante pruebas.

## Arquitectura prevista

-   **Frontend:** React y Vite.
-   **Backend:** Node.js y Express, mediante una API REST.
-   **Base de datos:** MySQL.
-   **Asistente:** integración opcional con un proveedor compatible con
    la API de chat completions; el backend contempla respuestas basadas
    en reglas cuando no se configura una clave de IA.

Flujo general:

`Usuario → Frontend React → API REST (Express) → MySQL`

El asistente puede utilizar el servicio de IA cuando se configure y
habilite esa integración.

## Estructura del repositorio

La estructura puede variar según cómo esté organizado el repositorio
final. En el proyecto se han utilizado carpetas para el código y para
las entregas académicas, por ejemplo:

``` text
/
├── Codigo/                 # Frontend (si así está organizado el repositorio principal)
├── FASE 1/                 # Evidencias y documentos de la primera fase
├── FASE 2/                 # Evidencias y documentos de la segunda fase
├── FASE 3/                 # Evidencias y documentos de la tercera fase
└── README.md               # Presentación general del proyecto
```

El backend se mantiene también en un repositorio/carpeta separado. Su
estructura y pasos de ejecución están descritos en el README específico
del backend.

## Requisitos generales

-   Node.js compatible con la versión requerida por cada componente.
-   MySQL 8 para el backend.
-   Git.
-   Un navegador moderno.
-   (Opcional) Docker, si se desea levantar MySQL mediante el
    `docker-compose.yml` del backend.

Consulta el README de cada componente para ver los requisitos exactos y
sus comandos.

## Ejecución

### Frontend

Desde la carpeta que contiene el `package.json` del frontend:

``` bash
npm install
npm run dev
```

Estos comandos son los habituales en el proyecto React/Vite. Si los
scripts de `package.json` son diferentes, utiliza los que estén
definidos allí. Vite normalmente muestra en la terminal la dirección
local que se debe abrir en el navegador.

### Backend

Sigue las instrucciones de instalación, configuración de `.env`,
preparación de MySQL y arranque del servidor que aparecen en el README
del backend. No basta con iniciar el frontend para confirmar que la API
y la base de datos están conectadas.

## Variables de entorno y seguridad

-   No subas archivos `.env` con contraseñas, claves JWT ni claves de
    proveedores de IA.
-   Usa `.env.example` como referencia para configurar el backend.
-   Cambia los valores de ejemplo por secretos propios y no compartas
    esos secretos en capturas o documentos.
-   La autenticación de demostración del frontend, si todavía se utiliza
    de forma aislada, no debe considerarse equivalente a la
    autenticación segura del backend hasta que la integración haya sido
    comprobada.

## Pruebas y verificación

Antes de presentar una versión como funcional:

1.  Instala las dependencias de frontend y backend.
2.  Configura y comprueba la base de datos.
3.  Ejecuta las pruebas automáticas disponibles en el backend.
4.  Ejecuta el script de prueba de humo del backend.
5.  Comprueba desde el navegador los flujos principales.
6.  Verifica que las operaciones realizadas en la interfaz se reflejen
    correctamente en la API y en la base de datos.

Consulta la documentación de pruebas que acompaña al backend. No marques
las pruebas como aprobadas sin ejecutarlas y registrar sus resultados.

## Equipo

-   **Esteban Guajardo:** desarrollo frontend,  backend y  experiencia de usuario
    (UX/UI).
-   **Daniel Troncoso:** liderazgo técnico ,  bases de datos y componente de inteligencia
    artificial.

## Metodología

El proyecto se organiza utilizando Scrum, con trabajo dividido en tareas
y entregas iterativas. El estado de cada historia o tarea debe
mantenerse actualizado en el tablero o Sprint Backlog del equipo.

## Documentación relacionada

-   README específico del backend: instalación, variables de entorno,
    base de datos y pruebas.
-   `docs/API.md`: rutas y contratos de la API del backend.
-   `docs/ARQUITECTURA.md`: organización técnica del backend.
-   `docs/MODELO_DE_DATOS.md`: tablas y relaciones de la base de datos.
-   `docs/pruebas.http`: solicitudes manuales para verificar endpoints.

Las rutas anteriores corresponden a la carpeta `docs/` del backend.

## Licencia y uso

Proyecto académico de uso educativo. No se ha definido una licencia de
distribución en este README.
