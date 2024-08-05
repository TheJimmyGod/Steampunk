import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHubspot, faSteam, faYoutube, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faHome, faNewspaper, faUser, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';

const SideBar = () => {
    const navigate = useNavigate();
    const {isLogin, logout} = useContext(LoginContext);

    return (
        <aside className="sidebar">
        <div className="logo">
            <FontAwesomeIcon icon={faHubspot} /> Steam News
        </div>
        <nav>
            <ul>
                <li onClick={() => {navigate("/steam")}}><FontAwesomeIcon icon={faHome} /> 홈</li>
                <li onClick={() => {navigate("/steam/newsList")}}><FontAwesomeIcon icon={faNewspaper} /> 뉴스페이지</li>
                <li onClick={() => {navigate("/steam/mypage")}}><FontAwesomeIcon icon={faUser} /> 마이페이지</li>
                {!isLogin ? <li onClick={() => {navigate("/steam/login")}} ><FontAwesomeIcon icon={faRightToBracket} />로그인</li> : <></>}
                {isLogin ? <li onClick={()=>{logout(false)}}><FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃</li> : <></>}
            </ul>
        </nav>
        <ul className="social-media">
            <li><FontAwesomeIcon icon={faSteam} /></li>
            <li><FontAwesomeIcon icon={faYoutube} /></li>
            <li><FontAwesomeIcon icon={faInstagram} /></li>
            <li><FontAwesomeIcon icon={faFacebook} /></li>
        </ul>

    </aside>
    );
};

export default SideBar;