import { ArrowLeft, Trash2, MessageCircle } from "lucide-react";

export default function CartPage({ cart, setPage, removeFromCart, clearCart }) {
  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const pagarWhatsApp = () => {
    const numero = "51952620281";

    const detalle = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.nombre} x${item.cantidad} = S/ ${(
            item.precio * item.cantidad
          ).toFixed(2)}`
      )
      .join("\n");

    const mensaje = `Hola, quiero realizar este pedido:%0A%0A${encodeURIComponent(
      detalle
    )}%0A%0ATotal: S/ ${total.toFixed(2)}`;

    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
  };

  return (
    <main className="app">
      <header className="cart-header">
        <button onClick={() => setPage("home")}>
          <ArrowLeft size={28} />
        </button>
        <h1>Carrito de Compras</h1>
      </header>

      <section className="cart-layout">
        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <h2>Tu carrito está vacío</h2>
              <p>Agrega productos desde el catálogo.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className={`cart-icon ${item.color}`}>
                  {item.nombre.charAt(0)}
                </div>

                <div>
                  <h3>{item.nombre}</h3>
                  <p>Cantidad: {item.cantidad}</p>
                </div>

                <div className="cart-price">
                  <strong>S/ {(item.precio * item.cantidad).toFixed(2)}</strong>
                  <button onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <button className="clear-btn" onClick={clearCart}>
              Limpiar carrito
            </button>
          )}
        </div>

        <aside className="payment-box">
          <h2>Resumen de Pago</h2>

          <div className="payment-row">
            <span>Subtotal</span>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>

          <div className="payment-row">
            <span>Comisión de servicio</span>
            <strong>Gratis</strong>
          </div>

          <hr />

          <div className="payment-total">
            <span>Total</span>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>

          <button
            className="whatsapp-btn"
            onClick={pagarWhatsApp}
            disabled={cart.length === 0}
          >
            <MessageCircle size={28} />
            Pagar vía WhatsApp
          </button>

          <p>Un asesor te atenderá de inmediato para completar tu pedido.</p>
        </aside>
      </section>
    </main>
  );
}