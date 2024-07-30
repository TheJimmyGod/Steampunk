import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button,Form } from 'react-bootstrap';

const COUNT_PER_PAGE = 1000;
const new_regex = /^[가-힣0-9\s]*$/;
const RegisterForm = ({register}) => {
  let [keyword, setKeyword] = useState("");
    useEffect(()=>{
      findPath(keyword)}, [keyword]);
    let addrData = useRef([]);

    const findPath = (keyword) => {
      if(new_regex.test(keyword))
      {
        addrData.current = [];
    // 	devU01TX0FVVEgyMDI0MDczMDE1NTM1MDExNDk3NTU=
        let encodedKeyword = encodeURIComponent(keyword);
        let apiKey = "devU01TX0FVVEgyMDI0MDczMDE1NTM1MDExNDk3NTU=";
        axios({
        method: "get",
        url: `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${apiKey}&currentPage=1&countPerPage=${COUNT_PER_PAGE}&keyword=${encodedKeyword}`,
        headers:{
          "Content-Type" : "application/json"
        }
        }).then(response=>{
          const {data, status, statusText} = response;
          if(status === 200)
          {
            for(let item of data.results.juso){
              let road = item.rn + " " + item.buldMnnm;
              if(!addrData.current.some(entry=>entry === road))
                  addrData.current.push({key: road, value: item.jibunAddr});
            }
            console.log(addrData.current.length);
          }
        }).catch(()=>{
          return;
        });
      }
    }
    const [selected, setSelected] = useState('');

    const handleChangeSelect = (e) => {
      setSelected(e.target.value);
    };
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
      <Form className="login-form" onSubmit={(e) => onRegister(e)}>
        <div>
          <Form.Label htmlFor="username">유저 ID</Form.Label>
          <Form.Control
            id="username"
            type="text"
            placeholder="유저 ID를 입력해주세요"
            name="username"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <Form.Label htmlFor="password">패스워드</Form.Label>
          <Form.Control
            id="password"
            type="password"
            placeholder="패스워드를 입력해주세요"
            name="password"
            autoComplete="current-password"
            required
          />
        </div>     
        <div>
          <Form.Label htmlFor="re_password">패스워드 재입력</Form.Label>
          <Form.Control
            id="re_password"
            type="re_password"
            placeholder="패스워드를 다시 입력해주세요"
            name="re_password"
            autoComplete="current-password"
            required
          />
        </div>
        <div>
          <Form.Label htmlFor="path_address">도로명주소</Form.Label>
          <Form.Control
            id="path"
            type="text"
            placeholder="도로명주소를 입력해주세요"
            name="path"
            autoComplete="path"
            required
            onChange={(e)=>{setKeyword(e.target.value);
            }}
          />
        </div>
        <div>
          <Form.Select onChange={handleChangeSelect}>
              <option>
                {/* TODO */}
              </option>
          </Form.Select>
        </div>
        <div>
          <Form.Control
            id="address_main"
            type="text"
            name="address_main"
            autoComplete="address_main"
            readOnly
          />
        </div>
        <div>
          <Form.Label htmlFor="address_sub">상세주소</Form.Label>
          <Form.Control
            id="address_sub"
            type="text"
            placeholder="상세주소를 입력해주세요"
            name="address_sub"
            autoComplete="address_sub"
            required
          />
        </div>
        <Button className="btn btn--form btn-login" type="submit">
          Register
        </Button>


      </Form>
    </div>
    );
};

export default RegisterForm;