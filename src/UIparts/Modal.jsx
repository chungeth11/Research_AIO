import { useEffect } from "react";

function Modal({ titleId, onClose, className = "", zIndex = 50, children }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{ zIndex }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`max-h-[calc(100dvh-2rem)] w-full min-h-0 overflow-y-auto overscroll-contain rounded-2xl bg-white p-6 shadow-xl sm:p-8 ${className}`}
      >
        {children}
      </section>
    </div>
  );
}

export default Modal;
