import FooterSocialLinks from "@/features/HomeFeatures/Footer/footerSocialLinks";
import logo from "../../../assets/Ketone/footerLogo.png";
import bgImage from "../../../assets/Ketone/uc-bg.jpg";
import React from "react";
import { Link } from "react-router-dom";

const UnderConstruction: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-Awesomegray gap-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      <div className="relative flex flex-col justify-center items-center text-center p-6 bg-black shadow-2xl shadow-black bg-opacity-5 backdrop-blur-lg rounded-3xl border-white border-2">
        <div className="flex justify-center relative h-auto bg-white p-2 rounded-lg shadow-2xl shadow-black backdrop-blur-lg w-full">
          <Link to="/home">
            <img src={logo.src} alt="Logo" className="relative h-16 top-0" />
          </Link>
        </div>
        <h1 className="text-5xl font-inter font-bold text-white mt-12">
          Coming Soon!
        </h1>
        <p className="text-lg font-inter font-bold text-white mt-4">
          We're working hard to finish the development of this page.
        </p>
        <p className="text-white font-inter font-bold">
          Stay tuned for something amazing!
        </p>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mt-8"></div>

        <div className="mt-6 flex justify-evenly space-x-6 bg-white p-6 rounded-lg w-full">
          <FooterSocialLinks />
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
