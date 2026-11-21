/* =====================================================================
   analytics.js — carga GA4 (si hay ID válido) + Monitor de eventos didáctico.
   Expone window.Analitica = { activo, id, enviarEvento, enviarYNavegar }.
   ===================================================================== */
(function () {
  var CFG = window.TIENDA_CONFIG || {};
  var ID = String(CFG.GA_MEASUREMENT_ID || "");
  var ACTIVO = /^G-[A-Z0-9]+$/i.test(ID) && ID !== "G-XXXXXXXXXX";
  var DEBUG = CFG.DEBUG_MODE === true;
  var K_EV = "vx_eventos", K_OR = "vx_origen", K_OC = "vx_monitor_oculto";

  /* ---------- Carga de gtag.js solo con ID válido ---------- */
  if (ACTIVO) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ID);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    if (DEBUG) { window.gtag("config", ID, { debug_mode: true }); }
    else { window.gtag("config", ID); }
  }

  /* ---------- Almacenamiento seguro ---------- */
  function leerEv() { try { return JSON.parse(sessionStorage.getItem(K_EV) || "[]"); } catch (e) { return []; } }
  function guardarEv(a) { try { sessionStorage.setItem(K_EV, JSON.stringify(a)); } catch (e) {} }
  function moneda(n) { return "$" + Number(n).toLocaleString("es-CO"); }

  /* ---------- Resumen legible de un evento ---------- */
  function resumen(p) {
    var r = [];
    if (!p) return "";
    if (p.page_path) r.push(p.page_path);
    if (p.item_list_id) r.push("lista: " + p.item_list_id);
    if (p.promotion_id) r.push("promo: " + p.promotion_id);
    if (p.transaction_id) r.push("pedido: " + p.transaction_id);
    if (p.items && p.items.length) {
      var nombres = p.items.slice(0, 2).map(function (i) { return i.item_name + (i.quantity > 1 ? " ×" + i.quantity : ""); });
      r.push(p.items.length + " ítem(s): " + nombres.join(", ") + (p.items.length > 2 ? "…" : ""));
    }
    if (p.value !== undefined) r.push("value " + moneda(p.value));
    if (p.shipping !== undefined) r.push("envío " + moneda(p.shipping));
    if (p.coupon) r.push("cupón " + p.coupon);
    if (p.shipping_tier) r.push(p.shipping_tier);
    if (p.payment_type) r.push("pago: " + p.payment_type);
    if (p.tipo_cliente) r.push("cliente " + p.tipo_cliente);
    return r.join(" · ");
  }

  function registrar(nombre, params) {
    var a = leerEv();
    a.unshift({ h: new Date().toLocaleTimeString("es-CO", { hour12: false }), n: nombre, r: resumen(params) });
    guardarEv(a.slice(0, 12));
    pintarLista();
  }

  /* ---------- API pública ---------- */
  function enviarEvento(nombre, params) {
    params = Object.assign({ currency: "COP" }, params || {});
    registrar(nombre, params);
    if (ACTIVO) window.gtag("event", nombre, params);
  }

  function enviarYNavegar(nombre, params, url) {
    params = Object.assign({ currency: "COP" }, params || {});
    registrar(nombre, params);
    if (!ACTIVO) { window.location.href = url; return; }
    var hecho = false;
    function ir() { if (hecho) return; hecho = true; window.location.href = url; }
    var conCallback = Object.assign({}, params, { event_callback: ir, event_timeout: 1000 });
    window.gtag("event", nombre, conCallback);
    setTimeout(ir, 1200);
  }

  window.Analitica = { activo: ACTIVO, id: ID, enviarEvento: enviarEvento, enviarYNavegar: enviarYNavegar };

  /* ---------- Origen de la visita (primera página de la sesión) ---------- */
  try {
    if (!sessionStorage.getItem(K_OR)) {
      var q = new URLSearchParams(location.search);
      var src = q.get("utm_source"), med = q.get("utm_medium"), cam = q.get("utm_campaign");
      var txt = src ? src + " / " + (med || "(sin medium)") + " · " + (cam || "(sin campaña)") : "directo (sin UTM)";
      sessionStorage.setItem(K_OR, txt);
    }
  } catch (e) {}

  /* ---------- page_view en el monitor (GA4 lo envía solo con config) ---------- */
  registrar("page_view", { page_path: location.pathname + location.search });

  /* ---------- Monitor de eventos ---------- */
  var elLista = null;
  function pintarLista() {
    if (!elLista) return;
    var a = leerEv();
    elLista.innerHTML = "";
    if (!a.length) { var v = document.createElement("li"); v.className = "vx-vacio"; v.textContent = "Aún no hay eventos."; elLista.appendChild(v); return; }
    a.forEach(function (e, idx) {
      var li = document.createElement("li");
      if (idx === 0) li.className = "vx-nuevo";
      var t = document.createElement("span"); t.className = "vx-hora"; t.textContent = e.h;
      var n = document.createElement("b"); n.className = "vx-nombre"; n.textContent = " " + e.n;
      var r = document.createElement("div"); r.className = "vx-res"; r.textContent = e.r;
      li.appendChild(t); li.appendChild(n); li.appendChild(r);
      elLista.appendChild(li);
    });
  }

  function borrarCookiesGA() {
    var host = location.hostname, partes = host.split("."), doms = [host, "." + host];
    for (var i = 1; i < partes.length - 1; i++) doms.push("." + partes.slice(i).join("."));
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (n.indexOf("_ga") === 0) {
        var base = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie = base;
        doms.forEach(function (d) { document.cookie = base + "; domain=" + d; });
      }
    });
  }

  function simularNuevoVisitante() {
    borrarCookiesGA();
    try { localStorage.removeItem("vx_carrito"); localStorage.removeItem("vx_cupon"); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    window.location.href = "index.html";
  }

  function iniciarMonitor() {
    var oculto = false;
    try { oculto = localStorage.getItem(K_OC) === "1"; } catch (e) {}
    document.body.classList.add("con-monitor");

    var panel = document.createElement("aside");
    panel.id = "vx-monitor"; panel.className = "vx-monitor";
    panel.setAttribute("aria-label", "Monitor de eventos");
    panel.innerHTML =
      '<div class="vx-cab"><strong>Monitor de eventos GA4</strong><button type="button" id="vx-ocultar">Ocultar</button></div>' +
      '<div id="vx-estado" class="vx-estado"></div>' +
      '<div class="vx-origen"><span>Origen de la visita</span><b id="vx-origen"></b></div>' +
      '<div class="vx-sub">Últimos 12 eventos</div><ol id="vx-lista" class="vx-lista"></ol>' +
      '<button type="button" id="vx-reset" class="vx-reset">Simular nuevo visitante</button>';
    document.body.appendChild(panel);

    var abrir = document.createElement("button");
    abrir.type = "button"; abrir.id = "vx-mostrar"; abrir.className = "vx-mostrar"; abrir.textContent = "Mostrar monitor";
    document.body.appendChild(abrir);

    var est = panel.querySelector("#vx-estado");
    if (ACTIVO) { est.className = "vx-estado ok"; est.textContent = "Conectado a " + ID + (DEBUG ? " · modo depuración" : " · sin modo depuración"); }
    else { est.className = "vx-estado err"; est.textContent = "Sin ID de medición: los eventos solo se muestran aquí. Edita js/config.js."; }

    try { panel.querySelector("#vx-origen").textContent = sessionStorage.getItem(K_OR) || "directo (sin UTM)"; }
    catch (e) { panel.querySelector("#vx-origen").textContent = "directo (sin UTM)"; }

    elLista = panel.querySelector("#vx-lista");
    pintarLista();

    function aplicar() {
      document.body.classList.toggle("monitor-oculto", oculto);
      panel.hidden = oculto; abrir.hidden = !oculto;
    }
    function alternar() { oculto = !oculto; try { localStorage.setItem(K_OC, oculto ? "1" : "0"); } catch (e) {} aplicar(); }
    panel.querySelector("#vx-ocultar").addEventListener("click", alternar);
    abrir.addEventListener("click", alternar);
    panel.querySelector("#vx-reset").addEventListener("click", simularNuevoVisitante);
    aplicar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarMonitor);
  else iniciarMonitor();
})();
