/* =====================================================================
   CONFIGURACIÓN DE LA TIENDA — este es el ÚNICO archivo que debes editar.

   DÓNDE PEGAR EL ID DE MEDICIÓN DE GOOGLE ANALYTICS 4:
   1. Entra a Google Analytics → Administrar (engranaje) → Flujos de datos.
   2. Abre tu flujo web y copia el "ID de medición" (empieza por G-).
   3. Pégalo abajo, entre las comillas, reemplazando G-XXXXXXXXXX.
   4. Guarda el archivo (y vuelve a subirlo a GitHub para que Vercel lo publique).

   Mientras el ID siga siendo G-XXXXXXXXXX NO se carga gtag.js y los
   eventos solo se ven en el monitor del lado derecho de la tienda.

   DEBUG_MODE:
   - true  → los eventos aparecen en Administrar → DebugView (para clase).
   - false → modo normal (sin debug_mode).
   ===================================================================== */
window.TIENDA_CONFIG = {
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX",
  DEBUG_MODE: true
};
