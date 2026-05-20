import { useStore } from "../context/StoreContext";

export default function Toast() {
  const { toastMsg, toastVisible } = useStore();

  return (
    <div className={`toast${toastVisible ? " show" : ""}`}>
      <span className="toast-icon">✓</span>
      <span>{toastMsg}</span>
    </div>
  );
}
