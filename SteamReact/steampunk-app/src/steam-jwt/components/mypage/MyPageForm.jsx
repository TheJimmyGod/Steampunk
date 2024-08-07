import React, { useContext} from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';
import '../../../HTML/SteamNewsCss.css';
import SideBar from '../sidebar/SideBar';
const MyPageForm = ({removal}) => {
    const navigate = useNavigate();
    const {userInfo} = useContext(LoginContext);

    return (
        <>
        <SideBar/>
            <main className='mypage'>
            <header className="main-header"></header>
            <div className="banner">
                <h1>Steam News User Page</h1>
                <p>{userInfo != null && userInfo.username ? userInfo.username : "Anonymous"}님 환영합니다</p>
            </div>
            <div className='bg'>
            <div>
                <Button className='btn-form' onClick={()=>navigate(`/steam/bookmarkmanager`)}>뉴스 즐겨찾기 관리</Button>
            </div>
            <div>
                <Button className='btn-form' onClick={()=>{navigate(userInfo == null ? `/steam/login` : `/steam/edit/${userInfo.id}`)}}>개인 정보 수정</Button>
            </div>
            <div>
                <Button className='btn-form' onClick={removal}>계정 탈퇴</Button>
            </div>
            </div>
            <div style={{marginTop: "20px"}}>
                <Button className='btn-form' onClick={()=>{navigate(-1)}}>이전</Button>
            </div>
            </main>
        </>
    );
};

export default MyPageForm;