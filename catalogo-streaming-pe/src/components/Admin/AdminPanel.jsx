import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import {
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Save,
  Trash2,
  LayoutDashboard,
  Image,
  Package,
  Tags,
  Flame,
} from "lucide-react";

export default function AdminPanel({ setPage }) {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("dashboard");

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [remates, setRemates] = useState([]);

  const [promo, setPromo] = useState({
    titulo: "Streaming PE",
    texto: "",
    codigo: "STREAM24",
    imagenUrl: "",
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "Streaming",
    color: "blue",
    icono: "📺",
    imagenUrl: "",
    activo: true,
  });

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
    icono: "Monitor",
    activo: true,
    orden: 1,
  });

  const [nuevoRemate, setNuevoRemate] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precioAntes: "",
    imagenUrl: "",
    destacado: false,
    activo: true,
    orden: 1,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        cargarProductos();
        cargarCategorias();
        cargarRemates();
        cargarPromo();
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, correo, password);
    } catch (error) {
      alert("Correo o contraseña incorrectos");
    }
  };

  const salir = async () => {
    await signOut(auth);
    setPage("home");
  };

  const cargarProductos = async () => {
    const snapshot = await getDocs(collection(db, "productos"));

    const lista = snapshot.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));

    setProductos(lista);
  };

  const cargarCategorias = async () => {
    const snapshot = await getDocs(collection(db, "categorias"));

    const lista = snapshot.docs
      .map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }))
      .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0));

    setCategorias(lista);
  };

  const cargarRemates = async () => {
    const snapshot = await getDocs(collection(db, "remates"));

    const lista = snapshot.docs
      .map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }))
      .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0));

    setRemates(lista);
  };

  const cargarPromo = async () => {
    const referencia = doc(db, "configuracion", "promoPrincipal");
    const snap = await getDoc(referencia);

    if (snap.exists()) {
      setPromo(snap.data());
    }
  };

  const guardarPromo = async () => {
    await setDoc(doc(db, "configuracion", "promoPrincipal"), promo);
    alert("Banner guardado correctamente");
  };

  const agregarProducto = async (e) => {
    e.preventDefault();

    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      alert("Completa nombre y precio");
      return;
    }

    await addDoc(collection(db, "productos"), {
      ...nuevoProducto,
      precio: Number(nuevoProducto.precio),
      activo: true,
    });

    setNuevoProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "Streaming",
      color: "blue",
      icono: "📺",
      imagenUrl: "",
      activo: true,
    });

    cargarProductos();
  };

  const actualizarProducto = async (id, campo, valor) => {
    const referencia = doc(db, "productos", id);

    const valorFinal =
      campo === "precio"
        ? Number(valor)
        : campo === "activo"
        ? Boolean(valor)
        : valor;

    await updateDoc(referencia, {
      [campo]: valorFinal,
    });

    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === id ? { ...producto, [campo]: valorFinal } : producto
      )
    );
  };

  const eliminarProducto = async (id) => {
    const confirmar = confirm("¿Eliminar este producto?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "productos", id));
    cargarProductos();
  };

  const agregarCategoria = async (e) => {
    e.preventDefault();

    if (!nuevaCategoria.nombre) {
      alert("Coloca el nombre de la categoría");
      return;
    }

    await addDoc(collection(db, "categorias"), {
      ...nuevaCategoria,
      orden: Number(nuevaCategoria.orden),
      activo: true,
    });

    setNuevaCategoria({
      nombre: "",
      descripcion: "",
      icono: "Monitor",
      activo: true,
      orden: categorias.length + 1,
    });

    cargarCategorias();
  };

  const actualizarCategoria = async (id, campo, valor) => {
    const referencia = doc(db, "categorias", id);

    const valorFinal =
      campo === "orden"
        ? Number(valor)
        : campo === "activo"
        ? Boolean(valor)
        : valor;

    await updateDoc(referencia, {
      [campo]: valorFinal,
    });

    setCategorias((prev) =>
      prev.map((categoria) =>
        categoria.id === id ? { ...categoria, [campo]: valorFinal } : categoria
      )
    );
  };

  const eliminarCategoria = async (id) => {
    const confirmar = confirm("¿Eliminar esta categoría?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "categorias", id));
    cargarCategorias();
  };

  const agregarRemate = async (e) => {
    e.preventDefault();

    if (!nuevoRemate.nombre || !nuevoRemate.precio) {
      alert("Completa nombre y precio");
      return;
    }

    await addDoc(collection(db, "remates"), {
      ...nuevoRemate,
      precio: Number(nuevoRemate.precio),
      precioAntes: Number(nuevoRemate.precioAntes || 0),
      orden: Number(nuevoRemate.orden || 1),
      activo: true,
    });

    setNuevoRemate({
      nombre: "",
      descripcion: "",
      precio: "",
      precioAntes: "",
      imagenUrl: "",
      destacado: false,
      activo: true,
      orden: 1,
    });

    cargarRemates();
  };

  const actualizarRemate = async (id, campo, valor) => {
    const referencia = doc(db, "remates", id);

    const valorFinal =
      campo === "precio" || campo === "precioAntes" || campo === "orden"
        ? Number(valor)
        : campo === "activo" || campo === "destacado"
        ? Boolean(valor)
        : valor;

    await updateDoc(referencia, {
      [campo]: valorFinal,
    });

    setRemates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [campo]: valorFinal } : item
      )
    );
  };

  const eliminarRemate = async (id) => {
    const confirmar = confirm("¿Eliminar este remate?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "remates", id));
    cargarRemates();
  };

  if (!user) {
    return (
      <main className="admin-page">
        <form className="admin-login" onSubmit={login}>
          <h1>Panel Admin</h1>
          <p>Acceso privado para administrar tu catálogo.</p>

          <input
            type="email"
            placeholder="Correo administrador"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar al panel</button>

          <span onClick={() => setPage("home")}>Volver al catálogo</span>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <h1>Panel Administrador</h1>
          <p>Gestiona tu web por secciones.</p>
        </div>

        <button onClick={salir}>
          <LogOut size={18} />
          Salir
        </button>
      </section>

      <section className="admin-tabs">
        <button
          className={tab === "dashboard" ? "active" : ""}
          onClick={() => setTab("dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          className={tab === "banner" ? "active" : ""}
          onClick={() => setTab("banner")}
        >
          <Image size={18} />
          Banner
        </button>

        <button
          className={tab === "productos" ? "active" : ""}
          onClick={() => setTab("productos")}
        >
          <Package size={18} />
          Productos
        </button>

        <button
          className={tab === "categorias" ? "active" : ""}
          onClick={() => setTab("categorias")}
        >
          <Tags size={18} />
          Categorías
        </button>

        <button
          className={tab === "remates" ? "active" : ""}
          onClick={() => setTab("remates")}
        >
          <Flame size={18} />
          Remates
        </button>
      </section>

      {tab === "dashboard" && (
        <section className="admin-dashboard">
          <div className="dashboard-card">
            <span>Productos</span>
            <strong>{productos.length}</strong>
            <p>Total de productos creados.</p>
          </div>

          <div className="dashboard-card">
            <span>Categorías</span>
            <strong>{categorias.length}</strong>
            <p>Secciones visibles en la hamburguesa.</p>
          </div>

          <div className="dashboard-card">
            <span>Remates</span>
            <strong>{remates.length}</strong>
            <p>Promos exclusivas creadas.</p>
          </div>

          <div className="dashboard-card">
            <span>Activos</span>
            <strong>{productos.filter((p) => p.activo !== false).length}</strong>
            <p>Productos visibles en la web.</p>
          </div>
        </section>
      )}

      {tab === "banner" && (
        <section className="admin-grid single">
          <div className="admin-card admin-banner-card">
            <h2>Banner promocional</h2>

            {promo.imagenUrl && (
              <img
                className="admin-banner-preview"
                src={promo.imagenUrl}
                alt="Banner"
              />
            )}

            <input
              placeholder="URL de imagen del banner"
              value={promo.imagenUrl}
              onChange={(e) => setPromo({ ...promo, imagenUrl: e.target.value })}
            />

            <input
              placeholder="Código promocional"
              value={promo.codigo}
              onChange={(e) => setPromo({ ...promo, codigo: e.target.value })}
            />

            <button onClick={guardarPromo}>
              <Save size={18} />
              Guardar banner
            </button>
          </div>
        </section>
      )}

      {tab === "productos" && (
        <>
          <section className="admin-grid">
            <form className="admin-card" onSubmit={agregarProducto}>
              <h2>Agregar producto</h2>

              {nuevoProducto.imagenUrl && (
                <img
                  className="admin-product-preview"
                  src={nuevoProducto.imagenUrl}
                  alt="Vista previa"
                />
              )}

              <input
                placeholder="Nombre del producto"
                value={nuevoProducto.nombre}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
                }
              />

              <textarea
                placeholder="Descripción"
                value={nuevoProducto.descripcion}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    descripcion: e.target.value,
                  })
                }
              />

              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={nuevoProducto.precio}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
                }
              />

              <select
                value={nuevoProducto.categoria}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    categoria: e.target.value,
                  })
                }
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>

              <input
                placeholder="URL de imagen del producto"
                value={nuevoProducto.imagenUrl}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    imagenUrl: e.target.value,
                  })
                }
              />

              <div className="admin-row">
                <input
                  placeholder="Emoji si no hay imagen"
                  value={nuevoProducto.icono}
                  onChange={(e) =>
                    setNuevoProducto({ ...nuevoProducto, icono: e.target.value })
                  }
                />

                <select
                  value={nuevoProducto.color}
                  onChange={(e) =>
                    setNuevoProducto({ ...nuevoProducto, color: e.target.value })
                  }
                >
                  <option value="blue">Azul</option>
                  <option value="red">Rojo</option>
                  <option value="purple">Morado</option>
                  <option value="cyan">Celeste</option>
                  <option value="green">Verde</option>
                </select>
              </div>

              <button type="submit">
                <Plus size={18} />
                Agregar producto
              </button>
            </form>
          </section>

          <section className="admin-products">
            <h2>Productos actuales</h2>

            {productos.map((producto) => (
              <div className="admin-product-item improved" key={producto.id}>
                <div className="admin-product-image-box">
                  {producto.imagenUrl ? (
                    <img src={producto.imagenUrl} alt={producto.nombre} />
                  ) : (
                    <span>{producto.icono || "📺"}</span>
                  )}
                </div>

                <div className="admin-edit-grid">
                  <input
                    value={producto.nombre}
                    onChange={(e) =>
                      actualizarProducto(producto.id, "nombre", e.target.value)
                    }
                  />

                  <select
                    value={producto.categoria || ""}
                    onChange={(e) =>
                      actualizarProducto(producto.id, "categoria", e.target.value)
                    }
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.nombre}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>

                  <input
                    value={producto.descripcion}
                    onChange={(e) =>
                      actualizarProducto(
                        producto.id,
                        "descripcion",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    step="0.01"
                    value={producto.precio}
                    onChange={(e) =>
                      actualizarProducto(producto.id, "precio", e.target.value)
                    }
                  />

                  <input
                    className="wide"
                    placeholder="URL imagen"
                    value={producto.imagenUrl || ""}
                    onChange={(e) =>
                      actualizarProducto(producto.id, "imagenUrl", e.target.value)
                    }
                  />
                </div>

                <div className="admin-actions">
                  <button
                    className={
                      producto.activo === false ? "show-btn off" : "show-btn"
                    }
                    onClick={() =>
                      actualizarProducto(
                        producto.id,
                        "activo",
                        producto.activo === false
                      )
                    }
                  >
                    {producto.activo === false ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => eliminarProducto(producto.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {tab === "categorias" && (
        <>
          <section className="admin-grid">
            <form className="admin-card" onSubmit={agregarCategoria}>
              <h2>Agregar categoría / servicio</h2>

              <input
                placeholder="Nombre: Streaming, Office, Apps..."
                value={nuevaCategoria.nombre}
                onChange={(e) =>
                  setNuevaCategoria({
                    ...nuevaCategoria,
                    nombre: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Descripción"
                value={nuevaCategoria.descripcion}
                onChange={(e) =>
                  setNuevaCategoria({
                    ...nuevaCategoria,
                    descripcion: e.target.value,
                  })
                }
              />

              <input
                placeholder="Icono: Monitor, FileText, Smartphone, Gem, Bot, Globe"
                value={nuevaCategoria.icono}
                onChange={(e) =>
                  setNuevaCategoria({
                    ...nuevaCategoria,
                    icono: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Orden"
                value={nuevaCategoria.orden}
                onChange={(e) =>
                  setNuevaCategoria({
                    ...nuevaCategoria,
                    orden: e.target.value,
                  })
                }
              />

              <button type="submit">
                <Plus size={18} />
                Agregar categoría
              </button>
            </form>
          </section>

          <section className="admin-products">
            <h2>Categorías actuales</h2>

            {categorias.map((categoria) => (
              <div className="admin-category-item" key={categoria.id}>
                <input
                  value={categoria.nombre}
                  onChange={(e) =>
                    actualizarCategoria(categoria.id, "nombre", e.target.value)
                  }
                />

                <input
                  value={categoria.descripcion}
                  onChange={(e) =>
                    actualizarCategoria(
                      categoria.id,
                      "descripcion",
                      e.target.value
                    )
                  }
                />

                <input
                  value={categoria.icono}
                  onChange={(e) =>
                    actualizarCategoria(categoria.id, "icono", e.target.value)
                  }
                />

                <input
                  type="number"
                  value={categoria.orden || 1}
                  onChange={(e) =>
                    actualizarCategoria(categoria.id, "orden", e.target.value)
                  }
                />

                <button
                  className={
                    categoria.activo === false ? "show-btn off" : "show-btn"
                  }
                  onClick={() =>
                    actualizarCategoria(
                      categoria.id,
                      "activo",
                      categoria.activo === false
                    )
                  }
                >
                  {categoria.activo === false ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => eliminarCategoria(categoria.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </section>
        </>
      )}

      {tab === "remates" && (
        <>
          <section className="admin-grid">
            <form className="admin-card" onSubmit={agregarRemate}>
              <h2>Agregar promo exclusiva</h2>

              {nuevoRemate.imagenUrl && (
                <img
                  className="admin-product-preview"
                  src={nuevoRemate.imagenUrl}
                  alt="Vista previa"
                />
              )}

              <input
                placeholder="Nombre promo"
                value={nuevoRemate.nombre}
                onChange={(e) =>
                  setNuevoRemate({
                    ...nuevoRemate,
                    nombre: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Descripción"
                value={nuevoRemate.descripcion}
                onChange={(e) =>
                  setNuevoRemate({
                    ...nuevoRemate,
                    descripcion: e.target.value,
                  })
                }
              />

              <div className="admin-row">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio oferta"
                  value={nuevoRemate.precio}
                  onChange={(e) =>
                    setNuevoRemate({
                      ...nuevoRemate,
                      precio: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio antes"
                  value={nuevoRemate.precioAntes}
                  onChange={(e) =>
                    setNuevoRemate({
                      ...nuevoRemate,
                      precioAntes: e.target.value,
                    })
                  }
                />
              </div>

              <input
                placeholder="URL imagen promo"
                value={nuevoRemate.imagenUrl}
                onChange={(e) =>
                  setNuevoRemate({
                    ...nuevoRemate,
                    imagenUrl: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Orden"
                value={nuevoRemate.orden}
                onChange={(e) =>
                  setNuevoRemate({
                    ...nuevoRemate,
                    orden: e.target.value,
                  })
                }
              />

              <button type="submit">
                <Plus size={18} />
                Crear remate
              </button>
            </form>
          </section>

          <section className="admin-products">
            <h2>Remates actuales</h2>

            {remates.map((item) => (
              <div className="admin-product-item improved" key={item.id}>
                <div className="admin-product-image-box">
                  {item.imagenUrl ? (
                    <img src={item.imagenUrl} alt={item.nombre} />
                  ) : (
                    <span>🔥</span>
                  )}
                </div>

                <div className="admin-edit-grid">
                  <input
                    value={item.nombre}
                    onChange={(e) =>
                      actualizarRemate(item.id, "nombre", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    step="0.01"
                    value={item.precio}
                    onChange={(e) =>
                      actualizarRemate(item.id, "precio", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    step="0.01"
                    value={item.precioAntes || ""}
                    onChange={(e) =>
                      actualizarRemate(item.id, "precioAntes", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    value={item.orden || 1}
                    onChange={(e) =>
                      actualizarRemate(item.id, "orden", e.target.value)
                    }
                  />

                  <input
                    className="wide"
                    placeholder="URL imagen"
                    value={item.imagenUrl || ""}
                    onChange={(e) =>
                      actualizarRemate(item.id, "imagenUrl", e.target.value)
                    }
                  />

                  <input
                    className="wide"
                    placeholder="Descripción"
                    value={item.descripcion || ""}
                    onChange={(e) =>
                      actualizarRemate(item.id, "descripcion", e.target.value)
                    }
                  />
                </div>

                <div className="admin-actions">
                  <button
                    className={item.activo === false ? "show-btn off" : "show-btn"}
                    onClick={() =>
                      actualizarRemate(item.id, "activo", item.activo === false)
                    }
                  >
                    {item.activo === false ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => eliminarRemate(item.id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}