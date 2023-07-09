import React from 'react';
import Footer from '../components/footer';
import Nav from '../components/nav';
import ProfileBlock from '../components/profile/profile block';
import SubHeader from '../components/sub header';

const Profile = () => {
    return (
        <div>
            <Nav/>
            <SubHeader headerTitle={"Your Profile"}/>
            <ProfileBlock/>
            <Footer/>
        </div>
    );
}

export default Profile;
