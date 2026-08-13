import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function SiteLayout() {
  return (
    <>
      <Header />
      {/* Outlet renderiza a página específica da rota */}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
