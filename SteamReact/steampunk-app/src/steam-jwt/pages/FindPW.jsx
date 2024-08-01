import React from 'react';
import Header from '../components/header/Header';
import FindPWLoginForm from '../components/login/FindPWLoginForm';

const FindPW = () => {
    return (<>
    <Header/>
    <div className='container'>
            <FindPWLoginForm/>
            </div>
    </>

    );
};

export default FindPW;