import axios from 'axios';
import React, { useEffect } from 'react';


const COUNT_PER_PAGE = 1000;
const new_regex = /^[가-힣0-9\s]*$/;

const RegisterForm = ({register}) => {
   let keyword = "안산천동로";
    useEffect(()=>{findPath(keyword)},[keyword]);

    const findPath = (keyword) => {

      if(new_regex.test(keyword))
      {
    // 	devU01TX0FVVEgyMDI0MDczMDE1NTM1MDExNDk3NTU=
        let encodedKeyword = encodeURIComponent(keyword);
        let apiKey = "devU01TX0FVVEgyMDI0MDczMDE1NTM1MDExNDk3NTU=";
        axios({
        method: "post",
        url: `https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do?resultType=json&confmKey=${apiKey}&currentPage=1&countPerPage=${COUNT_PER_PAGE}&keyword=${encodedKeyword}`,
        }).then(response=>{
          const {data, status, statusText} = response;
          if(status === 200)
          {
          }
        }).catch(()=>{
          console.log("Error!");
        });
      }
      
    }



    const onRegister = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        console.log(username, password);

        register({username, password});
    };
    return (
<div className="form">
      <h2 className="login-title">회원가입</h2>
      <form className="login-form" onSubmit={(e) => onRegister(e)}>
        <div>
          <label htmlFor="username">유저 ID</label>
          <input
            id="username"
            type="text"
            placeholder="유저 ID를 입력해주세요"
            name="username"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">패스워드</label>
          <input
            id="password"
            type="password"
            placeholder="패스워드를 입력해주세요"
            name="password"
            autoComplete="current-password"
            required
          />
        </div>     
        <div>
          <label htmlFor="re_password">패스워드 재입력</label>
          <input
            id="re_password"
            type="re_password"
            placeholder="패스워드를 다시 입력해주세요"
            name="re_password"
            autoComplete="current-password"
            required
          />
        </div>
        <div>
          <label htmlFor="path_address">도로명주소</label>
          <input
            id="path"
            type="text"
            placeholder="도로명주소를 입력해주세요"
            name="path"
            autoComplete="path"
            required
          />
        </div>
        <div>
          <input
            id="address_main"
            type="text"
            name="address_main"
            autoComplete="address_main"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="address_sub">상세주소</label>
          <input
            id="address_sub"
            type="text"
            placeholder="상세주소를 입력해주세요"
            name="address_sub"
            autoComplete="address_sub"
            required
          />
        </div>
        <button className="btn btn--form btn-login" type="submit">
          Register
        </button>


      </form>
    </div>
    );
};

export default RegisterForm;