import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Clock, PizzaSlice, ThumbsUp } from "iconoir-react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../loader";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [categories, setCategories] = useState({
    selectedRadio: null,
    categories: [
      {
        optionName: "Desserts",
        optionId: "category1",
        filterName: "categories",
      },
      {
        optionName: "Warm Appetizers",
        optionId: "category2",
        filterName: "categories",
      },
      { optionName: "Pastry", optionId: "category3", filterName: "categories" },
      {
        optionName: "Cold Appetizers",
        optionId: "category4",
        filterName: "categories",
      },
      { optionName: "Salad", optionId: "category5", filterName: "categories" },
      {
        optionName: "Main Dishes",
        optionId: "category6",
        filterName: "categories",
      },
    ],
  });
  const [difficultyPreparationOptions, setDifficultyPreparationOptions] =
    useState({
      selectedRadio: null,
      options: [
        {
          optionName: "Easy",
          optionId: "difficulty1",
          filterName: "difficultyPreparation",
        },
        {
          optionName: "Intermediate",
          optionId: "difficulty2",
          filterName: "difficultyPreparation",
        },
        {
          optionName: "Hard",
          optionId: "difficulty3",
          filterName: "difficultyPreparation",
        },
      ],
    });
  const [minutes, setMinutes] = useState("?");
  const [category, setCategory] = useState(
    location.state?.name ? location.state.name : ""
  );
  const [difficultyPreparation, setDifficultyPreparation] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const searchValueRef = useRef(null);
  const inputNumberRef = useRef(null);

  const fetchAllRecipes = async () => {
    await axios
      .get("https://neorecipes.onrender.com/api/all-recipes")
      .then((data) => {
        setRecipes(data.data);
        setLoading(false);
      });
  };

  const resetFilters = () => {
    setDifficultyPreparationOptions({
      selectedRadio: null,
      options: difficultyPreparationOptions.options,
    });
    setCategories({ selectedRadio: null, categories: categories.categories });
    searchValueRef.current.value = "";
    setSearchValue("");
    setCategory("");
    setDifficultyPreparation("");
    setMinutes("?");
    inputNumberRef.current.value = inputNumberRef.current.min;
    fetchAllRecipes();
  };

  const selectOption = (e, id) => {
    if (e.target.name === "difficultyPreparation") {
      setDifficultyPreparationOptions({
        selectedRadio: id,
        options: difficultyPreparationOptions.options,
      });
      setDifficultyPreparation(e.target.value);
    } else {
      setCategories({ selectedRadio: id, categories: categories.categories });
      setCategory(e.target.value);
    }
  };

  useEffect(() => {
    const categoryFromHome = () => {
      if (location.state) {
        setCategories({
          selectedRadio: location.state.id,
          categories: categories.categories,
        });
      } else {
        fetchAllRecipes();
      }
      window.history.replaceState({}, document.title);
    };

    categoryFromHome();
  }, []);

  useEffect(() => {
    const fetchSearchOptions = async () => {
      setLoadingRecipes(true);
      await axios
        .post("https://neorecipes.onrender.com/api/search-recipes", {
          category: category,
          searchValue: searchValue.trim(),
          difficultyPreparation: difficultyPreparation,
        })
        .then((data) => {
          setRecipes(data.data);
          setLoadingRecipes(false);
          setLoading(false);
        });
    };

    fetchSearchOptions();
  }, [category, difficultyPreparation, searchValue]);

  return (
    <div className="section search-margin">
      {loading && <Loader />}
      <div className="search__blocks--wrapper row">
        <div className="search__wrapper">
          <div className="search__input--wrapper">
            <input
              type="text"
              placeholder="What do you want to eat today?"
              ref={searchValueRef}
              onBlur={(e) =>
                setTimeout(() => {
                  setSearchValue(e.target.value);
                }, 300)
              }
              onKeyUp={(e) => {
                e.key == "Enter" &&
                  setTimeout(() => {
                    setSearchValue(e.target.value);
                  }, 300);
              }}
            />
          </div>
          <div className="search__filter">
            <div className="search__filter--title">
              <h1>Difficulty Preparation</h1>
            </div>
            <ul className="search__filter--options">
              {difficultyPreparationOptions.options.map((option) => (
                <li className="search__filter--option" key={option.optionId}>
                  <label htmlFor={option.optionId}>
                    <input
                      type="radio"
                      name={option.filterName}
                      value={option.optionName}
                      id={option.optionId}
                      checked={
                        option.optionId ===
                        difficultyPreparationOptions.selectedRadio
                      }
                      onChange={(e) => selectOption(e, option.optionId)}
                    />
                    <p>{option.optionName}</p>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="search__filter">
            <div className="search__filter--title">
              <h1>Categories</h1>
            </div>
            <ul className="search__filter--options">
              {categories?.categories.map((category) => (
                <li className="search__filter--option" key={category.optionId}>
                  <label htmlFor={category.optionId}>
                    <input
                      type="radio"
                      name={category.filterName}
                      value={category.optionName}
                      id={category.optionId}
                      checked={category.optionId === categories.selectedRadio}
                      onChange={(e) => selectOption(e, category.optionId)}
                    />
                    <p>{category.optionName}</p>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="search__filter search__filter--range">
            <div className="search__filter--title">
              <h1>Preparation Time</h1>
            </div>
            <div className="search__filter--input-range">
              <input
                type="range"
                min="1"
                max="360"
                defaultValue="1"
                ref={inputNumberRef}
                onChange={(e) => setMinutes(e.target.value)}
              />
              <span id="output">Less than {minutes} minutes (or equal)</span>
            </div>
          </div>
          <div className="search__filter search__filter--button">
            <span onClick={resetFilters}>Reset</span>
          </div>
        </div>
        {loadingRecipes ? (
          <div className="all-recipes__wrapper">
            <div className="loading-recipes no-results">
              <h2>Finding right recipes...</h2>
            </div>
          </div>
        ) : (
          <div className="all-recipes__wrapper">
            {minutes !== "?" ? (
              recipes.filter((recipe) => recipe.preparationTime <= minutes)
                .length > 0 ? (
                recipes
                  ?.filter((recipe) => recipe.preparationTime <= minutes)
                  .map((recipe) => (
                    <div
                      className="all-recipes__recipe"
                      key={recipe.recipeId}
                      onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                    >
                      <figure className="all-recipes__recipe--image">
                        <img src={recipe.mainImage} alt="" />
                      </figure>
                      <div className="all-recipes__recipe--desc">
                        <div className="all-recipes__recipe--desc small">
                          <div className="swiper__desc--small-block small-block">
                            <Clock height={16} width={16} color={"#d32626"} />
                            <p>{recipe.preparationTime} minutes</p>
                          </div>
                          <div className="swiper__desc--small-block small-block">
                            <PizzaSlice
                              height={16}
                              width={16}
                              color={"#d32626"}
                            />
                            <p>{recipe.recipeCategory}</p>
                          </div>
                          <div className="swiper__desc--small-block small-block">
                            <ThumbsUp
                              height={16}
                              width={16}
                              color={"#d32626"}
                            />
                            <p>{recipe.likes}</p>
                          </div>
                        </div>
                        <div className="all-recipes__recipe--desc-para">
                          <h5>{recipe.title}</h5>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="no-results">
                  <h2>There are no recipes</h2>
                </div>
              )
            ) : recipes.length > 0 ? (
              recipes?.map((recipe) => (
                <div
                  className="all-recipes__recipe"
                  key={recipe.recipeId}
                  onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                >
                  <figure className="all-recipes__recipe--image">
                    <img src={recipe.mainImage} alt="" />
                  </figure>
                  <div className="all-recipes__recipe--desc">
                    <div className="all-recipes__recipe--desc small">
                      <div className="swiper__desc--small-block small-block">
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
                    <div className="all-recipes__recipe--desc-para">
                      <h5>{recipe.title}</h5>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h2>There are no recipes</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
