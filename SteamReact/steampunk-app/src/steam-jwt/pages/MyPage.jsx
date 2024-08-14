import React, { useContext } from 'react';
import * as Swal from '../apis/alert'
import { SERVER_HOST } from '../apis/api'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import axios from 'axios';
import MyPageForm from '../components/mypage/MyPageForm'


const MyPage = () => {
    const navigate = useNavigate();
    const {userInfo, logout} = useContext(LoginContext);
    const removal = async () =>{
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
                            Swal.alert("회원 탈퇴 성공!", "", "success", () => {
                                logout(true);}); 
                        }
                    });
                }
            }
        );
    };
    return (
        <>
            <>
                <MyPageForm removal={removal}/>
            </>
        </>
    );
};

export default MyPage;