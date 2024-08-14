import React, { useContext, useEffect, useState } from 'react';
import './LoginForm.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import Cookies from 'js-cookie';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { NORMAL_SERVER_HOST } from '../../apis/api';
const LoginForm = () => {
  const { login } = useContext(LoginContext);

  const [rememberUserId, setRememberUserId] = useState();

  const navigate = useNavigate();
  const onLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const rememberId = e.target.rememberId.checked;

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
      <h2 className="login-title">로그인</h2>
      <Form className="login-form" onSubmit={onLogin}>
        <Form.Group>
          <div>
            <Form.Label htmlFor="username"></Form.Label>
            <Form.Control
              id="username"
              type="text"
              placeholder="아이디 입력"
              name="username"
              autoComplete='username'
              required
              defaultValue={rememberUserId}
            />
          </div>
          <div>
            <Form.Label htmlFor="password"></Form.Label>
            <Form.Control
              id="password"
              type="password"
              placeholder="비밀번호 입력"
              name="password"
              autoComplete='current-password'
              required
            />
          </div>
        </Form.Group>
        <div className="login-options">
            <span className='form-check'>
              <label className="toggle-btn">
                {!rememberUserId
                  ?
                  <input type="checkbox" id="remember-id" name='rememberId' value='0' />
                  :
                  <input type="checkbox" id="remember-id" name='rememberId' value='0' defaultChecked />
                }
                <span className="slider"></span>
              </label>
              <label htmlFor='remember-id' className='check-label'>아이디 저장</label>
            </span>
          

          <div className='login-find'>
            <span onClick={() => { navigate("/steam/findId") }}>
              아이디 찾기
            </span>
            <span onClick={() => { navigate("/steam/findPw") }}>
              비밀번호 찾기
            </span>
          </div>
        </div>
        <div className="login-buttons">
          <Button type='submit' className="btn-form btn-login">
            로그인
          </Button>
          <Button className="btn-form btn-register" onClick={() => { navigate("/steam/register") }}>
            회원가입
          </Button>
        </div>
      </Form>
      <Link to={`${NORMAL_SERVER_HOST}/oauth2/authorization/google`}><FontAwesomeIcon icon={faGoogle}/></Link>
    </div>
  );

};

export default LoginForm;