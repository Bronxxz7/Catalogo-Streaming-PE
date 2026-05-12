import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ producto, addToCart }) {
  const [cantidad, setCantidad] = useState(1);

  return (
    <article className="product-card premium-product">
      <div className="product-media">
        {producto.imagenUrl ? (
          <img src={producto.imagenUrl} alt={producto.nombre} />
        ) : (
          <div className={`product-icon ${producto.color}`}>
            {producto.icono}
          </div>
        )}
      </div>

      <span className="category">{producto.categoria}</span>

      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>

      <div className="price">
        S/ {Number(producto.precio).toFixed(2)}
        <small> / mes</small>
      </div>

      <div className="card-actions">
        <div className="quantity">
          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>
            −
          </button>
          <span>{cantidad}</span>
          <button onClick={() => setCantidad(cantidad + 1)}>+</button>
        </div>

        <button className="add-btn" onClick={() => addToCart(producto, cantidad)}>
          <ShoppingCart size={20} />
        </button>
      </div>
    </article>
  );
}