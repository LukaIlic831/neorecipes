import React, { useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

const RelatedRecipes = ({ allRecipes, relatedRecipesTagIds, setLoading }) => {
  const navigate = useNavigate();
  const { windowWidth } = useContext(AppContext);
  return (
    <div className="related section">
      <div className="title-arrows__wrapper">
        <div className="arrow">
          <FastArrowLeft className="arrow" color={"#7a7a7a"} />
        </div>
        <div className="title__with-arrows">
          <h1>Related Recipes</h1>
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
        {allRecipes
          ?.filter((recipe) => relatedRecipesTagIds.includes(recipe.tagId))
          .map((recipe) => (
            <SwiperSlide
              onClick={() => {
                navigate(`/recipes/${recipe.recipeId}`);
                setLoading(true);
              }}
              key={recipe.recipeId}
            >
              <div className="swiper__image">
                <img
                  src={
                    recipe.mainImage
                  }
                  alt=""
                />
              </div>
              <div className="swiper__desc">
                <div className="swiper__desc--small small">
                  <div className="swiper__desc--small-block small-block hidden-time">
                    <Clock height={16} width={16} color={"#d32626"} />
                    <p>{recipe.preparationTime} minutes</p>
                  </div>
                  <div className="swiper__desc--small-block small-block">
                    <PizzaSlice height={16} width={16} color={"#d32626"} />
                    <p>{recipe.recipeCategory}</p>
                  </div>
                  <div className="swiper__desc--small-block small-block">
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

export default RelatedRecipes;
