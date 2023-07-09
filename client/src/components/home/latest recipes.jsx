import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import {
  PizzaSlice,
  Clock,
  ThumbsUp,
  FastArrowLeft,
  FastArrowRight,
} from "iconoir-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import Loader from "../loader";

const LatestRecipes = () => {
  const { windowWidth } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [latestRecipes, setLatestRecipes] = useState([]);

  const fetchLatestRecipes = async () => {
    await axios
      .get("https://neorecipes.onrender.com/api/latest-recipes")
      .then((data) => {
        setLatestRecipes(data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLatestRecipes();
  }, []);

  return (
    <div className="latest section" id="latest">
      {loading && <Loader />}
      <div className="title-arrows__wrapper">
        <div className="arrow">
          <FastArrowLeft className="arrow" color={"#7a7a7a"} />
        </div>
        <div className="title__with-arrows">
          <h1>Latest Recipes</h1>
        </div>
        <div className="arrow">
          <FastArrowRight className="arrow" color={"#7a7a7a"} />
        </div>
      </div>
      <Swiper
        slidesPerView={
          windowWidth
            ? windowWidth > 768
              ? 3
              : windowWidth < 768 && windowWidth > 420
              ? 2
              : 1
            : 3
        }
        spaceBetween={30}
        modules={[Pagination]}
      >
        {latestRecipes.length > 0 &&
          latestRecipes?.map((recipe) => (
            <SwiperSlide
              onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
              key={recipe.recipeId}
            >
              <div className="swiper__image">
                <img src={recipe.mainImage} alt="" />
              </div>
              <div className="swiper__desc">
                <div className="swiper__desc--small small">
                  <div className="swiper__desc--small-block small-block">
                    <Clock height={16} width={16} color={"#d32626"} />
                    <p>{recipe.preparationTime} minutes</p>
                  </div>
                  <div className="swiper__desc--small-block small-block">
                    <PizzaSlice height={16} width={16} color={"#d32626"} />
                    <p>{recipe.recipeCategory}</p>
                  </div>
                  <div className="swiper__desc--small-block small-block hidden-likes">
                    <ThumbsUp height={16} width={16} color={"#d32626"} />
                    <p>{recipe.likes}</p>
                  </div>
                </div>
                <div className="swiper__desc--para">
                  <h5>{recipe.title}</h5>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default LatestRecipes;
