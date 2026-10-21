# Diagramas UML y arquitectura --- Vendix

**Proyecto APT · Ingeniería en Informática · Duoc UC, sede Valparaíso**\
Versión 1.0

Estos diagramas resumen el diseño conocido de Vendix a partir de la
descripción del proyecto y de los componentes identificados en el
backend. Son una base documental: antes de usarlos como representación
definitiva, comparar el diagrama entidad-relación con
`database/schema.sql` y revisar los nombres exactos de tablas, columnas
y relaciones. Los diagramas de casos de uso y arquitectura describen el
alcance previsto y no prueban por sí mismos que todas las funciones
estén integradas.

## 1. Diagrama de casos de uso (vista funcional)

``` mermaid
flowchart LR
    V["Vendedor / Usuario"]
    A["Autenticación"]
    P["Gestionar productos"]
    S["Registrar y consultar ventas"]
    I["Consultar inventario"]
    R["Consultar estadísticas y reportes"]
    AI["Consultar asistente"]
    H["Consultar estado de API"]

    V --> A
    V --> P
    V --> S
    V --> I
    V --> R
    V --> AI
    V --> H
```

**Lectura:** el usuario interactúa con las funciones de autenticación,
productos, ventas, inventario, reportes y asistente. La disponibilidad
real de cada caso de uso debe validarse en la aplicación integrada.

## 2. Diagrama de arquitectura (vista de componentes)

``` mermaid
flowchart TD
    U["Usuario"]
    FE["Frontend<br/>React + Vite"]
    API["Backend<br/>Node.js + Express<br/>API REST"]
    AUTH["Autenticación<br/>JWT"]
    SVC["Servicios y rutas<br/>de negocio"]
    DB[("MySQL")]
    LLM["Proveedor de IA opcional"]

    U --> FE
    FE -->|"HTTP / JSON"| API
    API --> AUTH
    API --> SVC
    SVC --> DB
    SVC -.->|"si está configurado"| LLM
```

**Lectura:** el frontend React se comunica con la API REST Express
usando HTTP/JSON. El backend aplica autenticación y lógica de negocio y
consulta MySQL. La conexión con un proveedor de IA es opcional y depende
de la configuración.

## 3. Diagrama entidad-relación (modelo de datos)

``` mermaid
erDiagram
    USUARIOS ||--o{ PRODUCTOS : administra
    USUARIOS ||--o{ VENTAS : registra
    VENTAS ||--|{ DETALLE_VENTAS : contiene
    PRODUCTOS ||--o{ DETALLE_VENTAS : aparece_en
    PRODUCTOS ||--o{ MOVIMIENTOS_STOCK : registra

    USUARIOS {
        int id_usuario PK
        string nombre
        string correo
        string password_hash
    }
    PRODUCTOS {
        int id_producto PK
        int id_usuario FK
        string nombre
        decimal precio
        int stock
    }
    VENTAS {
        int id_venta PK
        int id_usuario FK
        datetime fecha
        decimal total
    }
    DETALLE_VENTAS {
        int id_detalle PK
        int id_venta FK
        int id_producto FK
        int cantidad
        decimal precio_unitario
    }
    MOVIMIENTOS_STOCK {
        int id_movimiento PK
        int id_producto FK
        string tipo
        int cantidad
        datetime fecha
    }
```

**Importante:** los nombres de campos de este esquema son
representativos para explicar las relaciones previstas. Deben
confirmarse con `database/schema.sql` antes de entregar este diagrama
como modelo exacto de la base de datos. El backend ya contiene
`docs/er.mmd` y `docs/modelo-entidad-relacion.png`; si estos
corresponden al esquema vigente, conviene priorizarlos y no mantener dos
diagramas divergentes.

## 4. Archivos incluidos

-   `Diagramas_UML_Vendix.md`: los tres diagramas en Mermaid,
    renderizables en GitHub.
-   `casos_de_uso.mmd`: fuente del diagrama de casos de uso.
-   `arquitectura.mmd`: fuente del diagrama de arquitectura.
-   `modelo_datos_referencia.mmd`: modelo de datos de referencia,
    pendiente de cotejo con el esquema real.

## 5. Verificación antes de entregar

-   [ ] Confirmar los nombres exactos de tablas y columnas con
    `database/schema.sql`.
-   [ ] Revisar que la arquitectura coincida con los archivos y
    servicios actuales.
-   [ ] Confirmar qué módulos están conectados desde el frontend.
-   [ ] Sustituir cualquier relación o función que no corresponda al
    código vigente.
