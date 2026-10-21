# Sprint Backlog --- Vendix

**Proyecto APT · Ingeniería en Informática · Duoc UC, sede Valparaíso**\
Versión 1.0 · Backlog inicial propuesto; actualizar estados según el
avance verificado.

## 1. Propósito

Este Sprint Backlog inicial organiza historias de usuario de Vendix y
sus criterios de aceptación. Se construyó a partir de los módulos
identificados en el frontend y de las capacidades descritas en el
backend entregado. No reemplaza el tablero real del equipo ni confirma
que una historia esté terminada.

## 2. Priorización

-   **Alta:** funciones centrales necesarias para operar con productos,
    ventas e inventario.
-   **Media:** funciones de apoyo y consulta.

La prioridad es una propuesta inicial y debe validarse con el equipo y
la pauta de evaluación.

## 3. Historias de usuario

### HU-01 --- Iniciar sesión · Prioridad: Alta

**Historia:** Como usuario, quiero iniciar sesión para acceder a las
funciones del sistema de forma controlada.

**Criterios de aceptación:** Con credenciales válidas, el sistema
permite el acceso; con credenciales inválidas, muestra un mensaje claro;
las rutas protegidas no deben quedar accesibles sin autorización.

**Estado inicial:** Por verificar en integración

**Nota de verificación:** El backend incluye autenticación con JWT.
Verificar que el frontend use la API real y no solamente autenticación
simulada/localStorage.

### HU-02 --- Gestionar productos · Prioridad: Alta

**Historia:** Como vendedor, quiero registrar, consultar, modificar y
eliminar productos para mantener actualizado mi catálogo.

**Criterios de aceptación:** Los campos obligatorios se validan; los
cambios confirmados se guardan en MySQL; los errores se informan de
forma comprensible.

**Estado inicial:** Backend contemplado; integración por verificar

**Nota de verificación:** Comprobar los endpoints de productos y el
flujo desde la interfaz.

### HU-03 --- Registrar ventas · Prioridad: Alta

**Historia:** Como vendedor, quiero registrar una venta para mantener un
historial de mis operaciones.

**Criterios de aceptación:** Se registran los productos, cantidades y
totales; se validan los datos; la venta queda persistida y puede
consultarse después.

**Estado inicial:** Backend contemplado; integración por verificar

**Nota de verificación:** Probar una venta completa con datos de prueba
y comprobar la persistencia.

### HU-04 --- Actualizar existencias · Prioridad: Alta

**Historia:** Como vendedor, quiero que el inventario refleje los
movimientos de productos para conocer las existencias disponibles.

**Criterios de aceptación:** Los movimientos de venta afectan el stock
según las reglas implementadas; no se permiten operaciones inválidas;
los cambios quedan reflejados en la base de datos.

**Estado inicial:** Backend contemplado; integración por verificar

**Nota de verificación:** Verificar las reglas reales de stock en
servicios y pruebas antes de marcar como terminado.

### HU-05 --- Consultar estadísticas y reportes · Prioridad: Media

**Historia:** Como vendedor, quiero consultar estadísticas de ventas e
inventario para entender el movimiento del negocio.

**Criterios de aceptación:** Los datos mostrados corresponden a las
respuestas de la API; los rangos o filtros disponibles se comportan
correctamente; los estados sin datos se muestran claramente.

**Estado inicial:** Por verificar

**Nota de verificación:** Comparar cifras de la interfaz con resultados
de la API y datos de prueba.

### HU-06 --- Consultar al asistente · Prioridad: Media

**Historia:** Como usuario, quiero hacer preguntas relacionadas con la
gestión del negocio para recibir orientación a partir de las capacidades
disponibles del sistema.

**Criterios de aceptación:** El endpoint responde con un mensaje; si la
integración con IA no está configurada, el comportamiento alternativo se
comunica adecuadamente; los errores no exponen claves ni detalles
sensibles.

**Estado inicial:** Backend contempla IA opcional y reglas; integración
por verificar

**Nota de verificación:** No afirmar que la IA está activa hasta
configurar y probar el proveedor.

### HU-07 --- Revisar el estado del sistema · Prioridad: Media

**Historia:** Como integrante del equipo, quiero comprobar si la API
está disponible para facilitar la verificación del entorno.

**Criterios de aceptación:** La ruta de salud devuelve una respuesta
coherente e informa el estado documentado de la API y dependencias.

**Estado inicial:** Por verificar mediante ejecución

**Nota de verificación:** Comprobar la ruta /api/salud con el backend
levantado.

## 4. Tareas técnicas transversales

-   [ ] Configurar variables de entorno sin versionar secretos.
-   [ ] Preparar MySQL y ejecutar el script de inicialización en un
    entorno de prueba.
-   [ ] Levantar el backend y comprobar la ruta de salud.
-   [ ] Configurar la URL de la API en el frontend y comprobar CORS.
-   [ ] Ejecutar las pruebas automáticas y el script de prueba de humo;
    guardar resultados reales.
-   [ ] Validar flujos desde la interfaz y comprobar que los datos
    persisten en MySQL.
-   [ ] Actualizar la documentación de API, modelo de datos e
    instalación cuando cambie el código.

## 5. Definición de terminado provisional

Una historia puede marcarse como terminada cuando cumple sus criterios
de aceptación, la validación pertinente se ha ejecutado y registrado,
los cambios están integrados, no quedan errores bloqueantes conocidos y
la documentación relevante está actualizada. La Definition of Done
formal se documentará por separado.

## 6. Seguimiento por sprint

Para cada sprint, el equipo debe seleccionar historias según capacidad y
prioridad, dividirlas en tareas concretas, asignar responsables, estimar
esfuerzo y actualizar el estado con evidencia. No se asignan fechas,
puntos ni sprints ficticios en este documento porque no se proporcionó
el tablero histórico del equipo.
