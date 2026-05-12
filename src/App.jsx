import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

import ProductCard from "./components/ProductCard";
import CartPage from "./components/CartPage";

import AdminPanel from "./components/Admin/AdminPanel";

import { db } from "./firebase";
import { Sparkles } from "lucide-react";

import {
  collection,
  onSnapshot,
  doc,
} from "firebase/firestore";

export default function App() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [section, setSection] =
    useState("inicio");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [category, setCategory] =
    useState("Todos");

  const [cart, setCart] = useState(() => {
    const saved =
      localStorage.getItem(
        "streamCart"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  const [page, setPage] =
    useState("home");

  const [secretClicks, setSecretClicks] =
    useState(0);

  const [productos, setProductos] =
    useState([]);

  const [categorias, setCategorias] =
    useState([]);

  const [remates, setRemates] =
    useState([]);

  const [promo, setPromo] =
    useState({
      titulo: "Streaming PE",
      texto: "",
      codigo: "STREAM24",
      imagenUrl: "",
    });

  useEffect(() => {
    localStorage.setItem(
      "streamCart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "productos"),
      (snapshot) => {
        const lista =
          snapshot.docs
            .map((documento) => ({
              id: documento.id,
              ...documento.data(),
            }))
            .filter(
              (producto) =>
                producto.activo !==
                false
            );

        setProductos(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "categorias"),
      (snapshot) => {
        const lista =
          snapshot.docs
            .map((documento) => ({
              id: documento.id,
              ...documento.data(),
            }))
            .sort(
              (a, b) =>
                Number(
                  a.orden || 0
                ) -
                Number(
                  b.orden || 0
                )
            );

        setCategorias(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "remates"),
      (snapshot) => {
        const lista =
          snapshot.docs
            .map((documento) => ({
              id: documento.id,
              ...documento.data(),
            }))
            .filter(
              (item) =>
                item.activo !==
                false
            )
            .sort(
              (a, b) =>
                Number(
                  a.orden || 0
                ) -
                Number(
                  b.orden || 0
                )
            );

        setRemates(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ref = doc(
      db,
      "configuracion",
      "promoPrincipal"
    );

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setPromo(
            snapshot.data()
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSecretClick = () => {
    setSecretClicks((prev) => {
      const next = prev + 1;

      if (next >= 5) {
        setPage("admin");
        return 0;
      }

      return next;
    });
  };

  const addToCart = (
    producto,
    cantidad
  ) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.id ===
          producto.id
      );

      if (exists) {
        return prev.map((item) =>
          item.id ===
          producto.id
            ? {
                ...item,
                cantidad:
                  item.cantidad +
                  cantidad,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...producto,
          cantidad,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart(
      cart.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems =
    cart.reduce(
      (acc, item) =>
        acc + item.cantidad,
      0
    );

  const productosFiltrados =
    useMemo(() => {
      return productos.filter(
        (producto) => {
          const coincideBusqueda =
            producto.nombre
              ?.toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              ) ||
            producto.descripcion
              ?.toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              );

          const coincideCategoria =
            category ===
              "Todos" ||
            producto.categoria
              ?.toLowerCase()
              .includes(
                category.toLowerCase()
              ) ||
            producto.nombre
              ?.toLowerCase()
              .includes(
                category.toLowerCase()
              );

          return (
            coincideBusqueda &&
            coincideCategoria
          );
        }
      );
    }, [
      productos,
      searchTerm,
      category,
    ]);

  if (page === "admin") {
    return (
      <AdminPanel
        setPage={setPage}
      />
    );
  }

  if (page === "cart") {
    return (
      <CartPage
        cart={cart}
        setPage={setPage}
        removeFromCart={
          removeFromCart
        }
        clearCart={clearCart}
      />
    );
  }

  return (
    <main className="app">
      <Navbar
        totalItems={totalItems}
        setPage={setPage}
        openSidebar={() =>
          setSidebarOpen(true)
        }
        onSecretClick={
          handleSecretClick
        }
      />

      <Sidebar
        open={sidebarOpen}
        closeSidebar={() =>
          setSidebarOpen(false)
        }
        setSection={setSection}
        setSearchTerm={
          setSearchTerm
        }
        setCategory={setCategory}
        categorias={categorias}
      />

      {section === "inicio" && (
        <>
          <section className="hero">
            <div className="hero-left">
              <div className="clean-hero">
                <span className="tag">
                  <Sparkles
                    size={16}
                  />
                  CATÁLOGO DIGITAL
                  PREMIUM
                </span>

                <h1>
                  Streaming PE
                </h1>

                <p>
                  Compra tus
                  cuentas
                  favoritas de
                  forma rápida,
                  moderna y
                  segura.
                </p>

                <button
                  className="hero-btn"
                  onClick={() =>
                    setSection(
                      "catalogo"
                    )
                  }
                >
                  Explorar
                  catálogo
                </button>
              </div>
            </div>

            <div className="hero-right">
              <div className="promo-slider">
                {promo.imagenUrl ? (
                  <img
                    src={
                      promo.imagenUrl
                    }
                    alt="Promoción"
                  />
                ) : (
                  <div className="promo-empty">
                    Agrega una
                    promoción
                    desde el
                    admin
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="catalog-header">
            <div>
              <h2>
                Más populares
              </h2>

              <p>
                Las cuentas más
                pedidas por
                nuestra
                comunidad.
              </p>
            </div>
          </section>

          <section className="products-grid">
            {productos
              .slice(0, 4)
              .map(
                (producto) => (
                  <ProductCard
                    key={
                      producto.id
                    }
                    producto={
                      producto
                    }
                    addToCart={
                      addToCart
                    }
                  />
                )
              )}
          </section>
        </>
      )}

      {section === "catalogo" && (
        <>
          <section className="catalog-header page-title">
            <div>
              <h2>
                Catálogo
              </h2>

              <p>
                {category ===
                "Todos"
                  ? "Todos los productos disponibles."
                  : `Categoría: ${category}`}
              </p>
            </div>
          </section>

          <section className="products-grid">
            {productosFiltrados.length ===
            0 ? (
              <div className="empty-products">
                <h2>
                  No hay
                  productos
                </h2>

                <p>
                  Prueba otra
                  búsqueda o
                  categoría.
                </p>
              </div>
            ) : (
              productosFiltrados.map(
                (
                  producto
                ) => (
                  <ProductCard
                    key={
                      producto.id
                    }
                    producto={
                      producto
                    }
                    addToCart={
                      addToCart
                    }
                  />
                )
              )
            )}
          </section>
        </>
      )}

      {section ===
        "promociones" && (
        <section className="deals-page">
          <div className="deal-feature">
            <span>
              REMATE PREMIUM
            </span>

            <div className="deal-icon">
              🍿
            </div>

            <h1>
              Combos y
              Remates
            </h1>

            <p>
              Productos
              exclusivos con
              precios rebajados
              por tiempo
              limitado.
            </p>

            <button
              onClick={() =>
                setSection(
                  "catalogo"
                )
              }
            >
              Ver catálogo
            </button>
          </div>

          <div className="deal-grid">
            {remates.map(
              (
                item,
                index
              ) => (
                <div
                  className={
                    index === 0
                      ? "deal-card large"
                      : "deal-card"
                  }
                  key={item.id}
                >
                  {item.imagenUrl ? (
                    <img
                      src={
                        item.imagenUrl
                      }
                      alt={
                        item.nombre
                      }
                    />
                  ) : (
                    <div className="deal-emoji">
                      🔥
                    </div>
                  )}

                  <div className="deal-info">
                    <small>
                      {index === 0
                        ? "DESTACADO"
                        : "OFERTA"}
                    </small>

                    <h3>
                      {
                        item.nombre
                      }
                    </h3>

                    <p>
                      {
                        item.descripcion
                      }
                    </p>

                    <div className="deal-bottom">
                      <div className="deal-prices">
                        {item.precioAntes >
                          0 && (
                          <span className="old-price">
                            S/{" "}
                            {Number(
                              item.precioAntes
                            ).toFixed(
                              2
                            )}
                          </span>
                        )}

                        <strong>
                          S/{" "}
                          {Number(
                            item.precio
                          ).toFixed(
                            2
                          )}
                        </strong>
                      </div>

                      <button
                        onClick={() =>
                          addToCart(
                            item,
                            1
                          )
                        }
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}
    </main>
  );
}