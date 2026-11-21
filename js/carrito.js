/* carrito.js — carrito en localStorage, cupón BIENVENIDA10 y armado de ítems GA4. */
(function () {
  var K_C = "vx_carrito", K_P = "vx_cupon";
  var CUPON = { codigo: "BIENVENIDA10", pct: 10 };
  var fmt = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function lineas() {
    var a;
    try { a = JSON.parse(lsGet(K_C) || "[]"); } catch (e) { a = []; }
    if (!Array.isArray(a)) return [];
    return a.filter(function (l) { return l && window.buscarProducto(l.id) && l.cantidad > 0; });
  }
  function cantidadTotal() { return lineas().reduce(function (s, l) { return s + l.cantidad; }, 0); }
  function badge() {
    var el = document.getElementById("badge-carrito");
    if (el) {
      el.textContent = cantidadTotal();
      el.classList.remove("pop");
      void el.offsetWidth;
      el.classList.add("pop");
    }
  }
  function guardar(a) { lsSet(K_C, JSON.stringify(a)); badge(); }

  function agregar(id, n) {
    var a = lineas(), l = a.filter(function (x) { return x.id === id; })[0];
    if (l) l.cantidad = Math.min(99, l.cantidad + n); else a.push({ id: id, cantidad: n });
    guardar(a);
  }
  /* Devuelve las unidades realmente quitadas. */
  function quitar(id, n) {
    var a = lineas(), l = a.filter(function (x) { return x.id === id; })[0];
    if (!l) return 0;
    var q = Math.min(n, l.cantidad);
    l.cantidad -= q;
    guardar(a.filter(function (x) { return x.cantidad > 0; }));
    return q;
  }
  function vaciar() { lsDel(K_C); lsDel(K_P); badge(); }

  function cuponActivo() { return lsGet(K_P) === CUPON.codigo; }
  function aplicarCupon(cod) {
    if (String(cod || "").trim().toUpperCase() === CUPON.codigo) { lsSet(K_P, CUPON.codigo); return true; }
    return false;
  }
  function quitarCupon() { lsDel(K_P); }

  function precioConCupon(p) { return Math.round(p.precio * (100 - CUPON.pct) / 100); }
  function precioUnit(p) { return cuponActivo() ? precioConCupon(p) : p.precio; }

  /* Ítem GA4. conCupon=true → precio con descuento + discount + coupon. */
  function itemGA(p, cantidad, index, conCupon) {
    var it = { item_id: p.id, item_name: p.nombre, item_brand: window.MARCA, item_category: p.categoria,
               price: p.precio, quantity: cantidad, index: index };
    if (conCupon && cuponActivo()) {
      var pd = precioConCupon(p);
      it.price = pd; it.discount = p.precio - pd; it.coupon = CUPON.codigo;
    }
    return it;
  }

  /* { value, coupon?, items } del carrito actual (con cupón si está activo). */
  function paramsCarrito() {
    var items = lineas().map(function (l, i) { return itemGA(window.buscarProducto(l.id), l.cantidad, i, true); });
    var value = items.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
    var o = { value: value };
    if (cuponActivo()) o.coupon = CUPON.codigo;
    o.items = items;
    return o;
  }

  function totales() {
    var lista = 0, valor = 0;
    lineas().forEach(function (l) {
      var p = window.buscarProducto(l.id);
      lista += p.precio * l.cantidad; valor += precioUnit(p) * l.cantidad;
    });
    return { lista: lista, valor: valor, descuento: lista - valor };
  }

  window.Carrito = {
    CUPON: CUPON, formato: function (n) { return fmt.format(n); },
    lineas: lineas, cantidadTotal: cantidadTotal, agregar: agregar, quitar: quitar, vaciar: vaciar,
    cuponActivo: cuponActivo, aplicarCupon: aplicarCupon, quitarCupon: quitarCupon,
    precioConCupon: precioConCupon, precioUnit: precioUnit, itemGA: itemGA,
    paramsCarrito: paramsCarrito, totales: totales, actualizarBadge: badge
  };
  badge();
})();
