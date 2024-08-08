import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { SERVER_HOST } from '../../apis/api'

const FindIDLoginForm = () => {
    const [id, setID] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleInput = (e) =>{
        setID(e.target.value);
    }

    useEffect(()=>{
        console.log(error);
        setError(false);
    },[])

    const submitForm = (e) => {
        e.preventDefault();
        if(id.trim() === "")
        {
            setError(true);
        }
        else
        {
            const url = `${SERVER_HOST}/findId/${id}`;
            axios({
                method: "get",
                url: url,
                headers:{
                    "Content-Type":"application/json;charset=utf-8"
                }
            }).then(response=>{
                const {data, status, statusText} = response;

                if(status === 200)
                {
                    if(!data)
                    {
                        console.log("존재하지 않는 아이디");
                        setError(true);
                        setSuccess(false);
                    }
                    else
                    {
                        setSuccess(true);
                    }
                }
            }).catch(err=>{
                console.log(err);
                setError(true);
                setSuccess(false);
            });
        }
        if(error)
        {
            navigate("/steam/findId");
            return;
        }
    }

    return (
        <div className="form">
            <h2 className="login-title">아이디 찾기</h2>
            <Form onSubmit={submitForm}>
               <Form.Label htmlFor='ID'>
            
               </Form.Label>
                <Form.Control className='find-id-form'
                type='text'
                id='ID'
                name='ID'
                value={id}
                placeholder='찾으실 아이디를 입력해주세요'
                autoComplete='ID'
                onChange={handleInput}
                 >
                </Form.Control>
                
                {error ? (<span id='err'>입력 창이 비어있거나 아이디가 존재하지 않습니다.</span>) : (<></>)}
                {success ? (<span id='err'>입력하신 {id}는 존재합니다. </span>) : (<></>)}
                
                <Button className='btn-form'type='submit'>
                입력
               </Button>
            </Form>
            <div style={{marginTop: "20px"}}>
                <Button className='btn-form' onClick={()=>{navigate(-1)}}>이전</Button>
            </div>
        </div>
    );
};

export default FindIDLoginForm;