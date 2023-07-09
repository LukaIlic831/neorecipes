import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Cookies from "universal-cookie";
import { AddSquare, Menu, XboxX } from "iconoir-react";

const cookies = new Cookies();

const Nav = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const signOut = () => {
    cookies.remove("auth-token");
    navigate("/signin");
  };

  const openMenu = () => {
    menuRef.current.style.right = 0;
  };

  const close = () => {
    menuRef.current.style.right = "-100%";
  };

  return (
    <>
      <nav id="nav">
        <figure className="logo__wrapper" onClick={() => navigate("/")}>
          <img src={logo} alt="" />
          <h2 className="logo__name">NeoRecipes</h2>
        </figure>
        {cookies.get("auth-token") ? (
          <ul className="nav__list">
            <li className="nav__list--item">
              <a
                className="nav__list--item-link nav__list--item-animation"
                onClick={() => navigate("/")}
              >
                Home
              </a>
            </li>
            <li className="nav__list--item">
              <a
                className="nav__list--item-link nav__list--item-animation"
                onClick={() => navigate("/search")}
              >
                Search
              </a>
            </li>
            <li className="nav__list--item">
              <a
                className="nav__list--item-link nav__list--item-animation"
                onClick={() => navigate("/profile")}
              >
                Profile
              </a>
            </li>
            <li className="nav__list--item">
              <a
                className="nav__list--item-link nav__list--item-animation"
                onClick={signOut}
              >
                Sign Out
              </a>
            </li>
            <li className="nav__list--item">
              <a
                className="nav__list--item-link nav__list--item-button"
                onClick={() => navigate("/add-recipe")}
              >
                Add Recipe
              </a>
            </li>
          </ul>
        ) : (
          <ul className="nav__list">
            <li className="nav__list--item">
              <a
                className="nav__list--item-link nav__list--item-animation"
                onClick={() => navigate("/")}
              >
                Home
              </a>
            </li>
            <li className="nav__list--item">
              <a
                className="nav__list--item-link nav__list--item-animation"
                onClick={() => navigate("/search")}
              >
                Search
              </a>
            </li>
            <li className="nav__list--item">
              <a
                className="nav__list--item-link nav__list--item-button"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </a>
            </li>
          </ul>
        )}
        {cookies.get("auth-token") ? (
          <ul className="nav__list--mobile">
            <li className="nav__list--mobile-item">
              <a
                className="nav__list--mobile-link mobile-icon-add"
                onClick={() => navigate("/add-recipe")}
              >
                <AddSquare className="mobile-icon" color={"#edf4f2"} />
              </a>
            </li>
            <li className="nav__list--mobile-item">
              <a className="nav__list--mobile-link">
                <Menu className="mobile-icon" color={"#222"} onClick={openMenu} />
              </a>
            </li>
          </ul>
        ) : (
          <ul className="nav__list--mobile">
            <li className="nav__list--mobile-item">
              <a className="nav__list--mobile-link">
                <Menu className="mobile-icon" color={"#222"} onClick={openMenu} />
              </a>
            </li>
          </ul>
        )}
      </nav>
      <div className="nav__list--mobile-background" ref={menuRef}>
        {cookies.get("auth-token") ? (
          <>
            <XboxX
              width={40}
              height={40}
              color={"#222"}
              id="menu-close"
              style={{ cursor: "pointer" }}
              onClick={close}
            />
            <ul className="nav__list--mobile-menu">
              <li className="nav__list--mobile-menu-item">
                <a className="nav__list--mobile-menu-item-link"  onClick={() => navigate("/")}>Home</a>
              </li>
              <li className="nav__list--mobile-menu-item">
                <a className="nav__list--mobile-menu-item-link"  onClick={() => navigate("/search")}>Search</a>
              </li>
              <li className="nav__list--mobile-menu-item">
                <a className="nav__list--mobile-menu-item-link"  onClick={() => navigate("/profile")}>Profile</a>
              </li>
              <li className="nav__list--mobile-menu-item">
                <a className="nav__list--mobile-menu-item-link" onClick={signOut}>Sign Out</a>
              </li>
              <li className="nav__list--mobile-menu-item">
                <a className="nav__list--mobile-menu-item-link nav__list--mobile-menu-item-button"  onClick={() => navigate("/add-recipe")}>
                  Add Recipe
                </a>
              </li>
            </ul>
          </>
        ) : (
          <>
          <XboxX
              width={40}
              height={40}
              color={"#222"}
              id="menu-close"
              style={{ cursor: "pointer" }}
              onClick={close}
            />
            <ul className="nav__list--mobile-menu">
              <li className="nav__list--mobile-menu-item">
                <a className="nav__list--mobile-menu-item-link"  onClick={() => navigate("/")}>Home</a>
              </li>
              <li className="nav__list--mobile-menu-item">
                <a className="nav__list--mobile-menu-item-link" onClick={() => navigate("/search")}>Search</a>
              </li>
              <li className="nav__list--mobile-menu-item">
                <a className="nav__list--mobile-menu-item-link nav__list--mobile-menu-item-button" onClick={() => navigate("/signin")}>
                  Sign in
                </a>
              </li>
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Nav;
