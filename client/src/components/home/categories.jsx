import React, { useState } from "react";
import desserts from "../../assets/dessert.webp";
import pastry from "../../assets/pastry.webp"
import salad from "../../assets/salad.webp";
import warmAppetizers from "../../assets/warmAppetizers.webp";
import coldAppetizers from "../../assets/coldAppetizers.webp";
import mainDishes from "../../assets/mainDishes.webp";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    {
      id: "category1",
      value: "Desserts",
      name: "categories",
      text: "Desserts",
      image: desserts,
    },
    {
      id: "category2",
      value: "Warm Appetizers",
      name: "categories",
      text: "Warm Appetizers",
      image: warmAppetizers,
    },
    {
      id: "category3",
      value: "Pastry",
      name: "categories",
      text: "Pastry",
      image: pastry,
    },
    {
      id: "category4",
      value: "Cold Appetizers",
      name: "categories",
      text: "Cold Appetizers",
      image: coldAppetizers,
    },
    {
      id: "category5",
      value: "Salad",
      name: "categories",
      text: "Salad",
      image: salad,
    },
    {
      id: "category6",
      value: "Main Dishes",
      name: "categories",
      text: "Main Dishes",
      image: mainDishes,
    },
  ]);
  return (
    <div className="section">
      <div className="main__title">
        <h1>Categories</h1>
      </div>
      <div className="categories">
        {categories?.map((category) => (
          <div className="category" key={category.id}>
            <div>
              <figure className="category__image">
                <img src={category.image} alt="" />
              </figure>
            </div>
            <input
              type="radio"
              id={category.id}
              name={category.name}
              className="hidden"
              value={category.value}
              onChange={() =>
                navigate("/search", {
                  state: { id: category.id, name: category.value },
                })
              }
            />
            <label className="category__title" htmlFor={category.id}>
              <h2>{category.text}</h2>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
