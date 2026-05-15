import { Footer } from "@/components/footer";
import Header from "@/components/header";
import NavigationScroll from "@/components/NavigationScroll";
import ScrollToTop from "@/components/ScrollToTop";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <NavigationScroll />
      <Header/>
      <Outlet />
      <Footer/>
      <ScrollToTop/>
    </>
  );
};

export default MainLayout;
