import {
  Menu,
  Monitor,
  ShoppingCart,
} from "lucide-react";

export default function Navbar({
  totalItems,
  setPage,
  openSidebar,
  onSecretClick,
}) {
  return (
    <header className="navbar">
      <div className="brand">
        <button
          className="brand-icon secret-logo"
          onClick={onSecretClick}
        >
          <Monitor size={22} />
        </button>

        <h2>Streaming PE</h2>
      </div>

      <div className="nav-actions">
        <button
          className="cart-btn"
          onClick={() => setPage("cart")}
        >
          <ShoppingCart size={25} />

          {totalItems > 0 && (
            <span>{totalItems}</span>
          )}
        </button>

        <button
          className="menu-btn"
          onClick={openSidebar}
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}