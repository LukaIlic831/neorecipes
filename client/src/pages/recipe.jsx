import React from 'react';
import Footer from '../components/footer';
import Nav from '../components/nav';
import RecipeData from '../components/recipe/recipe data';
import SubHeader from '../components/sub header';

const Recipe = () => {
    return (
        <div>
            <Nav/>
            <SubHeader headerTitle={"Recipe Details"}/>
            <RecipeData/>
            <Footer/>
        </div>
    );
}

export default Recipe;
