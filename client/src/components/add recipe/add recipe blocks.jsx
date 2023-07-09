import React, { useContext, useRef, useState } from "react";
import { Plus, Minus, Trash } from "iconoir-react";
import AddRecipeTag from "./add recipe components/add recipe tag";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { levelsData } from "../../levelsData/levelsData";
import { AppContext } from "../../App";
import Loader from "../loader";

const AddRecipeBlocks = () => {
  const { user, fetchUser } = useContext(AppContext);
  const [steps, setSteps] = useState([{ number: 1, stepDesc: "" }]);
  const [ingredients, setIngredients] = useState([{ ingredientDesc: "" }]);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState();
  const [error, setError] = useState(false);
  const [errorInputNumber, setErrorInputNumber] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const tagsInput = useRef(null);
  const imageBorder = useRef(null);
  const preparationTime = useRef(null);
  const mainErrorBlock = useRef(null);
  const prepErrorBlock = useRef(null);
  const navigate = useNavigate();

  const addStep = () => {
    setSteps([...steps, { number: steps.length + 1, stepDesc: "" }]);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredientDesc: "" }]);
  };

  const removeIngredient = async (ingredientIndex) => {
    setIngredients(ingredients.filter((_, index) => index !== ingredientIndex));
  };

  const removeStep = async (stepIndex) => {
    setSteps(steps.filter((_, index) => index !== stepIndex));
  };

  const checkIfTagExists = (e) => {
    return tags.find((tag) => tag.tag === e.target.value);
  };

  const addTag = (e) => {
    if (!checkIfTagExists(e) && tags.length < 5) {
      setTags([...tags, { tag: e.target.value.toLowerCase() }]);
    }
    tagsInput.current.value = "";
  };

  const addTagOnKeyPress = (e) => {
    e.key === "Enter" && addTag(e);
  };

  const addImage = (e) => {
    setFile(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
    imageBorder.current.style.border = "none";
  };

  const emptyIngredient = () => {
    return ingredients.find(
      (ingredient) => ingredient.ingredientDesc.trim() === ""
    );
  };

  const emptyStep = () => {
    return steps.find((step) => step.stepDesc.trim() === "");
  };

  const addRecipeInfo = async () => {
    if (
      title.length === 0 ||
      ingredients.length === 0 ||
      steps.length === 0 ||
      emptyIngredient() ||
      emptyStep() ||
      !file ||
      tags.length === 0 ||
      !difficultyPreparationOptions.selectedRadio ||
      !categories.selectedRadio
    ) {
      setError(true);
      setTimeout(() => {
        mainErrorBlock.current.style.opacity = 0;
      }, 2000);

      setTimeout(() => {
        setError(false);
      }, 2200);

      return;
    }

    if (
      preparationTime.current.value < 1 ||
      preparationTime.current.value > 360
    ) {
      setErrorInputNumber(true);
      setTimeout(() => {
        prepErrorBlock.current.style.opacity = 0;
      }, 2000);

      setTimeout(() => {
        setErrorInputNumber(false);
      }, 2200);

      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("recipeimage", file);
    formData.append("creatorId", user.id);
    formData.append("recipeId", uuidv4());
    formData.append("ingredientsId", nanoid());
    formData.append("stepId", nanoid());
    formData.append("tagId", nanoid());
    formData.append("title", title);
    formData.append("creatorName", user.username);
    formData.append("preparationTime", preparationTime.current.value);
    formData.append("category", categories.selectedRadio);
    formData.append(
      "difficultyPreparation",
      difficultyPreparationOptions.selectedRadio
    );
    formData.append("steps", JSON.stringify(steps));
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("tags", JSON.stringify(tags));

    await axios
      .post("https://neorecipes.onrender.com/api/add-recipe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => checkUserLevel());
  };

  const checkUserLevel = async () => {
    await axios
      .post("https://neorecipes.onrender.com/api/check-level-incr", {
        nextLevelRecipesNeed: levelsData[user.level + 1],
        userId: user.id,
      })
      .then(() => {
        fetchUser();
        setLoading(false);
        navigate("/");
      });
  };

  const updateIngredientDesc = (e, ingredientIndex) => {
    setIngredients(
      ingredients.map((ingredient, index) =>
        index === ingredientIndex
          ? {
              ...ingredient,
              ingredientDesc: e.target.value,
            }
          : ingredient
      )
    );
  };

  const updateStepDesc = (e, stepIndex) => {
    setSteps(
      steps.map((step, index) =>
        index === stepIndex
          ? {
              ...step,
              stepDesc: e.target.value,
            }
          : step
      )
    );
  };

  const selectOption = (e, name) => {
    if (e.target.name === "difficultyPreparation") {
      setDifficultyPreparationOptions({
        selectedRadio: name,
        options: difficultyPreparationOptions.options,
      });
    } else {
      setCategories({ selectedRadio: name, categories: categories.categories });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="add-recipe__wrapper row">
        <div className="error__message">
          {error && (
            <div className="error__message--block" ref={mainErrorBlock}>
              <p>Everything must be entered</p>
            </div>
          )}
          {errorInputNumber && (
            <div className="error__message--block" ref={prepErrorBlock}>
              <p>Preparation time must be between 1 and 360 minutes</p>
            </div>
          )}
        </div>
        <div className="add-recipe__blocks--wrapper">
          <div className="add-recipe__block add-recipe__first-block">
            <div className="add-recipe__block--para">
              <div className="add-recipe__block--para-title">
                <h1>Add Title</h1>
              </div>
              <div className="add-recipe__block--para-input">
                <input
                  type="text"
                  maxLength="200"
                  placeholder="Title here..."
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="add-recipe__block--para">
              <div className="add-recipe__block--para-title">
                <h1>Add Main Image</h1>
              </div>
              <label
                htmlFor="mainImage"
                className="add-recipe__block--para-image"
              >
                <div
                  className="add-recipe__block--para-image-figure"
                  ref={imageBorder}
                >
                  {filePreview ? (
                    <img alt="" src={filePreview}></img>
                  ) : (
                    <p>Upload image</p>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="mainImage"
                name="recipeimage"
                className="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => addImage(e)}
              />
            </div>
            <div className="add-recipe__block--para">
              <div className="add-recipe__block--para-title">
                <h1>Add Ingredients</h1>
              </div>
              <div className="add-recipe__block--para-ingredients add-recipe__block--para-steps">
                {ingredients.map((ingredient, index) => (
                  <div
                    className="add-recipe__block--para-ingredients-ingredient add-recipe__block--para-steps-step"
                    key={index}
                  >
                    <div
                      className="step__remove"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash
                        height={16}
                        width={16}
                        strokeWidth={3}
                        color={"#edf4f2"}
                      />
                    </div>
                    <div className="step__counter">{index + 1}</div>
                    <div className="step__input">
                      <input
                        maxLength="200"
                        value={ingredient.ingredientDesc}
                        placeholder="Ingredient here..."
                        onChange={(e) => updateIngredientDesc(e, index)}
                      />
                    </div>
                    <div
                      className="mobile__ingredient-step--remove step__add"
                      onClick={() => removeIngredient(index)}
                    >
                      <Minus
                        height={30}
                        width={30}
                        strokeWidth={3}
                        color={"#edf4f2"}
                      />
                    </div>
                  </div>
                ))}
                <div className="add-recipe__block--para-ingredients-add-ingredient add-recipe__block--para-steps-add-step">
                  <div className="step__counter">{ingredients.length + 1}</div>
                  <div className="step__input">
                    <input disabled placeholder="Ingredient here..." />
                  </div>
                  <div className="step__add" onClick={addIngredient}>
                    <Plus
                      height={30}
                      width={30}
                      strokeWidth={3}
                      color={"#edf4f2"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="add-recipe__block--para">
              <div className="add-recipe__block--para-title">
                <h1>Add Preparation Steps</h1>
              </div>
              <div className="add-recipe__block--para-steps">
                {steps.map((step, index) => (
                  <div
                    className="add-recipe__block--para-steps-step"
                    key={index}
                  >
                    <div
                      className="step__remove"
                      onClick={() => removeStep(index)}
                    >
                      <Trash
                        height={16}
                        width={16}
                        strokeWidth={3}
                        color={"#edf4f2"}
                      />
                    </div>
                    <div className="step__counter">{index + 1}</div>
                    <div className="step__input">
                      <textarea
                        maxLength="1500"
                        placeholder="Step text here..."
                        value={step.stepDesc}
                        onChange={(e) => updateStepDesc(e, index)}
                      />
                    </div>
                    <div
                      className="mobile__ingredient-step--remove step__add"
                      onClick={() => removeStep(index)}
                    >
                      <Minus
                        height={30}
                        width={30}
                        strokeWidth={3}
                        color={"#edf4f2"}
                      />
                    </div>
                  </div>
                ))}
                <div className="add-recipe__block--para-steps-add-step">
                  <div className="step__counter">{steps.length + 1}</div>
                  <div className="step__input">
                    <textarea disabled placeholder="Step text here..." />
                  </div>
                  <div className="step__add" onClick={addStep}>
                    <Plus
                      height={30}
                      width={30}
                      strokeWidth={3}
                      color={"#edf4f2"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="add-recipe__block add-recipe__second-block">
            <div className="add-recipe__block--para">
              <div className="add-recipe__block--para-title add-recipe__block--para-filter-title">
                <h1>Add Category</h1>
              </div>
              <ul className="add-recipe__block--para-filter-options">
                {categories?.categories.map((category) => (
                  <li
                    className="add-recipe__block--para-filter-options-option"
                    key={category.optionId}
                  >
                    <label htmlFor={category.optionId}>
                      <input
                        type="radio"
                        name={category.filterName}
                        value={category.optionName}
                        id={category.optionId}
                        checked={
                          category.optionName === categories.selectedRadio
                        }
                        onChange={(e) => selectOption(e, category.optionName)}
                      />
                      <p>{category.optionName}</p>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="add-recipe__block--para">
              <div className="add-recipe__block--para-title add-recipe__block--para-filter-title">
                <h1>Add Difficulty Preparation</h1>
              </div>
              <ul className="add-recipe__block--para-filter-options">
                {difficultyPreparationOptions?.options.map((option) => (
                  <li
                    className="add-recipe__block--para-filter-options-option"
                    key={option.optionId}
                  >
                    <label htmlFor={option.optionId}>
                      <input
                        type="radio"
                        name={option.filterName}
                        value={option.optionName}
                        id={option.optionId}
                        checked={
                          option.optionName ===
                          difficultyPreparationOptions.selectedRadio
                        }
                        onChange={(e) => selectOption(e, option.optionName)}
                      />
                      <p>{option.optionName}</p>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="add-recipe__block--para">
              <div className="add-recipe__block--para-title add-recipe__block--para-filter-title">
                <h1>Add Preparation Time</h1>
              </div>
              <div className="add-recipe__block--para-input number-input">
                <input type="number" defaultValue="1" ref={preparationTime} />
                <span>Minutes</span>
              </div>
            </div>
            <div className="add-recipe__block--para">
              <div className="add-recipe__block--para-title add-recipe__block--para-filter-title">
                <h1>Add Tags</h1>
              </div>
              <div className="add-recipe__block--para-input tags-input">
                <input
                  type="text"
                  placeholder="Tags here... (press enter to add)"
                  maxLength={45}
                  ref={tagsInput}
                  onKeyPress={(e) => addTagOnKeyPress(e)}
                />
              </div>
              <ul className="add-recipe__block--para-tags add-recipe__block--para-filter-options">
                {tags.map((tag, index) => (
                  <AddRecipeTag
                    tagName={tag.tag}
                    setTags={setTags}
                    tags={tags}
                    key={index}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="add-recipe__submit--button">
          <span onClick={() => navigate("/")} className="cancel">
            Cancel
          </span>
          <span onClick={addRecipeInfo}>Add Recipe</span>
        </div>
      </div>
    </>
  );
};

export default AddRecipeBlocks;
