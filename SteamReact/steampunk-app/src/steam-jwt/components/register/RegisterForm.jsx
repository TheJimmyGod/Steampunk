import "./RegisterForm.css";
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button,Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



const COUNT_PER_PAGE = 1000;
const new_regex = /^[가-힣0-9\s]*$/;
const RegisterForm = ({register}) => {

  const [addrData, setAddrData] = useState([]);
  const [errors, setErrors] = useState({});
  const [keyword, setKeyword] = useState("");
  const prev = useRef("");
  
  const navigate = useNavigate();

  useEffect(()=>{
    document.getElementById('birth').value = new Date().toISOString().substring(0, 10);

    console.log(errors);

    setErrors({
      username: false,
      password: false,
      re_password: false,
      address_main: false,
      address_sub: false
    });
  },[]);

  useEffect(()=>{
    if(keyword.trim() === "")
    {
      setAddrData([]);
      console.log(document.getElementById("address_main").value);
      document.getElementById("address_main").value = "";
      return;
    }
      
    if(prev.current !== keyword)
      findPath();
  },[keyword]);

    const findPath = () => {      
      if(new_regex.test(keyword))
      {
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
  const {data, status} = response;
  if(status === 200)
  {
    setAddrData([]);
    if(!Array.isArray(data.results.juso))
      return;
    for(let item of data.results.juso){
      let road = item.rn + " " + item.buldMnnm;
      
      if(item.rn.includes(keyword) === false)
      {
         continue;
      }
      if(!addrData.some(entry=>entry.key.includes(road)))
      {
          addrData.push({key: road, value: item.jibunAddr});
      }
    }
    setAddrData(sortArr(addrData).filter(x=>x.key.includes(keyword)));
    prev.current = keyword;
  }
}).catch(err=>{
  console.log(err);
  return;
});
      }

    }

    function sortArr() {
      const entries = [];
      for (const item of addrData) {
        entries.push(item);
      }
      setAddrData(entries.sort());
      return addrData;
    }

    const [selected, setSelected] = useState('');

    const handleChangeSelect = (e) => {
      setSelected(e.target.value);
      document.getElementById("address_main").value = selected;
    };
    const onRegister = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const re_password = e.target.re_password.value;
        const address_main = e.target.address_main.value;
        const address_sub = e.target.address_sub.value;
        const birth = e.target.birth.value;
        const admin = e.target.admin.checked;
        
        errors.username = (username.trim() === "") ? true : false;
        errors.password = (password.trim() === "" || password.trim().length < 3 || password.trim().length > 9) ? true : false;
        errors.re_password = (re_password.trim() === "" || re_password.trim() !== password.trim()) ? true : false;
        errors.address_main = (address_main.trim() === "") ? true : false;
        errors.address_sub = (address_sub.trim() === "") ? true : false;

        if(errors.username || errors.password || errors.re_password || errors.address_main || errors.address_sub)
        {
            navigate("/steam/register");
            return;
        }
        
        register({username, password, re_password, address_main, address_sub, birth, admin});
    };
    return (
<div className="form">
<div id='top'/>
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
          />
        </div>
        <br/>
        {errors != null && errors.username ? (<span id='err'>유저 ID를 입력해주세요.</span>) : (<></>)}
        <hr/>
        <div>
          <Form.Label htmlFor="password">패스워드</Form.Label>
          <Form.Control
            id="password"
            type="password"
            placeholder="패스워드를 입력해주세요"
            name="password"
            autoComplete="current-password"
          />
        </div>
        <br/>
        {errors != null && errors.password ? (<span id='err'>패스워드가 입력 안 되었거나, 4~8 자리를 쓰셔야 합니다.</span>) : (<></>)}
        <hr/>
        <div>
          <Form.Label htmlFor="re_password">패스워드 재입력</Form.Label>
          <Form.Control
            id="re_password"
            type="password"
            placeholder="패스워드를 다시 입력해주세요"
            name="re_password"
            autoComplete="current-password"
          />
        </div>
        <br/>
        {errors != null && errors.re_password ? (<span id='err'>재입력 패스워드가 일치하지 않습니다.</span>) : (<></>)}
        <hr/>
        <div>
          <Form.Label htmlFor="path_address">도로명주소</Form.Label>
          <Form.Control
            id="path"
            type="text"
            placeholder="도로명주소를 입력해주세요"
            name="path"
            autoComplete="path"
            onChange={(e)=>{
              let str = e.target.value.trim();
              setKeyword(str);
            }}
          />
        </div>
        <div>
          <Form.Select onChange={handleChangeSelect}>
            <option value={""} key={""} readOnly>&lt;도로명주소를 검색해주십시오&gt;</option>
          {
            addrData.length > 0 ?
           addrData.map((option, index) => (
          <option
            value={option.value}
            key={`${option.value}-${index}`}
            defaultValue={"" === option.value}
          >
            {option.key}
          </option>
        )) :
        
        <option value={""} defaultValue={""} disabled>
       &lt;조회 결과 없습니다&gt;
        </option>
        }
          </Form.Select>
        </div>
        <div>
          <Form.Control
            id="address_main"
            type="text"
            name="address_main"
            placeholder='도로명주소를 입력시 자동으로 출력됩니다.'
            autoComplete="address_main"
            value={selected ? selected : ""}
            readOnly
            style={{backgroundColor:"grey", color:"white"}}
          />
        </div>
        <br/>
        {errors != null && errors.address_main ? (<span id='err'>도로명주소를 입력해주세요.</span>) : (<></>)}
        <hr/>
        <div>
          <Form.Label htmlFor="address_sub">상세주소</Form.Label>
          <Form.Control
            id="address_sub"
            type="text"
            placeholder="상세주소를 입력해주세요"
            name="address_sub"
            autoComplete="address_sub"
          />
        </div>
        <br/>
        {errors != null && errors.address_main ? (<span id='err'>상세주소를 입력해주세요.</span>) : (<></>)}
        <hr/>
        <div>
          <Form.Label htmlFor="birth">유저 생년월일</Form.Label>
          <Form.Control
           type="date"
            id="birth"
            name="birth"
            max="2024-08-29"
            min="1990-08-29"
          />
        </div>
        <br/>
        <hr/>
        <div style={{textAlign:"left"}}>
        <Form.Label htmlFor="admin">관리자로 등록</Form.Label>
          <Form.Check 
          style={{width: "32px"}}
          id="admin"
          name="admin"
          >
          </Form.Check>
        </div>
        <Button className="btn--form btn-login" type="submit">
          등록 완료
        </Button>
      </Form>
      <div id='bottom'/>
    </div>
    );
};

export default RegisterForm;