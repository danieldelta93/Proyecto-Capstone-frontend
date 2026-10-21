# Plan de Pruebas --- Vendix

**Proyecto APT · Ingeniería en Informática · Duoc UC, sede Valparaíso**\
Versión 1.0

Este plan define pruebas funcionales iniciales para Vendix. Los
resultados no se han marcado como aprobados: deben ejecutarse en el
entorno del equipo y registrarse con evidencia. Los pasos deben
ajustarse si la implementación real difiere de la descripción o si el
entorno de prueba requiere otros datos.

## 1. Objetivo

Comprobar de forma ordenada los flujos principales de autenticación,
productos, ventas, inventario, estadísticas, asistente y disponibilidad
de la API.

## 2. Alcance

Incluye pruebas funcionales manuales y verificaciones de persistencia.
Se recomienda ejecutarlas primero en un entorno de prueba con datos
ficticios, no sobre datos reales de negocio.

## 3. Condiciones previas

-   [ ] Tener las dependencias del backend y frontend instaladas.
-   [ ] Configurar el archivo `.env` con valores de prueba y sin
    compartir secretos.
-   [ ] Tener MySQL disponible y el esquema inicializado.
-   [ ] Levantar backend y frontend, y confirmar la URL de la API.
-   [ ] Preparar una cuenta y productos de prueba; anotar los datos
    iniciales de stock y ventas.

## 4. Casos de prueba

### CP-01 --- Inicio de sesión con credenciales válidas

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Ingresar credenciales de una cuenta de prueba existente y
enviar el formulario.

**Resultado esperado:** El sistema permite el acceso y muestra la vista
autorizada.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-02 --- Inicio de sesión con credenciales inválidas

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Ingresar una contraseña incorrecta para una cuenta de prueba.

**Resultado esperado:** El sistema rechaza el acceso y muestra un
mensaje claro sin exponer información sensible.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-03 --- Acceso a una ruta protegida sin sesión

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Intentar acceder a una función protegida sin token o sesión
válida.

**Resultado esperado:** La API rechaza la solicitud no autorizada.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-04 --- Crear un producto válido

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Enviar nombre, precio y demás campos obligatorios válidos a
través de la interfaz/API.

**Resultado esperado:** El producto se guarda y aparece en la consulta
posterior.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-05 --- Validación de producto inválido

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Enviar un producto con un campo obligatorio ausente o un
valor no permitido.

**Resultado esperado:** La solicitud se rechaza con un error de
validación comprensible.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-06 --- Registrar una venta válida

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Crear una venta de prueba con productos existentes y
cantidades válidas.

**Resultado esperado:** La venta se guarda, el total es coherente y el
inventario se actualiza según las reglas implementadas.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-07 --- Venta con stock insuficiente

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Intentar vender una cantidad mayor que las existencias
disponibles.

**Resultado esperado:** La operación se rechaza si esa es la regla
implementada y el stock no queda inconsistente.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar / confirmar regla

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-08 --- Consultar inventario

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Abrir el módulo de inventario y consultar las existencias de
un producto de prueba.

**Resultado esperado:** La interfaz muestra datos coherentes con la
respuesta de la API y la base de datos.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-09 --- Consultar estadísticas

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Consultar estadísticas con datos de ventas de prueba
conocidos.

**Resultado esperado:** Los valores mostrados coinciden con los datos
disponibles y los filtros usados.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-10 --- Asistente sin clave de IA

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Ejecutar una consulta al asistente sin configurar la clave
del proveedor de IA.

**Resultado esperado:** El backend utiliza el comportamiento alternativo
documentado o informa claramente que la función no está disponible.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-11 --- Ruta de salud de la API

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Con el backend iniciado, consultar GET /api/salud.

**Resultado esperado:** La API devuelve la respuesta de salud
documentada y refleja el estado de las dependencias según su
implementación.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

### CP-12 --- Persistencia tras reinicio

**Precondición:** Entorno de prueba disponible; preparar los datos
necesarios para este caso.

**Pasos:** Crear un producto de prueba, reiniciar el backend y consultar
el producto nuevamente.

**Resultado esperado:** El producto continúa disponible si la operación
fue confirmada en MySQL.

**Resultado real:** Completar después de ejecutar la prueba.

**Estado inicial:** Por ejecutar

**Evidencia:** Agregar captura, salida de consola, respuesta HTTP o
consulta de base de datos, según corresponda.

## 5. Registro de resultados

Utiliza uno de estos estados al ejecutar cada caso: **Aprobado**,
**Fallido**, **Bloqueado** o **No ejecutado**. Si falla, anota los pasos
reproducibles, el resultado obtenido y el defecto asociado. No cambies
el estado a Aprobado sin evidencia.

## 6. Criterio de cierre

El plan puede considerarse ejecutado cuando todos los casos aplicables
tienen un estado y evidencia o una justificación de bloqueo. Los fallos
que impidan cumplir los criterios de aceptación deben resolverse o
quedar declarados como pendientes antes de afirmar que el sistema está
validado.
