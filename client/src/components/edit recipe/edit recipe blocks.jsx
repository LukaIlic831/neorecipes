import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EditRecipeTag from "./edit recipe components/edit recipe tag";
import { Plus, Trash, Minus } from "iconoir-react";
import Loader from "../loader";

const EditRecipeBlocks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(location.state?.recipe);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [tags, setTags] = useState();
  const [preparationTime, setPreparationTime] = useState(
    recipe?.preparationTime
  );
  const [title, setTitle] = useState(recipe?.title);
  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState();
  const [error, setError] = useState(false);
  const [errorInputNumber, setErrorInputNumber] = useState(false);
  const [loading, setLoading] = useState(true);
  const tagsInput = useRef(null);
  const imageBorder = useRef(null);
  const mainErrorBlock = useRef(null);
  const prepErrorBlock = useRef(null);

  const [categories, setCategories] = useState({
    selectedRadio: recipe?.recipeCategory,
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
      selectedRadio: recipe?.preparationDifficulty,
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

  const fetchTags = async (tagId) => {
    await axios
      .get(`https://neorecipes.onrender.com/api/recipe/tags/${tagId}`)
      .then((data) => {
        setTags(data.data);
        setLoading(false);
      });
  };

  const emptyIngredient = () => {
    return ingredients.find(
      (ingredient) => ingredient.ingredient.trim() === ""
    );
  };

  const emptyStep = () => {
    return steps.find((step) => step.stepDesc.trim() === "");
  };

  const updateRecipeInfo = async () => {
    if (
      title.length === 0 ||
      ingredients.length === 0 ||
      steps.length === 0 ||
      emptyIngredient() ||
      emptyStep() ||
      tags.length === 0
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

    if (preparationTime < 1 || preparationTime > 360) {
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
    file && formData.append("updatedimage", file);
    formData.append("recipeId", recipe.recipeId);
    formData.append("ingredientsId", recipe.ingredientsId);
    formData.append("stepId", recipe.stepId);
    formData.append("tagId", recipe.tagId);
    formData.append("imageLink", recipe.mainImage);
    formData.append("title", title);
    formData.append("category", categories.selectedRadio);
    formData.append("preparationTime", preparationTime);
    formData.append(
      "difficultyPreparation",
      difficultyPreparationOptions.selectedRadio
    );
    formData.append("steps", JSON.stringify(steps));
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("tags", JSON.stringify(tags));

    await axios
      .post("https://neorecipes.onrender.com/api/update-recipe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setLoading(false);
        navigate("/profile");
      });
  };

  const addStep = () => {
    setSteps([...steps, { stepDesc: "" }]);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: "" }]);
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
  };

  const updateIngredientDesc = (e, ingredientIndex) => {
    setIngredients(
      ingredients.map((ingredient, index) =>
        index === ingredientIndex
          ? {
              ...ingredient,
              ingredient: e.target.value,
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

  useEffect(() => {
    fetchSteps(recipe?.stepId);
    fetchIngredients(recipe?.ingredientsId);
    fetchTags(recipe?.tagId);
  }, [recipe?.ingredientsId, recipe?.tagId, recipe?.stepId]);

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
                  value={title}
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
                  className="edit-recipe__block--para-image-figure add-recipe__block--para-image-figure"
                  ref={imageBorder}
                >
                  {filePreview ? (
                    <img alt="" src={filePreview} />
                  ) : (
                    <img alt="" src={recipe.mainImage} />
                  )}
                </div>
              </label>
              <input
                type="file"
                id="mainImage"
                name="updatedimage"
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
                {ingredients?.map((ingredient, index) => (
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
                        value={ingredient.ingredient}
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
                  <div className="step__counter">{ingredients?.length + 1}</div>
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
                {steps?.map((step, index) => (
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
                  <div className="step__counter">{steps?.length + 1}</div>
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
                <input
                  type="number"
                  defaultValue="1"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(Number(e.target.value))}
                />
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
                {tags?.map((tag, index) => (
                  <EditRecipeTag
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
          <span onClick={() => navigate("/profile")} className="cancel">
            Cancel
          </span>
          <span onClick={updateRecipeInfo}>Confirm</span>
        </div>
      </div>
    </>
  );
};

export default EditRecipeBlocks;
