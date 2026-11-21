/* Página: detalle de producto (producto.html?id=VOX-001) */
(function () {
  var C = window.Carrito, A = window.Analitica;
  var box = document.getElementById("detalle");
  var id = new URLSearchParams(location.search).get("id");
  var p = window.buscarProducto(id);

  if (!p) {
    box.innerHTML = '<div class="panel vacio"><p>No encontramos ese producto.</p><a class="btn" href="index.html">Volver al catálogo</a></div>';
    return;
  }
  document.title = p.nombre + " · VoxIA AI";

  var usdTxt = p.precioUSD ? ' <span class="precio-usd">~ $' + p.precioUSD + ' USD / mes (TRM ref. $4.100 COP)</span>' : '';
  var precioHtml = '<div class="precio grande">' + C.formato(p.precio) + usdTxt + '</div>';
  if (C.cuponActivo()) {
    var descUSD = p.precioUSD ? ' (~ $' + Math.round(C.precioConCupon(p) / 4100) + ' USD)' : '';
    precioHtml += '<p class="msg ok">Con cupón BIENVENIDA10: <strong>' + C.formato(C.precioConCupon(p)) + '</strong>' + descUSD + ' por unidad</p>';
  }

  box.innerHTML =
    '<div class="detalle">' +
    '<div class="visual grande" style="background:linear-gradient(135deg,' + p.tono[0] + ',' + p.tono[1] + ')"><span>' + p.siglas + '</span></div>' +
    '<div><small class="cat">' + p.categoria + ' · ' + p.id + '</small><h1>' + p.nombre + '</h1>' +
    '<p>' + p.descripcion + '</p>' +
    '<ul class="checks">' +
    '<li>Motor híbrido Rasa Pro CALM + Cohere Command R+ (Cero alucinaciones en lógica de negocio)</li>' +
    '<li>Inclusión multilingüe en más de 95 idiomas con tokenización modular STRR</li>' +
    '<li>Infraestructura en data centers locales (Claro Triara / GTD Colombia, PUE &lt; 1.2)</li>' +
    '<li>Cumplimiento Ley 1581 de 2012 (Habeas Data SIC), SOC 2 Type II, GDPR y HIPAA</li>' +
    '<li>Facturación electrónica DIAN en COP o USD con pasarelas Wompi, PSE, Stripe y PayPal</li>' +
    '<li>Despacho digital automatizado en &lt; 3 min con garantía de satisfacción de 14 días (100% reembolso)</li>' +
    '</ul>' + precioHtml +
    '<div class="fila"><label for="cant">Cantidad</label><input id="cant" type="number" min="1" max="10" value="1">' +
    '<button type="button" class="btn" id="btn-agregar">Agregar al carrito</button></div>' +
    '<p id="aviso" class="msg" aria-live="polite"></p>' +
    '<p><a href="index.html">← Seguir viendo el catálogo</a></p></div></div>';

  A.enviarEvento("view_item", { value: p.precio, items: [C.itemGA(p, 1, 0, false)] });

  document.getElementById("btn-agregar").addEventListener("click", function () {
    var n = parseInt(document.getElementById("cant").value, 10);
    if (!(n >= 1)) n = 1;
    if (n > 10) n = 10;
    C.agregar(p.id, n);
    var it = C.itemGA(p, n, 0, true);
    A.enviarEvento("add_to_cart", { value: it.price * n, items: [it] });
    var av = document.getElementById("aviso");
    av.className = "msg ok";
    av.innerHTML = 'Agregaste ' + n + ' × ' + p.nombre + '. <a href="carrito.html">Ver carrito →</a>';
  });
})();
