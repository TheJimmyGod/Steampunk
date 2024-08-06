import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../../../HTML/SteamNewsCss.css';
import "../register/RegisterForm.css";
import * as Swal from '../../apis/alert'
import { SERVER_HOST } from '../../apis/api';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { AddressContext } from '../../contexts/AddressContextProvider';
// const COUNT_PER_PAGE = 1000;
// const new_regex = /^[가-힣0-9\s]*$/;
const EditPersonalInfoForm = () => {

    const {addrData, insertKeyword} = useContext(AddressContext);
    const [errors, setErrors] = useState({});
    const [changePW, setChangePW] = useState(false);
    const [user, setUser] = useState({ username:"", password:"", re_password:"", address_main:"", address_sub:"", birth:"", admin:false });
    const {userInfo, loginCheck} = useContext(LoginContext);
    const navigate = useNavigate();
    
    useEffect(()=>{
        setErrors({ username: false, password: false, re_password: false, address_main: false, address_sub: false });
        getUser();
    },[loginCheck]);

    async function getUser()
    {
      const response = await axios.get(`${SERVER_HOST}/${userInfo.id}`);
      const {data, status} = response;
      if(status === 200)
      {
          setUser({ ...user, username: data.username, password: "", re_password: "", address_main: data.address_main, address_sub: data.address_sub, birth: data.birth, admin: false });
          document.getElementById('birth').value = user.birth;
      }

    }

    const onEdit = (e) => {
        e.preventDefault();
        Swal.confirm("변경하시겠습니까?", "", "question",
          (result)=>{ 
              if(result.isConfirmed === false)
                return;
              else
              {
                const username = e.target.username.value;
                const password = changePW ? e.target.password.value : "";
                const re_password = changePW ? e.target.re_password.value : "";
                const address_main = e.target.address_main.value;
                const address_sub = e.target.address_sub.value;
            
                errors.username = (username.trim() === "");
                if(changePW)
                {
                    errors.password = (password.trim() === "" || password.trim().length < 3 || password.trim().length > 8);
                    errors.re_password = (re_password.trim() === "" || re_password.trim() !== password.trim());
                }
                errors.address_main = (address_main.trim() === "");
                errors.address_sub = (address_sub.trim() === "");
            
                if (errors.username || errors.password || errors.re_password || errors.address_main || errors.address_sub) {
                    navigate(`/steam/edit/${userInfo.id}`);
                    return;
                }
                const url = `${SERVER_HOST}/edit/${userInfo.id}`;
                axios({
                    url: url,
                    method:"put",
                    data: JSON.stringify(user),
                    headers:{
                      "Content-Type" : "application/json"
                    }
                }).then(response=>{
                    const {status} = response;
                    if(status === 200)
                      Swal.alert("변경 성공", "메인 화면으로 이동합니다.", "success", () => { navigate("/steam") });
                }).catch(err=>{
                  Swal.alert("변경 실패", err, "error");
                });
              }
          }
        );
      };

      const onActionHandle = (num = 0) => {
        if(num === 0)
        {
            Swal.confirm("변경을 취소하시겠습니까?", "", "question",
                (result)=>{ 
                    if(result.isConfirmed)
                        navigate('/steam/mypage');
                }
            );
        }
        else if(num === 1)
        {
          Swal.confirm("비밀번호 변경하시겠습니까?", "", "question",
            (result)=>{ 
                if(result.isConfirmed)
                    setChangePW(true);
            }
        );
        }
        else if(num === 2)
        {
          Swal.confirm("비밀번호 변경 취소하시겠습니까?", "", "question",
            (result)=>{ 
                if(result.isConfirmed){
                    setChangePW(false);
                    setUser({...user,
                      password:"",
                      re_password:""
                    })
                    document.getElementById("re_password").value = "";
                    document.getElementById("password").value = "";
                }
            }
        );
        }
      }
    
      const [selected, setSelected] = useState('');
    
      const handleChangeSelect = (e) => {
        setSelected(e.target.value);
        setUser({...user,
          address_main: e.target.value
        });
        user.address_main = selected;
        document.getElementById("address_main").value = e.target.value;
      };

      const changeValue = (e) =>{
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    return (
        <main className='form'>
            <header className="main-header"></header>
            <div className="banner">
                <h1>Edit Personal Infomation</h1>
                <p>{userInfo != null && userInfo.username ? userInfo.username : "Anonymous"}님의 정보를 수정할 수 있습니다</p>
            </div>
            <Form className="login-form" id="submitForm" onSubmit={(e) => onEdit(e)}>
        <div>
          <Form.Label htmlFor="username">유저 ID</Form.Label>
          <Form.Control
            id="username"
            type="text"
            placeholder="유저 ID를 입력해주세요"
            name="username"
            autoComplete="username"
            value={user?.username || ""}
            style={{backgroundColor:"gray", color:"white"}}
            onChange={changeValue}
            readOnly
          />
        </div>
        {errors != null && errors.username ? (<span id='err'>유저 ID를 입력해주세요.</span>) : (<></>)}
        <div>
          <Form.Label htmlFor="password">패스워드</Form.Label>
          <Form.Control
            id="password"
            type="password"
            placeholder= {changePW ? "패스워드를 입력해주세요"  : ""}
            name="password"
            autoComplete="current-password"
            onChange={changeValue}
            value={user?.password || ""}
            style={changePW ? {} : {backgroundColor:"gray", color:"white"}}
            readOnly= {changePW ? false : true}
          />
        </div>
        {errors != null && errors.password ? (<span id='err'>패스워드가 입력 안 되었거나, 4~8 자리를 쓰셔야 합니다.</span>) : (<></>)}
        <div>
          <Form.Label htmlFor="re_password">패스워드 재입력</Form.Label>
          <Form.Control
            id="re_password"
            type="password"
            placeholder= {changePW ? "패스워드를 다시 입력해주세요"  : ""}
            name="re_password"
            autoComplete="current-password"
            value={user?.re_password || ""}
            onChange={changeValue}
            style={changePW ? {} : {backgroundColor:"gray", color:"white"}}
            readOnly= {changePW ? false : true}
          />
        </div>
        {errors != null && errors.re_password ? (<span id='err'>재입력 패스워드가 일치하지 않습니다.</span>) : (<></>)}
        <div style={{textAlign:"right"}}>
            {
                changePW ?         
                <Button className="btn-form btn-login" onClick={()=>onActionHandle(2)}>
                비밀번호 취소
              </Button>  : 
                <Button className="btn-form btn-login" onClick={()=>onActionHandle(1)}>
                비밀번호 변경
              </Button>
            }
        </div>
        <div>
          <Form.Label htmlFor="path_address">도로명주소</Form.Label>
          <Form.Control
            id="path"
            type="text"
            placeholder="도로명주소를 입력해주세요"
            name="path"
            autoComplete="path"
            onChange={insertKeyword}
          />
        </div>
        <div>
          <Form.Select onChange={handleChangeSelect} className="select-adress">
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
            value={user != null ? user.address_main : ""}
            readOnly
          />
        </div>
        {errors != null && errors.address_main ? (<span id='err'>도로명주소를 입력해주세요.</span>) : (<></>)}
        <div>
          <Form.Label htmlFor="address_sub">상세주소</Form.Label>
          <Form.Control
            id="address_sub"
            type="text"
            placeholder="상세주소를 입력해주세요"
            name="address_sub"
            autoComplete="address_sub"
            onChange={changeValue}
            value={user != null ? user.address_sub : ""}
          />
        </div>
        {errors != null && errors.address_main ? (<span id='err'>상세주소를 입력해주세요.</span>) : (<></>)}
        <div>
          <Form.Label htmlFor="birth">유저 생년월일</Form.Label>
          <Form.Control
            type="date"
            id="birth"
            name="birth"
            max="2024-08-29"
            min="1990-08-29"
            value={user?.birth || ""}
            onChange={changeValue}
          />
        </div>
        <Button className="btn-form btn-login" type='submit'>
          등록 완료
        </Button>
        <Button className="btn-form btn-login" onClick={()=>onActionHandle(0)}>
          이전
        </Button>
      </Form>
        </main>
    );
};

export default EditPersonalInfoForm;