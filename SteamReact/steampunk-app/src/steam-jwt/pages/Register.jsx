import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../apis/auth'
import * as Swal from '../apis/alert'
import RegisterForm from '../components/register/RegisterForm';
import Header from '../components/header/Header';

const Register = () => {
    const navigate = useNavigate();
    const register = async(form) =>{
        console.log(`register()`, form);
        let response;
        try{
           response = await auth.register(form); 
        }catch(error){
            console.log(`회원 가입 요청중 에러 발생: ${error}`);
            return;
        }
        const {data, status} = response;
        console.log(`data: ${data} | status: ${status}`);
        if(status === 200){
            console.log("회원가입 성공!");
            Swal.alert("회원가입 성공", "메인 화면으로 이동합니다.", "success", () => { navigate("/steam/login") });
        }else{
            console.log(`회원가입 실패!`);
            Swal.alert("회원가입 실패", "회원가입에 실패하였습니다.", "error" );
        }
    }
    return (
        <>
          {/* <Header/> */}
          <div className='container'>
                <RegisterForm register={register}/>
            </div>  
        </>
    );
};

export default Register;