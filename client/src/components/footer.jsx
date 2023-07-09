import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/footerLogo.png";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer>
      <a href="/">
        <figure className="footer__image">
          <img src={logo} alt="" />
        </figure>
      </a>
      {cookies.get("auth-token") ? (
        <ul className="footer__list">
          <li className="footer__list--item">
            <a
              href="#nav"
              className="footer__list--item-link"
              onClick={() => navigate("/")}
            >
              Home
            </a>
          </li>
          <li className="footer__list--item">
            <a
              href="#nav"
              className="footer__list--item-link"
              onClick={() => navigate("/search")}
            >
              Search
            </a>
          </li>
          <li className="footer__list--item">
            <a
              href="#nav"
              className="footer__list--item-link"
              onClick={() => navigate("/profile")}
            >
              Profile
            </a>
          </li>
          <li className="footer__list--item">
            <a
              href="#nav"
              className="footer__list--item-link"
              onClick={() => navigate("/add-recipe")}
            >
              Add Recipe
            </a>
          </li>
        </ul>
      ) : (
        <ul className="footer__list">
          <li className="footer__list--item">
            <a
              href="#nav"
              className="footer__list--item-link"
              onClick={() => navigate("/")}
            >
              Home
            </a>
          </li>
          <li className="footer__list--item">
            <a
              href="#nav"
              className="footer__list--item-link"
              onClick={() => navigate("/search")}
            >
              Search
            </a>
          </li>
          <li className="footer__list--item">
            <a
              href="#nav"
              className="footer__list--item-link"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </a>
          </li>
        </ul>
      )}
      <div className="footer__copyright">
        <p>Copyright © 2023 NeoRecipes</p>
      </div>
    </footer>
  );
};

export default Footer;
