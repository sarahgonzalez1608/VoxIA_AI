/* Página: catálogo (index.html) */
(function () {
  var C = window.Carrito, A = window.Analitica, P = window.PRODUCTOS;
  var LISTA = { item_list_id: "catalogo_principal", item_list_name: "Catálogo principal" };
  var grid = document.getElementById("grid");

  grid.innerHTML = P.map(function (p, i) {
    var usdTxt = p.precioUSD ? ' <span class="precio-usd">~ $' + p.precioUSD + ' USD</span>' : '';
    return '<a class="card" href="producto.html?id=' + p.id + '" data-i="' + i + '">' +
      '<div class="visual" style="background:linear-gradient(135deg,' + p.tono[0] + ',' + p.tono[1] + ')"><span>' + p.siglas + '</span></div>' +
      '<div class="card-cuerpo"><small>' + p.categoria + '</small><h3>' + p.nombre + '</h3>' +
      '<p class="desc">' + p.descripcion + '</p><div class="precio">' + C.formato(p.precio) + usdTxt + '</div></div></a>';
  }).join("");

  /* Clic en un producto: select_item y luego navegar */
  grid.addEventListener("click", function (e) {
    var a = e.target.closest(".card");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    var i = Number(a.getAttribute("data-i")), p = P[i];
    A.enviarYNavegar("select_item", {
      item_list_id: LISTA.item_list_id, item_list_name: LISTA.item_list_name,
      items: [C.itemGA(p, 1, i, false)]
    }, "producto.html?id=" + p.id);
  });

  /* Banner del cupón */
  var promo = {
    promotion_id: "BIENVENIDA10", promotion_name: "Cupón de bienvenida 10%",
    creative_name: "banner_bienvenida", creative_slot: "inicio_superior",
    items: P.slice(0, 3).map(function (p, i) { return C.itemGA(p, 1, i, false); })
  };
  var banner = document.getElementById("banner-promo");
  A.enviarEvento("view_promotion", promo);
  banner.addEventListener("click", function (e) {
    e.preventDefault();
    C.aplicarCupon("BIENVENIDA10");
    A.enviarYNavegar("select_promotion", promo, "carrito.html");
  });

  /* Lista de productos */
  A.enviarEvento("view_item_list", Object.assign({}, LISTA, {
    items: P.map(function (p, i) { return C.itemGA(p, 1, i, false); })
  }));
})();
