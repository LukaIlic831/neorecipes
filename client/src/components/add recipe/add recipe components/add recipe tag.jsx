import React from "react";

const AddRecipeTag = ({ tagName, setTags, tags }) => {
  const removeTag = () => {
    setTags(tags.filter((tag) => tag.tag !== tagName));
  };
  return (
    <li className="add-recipe__block--para-tag add-recipe__block--para-filter-options-option">
      <p onClick={removeTag}>{tagName}</p>
    </li>
  );
};

export default AddRecipeTag;
