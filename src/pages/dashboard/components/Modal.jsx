import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, icon, children }) {
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
    <div className="fixed inset-0 z-999 flex flex-col bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* HEADER */}
      <div className="z-10 flex items-center gap-4 border-b border-slate-100 bg-white px-6 py-5 shadow-sm">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-800">
            <i className={`${icon} text-lg`} />
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-[10px] font-bold uppercase leading-none tracking-widest text-slate-500">
            Condomínio Kizonmba
          </p>
        </div>

        {/* FECHAR */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all duration-300 hover:bg-blue-50 hover:text-blue-800 active:scale-90"
        >
          <i className="fas fa-times" />
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 text-slate-700 md:p-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>,
    document.body
  );
}
