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
                <Link className="nav-link" to="/steam/login">로그인</Link>
                <Link className="nav-link" to="/steam/register">회원가입</Link>
            </>:
            <>
            {
                userInfo.role.includes("ROLE_MEMBER") ?
                <>
                        <Link className="nav-link" to="/">정회원</Link>
                </>
                :
                <>
                </>
            }
            {
                userInfo.role.includes("ROLE_ADMIN") ?
                <>
                    <Link className="nav-link" to="/">관리자</Link>
                </>
                :
                <>
                </>
            } 

          <Button variant="drak" onClick={()=>logout()}>로그아웃({userInfo.id}:{userInfo.username}:{userInfo.role})</Button>
            </>
            }
        </Nav>
      </Navbar>
    </>    
  );
};

export default Header;