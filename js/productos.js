/* =====================================================================
   Catálogo Oficial — VoxIA AI S.A.S. (VoxIA Enterprise Multilingual Conversational AI)
   Sociedad Comercial S.A.S. · NIT 901.845.210-4 · Bogotá, Colombia
   Paleta Oficial: #051C3C | #0CBDAD | #062951 | #4433C0 | #FFFFFF
   Precios duales en COP y USD (TRM de referencia $1 USD = $4.100 COP)
   ===================================================================== */

window.MARCA = "VoxIA AI S.A.S.";

window.PRODUCTOS = [
  {
    id: "VOX-001",
    nombre: "Plan Starter — Chatbot Web Starter",
    categoria: "Suscripciones SaaS",
    precio: 615000,
    precioUSD: 150,
    siglas: "CW",
    tono: ["#051C3C", "#0CBDAD"],
    descripcion: "Chatbot con IA conversacional para sitios web con motor Cohere Command R+ y orquestación determinista Rasa CALM. Soporte en 95+ idiomas, hasta 100 páginas de base de conocimiento y cero alucinaciones. Suscripción mensual ($150 USD ~ $615.000 COP)."
  },
  {
    id: "VOX-002",
    nombre: "VoxIA Voice AI Agent Pro",
    categoria: "Agentes de voz",
    precio: 2460000,
    precioUSD: 600,
    siglas: "AV",
    tono: ["#4433C0", "#0CBDAD"],
    descripcion: "Agente de voz inteligente con latencia ultra-baja (<200ms, real 165ms) para atención de llamadas y telefonía IP. Síntesis hiperrealista y reconocimiento translingüe sin alucinaciones. Suscripción mensual ($600 USD ~ $2.460.000 COP + $0,08 USD/min)."
  },
  {
    id: "VOX-003",
    nombre: "Plan Growth — Omnicanal WhatsApp + CRM",
    categoria: "Suscripciones SaaS",
    precio: 1845000,
    precioUSD: 450,
    siglas: "WC",
    tono: ["#062951", "#4433C0"],
    descripcion: "IA unificada atendiendo Web, WhatsApp Business y CRM (Salesforce, HubSpot, SAP) con historial centralizado, Cross-Lingual RAG y vectorización Jina Embeddings v3. Suscripción mensual ($450 USD ~ $1.845.000 COP)."
  },
  {
    id: "VOX-004",
    nombre: "Telefonía IP con IA & Troncal SIP",
    categoria: "Telefonía IP",
    precio: 740000,
    precioUSD: 180,
    siglas: "TI",
    tono: ["#051C3C", "#062951"],
    descripcion: "Líneas IP simétricas conectadas a operadores colombianos regulados por la CRC (Claro Triara / ETB) con enrutamiento inteligente, transferencia supervisada y SLA 99.99%. Suscripción mensual ($180 USD ~ $740.000 COP)."
  },
  {
    id: "VOX-005",
    nombre: "Pack Inclusión Multilingüe 95+ (STRR)",
    categoria: "Complementos RSE",
    precio: 350000,
    precioUSD: 85,
    siglas: "ML",
    tono: ["#0CBDAD", "#4433C0"],
    descripcion: "Pilar de RSE: tokenización modular STRR para habilitar más de 95 idiomas y dialectos sin sobrecosto discriminatorio para PYMEs exportadoras y lenguas nativas. Complemento mensual ($85 USD ~ $350.000 COP)."
  },
  {
    id: "VOX-006",
    nombre: "VoxIA Enterprise CALM Integration",
    categoria: "Servicios Enterprise",
    precio: 4920000,
    precioUSD: 1200,
    siglas: "IC",
    tono: ["#062951", "#0CBDAD"],
    descripcion: "Servicio de integración y orquestación con Rasa Pro CALM, conector con ERP SAP/Oracle, bases híbridas PostgreSQL/Qdrant y cifrado AES-256. Setup corporativo / suscripción mensual ($1.200 USD ~ $4.920.000 COP)."
  },
  {
    id: "VOX-007",
    nombre: "Onboarding, Guardrails y Red-Teaming",
    categoria: "Servicios",
    precio: 480000,
    precioUSD: 117,
    siglas: "OE",
    tono: ["#4433C0", "#051C3C"],
    descripcion: "Configuración guiada: ingesta de datos, adaptación Task LoRA, guardrails éticos anti-alucinación, pruebas red-teaming y capacitación a tu equipo (52h/año). Servicio de pago único ($117 USD ~ $480.000 COP)."
  },
  {
    id: "VOX-008",
    nombre: "Plan Enterprise Cero Alucinaciones",
    categoria: "Suscripciones SaaS",
    precio: 4920000,
    precioUSD: 1200,
    siglas: "EN",
    tono: ["#051C3C", "#4433C0"],
    descripcion: "Plan corporativo con agentes ilimitados, cómputo GPU NVIDIA A100/H100, Green Computing PUE < 1.2, auditoría criptográfica, cumplimiento Ley 1581/SOC 2 y SLA 99.99%. Suscripción mensual ($1.200 USD ~ $4.920.000 COP)."
  }
];

window.buscarProducto = function (id) {
  for (var i = 0; i < window.PRODUCTOS.length; i++) {
    if (window.PRODUCTOS[i].id === id) return window.PRODUCTOS[i];
  }
  return null;
};
