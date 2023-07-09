import React from 'react';

const SubHeader = ({headerTitle}) => {
    return (
        <header id='sub-header'>
            <div className="sub-header__title">
                <h1>{headerTitle}</h1>
            </div>
        </header>
    );
}

export default SubHeader;
