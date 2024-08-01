import React from 'react';
import Header from '../components/header/Header';
import FindIDLoginForm from '../components/login/FindIDLoginForm';

const FindID = () => {
    return (
        <>
            <Header/>
            <div className='container'>
                <FindIDLoginForm/>
            </div>
        </>
    );
};

export default FindID;