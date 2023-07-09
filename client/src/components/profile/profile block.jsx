import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Clock, PizzaSlice, ThumbsUp } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { levelsData } from "../../levelsData/levelsData";
import Cookies from "universal-cookie";
import Loader from "../loader";

const cookies = new Cookies();

const ProfileBlock = () => {
  const { user, windowWidth, setUser, fetchUser } = useContext(AppContext);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [showMyRecipes, setShowMyRecipes] = useState(true);
  const [optionsDisplay, setOptionsDisplay] = useState("none");
  const [filePreview, setFilePreview] = useState();

  const navigate = useNavigate();

  const fetchUserAfterDeletingRecipe = async () => {
    if (cookies.get("auth-token")) {
      await axios
        .get(
          `https://neorecipes.onrender.com/api/user/${cookies.get(
            "auth-token"
          )}`
        )
        .then((data) => {
          if (localStorage.getItem("currentLevel") !== data.data[0].level) {
            localStorage.currentLevel = data.data[0].level;
          }
          setUser(data.data[0]);
        });
    }
  };

  const fetchMyRecipes = async () => {
    user &&
      (await axios
        .get(`https://neorecipes.onrender.com/api/my-recipes/${user.id}`)
        .then((data) => {
          setMyRecipes(data.data);
          setLoading(false);
        }));
  };

  const fetchLikedRecipes = async () => {
    user &&
      (await axios
        .get(`https://neorecipes.onrender.com/api/liked-recipes/${user.id}`)
        .then((data) => setLikedRecipes(data.data)));
  };

  const changeOption = (e) => {
    if (e.target.value === "likedRecipes") {
      setShowMyRecipes(false);
      setOptionsDisplay("none");
    } else {
      setShowMyRecipes(true);
    }
  };

  const checkLevel = async () => {
    user.level > 1
      ? await axios
          .post("https://neorecipes.onrender.com/api/check-level-decr", {
            userLevel: levelsData[user.level],
            userId: user.id,
          })
          .then(() => {
            fetchMyRecipes();
            fetchUserAfterDeletingRecipe();
          })
      : fetchMyRecipes();
  };

  const deleteRecipe = async (recipeId, stepId, tagId, ingredientsId) => {
    setLoading(true);
    await axios
      .post("https://neorecipes.onrender.com/api/delete-recipe", {
        recipeId: recipeId,
        stepId: stepId,
        tagId: tagId,
        ingredientsId: ingredientsId,
      })
      .then(() => {
        checkLevel();
      });
  };

  const changeImage = async (e) => {
    setLoading(true);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
    let formData = new FormData();
    formData.append("changedImage", e.target.files[0]);
    formData.append("id", user.id);
    await axios
      .post("https://neorecipes.onrender.com/api/change-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        fetchUser();
        setLoading(false);
      });
  };

  const showOptions = (e) => {
    e.target.checked ? setOptionsDisplay("flex") : setOptionsDisplay("none");
  };

  useEffect(() => {
    fetchMyRecipes();
    fetchLikedRecipes();
  }, [user]);

  return (
    <div className="section">
      {loading && <Loader />}
      <div className="profile__wrapper row">
        <div className="profile__block">
          <figure className="profile__block--image">
            {filePreview ? (
              <img src={filePreview} alt="" />
            ) : (
              user?.profileImage && <img src={user?.profileImage} alt="" />
            )}
            <label htmlFor="changeImage" className="profile__block--image-add">
              <input
                type="file"
                id="changeImage"
                name="changedImage"
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => changeImage(e)}
              />
              <div className="profile__block--image-add-text">
                <span>Change Image</span>
              </div>
            </label>
          </figure>
          <div className="profile__block--username">
            <p>
              Username: <span>{user?.username}</span>
            </p>
            <p>
              Level: <span>{user?.level}</span>
            </p>
            <span>
              ({levelsData[user?.level + 1] - myRecipes?.length} more{" "}
              {levelsData[user?.level + 1] - myRecipes?.length === 1
                ? "recipe "
                : "recipes "}
              for next level)
            </span>
          </div>
        </div>
        <div className="profile__block">
          <div className="profile__block--para">
            <div className="profile__block--para-title">
              <h1>Email</h1>
            </div>
            <div className="profile__block--para-email">
              <p>{user?.email}</p>
            </div>
          </div>
          <div className="profile__block--para">
            <div className="profile__block--para-title">
              <h1>Description</h1>
            </div>
            <div className="profile__block--para-desc">
              <p>{user?.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="profile__recipes row">
        <ul className="profile__recipes--list">
          <label htmlFor="myRecipes">
            <input
              type="radio"
              name="recipes"
              value="myRecipes"
              defaultChecked
              id="myRecipes"
              onChange={(e) => changeOption(e)}
            />
            <li className="profile__recipes--list-item">
              <p>My Recipes</p>
            </li>
          </label>
          <label htmlFor="likedRecipes">
            <input
              type="radio"
              name="recipes"
              value="likedRecipes"
              id="likedRecipes"
              onChange={(e) => changeOption(e)}
            />
            <li className="profile__recipes--list-item">
              <p>Liked Recipes</p>
            </li>
          </label>
        </ul>
        {showMyRecipes && myRecipes.length > 0 && (
          <div className="mobile__open--options">
            <input
              type="checkbox"
              id="options"
              onChange={(e) => showOptions(e)}
            />
            <label htmlFor="options">
              <span>Show Options</span>
            </label>
          </div>
        )}
      </div>
      {showMyRecipes ? (
        <>
          {myRecipes.length > 0 ? (
            <div className="my-recipes__wrapper">
              {myRecipes?.map((recipe) => (
                <div className="my-recipe" key={recipe.recipeId}>
                  <div
                    className="my-recipe__options"
                    style={{
                      display: windowWidth < 768 ? optionsDisplay : "flex",
                    }}
                  >
                    <div className="my-recipe__options--option">
                      <button
                        onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                      >
                        View
                      </button>
                    </div>
                    <div className="my-recipe__options--option">
                      <button
                        onClick={() =>
                          navigate(`/edit-recipe/${recipe.recipeId}`, {
                            state: {
                              recipe: recipe,
                            },
                          })
                        }
                      >
                        Edit
                      </button>
                    </div>
                    <div className="my-recipe__options--option">
                      <button
                        onClick={() =>
                          deleteRecipe(
                            recipe.recipeId,
                            recipe.stepId,
                            recipe.tagId,
                            recipe.ingredientsId
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <figure className="my-recipe__image">
                    <img src={recipe.mainImage} alt="" />
                  </figure>
                  <div className="my-recipe__desc">
                    <div className="small">
                      <div className="my-recipe__desc--small-block small-block">
                        <Clock height={16} width={16} color={"#d32626"} />
                        <p>{recipe.preparationTime} minutes</p>
                      </div>
                      <div className="my-recipe__desc--small-block small-block">
                        <PizzaSlice height={16} width={16} color={"#d32626"} />
                        <p>{recipe.recipeCategory}</p>
                      </div>
                      <div className="my-recipe__desc--small-block small-block">
                        <ThumbsUp height={16} width={16} color={"#d32626"} />
                        <p>{recipe.likes}</p>
                      </div>
                    </div>
                    <div className="my-recipe__desc--para">
                      <h5>{recipe.title}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h2>There are no recipes</h2>
            </div>
          )}
        </>
      ) : (
        <>
          {likedRecipes.length > 0 ? (
            <div className="liked-recipes__wrapper my-recipes__wrapper">
              {likedRecipes?.map((recipe) => (
                <div
                  className="liked-recipe my-recipe"
                  onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
                  style={{ cursor: "pointer" }}
                  key={recipe.recipeId}
                >
                  <figure className="liked-recipe__image my-recipe__image">
                    <img src={recipe.mainImage} alt="" />
                  </figure>
                  <div className="liked-recipe__desc my-recipe__desc">
                    <div className="small">
                      <div className="liked-recipe__desc--small-block my-recipe__desc--small-block small-block">
                        <Clock height={16} width={16} color={"#d32626"} />
                        <p>{recipe.preparationTime} minutes</p>
                      </div>
                      <div className="liked-recipe__desc--small-block my-recipe__desc--small-block small-block">
                        <PizzaSlice height={16} width={16} color={"#d32626"} />
                        <p>{recipe.recipeCategory}</p>
                      </div>
                      <div className="liked-recipe__desc--small-block my-recipe__desc--small-block small-block">
                        <ThumbsUp height={16} width={16} color={"#d32626"} />
                        <p>{recipe.likes}</p>
                      </div>
                    </div>
                    <div className="liked-recipe__desc--para my-recipe__desc--para">
                      <h5>{recipe.title}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h2>There are no recipes</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileBlock;
