# Vendix — Prototipo frontend

Prototipo en React (Vite) del sistema de gestión de ventas e inventario
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
  del período, filtros por período y método de pago, e historial
  agrupado por día.
- **Panel**: dashboards (Chart.js) de ventas por día, **inversión y
  ganancia**, productos más vendidos, ticket promedio y alertas de stock
  bajo.
- **Asistente**: chat que responde preguntas en lenguaje natural
  calculando sobre los datos de ventas e inventario.
- **Reportes**: exportación a CSV (Excel) y a PDF (impresión).

## Cuentas y datos por usuario

Al abrir Vendix por primera vez se pide iniciar sesión o crear una
cuenta (nombre del negocio, tu nombre, correo electrónico y
contraseña). A partir de ahí, todo lo que agregues (productos, ventas)
queda asociado a ese correo y separado de las demás cuentas.

Cada cuenta nueva parte vacía: tú agregas tus propios productos y
ventas. (Las versiones anteriores traían una cuenta demo con datos de
ejemplo; ya no existe y, si había quedado guardada en tu navegador,
Vendix la borra sola al abrir.)

**Importante — esto es un prototipo, no un sistema de login real:**
las cuentas y contraseñas se guardan en el `localStorage` del propio
navegador, en texto plano, sin backend detrás. Sirve para que cada
persona vea sus propios datos en este dispositivo y para presentar el
proyecto, pero **no** es seguro para producción. Para el sistema
final se necesita un backend con autenticación real (contraseñas con
hash, tokens de sesión, base de datos), como se define en el diseño
de arquitectura del proyecto.

Los datos se guardan en el `localStorage` del
navegador, así que los cambios persisten solo en tu equipo. Este
prototipo es solo frontend: no hay backend ni base de datos real
todavía (ver "Próximos pasos").

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

### "No puedo entrar" (error de toLowerCase)

Si en algún momento probaste una versión anterior de Vendix en ese
mismo navegador (de cuando el login pedía "usuario" en vez de
"correo"), puede haber quedado guardada una cuenta vieja e
incompleta en el `localStorage`, y eso hacía fallar el login para
todos. Ya está arreglado: Vendix ahora
ignora automáticamente esas cuentas viejas e incompletas. Si de
todas formas ves algo raro, puedes borrarlas a mano: DevTools →
pestaña **Application** → **Local Storage** → tu sitio → elimina la
entrada `vendix_users` → recarga la página.

## Cómo instalar y correr

Necesitas [Node.js](https://nodejs.org/) 18 o superior instalado.

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente
`http://localhost:5173`).

Otros comandos:

```bash
npm run build     # genera la versión de producción en /dist
npm run preview   # sirve la carpeta /dist para probarla
```

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
  MainApp.jsx, MainApp.css    layout general (el "shell" de la app) y sesión activa
  styles/
    variables.css             paleta de colores clara/oscura (única fuente)
    base.css                  reset + piezas de UI compartidas (botones, inputs, tarjetas...)
  utils/format.js, csv.js     formato de moneda/fechas, export CSV
  utils/finanzas.js           cálculos de inversión y ganancia
  hooks/
    useAuth.js                cuentas, login/registro, sesión activa
    useLocalStorage.js        persistencia en el navegador
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
    Asistente/
      Asistente.jsx + .css
      respuestas.js           (lógica del asistente, sin JSX)
    Reportes/Reportes.jsx + .css
```

## Próximos pasos sugeridos (según el informe del proyecto)

- Reemplazar `hooks/useAuth.js` y `localStorage` por un backend real
  de autenticación (API REST en Node.js/Django + MySQL o Firebase
  Auth, según definan en el diseño de arquitectura), con contraseñas
  guardadas con hash.
- Reemplazar `data/mockData.js` y `localStorage` por llamadas a una
  API REST para productos y ventas.
- Definir el modelo de datos (diagrama entidad-relación) para
  productos, ventas y usuarios.
- Conectar el módulo Asistente a una API de IA real (OpenAI u otra)
  en vez de las respuestas basadas en reglas de `respuestas.js`.
