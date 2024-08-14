import React, { useEffect } from 'react';
import * as Swal from '../../apis/alert'
import { useNavigate } from 'react-router-dom';

const GoogleLoginForm = () => {
    useEffect(()=>{
        window.location.href = 'http://localhost:8080/oauth2/authorization/google'
    },[])

    return (
        <div>
            
        </div>
    );
};

export default GoogleLoginForm;