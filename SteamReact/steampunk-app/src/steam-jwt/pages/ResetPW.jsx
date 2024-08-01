import React from 'react';
import Header from '../components/header/Header';
import ResetPWForm from '../components/login/ResetPWForm';

const ResetPW = () => {
    return (
        <>
            <Header/>
               <div className='container'>
                    <ResetPWForm/>
               </div>
        </>
    );
};

export default ResetPW;