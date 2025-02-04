import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Swal from '../../apis/alert'
import { SERVER_HOST } from '../../apis/api'
const FindPWLoginForm = () => {
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(()=>{setErrors({username: false,birth: false});},[])

    const submitForm = (e) => {
        e.preventDefault();
        const birth = e.target.birth.value;
        const username = e.target.username.value;
        errors.username = (username.trim() === "");
        errors.birth = (birth.trim() === "");

        if(!errors.ID && !errors.birth)
        {
            axios({
                method: "get",
                url: `${SERVER_HOST}/findPw/${username}/${birth}`,
                headers:{"Content-Type":"application/json;charset=utf-8"}
            }).then(response=>{
                const {data, status} = response;
    
                if(status === 200)
                {
                    if(data < 0)
                        errors.username = errors.birth = true;
                    else
                    {
                        Swal.confirm("성공적으로 계정을 찾아냈습니다. 비밀번호 재발급을 진행하시겠습니까?", "", "question", (result)=>{ if(result.isConfirmed) 

                            navigate("/steam/resetPw", 
                                { state: { id: data }});
                        });
                        errors.username = errors.birth = false;
                    }
                }
            }).catch(err=>{
                console.log(err);
                errors.username = errors.birth = true;
            });
        }

        if(errors.ID || errors.birth) navigate("/steam/findPw");
    }

    return (
        <div className="form">
            <div style={{marginTop: "5%"}}></div>
            <h2 className="login-title">비밀번호 찾기</h2>
            <Form onSubmit={submitForm}>
               <Form.Label htmlFor='username'>
               </Form.Label>
                <Form.Control
                type='text'
                id='username'
                name='username'
                placeholder='아이디를 입력해주세요'
                autoComplete='username'
                 />
                
                {errors != null && errors.username ? (<span id='err'>입력 창이 비어있거나 아이디가 존재하지 않습니다.</span>) : (<></>)}
                
                <Form.Label htmlFor='birth'>
                
               </Form.Label>
                <Form.Control
                className='find-password'
                type='text'
                id='birth'
                name='birth'
                placeholder='생년월일 8자리 입력'
                autoComplete='birth'
                 />
                
                {errors != null && errors.birth ? (<span id='err'>입력 창이 비어있거나 생년월일이 알맞지 않습니다.</span>) : (<></>)}
                
                <Button className='btn-form' type='submit'>
                입력
               </Button>
            </Form>
            <div style={{marginTop: "20px"}}>
                <Button className='btn-form' onClick={()=>{navigate(-1)}}>이전</Button>
            </div>
        </div>
    );
};

export default FindPWLoginForm;