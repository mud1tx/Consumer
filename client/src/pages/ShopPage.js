import React from "react";
import Shop from "../features/Shop/Shop";
import Navbar from "../components/Navbar";
import HeroSection from "../features/Shop/HeroSection";

const ShopPage = () => {
  return (
    <div className="bg-main_color-100">
      <Navbar />
      <HeroSection />
      {/* <div className="bg-main_color-100">
        <h1 className="text-3xl font-semibold  text-main_color-1000 ml-16">
          Featured Product SoFar
        </h1>
      </div> */}
      <Shop />;
    </div>
  );
};

export default ShopPage;
