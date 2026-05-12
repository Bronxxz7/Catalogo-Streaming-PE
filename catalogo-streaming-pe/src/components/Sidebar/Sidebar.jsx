import {
  X,
  Home,
  LayoutGrid,
  Gift,
  Search,
  Monitor,
  FileText,
  Smartphone,
  Bot,
  Globe,
  Gem,
} from "lucide-react";

const iconos = {
  Monitor,
  FileText,
  Smartphone,
  Bot,
  Globe,
  Gem,
};

export default function Sidebar({
  open,
  closeSidebar,
  setSection,
  setSearchTerm,
  setCategory,
  categorias = [],
}) {
  const goTo = (section) => {
    setSection(section);
    closeSidebar();
  };

  const chooseCategory = (category) => {
    setCategory(category);
    setSection("catalogo");
    closeSidebar();
  };

  return (
    <>
      <div
        className={
          open
            ? "sidebar-overlay active"
            : "sidebar-overlay"
        }
        onClick={closeSidebar}
      />

      <aside
        className={
          open
            ? "sidebar active"
            : "sidebar"
        }
      >
        <div className="sidebar-top">
          <h2>Explorar</h2>

          <button
            className="close-sidebar"
            onClick={closeSidebar}
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar productos..."
            onChange={(e) => {
              setSearchTerm(
                e.target.value
              );

              setSection(
                "catalogo"
              );
            }}
          />
        </div>

        <nav className="sidebar-links">
          <button
            onClick={() =>
              goTo("inicio")
            }
          >
            <Home size={18} />
            Inicio
          </button>

          <button
            onClick={() =>
              goTo("catalogo")
            }
          >
            <LayoutGrid size={18} />
            Catálogo
          </button>

          <button
            onClick={() =>
              goTo(
                "promociones"
              )
            }
          >
            <Gift size={18} />
            Promociones
          </button>
        </nav>

        <div className="sidebar-section">
          <span className="sidebar-title">
            Categorías
          </span>

          <div className="sidebar-categories dynamic">
            {categorias
              .filter(
                (categoria) =>
                  categoria.activo !==
                  false
              )
              .map((categoria) => {
                const Icono =
                  iconos[
                    categoria.icono
                  ] || Monitor;

                return (
                  <button
                    key={
                      categoria.id
                    }
                    onClick={() =>
                      chooseCategory(
                        categoria.nombre
                      )
                    }
                  >
                    <Icono
                      size={17}
                    />

                    <div className="cat-info">
                      <strong>
                        {
                          categoria.nombre
                        }
                      </strong>

                      <small>
                        {
                          categoria.descripcion
                        }
                      </small>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        <div className="sidebar-promo">
          <span>EXCLUSIVO</span>

          <h3>
            Promos Premium
          </h3>

          <p>
            Combos especiales y
            ofertas limitadas
            disponibles.
          </p>

          <button
            onClick={() =>
              goTo(
                "promociones"
              )
            }
          >
            Ver promociones
          </button>
        </div>
      </aside>
    </>
  );
}