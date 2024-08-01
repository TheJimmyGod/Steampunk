import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import * as Swal from '../apis/alert'
import * as auth from '../apis/auth'
import api from '../apis/api';
export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName'

const LoginContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [roles, setRoles] = useState({isMember: false, isAdmin:false});

    const loginCheck = async (isAuthPage = false) =>{
                // 쿠키에 access token (JWT)가 있는지 꺼내본다.
                const accessToken = Cookies.get('accessToken');
                console.log(`accessToken: ${accessToken}`);
        
                let response;
                let data;
        
                // 만일 JWT이 없다면
                if(!accessToken){
                    console.log('쿠키에 JWT(accesssToken)이 없음');
                    logoutSetting();
                    return;
                }
        
                // JWT가 없는데, 인증이 필요한 페이지라면? -> 로그인 페이지로 리다이렉트
                if(!accessToken && isAuthPage){
                    navigate("/login");
                }
        
                // JWT 토큰이 있다면
                console.log('쿠키에 JWT(accessToken)이 저장되어 있음');
                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        
                try{
                    response = await auth.userInfo();
                }catch(error){
                    console.error(`error: ${error}`);
                    return;
                }
        
                // 응답 실패시
                if(!response) return;
        
                // user 정보 획득 성공
                console.log(`JWT (accessToken) 토큰으로 사용자 인증 정보 요청 성공`);
        
                data = response.data;
                console.log(`data: ${data}`);
        
                // 인증 실패시
                if(data === 'UNAUTHORIZED' || response.status === 401){
                    console.log('JWT(accessToken)이 만료되었거나 인증에 실패했습니다.');
                    return;
                }
        
                // 인증 성공!
                loginSetting(data, accessToken);
    }

    useEffect(()=>{loginCheck()},[]);
    const login = async (username, password, rememberId)=>{
        if(rememberId) Cookies.set('rememberId', username);
        else Cookies.remove('rememberId');
        try{
            const response = await auth.login(username, password);
            const {data, status, headers} = response;
            const authorization = headers.authorization;
            const accessToken = authorization.replace("Bearer ", "");

            console.log(`
                -- login 요청응답 --
                  data : ${data}
                  status : ${status}
                  headers : ${headers}
                  jwt : ${accessToken}
                `);
        

              if (status === 200) {
                Cookies.set("accessToken", accessToken);
              }
            loginCheck();
           Swal.alert("로그인 성공", "메인화면으로 이동합니다", "success", () => {navigate("/steam");}); 
        }
        catch(error)
        {
            Swal.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.', 'error');
        }
    }
    const logout = (force = false) => {
        if(force){
            logoutSetting();
            navigate("/steam");
            return;
        }
        Swal.confirm("로그아웃 하시겠습니까", "로그아웃을 진행합니다", "warning",
            (result)=>{ // confirm을 누르면 result로 리턴해서 발동한다
                if(result.isConfirmed){
                    logoutSetting();
                    navigate("/steam");
                }
            }
        );
    }
    const loginSetting = (userData, accessToken) =>{
        const {id, username, authorities} = userData;
        let authList = [];

        if(Array.isArray(authorities))
        {
            for(let i = 0; i < authorities.length; ++i)
            {
                if(authorities[i] === null)
                    continue;
                authList.push(authorities[i].name);
            }
        }

        console.log(`
            loginSetting()
               id : ${id}
               username : ${username}
               authorities : ${authList.join(",")}
            `);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`; 
        setIsLogin(true);
        setUserInfo({id, username, authorities});
        const updatedRoles = {isMember: false, isAdmin: false};
        if(Array.isArray(authList))
        {
            for(let it = 0; it < authList.length; ++it)
            {
                (authList[it] === 'ROLE_MEMBER')&& (updatedRoles.isMember = true);
                (authList[it] === 'ROLE_ADMIN') &&(updatedRoles.isAdmin = true);
            }
        }
        else
        {
            (authorities.name === 'ROLE_MEMBER')&& (updatedRoles.isMember = true);
            (authorities.name === 'ROLE_ADMIN') &&(updatedRoles.isAdmin = true);
        }
        setRoles(updatedRoles);
    };

    const logoutSetting = () =>{
        setIsLogin(false);
        setUserInfo(null);
        setRoles(null);
        Cookies.remove('accessToken');
        api.defaults.headers.common.Authorization = undefined;
    };

    return (
        <LoginContext.Provider value={{isLogin, userInfo, roles, loginCheck, login, logout}}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;