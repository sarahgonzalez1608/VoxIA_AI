/* Página: confirmación (gracias.html). Envía purchase UNA sola vez por pedido. */
(function () {
  var C = window.Carrito, A = window.Analitica;
  var box = document.getElementById("resultado"), ped = null;
  try { ped = JSON.parse(sessionStorage.getItem("vx_pedido") || "null"); } catch (e) {}

  if (!ped) {
    box.innerHTML = '<div class="panel vacio"><h1>No hay un pedido reciente</h1><p>Haz una compra simulada para ver la confirmación.</p><a class="btn" href="index.html">Ir al catálogo</a></div>';
    return;
  }

  var yaEnviado = ped.enviado === true;
  if (!yaEnviado) {
    if (window.gtag) window.gtag("set", "user_properties", { tipo_cliente: ped.tipo_cliente });
    var ev = { transaction_id: ped.transaction_id, affiliation: ped.affiliation, value: ped.value, shipping: ped.shipping };
    if (ped.coupon) ev.coupon = ped.coupon;
    ev.tipo_cliente = ped.tipo_cliente; ev.items = ped.items;
    A.enviarEvento("purchase", ev);
    ped.enviado = true;
    try { sessionStorage.setItem("vx_pedido", JSON.stringify(ped)); } catch (e) {}
  }

  var filas = ped.items.map(function (i) {
    return '<tr><td>' + i.item_name + '</td><td>' + i.quantity + '</td><td>' + C.formato(i.price * i.quantity) + '</td></tr>';
  }).join("");

  box.innerHTML =
    '<div class="panel">' +
    '<div class="exito-icono" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" stroke-width="2.5"/><path fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8 16-16"/></svg></div>' +
    '<h1>¡Gracias por tu compra simulada!</h1>' +
    '<p>Pedido <strong>' + ped.transaction_id + '</strong> · cliente <strong>' + ped.tipo_cliente + '</strong></p>' +
    '<div class="tabla-wrap"><table class="tabla"><thead><tr><th>Producto</th><th>Cant.</th><th>Subtotal</th></tr></thead><tbody>' + filas + '</tbody></table></div>' +
    '<dl class="tot"><dt>Productos' + (ped.coupon ? ' (cupón ' + ped.coupon + ')' : '') + '</dt><dd>' + C.formato(ped.value) + '</dd>' +
    '<dt>Envío</dt><dd>' + (ped.shipping === 0 ? "Gratis" : C.formato(ped.shipping)) + '</dd>' +
    '<dt class="gr">Total simulado</dt><dd class="gr">' + C.formato(ped.value + ped.shipping) + '</dd></dl>' +
    '<p class="msg ' + (yaEnviado ? "" : "ok") + '">' + (yaEnviado
      ? 'Este pedido ya fue registrado en Analytics: al recargar la página no se vuelve a enviar purchase.'
      : 'Evento purchase enviado (revisa el monitor).') + '</p>' +
    '<p class="nota">No se cobró nada: es una simulación académica.</p><a class="btn" href="index.html">Volver al catálogo</a></div>';
})();
