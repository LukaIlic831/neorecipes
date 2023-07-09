import React from "react";
import Footer from "../components/footer";
import Categories from "../components/home/categories";
import Header from "../components/home/header";
import LatestRecipes from "../components/home/latest recipes";
import MostLiked from "../components/home/most liked";
import NextLevelInfo from "../components/home/next level info";
import ParallaxHeader from "../components/home/parallax header";
import Nav from "../components/nav";

const Home = () => {
  return (
    <div>
      <NextLevelInfo />
      <Nav />
      <Header />
      <LatestRecipes />
      <MostLiked />
      <ParallaxHeader />
      <Categories />
      <Footer />
    </div>
  );
};

export default Home;
