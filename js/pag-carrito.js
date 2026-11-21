/* Página: carrito (carrito.html) */
(function () {
  var C = window.Carrito, A = window.Analitica;
  var box = document.getElementById("carrito-contenido");
  var msgCupon = "", msgTipo = "";

  function render() {
    var ls = C.lineas();
    if (!ls.length) {
      box.innerHTML = '<div class="panel vacio"><p>Tu carrito está vacío.</p><a class="btn" href="index.html">Ver catálogo</a></div>';
      return;
    }
    var act = C.cuponActivo(), t = C.totales();
    var filas = ls.map(function (l) {
      var p = window.buscarProducto(l.id), pu = C.precioUnit(p);
      return '<tr><td><strong>' + p.nombre + '</strong><br><small>' + p.categoria + ' · ' + p.id + '</small></td>' +
        '<td>' + (act ? '<s>' + C.formato(p.precio) + '</s><br>' : '') + C.formato(pu) + (p.precioUSD ? '<br><small class="precio-usd">~ $' + Math.round(pu / 4100) + ' USD</small>' : '') + '</td>' +
        '<td><div class="cant"><button type="button" data-acc="menos" data-id="' + p.id + '" aria-label="Disminuir">−</button>' +
        '<span>' + l.cantidad + '</span><button type="button" data-acc="mas" data-id="' + p.id + '" aria-label="Aumentar">+</button></div></td>' +
        '<td>' + C.formato(pu * l.cantidad) + '</td>' +
        '<td><button type="button" class="link" data-acc="quitar" data-id="' + p.id + '">Quitar</button></td></tr>';
    }).join("");

    var cupon = act
      ? '<p class="msg ok">Cupón ' + C.CUPON.codigo + ' aplicado: −' + C.CUPON.pct + ' % en productos.</p><button type="button" class="btn sec" data-acc="quitarcupon">Quitar cupón</button>'
      : '<label for="cupon">¿Tienes un cupón?</label><div class="fila"><input id="cupon" type="text" placeholder="BIENVENIDA10" autocomplete="off">' +
        '<button type="button" class="btn sec" data-acc="aplicar">Aplicar</button></div>' +
        (msgCupon ? '<p class="msg ' + msgTipo + '">' + msgCupon + '</p>' : '');

    box.innerHTML =
      '<div class="dos-col"><div class="panel"><div class="tabla-wrap"><table class="tabla"><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead><tbody>' + filas + '</tbody></table></div></div>' +
      '<aside class="panel resumen"><h2>Resumen</h2>' + cupon +
      '<dl class="tot"><dt>Productos</dt><dd>' + C.formato(t.lista) + '</dd>' +
      (act ? '<dt>Descuento</dt><dd>−' + C.formato(t.descuento) + '</dd>' : '') +
      '<dt class="gr">Total productos</dt><dd class="gr">' + C.formato(t.valor) + '</dd></dl>' +
      '<p class="nota">El envío se calcula en el checkout.</p><a class="btn" href="checkout.html">Ir al checkout</a></aside></div>';
  }

  function itemUno(id, cant) { return C.itemGA(window.buscarProducto(id), cant, 0, true); }

  box.addEventListener("click", function (e) {
    var b = e.target.closest("[data-acc]");
    if (!b) return;
    var acc = b.getAttribute("data-acc"), id = b.getAttribute("data-id"), it, q;
    if (acc === "mas") {
      C.agregar(id, 1); it = itemUno(id, 1);
      A.enviarEvento("add_to_cart", { value: it.price, items: [it] });
    } else if (acc === "menos") {
      q = C.quitar(id, 1);
      if (q) { it = itemUno(id, q); A.enviarEvento("remove_from_cart", { value: it.price * q, items: [it] }); }
    } else if (acc === "quitar") {
      var l = C.lineas().filter(function (x) { return x.id === id; })[0];
      if (l) { q = C.quitar(id, l.cantidad); it = itemUno(id, q); A.enviarEvento("remove_from_cart", { value: it.price * q, items: [it] }); }
    } else if (acc === "aplicar") {
      var ok = C.aplicarCupon(document.getElementById("cupon").value);
      msgCupon = ok ? "" : "Cupón no válido. Prueba con BIENVENIDA10."; msgTipo = "err";
    } else if (acc === "quitarcupon") { C.quitarCupon(); msgCupon = ""; }
    render();
  });
  box.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.id === "cupon") { e.preventDefault(); box.querySelector('[data-acc="aplicar"]').click(); }
  });

  render();
  if (C.lineas().length) A.enviarEvento("view_cart", C.paramsCarrito());
})();
