import React from 'react';
import '../pages/SteamNewsCss.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHubspot, faSteam, faYoutube, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faHome, faNewspaper, faUser, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const Home = () => {

const navigate = useNavigate();

    return (
        <>
            <aside className="sidebar">
                <div className="logo">
                    <FontAwesomeIcon icon={faHubspot} /> Steam News
                </div>
                <nav>
                    <ul>
                        <li onClick={() => {navigate("/steam")}}><FontAwesomeIcon icon={faHome} /> 홈</li>
                        <li onClick={() => {navigate("/steam/newsList")}}><FontAwesomeIcon icon={faNewspaper} /> 뉴스페이지</li>
                        <li onClick={() => {}}><FontAwesomeIcon icon={faUser} /> 마이페이지</li>
                        <li onClick={() => {navigate("/steam/login")}} ><FontAwesomeIcon icon={faRightToBracket} />로그인</li>
                        <li><FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃</li>
                    </ul>
                </nav>
                <ul className="social-media">
                    <li><FontAwesomeIcon icon={faSteam} /></li>
                    <li><FontAwesomeIcon icon={faYoutube} /></li>
                    <li><FontAwesomeIcon icon={faInstagram} /></li>
                    <li><FontAwesomeIcon icon={faFacebook} /></li>
                </ul>
            </aside>

            <main>
                <header className="main-header"></header>
                <section className="banner">
                    <h1>STEAM NEWS</h1>
                    <p>다양한 Steam 소식을 알려드립니다</p>
                </section>
                <section className="slider">
                    <div className="grid-item recommended">
                        추천게임 슬라이더 자리
                    </div>
                </section>
                <section className="content-grid">
                    <div className="grid-item chart">
                        차트 자리
                    </div>
                    <div className="grid-item video">
                        유튜브 영상 자리
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
