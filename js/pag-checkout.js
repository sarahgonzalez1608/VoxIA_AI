/* Página: checkout en dos pasos (checkout.html). Simulado: no guarda datos personales. */
(function () {
  var C = window.Carrito, A = window.Analitica;
  var PAISES = ["Colombia", "México", "Estados Unidos", "España", "Argentina", "Chile", "Perú", "Brasil"];
  var TARIFAS = { "Nacional - Estándar": 12000, "Nacional - Express": 25000, "Internacional - Estándar": 95000, "Internacional - Express": 160000 };
  var UMBRAL_GRATIS = 150000;

  var vacio = document.getElementById("checkout-vacio"), todo = document.getElementById("checkout");
  if (!C.lineas().length) { vacio.hidden = false; todo.hidden = true; return; }

  var sel = document.getElementById("pais"), nombre = document.getElementById("nombre"), aviso = document.getElementById("aviso-envio");
  var p1 = document.getElementById("paso1"), p2 = document.getElementById("paso2");
  sel.innerHTML = PAISES.map(function (p) { return '<option value="' + p + '">' + p + '</option>'; }).join("");

  function estado() {
    var pais = sel.value, serv = document.querySelector('input[name="servicio"]:checked').value;
    var tipo = pais === "Colombia" ? "Nacional" : "Internacional", tier = tipo + " - " + serv;
    return { pais: pais, tipo: tipo, tier: tier, envio: costo(tipo, serv) };
  }
  function costo(tipo, serv) {
    var tier = tipo + " - " + serv;
    if (tier === "Nacional - Estándar" && C.totales().valor >= UMBRAL_GRATIS) return 0;
    return TARIFAS[tier];
  }
  function txt(n) { return n === 0 ? "Gratis" : C.formato(n); }

  function pintar() {
    var tipo = sel.value === "Colombia" ? "Nacional" : "Internacional";
    document.getElementById("costo-estandar").textContent = txt(costo(tipo, "Estándar"));
    document.getElementById("costo-express").textContent = txt(costo(tipo, "Express"));
    var e = estado(), t = C.totales(), act = C.cuponActivo();
    var li = C.lineas().map(function (l) {
      var p = window.buscarProducto(l.id);
      return '<li><span>' + p.nombre + ' × ' + l.cantidad + '</span><span>' + C.formato(C.precioUnit(p) * l.cantidad) + '</span></li>';
    }).join("");
    document.getElementById("resumen").innerHTML = '<h2>Tu pedido</h2><ul class="lista-res">' + li + '</ul><dl class="tot">' +
      '<dt>Productos</dt><dd>' + C.formato(t.lista) + '</dd>' +
      (act ? '<dt>Cupón ' + C.CUPON.codigo + '</dt><dd>−' + C.formato(t.descuento) + '</dd>' : '') +
      '<dt>Envío (' + e.tier + ')</dt><dd>' + txt(e.envio) + '</dd>' +
      '<dt class="gr">Total</dt><dd class="gr">' + C.formato(t.valor + e.envio) + '</dd></dl>' +
      '<p class="nota">Moneda: COP. Pedido simulado.</p>';
    aviso.textContent = (e.tier === "Nacional - Estándar" && e.envio === 0) ? "Envío Nacional Estándar gratis por superar " + C.formato(UMBRAL_GRATIS) + " en productos." : "";
  }

  /* { value, coupon?, ...extra, items } */
  function armar(extra) {
    var b = C.paramsCarrito(), o = { value: b.value };
    if (b.coupon) o.coupon = b.coupon;
    Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
    o.items = b.items;
    return o;
  }

  function irPaso(n) {
    p1.hidden = n !== 1; p2.hidden = n !== 2;
    document.getElementById("ind1").className = n === 1 ? "activo" : "hecho";
    document.getElementById("ind2").className = n === 2 ? "activo" : "";
    pintar(); window.scrollTo(0, 0);
  }

  sel.addEventListener("change", pintar);
  Array.prototype.forEach.call(document.querySelectorAll('input[name="servicio"]'), function (r) { r.addEventListener("change", pintar); });

  A.enviarEvento("begin_checkout", armar());
  pintar();

  document.getElementById("btn-continuar").addEventListener("click", function () {
    var err = document.getElementById("err-nombre");
    if (!nombre.value.trim()) { err.textContent = "Escribe un nombre ficticio para continuar."; nombre.focus(); return; }
    err.textContent = "";
    var e = estado();
    if (window.gtag) window.gtag("set", "user_properties", { tipo_cliente: e.tipo });
    A.enviarEvento("add_shipping_info", armar({ shipping_tier: e.tier }));
    irPaso(2);
  });
  document.getElementById("btn-volver").addEventListener("click", function () { irPaso(1); });

  document.getElementById("btn-pagar").addEventListener("click", function () {
    var btn = this;
    if (!C.lineas().length) return;
    btn.disabled = true;
    var pago = document.querySelector('input[name="pago"]:checked').value;
    var e = estado(), b = C.paramsCarrito();
    var evento = armar({ payment_type: pago });

    var pedido = {
      transaction_id: "T-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
      affiliation: "VoxIA AI - Tienda simulada", value: b.value, shipping: e.envio
    };
    if (b.coupon) pedido.coupon = b.coupon;
    pedido.tipo_cliente = e.tipo; pedido.items = b.items; pedido.enviado = false;
    try { sessionStorage.setItem("vx_pedido", JSON.stringify(pedido)); } catch (x) {}
    C.vaciar();
    A.enviarYNavegar("add_payment_info", evento, "gracias.html");
  });
})();
