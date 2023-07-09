import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const ParallaxHeader = () => {
  const navigate = useNavigate();
  return (
    <header id="parallax-header">
      <div className="parallax-header__block">
        <div className="parallax-header__block--sub-title">
          <span>Eat. Love. Cook.</span>
        </div>
        <div className="parallax-header__block--title">
          <h1>Show Us Your Culinary Masterpiece</h1>
        </div>
        {cookies.get("auth-token") ? (
          <div className="parallax-header__block--button">
            <span onClick={() => navigate("/add-recipe")}>Add Recipe Now</span>
          </div>
        ) : (
          <div className="parallax-header__block--button">
            <span onClick={() => navigate("/signin")}>Sign in Now</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default ParallaxHeader;
