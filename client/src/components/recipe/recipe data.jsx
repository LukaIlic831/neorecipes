import React, { useContext, useEffect, useState } from "react";
import {
  User,
  Clock,
  ThumbsUp,
  DashboardDots,
  RefreshDouble,
} from "iconoir-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RelatedRecipes from "./related recipes";
import { AppContext } from "../../App";
import Cookies from "universal-cookie";
import Loader from "../loader";

const cookies = new Cookies();

const RecipeData = () => {
  const { user } = useContext(AppContext);
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [allRecipes, setAllRecipes] = useState([]);
  const [recipe, setRecipe] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState();
  const [tags, setTags] = useState();
  const [relatedRecipesTagIds, setRelatedRecipesTagIds] = useState();
  const [recipeLiked, setRecipeLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const fetchIngredients = async (ingredientsId) => {
    await axios
      .get(
        `https://neorecipes.onrender.com/api/recipe/ingredients/${ingredientsId}`
      )
      .then((data) => setIngredients(data.data));
  };

  const fetchSteps = async (stepId) => {
    await axios
      .get(`https://neorecipes.onrender.com/api/recipe/steps/${stepId}`)
      .then((data) => setSteps(data.data));
  };

  const fetchAllRecipes = async () => {
    await axios
      .get("https://neorecipes.onrender.com/api/all-recipes")
      .then((data) => setAllRecipes(data.data));
  };

  const likeRecipe = async () => {
    setLikeLoading(true);
    let likeOrDislike = !recipeLiked;
    likeOrDislike
      ? await axios
          .post("https://neorecipes.onrender.com/api/add-like", {
            recipeId: params.id,
            userId: user.id,
          })
          .then(() => {
            setRecipeLiked(likeOrDislike);
            setLikeLoading(false);
          })
      : await axios
          .post("https://neorecipes.onrender.com/api/remove-like", {
            recipeId: params.id,
            userId: user.id,
          })
          .then(() => {
            setRecipeLiked(likeOrDislike);
            setLikeLoading(false);
          });
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      await axios
        .get(`https://neorecipes.onrender.com/api/recipe/${params.id}`)
        .then((data) => {
          setRecipe(data.data[0]);
          fetchIngredients(data.data[0].ingredientsId);
          fetchSteps(data.data[0].stepId);
          fetchTags(data.data[0].tagId);
        });
    };

    const fetchTags = async (tagId) => {
      await axios
        .get(`https://neorecipes.onrender.com/api/recipe/tags/${tagId}`)
        .then((data) => {
          setTags(data.data);
          fetchAllTags(tagId, data.data);
        });
    };

    const fetchAllTags = async (tagId, tags) => {
      let thisRecipeTags = [];
      let sameTags = [];
      tags?.map((tag) => thisRecipeTags.push(tag.tag));
      await axios
        .get(`https://neorecipes.onrender.com/api/recipe/all-tags/${tagId}`)
        .then((data) => {
          data.data.map(
            (tag) =>
              thisRecipeTags.includes(tag.tag) &&
              !sameTags.includes(tag.tagId) &&
              sameTags.push(tag.tagId)
          );
          setRelatedRecipesTagIds(sameTags);
          fetchAllRecipes();
          setLoading(false);
        });
    };

    fetchRecipe();
  }, [params.id, recipeLiked]);

  useEffect(() => {
    const checkRecipeLiked = async () => {
      user &&
        recipe &&
        (await axios
          .get(
            `https://neorecipes.onrender.com/api/find-if-liked/${recipe.recipeId}&${user.id}`
          )
          .then((data) => {
            data.data.length > 0 ? setRecipeLiked(true) : setRecipeLiked(false);
          }));
    };
    checkRecipeLiked();
  }, [recipe, user]);

  return (
    <div className="section">
      {loading && <Loader />}
      <div className="recipe row">
        <div className="recipe__title">
          <h1>{recipe?.title}</h1>
        </div>
        <div className="mobile__recipe--date">
          <p>{recipe?.createDate}</p>
        </div>
        <figure className="recipe__main-image">
          {recipe?.mainImage && <img src={recipe.mainImage} alt="" />}
          <div className="recipe__date">
            <span>{recipe?.createDate}</span>
          </div>
          {cookies.get("auth-token") && (
            <div className="recipe__like">
              {recipeLiked ? (
                <>
                  {likeLoading ? (
                    <RefreshDouble
                      id="like-loader"
                      height={32}
                      width={32}
                      color={"#edf4f2"}
                    />
                  ) : (
                    <ThumbsUp
                      id="like"
                      height={32}
                      width={32}
                      fill={"#edf4f2"}
                      color={"#edf4f2"}
                      onClick={likeRecipe}
                    />
                  )}
                  <span>Recipe is liked</span>
                </>
              ) : (
                <>
                  {likeLoading ? (
                    <RefreshDouble
                      id="like-loader"
                      height={32}
                      width={32}
                      color={"#edf4f2"}
                    />
                  ) : (
                    <ThumbsUp
                      id="like"
                      height={32}
                      width={32}
                      color={"#edf4f2"}
                      onClick={likeRecipe}
                    />
                  )}
                  <span>Like this recipe</span>
                </>
              )}
            </div>
          )}
        </figure>
        <div className="recipe__small--blocks small">
          <div className="recipe__small--block small-block">
            <User height={16} width={16} color={"#d32626"} />
            <p>{recipe?.creatorName}</p>
          </div>
          <div className="recipe__small--block small-block">
            <DashboardDots height={16} width={16} color={"#d32626"} />
            <p>{recipe?.preparationDifficulty}</p>
          </div>
          <div className="recipe__small--block small-block">
            <Clock height={16} width={16} color={"#d32626"} />
            <p>{recipe?.preparationTime} minutes</p>
          </div>
          <div className="recipe__small--block small-block recipe-data-hidden-likes">
            <ThumbsUp height={16} width={16} color={"#d32626"} />
            <p>{recipe?.likes}</p>
          </div>
        </div>
        <div className="recipe__desc">
          <div className="recipe__ingredients recipe__desc--block">
            <div className="recipe__ingredients--title recipe__desc--title">
              <h4>Ingredients</h4>
            </div>
            <ul className="recipe__ingredients--list">
              {ingredients?.map((ingredient, index) => (
                <li className="recipe__ingredients--list-item" key={index}>
                  <p>{ingredient.ingredient}</p>
                </li>
              ))}
            </ul>
            <div className="recipe__tags recipe__desc--block">
              <div className="recipe__ingredients--title recipe__desc--title">
                <h4>Tags</h4>
              </div>
              <ul className="recipe__tags--list">
                {tags?.map((tag, index) => (
                  <li className="recipe__tags--list-item" key={index}>
                    <p className="recipe__tags--list-item-tag">{tag.tag}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="recipe__prep recipe__desc--block">
            <div className="recipe__prep--title recipe__desc--title">
              <h4>Preparation</h4>
            </div>
            <ol className="recipe__prep--list">
              {steps?.map((step, index) => (
                <li className="recipe__prep--list-item" key={index}>
                  <p>{step.stepDesc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      {relatedRecipesTagIds?.length > 0 && (
        <RelatedRecipes
          allRecipes={allRecipes}
          relatedRecipesTagIds={relatedRecipesTagIds}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default RecipeData;
