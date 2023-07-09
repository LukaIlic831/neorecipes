import React from 'react';
import Footer from '../components/footer';
import Nav from '../components/nav';
import Search from '../components/search/search';
import SubHeader from '../components/sub header';

const SearchPage = () => {
    return (
        <div>
            <Nav/>
            <SubHeader headerTitle={"Search Recipes"}/>
            <Search/>
            <Footer/>
        </div>
    );
}

export default SearchPage;
