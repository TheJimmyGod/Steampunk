import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import {useLocation, useNavigate } from 'react-router-dom';
import * as Swal from '../../apis/alert'
import { SERVER_HOST } from '../../apis/api'
const ResetPWForm = () => {
    const location = useLocation();
    const {id} = location.state || {};
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(()=>{
        setErrors({
            password: false,
            re_password: false
        });
    });

    const onRegister = async (e) =>
    {
        e.preventDefault();
        const password = e.target.password.value;
        const re_password = e.target.re_password.value;
        errors.password = (password.trim() === "" || password.trim().length < 3 || password.trim().length > 8) ? true : false;
        errors.re_password = (re_password.trim() === "" || re_password.trim() !== password.trim()) ? true : false;
        if(errors.username || errors.password || errors.re_password || errors.address_main || errors.address_sub)
            {
                navigate("/steam/resetPw");
                return;
            }
        const response = await axios.post(`${SERVER_HOST}/resetPw/${id}/${password}`);
        const {status} = response;
        Swal.alert((status === 200) ? "비밀번호 재발급 성공!" : "비밀번호 재발급 실패!", 
        (status === 200) ? "로그인 페이지로 이동합니다." : "비밀번호가 기존과 같거나 유효성 검사에서 실패를 했습니다.",
        (status === 200) ? "success" :"error", (status === 200) ? () => {navigate("/steam/login");} : ()=>{});
    }

    return (
        <div className="form">
        <div id='top'/>
              <h2 className="login-title">비밀번호 재발급</h2>
              <Form className="login-form" onSubmit={(e) => onRegister(e)}>
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
                <Button className="btn--form btn-login" type="submit">
                  등록 완료
                </Button>
              </Form>
              <div id='bottom'/>
            </div>
            );
};

export default ResetPWForm;