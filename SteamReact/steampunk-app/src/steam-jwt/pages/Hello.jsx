import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
    
const Hello = () => {
    const navigate = useNavigate();
    const {userInfo,loginCheck} = useContext(LoginContext);
    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(userInfo === undefined)
                navigate("/steam/login");
            else
                navigate("/steam");
        }, 500);
        return () => clearTimeout(timer);
    },[loginCheck]);

    return (
        <>
            Redirect 중입니다.  잠시만 기다려주세요...
        </>
    );
};

export default Hello;