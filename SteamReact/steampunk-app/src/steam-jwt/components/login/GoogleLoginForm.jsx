import React, { useEffect } from 'react';
import * as Swal from '../../apis/alert'
import { useNavigate } from 'react-router-dom';
import { NORMAL_SERVER_HOST } from '../../apis/api';

const GoogleLoginForm = () => {
    useEffect(()=>{
        window.location.href = `${NORMAL_SERVER_HOST}/oauth2/authorization/google`
    },[])

    return (
        <div>
            
        </div>
    );
};

export default GoogleLoginForm;