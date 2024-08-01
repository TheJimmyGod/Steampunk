import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { LoginContext } from '../../contexts/LoginContextProvider';

const Header = () => {

    const {isLogin, logout, userInfo} = useContext(LoginContext);
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand><Link className="nav-link" to="/steam">Home</Link></Navbar.Brand>
        <Nav className="me-auto">
            {/* 로그인 여부에 따라 조건부 렌더링 */}
            {!isLogin ? 
            <>
                <Link className="nav-link" to="/steam/login" key={"login"}>로그인</Link>
                <Link className="nav-link" to="/steam/register" key={"register"}>회원가입</Link>
            </>:
            <>
            {
              userInfo.authorities.map(x=>(
                x.name === "ROLE_MEMBER" ?
                <span key={"Member"}>
                        <Link className="nav-link" to="/" key={"Member"}>정회원</Link>
                </span>
                :
                x.name === "ROLE_ADMIN" ?
                <span key={"Admin"}>
                    <Link className="nav-link" to="/" key={"Admin"}>관리자</Link>
                </span>
                :
                <></>
              ))
            }
          <Button variant="drak" onClick={()=>logout()}>로그아웃({userInfo.id}:{userInfo.username}:{userInfo.authorities.map(x=>x.name)})</Button>
            </>
            }
        </Nav>
      </Navbar>
    </>    
  );
};

export default Header;