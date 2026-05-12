import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminSecret({
  setPage,
}) {
  return (
    <button
      className="admin-secret-btn"
      onClick={() => setPage("admin")}
    >
      <div className="secret-glow"></div>

      <ShieldCheck size={18} />

      <span>Panel privado</span>

      <LockKeyhole size={16} />
    </button>
  );
}