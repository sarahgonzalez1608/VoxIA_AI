# VoxIA AI — Tienda ficticia para el laboratorio de Google Analytics 4

Sitio **académico de simulación** del Diplomado en E-commerce y Negocios Internacionales Digitales.
Vende (de mentira) suscripciones SaaS y servicios de chatbots y agentes de voz con IA.
**No procesa pagos, no tiene servidor ni base de datos y no pide ni guarda datos personales.**

Solo HTML, CSS y JavaScript puros: sin npm, sin frameworks y sin compilación.

## Estructura

```
index.html        Catálogo (+ banner del cupón BIENVENIDA10)
producto.html     Detalle: producto.html?id=VOX-001
carrito.html      Carrito y cupón
checkout.html     Checkout en dos pasos (Envío → Pago simulado)
gracias.html      Confirmación (envía purchase una sola vez)
css/estilos.css   Estilos (incluye el monitor de eventos)
js/config.js      ← ÚNICO archivo que debes editar
js/analytics.js   Carga GA4, envía eventos y dibuja el monitor
js/productos.js   Los 8 productos (VOX-001 … VOX-008)
js/carrito.js     Carrito en localStorage, cupón e ítems GA4
js/pag-*.js       Un script por página
```

## 1. Configurar tu ID de medición

1. En Google Analytics: **Administrar → Flujos de datos →** tu flujo web → copia el **ID de medición** (`G-…`).
2. Abre `js/config.js` y reemplaza `G-XXXXXXXXXX`:

```js
window.TIENDA_CONFIG = { GA_MEASUREMENT_ID: "G-ABC123XYZ9", DEBUG_MODE: true };
```

- Con el marcador `G-XXXXXXXXXX` **no se carga gtag.js**: el monitor muestra un aviso rojo y los eventos solo se ven allí.
- `DEBUG_MODE: true` envía `debug_mode` y verás los eventos en **Administrar → DebugView**. Con `false` no se envía.

## 2. Probar

1. Abre la tienda publicada (o localmente con `python3 -m http.server` y entra a `http://localhost:8000`).
2. Recorre: catálogo → producto → carrito → checkout → gracias. El **monitor de la derecha** lista los últimos 12 eventos (se conservan entre páginas).
3. Confirma en **DebugView** (GA4) o con Tag Assistant.
4. Para empezar como persona nueva usa **Simular nuevo visitante** (borra cookies `_ga*`, carrito y sessionStorage).
5. Para probar el origen de la visita entra con UTM, por ejemplo: `/?utm_source=linkedin&utm_medium=social&utm_campaign=lab_ga4`.

## 3. Contrato de medición (12 eventos)

Todos llevan `currency: "COP"`. Cada ítem lleva `item_id, item_name, item_brand, item_category, price, quantity, index`.

| Evento | Cuándo | Parámetros clave |
|---|---|---|
| `view_item_list` | Al cargar el catálogo | item_list_id `catalogo_principal`, item_list_name, items |
| `view_promotion` | Al mostrar el banner | promotion_id `BIENVENIDA10`, promotion_name, creative_name, creative_slot, items |
| `select_promotion` | Clic en el banner (aplica cupón y va al carrito) | igual que view_promotion |
| `select_item` | Clic en un producto, antes de navegar | item_list_id, item_list_name, items |
| `view_item` | Al abrir el detalle | value, items |
| `add_to_cart` | Al agregar o aumentar unidades | value, items (quantity = unidades agregadas) |
| `remove_from_cart` | Al quitar o disminuir unidades | value, items |
| `view_cart` | Al abrir el carrito con productos | value, coupon (si existe), items |
| `begin_checkout` | Al abrir checkout.html | value, coupon, items |
| `add_shipping_info` | Clic en "Continuar al pago" | value, coupon, items, shipping_tier |
| `add_payment_info` | Clic en "Pagar (simulado)" | value, coupon, payment_type, items |
| `purchase` | Al cargar gracias.html (una vez por pedido) | transaction_id, affiliation, value, shipping, coupon, tipo_cliente, items |

Además: `gtag('set','user_properties',{ tipo_cliente })` al confirmar el envío y antes de `purchase`.

`shipping_tier` toma uno de: `Nacional - Estándar`, `Nacional - Express`, `Internacional - Estándar`, `Internacional - Express`.

**Con cupón** el ítem lleva `price` = precio unitario con descuento, `discount` = descuento por unidad y `coupon`.

### Decisiones de diseño (por si las preguntan en clase)
- Los eventos de catálogo (`view_item_list`, `select_item`, `view_item`, `view_promotion`, `select_promotion`) usan **precio de lista**; los eventos de carrito y compra usan el **precio con descuento** si el cupón está activo.
- `value` de `purchase` = productos con descuento **sin envío**; el envío va en `shipping`.
- Envío gratis (Nacional Estándar) cuando el valor de los productos **ya con descuento** es ≥ $150.000.
- `view_promotion` se envía una vez por carga del catálogo (el banner está arriba, siempre visible).
- El nombre del checkout es ficticio y **no se guarda ni se envía**.
- Recargar `gracias.html` no repite `purchase`: el pedido se marca como enviado en sessionStorage.

## 4. Publicar: GitHub (desde el navegador) + Vercel

**GitHub**
1. Entra a github.com → **New repository** → nombre `voxia-ai` → público → **Create repository**.
2. En el repositorio: **Add file → Upload files**.
3. Descomprime el .zip y arrastra **el contenido** de la carpeta `VoxIA-AI` (que `index.html` quede en la raíz del repositorio, junto con las carpetas `css` y `js`).
4. **Commit changes**.

**Vercel**
1. Entra a vercel.com e inicia sesión con GitHub → **Add New… → Project**.
2. Importa el repositorio `voxia-ai`.
3. **Framework Preset: Other**. Deja vacíos Build Command y Output Directory.
4. **Deploy**. Te dará una URL tipo `https://voxia-ai.vercel.app`.

Para cambiar el ID más tarde: edita `js/config.js` en GitHub (ícono del lápiz) → Commit; Vercel republica solo.

> Sitio académico de simulación. No procesa pagos ni guarda datos personales. Usa Google Analytics 4.
