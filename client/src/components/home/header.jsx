import React from "react";

const Header = () => {
  return (
    <header id="header">
      <div className="header__block">
        <div className="header__title">
          <h1>Welcome to NeoRecipes Community</h1>
        </div>
        <div className="header__para">
          <p>
            There are more than 200,000 recipes on NeoRecipes. Many of them
            process individual dishes in different ways. Here you can browse all
            the dishes we know and find the best recipes for your favorite dish.
          </p>
        </div>
        <div className="header__button">
          <a href="#latest">View Recipes</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
