import React, { useContext, useEffect, useState } from 'react';
import './LoginForm.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import Cookies from 'js-cookie';
import { Button,Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
    const {login} = useContext(LoginContext);
    const [rememberUserId, setRememberUserId] = useState();
    const navigate = useNavigate();
    const onLogin = (e) => {
        e.preventDefault();
        console.log("Hello world");
        const username = e.target.username.value;
        const password = e.target.password.value;
        const rememberId = e.target.rememberId.checked;

        console.log(e.target.username.value)
        console.log(e.target.password.value)
        console.log(e.target.rememberId.checked)
    
        login(username, password, rememberId);  // 로그인 진행!
    };

    useEffect(() => {
        // 쿠키에 저장된 username(아이디) 가져오기
        const rememberId = Cookies.get('rememberId');
        console.log(`쿠키 remeberId : ${rememberId}`);
        setRememberUserId(rememberId);
    
    }, []);

    return (
        <div className="form">
          <div id='top'/>
      <h2 className="login-title">로그인</h2>
      <Form className="login-form" onSubmit={ (e) => onLogin(e) }>
        <Form.Group>
        <div>
          <Form.Label htmlFor="name"><strong>유저 ID</strong></Form.Label>
          <Form.Control
                id="username"
                type="text"
                placeholder="유저 ID를 입력해주세요"
                name="username"
                autoComplete='username'
                required
                defaultValue={rememberUserId}
                />
        </div>
        <div>
          <Form.Label htmlFor="password"><strong>패스워드</strong> </Form.Label>
          <Form.Control
                id="password"
                type="password"
                placeholder="패스워드를 입력해주세요"
                name="password"
                autoComplete='current-password'
                required
                />
        </div>
        </Form.Group>
        <div>
        <span style={{float:"left"}}>
        <Button className="btn--form"  onClick={()=>{navigate("/steam/findId")}} style={{width: "150px"}}>
          아이디 찾기
        </Button>
        <br/>
        <br/>
        <Button className="btn--form" onClick={()=>{navigate("/steam/findPw")}} style={{width: "200px"}}>
          비밀번호 재발급
        </Button>
        </span>
        
        <span style={{textAlign:"right", alignItems:"flex-end", float:"right"}}>
        <span className='form-check' style={{float:"right"}}>
          <label className="toggle-btn">
            { !rememberUserId
              ?
              <input type="checkbox" id="remember-id" name='rememberId' value='0' />
              :
              <input type="checkbox" id="remember-id" name='rememberId' value='0' defaultChecked />
            }
            <span className="slider"></span>
          </label>
          <label htmlFor='remember-id' className='check-label'>아이디 저장</label>
        </span>
        <br/><br/>
        <Button type='submit' className="btn--form btn-login" value="Login" style={{width: "100px", height: "75px"}}>
          로그인
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button className="btn--form btn-login" onClick={()=>{navigate("/steam/register")}} style={{width: "100px", height: "75px"}}>
          회원가입
        </Button>
        </span>

        </div>
        <div id='bottom'/>
      </Form>
  </div>
    );
};

export default LoginForm;