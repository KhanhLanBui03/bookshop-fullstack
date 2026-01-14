import { Footer } from "@/components/footer";
import Header from "@/components/header";
import ScrollToTop from "@/components/ScrollToTop";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header/>
      <Outlet />
      <Footer/>
      <ScrollToTop/>
    </>
  );
};

export default MainLayout;
