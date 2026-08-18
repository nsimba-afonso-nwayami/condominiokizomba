import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function ModalSmall({
  isOpen,
  onClose,
  title,
  icon,
  children,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <i className={`${icon} text-sm`} />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Condomínio Kizomba
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <i className="fas fa-times text-sm" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
