import React, { useContext, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie';
import { LoginContext } from '../contexts/LoginContextProvider';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const {login, loginCheck} = useContext(LoginContext);
    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if(!token)
        {
            navigate("/steam/login");
        }
        else
        {
            Cookies.set('accessToken', token);
            navigate("/steam");
        }
        },[]);
    return (
        <div>
        </div>
    );
};

export default LoginSuccess;