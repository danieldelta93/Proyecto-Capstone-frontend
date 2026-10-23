# Vendix — Frontend

Aplicación en React (Vite) del sistema de gestión de ventas e inventario
para vendedores ambulantes y pymes — Proyecto APT, Ingeniería en
Informática, Duoc UC Valparaíso.

## Módulos incluidos

- **Login / cuentas**: cada persona crea su cuenta o inicia sesión, y
  ve solo sus propios productos y ventas.
- **Inventario**: alta, edición y eliminación de productos (CRUD) con
  precio de compra, precio de venta y ganancia por unidad, con
  búsqueda, filtros por categoría y por stock bajo, orden, vista de lista
  o de tarjetas y botón "Ver más" para inventarios grandes.
- **Ventas**: registro de ventas con descuento automático de stock, resumen
  del período, filtros por período y método de pago, historial agrupado
  por día y anulación de ventas (el stock vuelve al inventario).
- **Panel**: dashboards (Chart.js) de ventas por día, **inversión y
  ganancia**, productos más vendidos, ticket promedio y alertas de stock
  bajo.
- **Asistente**: chat que responde preguntas en lenguaje natural sobre tus
  ventas e inventario (las respuestas las genera el backend).
- **Reportes**: exportación a CSV (Excel) y a PDF (impresión).

## Conexión con el backend

Esta app **no guarda datos en el navegador**: todo (cuentas, productos, ventas, panel y asistente) se
pide y se guarda en el backend (repo `Proyecto-Capstone-backend`: API REST con Node.js, Express y MySQL).
Por eso necesitas tener el backend encendido para usarla.

- **Cuentas:** al registrarte o iniciar sesión, el backend entrega un token de sesión que se guarda en
  este navegador (`vendix_token`). Las contraseñas nunca se guardan aquí. Si el token vence, la app vuelve
  sola al login.
- **Datos:** cada cuenta ve solo lo suyo y puede entrar desde cualquier dispositivo.
- **Panel y asistente:** los números (ventas por día, inversión y ganancia, más vendidos, tendencia frente al
  período anterior) los calcula el servidor con consultas SQL.
- **Dirección de la API:** en desarrollo no hay que configurar nada, porque Vite reenvía `/api` a
  `http://localhost:3000` (ver `vite.config.js`). Al publicar la app, define `VITE_API_URL` (ver `.env.example`).
- **Sin internet:** la app instalable (PWA) abre sin conexión, pero necesita conexión con el servidor para
  mostrar y guardar datos. Las respuestas de la API nunca se guardan en la caché del navegador.
- Las ventas se piden al servidor hasta un máximo de 500 (las más recientes).

## Precio de compra, precio de venta y ganancia

Cada producto tiene un **precio de compra** (lo que te cuesta) y un
**precio de venta** (lo que cobras). Ejemplo: compras a $3.000 y vendes a
$5.000, entonces ganas $2.000 por unidad (margen de 40%). Al escribir los
dos precios, el formulario muestra la ganancia al instante.

- **Al vender**, cada ítem guarda el precio de compra de ese momento
  (`costoUnit`), así la ganancia de una venta no cambia si después cambias
  el costo del producto.
- **Panel → "Inversión y ganancia"**: barras apiladas por día. *Invertido*
  es lo que costó la mercadería vendida en el período; *invertido +
  ganancia = total vendido*. También muestra el margen y cuánto dinero
  tienes en mercadería (stock a precio de compra).
- **Productos o ventas antiguas** (hechos antes de existir el precio de
  compra): los productos muestran "Falta el precio de compra" hasta que los
  edites. Las ventas antiguas usan el costo actual del producto; si el
  producto no tiene costo, esa venta no entra en los cálculos y el Panel lo
  avisa.
- Los reportes CSV incluyen precio de compra, ganancia por unidad, invertido
  y ganancia por venta, y el asistente responde "¿Cuánto gané esta semana?".

## Web y "app" instalable (PWA)

El proyecto es una Progressive Web App: funciona como sitio web normal
y además se puede instalar desde el navegador, tanto en celular como
en computador, sin pasar por una tienda de aplicaciones.

- **Android / Chrome / Edge (celular o PC)**: al entrar al sitio
  aparece un botón de instalar en el encabezado de la app (o el ícono
  de instalación en la barra de direcciones). Al tocarlo, se agrega
  como app con ícono propio.
- **iPhone / iPad (Safari)**: iOS no permite ese botón automático. La
  app muestra un aviso indicando: toca **Compartir → Agregar a
  inicio**.
- Una vez instalada, abre en su propia ventana (sin la barra del
  navegador) y el ícono queda en el escritorio o launcher del
  celular.

Esto requiere que el sitio esté servido por HTTPS (o `localhost` para
pruebas). Para probar la instalación de forma realista, usa la
versión de producción:

```bash
npm run build
npm run preview
```

y abre la URL de `preview` en Chrome/Android para ver el botón de
instalar.

### "Sigo viendo una versión vieja de la app"

Si alguna vez probaste `npm run build` + `npm run preview` (o
instalaste la app), el navegador puede haber guardado esa versión en
caché (eso es justamente lo que permite que funcione sin internet). Si
después actualizas el código y ves que faltan cambios — por ejemplo,
no aparece el login — probablemente estás viendo esa versión guardada,
no el código actual. Para forzar la versión más nueva:

- Haz un refresco "duro": `Ctrl/Cmd + Shift + R`, o
- Abre las herramientas de desarrollador → pestaña **Application** →
  **Service Workers** → botón **Unregister**, y recarga, o
- Si la instalaste como app, desinstálala y vuelve a instalarla.

Esto solo pasa en el navegador donde la probaste; a cualquier otra
persona que entre por primera vez le va a cargar siempre la versión
actual.

## Cómo instalar y correr

Necesitas [Node.js](https://nodejs.org/) 18 o superior y **el backend encendido** (ver el README del
repo del backend: MySQL + `npm run dev`).

Con el backend corriendo en `http://localhost:3000`, en otra terminal:

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`), crea tu cuenta y listo.

Otros comandos:

```bash
npm run build     # genera la versión de producción en /dist
npm run preview   # sirve la carpeta /dist para probarla
```

Si ves "No se pudo conectar con el servidor", el backend está apagado: enciéndelo y toca **Reintentar**.

## Organización del código: cada componente en su carpeta

Cada componente vive en su propia carpeta con su `.jsx` **y su propio
`.css`** al lado — no hay un archivo gigante de estilos con todo
mezclado. Cada componente importa su propio CSS (`import
"./Nombre.css"`) al principio de su archivo.

Solo quedan afuera, en `src/styles/`, dos archivos chicos que son
compartidos **por necesidad técnica y de diseño**, no por comodidad:

- `styles/variables.css` — la paleta de colores (modo claro/oscuro).
  Son variables CSS (`--primary`, `--bg`, etc.): para que cascadeen a
  todos los componentes tienen que declararse una sola vez; no se
  pueden "repartir" entre carpetas.
- `styles/base.css` — un reset mínimo más las piezas de UI realmente
  genéricas que se repiten tal cual en varias pantallas distintas
  (botón, input, tarjeta, badge, modal, el toggle de pestañas, los
  estados vacíos). Por ejemplo el mismo `.btn-primary` se usa en
  Inventario, Ventas, Reportes y en el Login: vive una vez en
  `base.css` en lugar de copiarse y pegarse en cuatro archivos.

Todo lo demás — el diseño del encabezado, el chat del asistente, las
tarjetas del panel, la pantalla de login, etc. — es exclusivo de su
componente y está en el `.css` de esa carpeta.

```
src/
  main.jsx                    punto de entrada (importa variables.css y base.css)
  App.jsx                     decide si mostrar Login o la app principal
  api/
    cliente.js                envía las peticiones a la API (token, errores)
    api.js                    una función por cada cosa que se pide al backend
    mapeos.js                 traduce nombres de campos entre la API y la interfaz
  MainApp.jsx, MainApp.css    layout general (el "shell" de la app) y sesión activa
  styles/
    variables.css             paleta de colores clara/oscura (única fuente)
    base.css                  reset + piezas de UI compartidas (botones, inputs, tarjetas...)
  utils/format.js, csv.js     formato de moneda/fechas, export CSV
  utils/finanzas.js           cálculos de inversión y ganancia
  hooks/
    useAuth.js                login/registro, token y sesión activa (con el backend)
    useInstallPrompt.js       detecta si la app se puede instalar (PWA)
    useToast.js               avisos breves (venta registrada, etc.)
  components/
    Header/Header.jsx + .css
    TabBar/TabBar.jsx + .css
    Toast/Toast.jsx + .css
    Icons/Icons.jsx           (íconos SVG en línea, sin CSS propio)
    Auth/Login.jsx + .css
    Inventario/
      Inventario.jsx + .css
      ProductModal.jsx        (reutiliza los estilos de modal/formulario de base.css)
    Ventas/
      Ventas.jsx + .css
      NuevaVentaModal.jsx + .css
    Panel/Panel.jsx + .css
    Asistente/Asistente.jsx + .css
    Reportes/Reportes.jsx + .css
```

## Próximos pasos

- Publicar el backend y el frontend en la nube (con HTTPS) y definir `VITE_API_URL`.
- Conectar el asistente a un proveedor de IA real configurando `LLM_API_KEY` en el backend (hoy responde con reglas).
- Pruebas de usabilidad con vendedores reales.
- Devoluciones parciales y reportes generados en el servidor.
