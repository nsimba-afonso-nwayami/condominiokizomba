import { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import HeaderAdmin from "./HeaderAdmin";

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-700 relative antialiased">
      {/* SIDEBAR */}
      <SidebarAdmin
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* CONTEÚDO */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* HEADER */}
        <HeaderAdmin
          title={title}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN */}
        <main className="mt-16 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
