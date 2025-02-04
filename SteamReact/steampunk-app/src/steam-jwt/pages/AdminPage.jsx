import React, { useContext } from 'react';
import * as Swal from '../apis/alert'
import { SERVER_HOST } from '../apis/api'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import axios from 'axios';
import AdminPageForm from '../components/adminpage/AdminPageForm';

const AdminPage = () => {
    const navigate = useNavigate();
    const {userInfo} = useContext(LoginContext);
    const removal = () =>{
        if(userInfo === undefined || userInfo.id === undefined)
        {
            navigate(`/steam/login`);
            return;
        }

        Swal.confirm("계정 탈퇴를 진행하시겠습니까?", "", "question",
            (result)=>{ 
                if(result.isConfirmed){
                    axios({
                        url: `${SERVER_HOST}/remove/${userInfo.id}`,
                        method: "delete"
                    }).then(response=>{
                        const {status} = response;
                        if(status === 200)
                        {
                            Swal.alert("관리자 탈퇴 성공!", "로그인 페이지로 이동합니다.", "success", () => {navigate("/steam/login");}); 
                        }
                    });
                }
            }
        );
    };
    return (
        <>
            <AdminPageForm removal={removal}/>
        </>
    );
};

export default AdminPage;