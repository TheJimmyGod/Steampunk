import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHubspot, faSteam, faYoutube, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faHome, faNewspaper, faUser, faRightToBracket, faRightFromBracket, faBars, faMagnifyingGlass, faBookmark, faDownLong } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import SideBar from '../components/sidebar/SideBar';

const NewsList = () => {

    const navigate = useNavigate();
    console.log(LoginContext);
    const { isLogin } = useContext(LoginContext);
    const { logout } = useContext(LoginContext);

    console.log(isLogin);
    console.log(logout);

    return (
        <>
            <SideBar/>
            <main>
                <header className="main-header"></header>
                <section className="banner">
                    <h1>STEAM NEWS</h1>
                    <p>최신 스팀 뉴스를 알려드립니다</p>
                    <div className="search-bar">
                        <FontAwesomeIcon icon={faBars} className="filter-toggle" />
                        <input className="search-news" placeholder="Search..." />
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                    <div className="filter-menu">
                        <label>
                            <input type="radio" name="filter" value="all" defaultChecked />
                            전체
                        </label>
                        <label>
                            <input type="radio" name="filter" value="free" />
                            무료게임
                        </label>
                        <label>
                            <input type="radio" name="filter" value="paid" />
                            유료게임
                        </label>
                    </div>
                </section>
                <section className="news-list">
                    <div className="news-item">
                        <img src="" alt="뉴스 이미지" className="news-image" />
                        <div className="news-content">
                            <h2 className="news-title">뉴스 제목</h2>
                            <p className="game-name">게임명</p>
                            <p className="author">저자</p>
                        </div>
                        <div className="bookmark">
                            <FontAwesomeIcon icon={farBookmark} />
                            <FontAwesomeIcon icon={faBookmark} />
                        </div>
                    </div>
                    <div className="add-news">
                        <FontAwesomeIcon icon={faDownLong} /> 뉴스 더보기
                    </div>
                </section>
            </main>
        </>
    );
};

export default NewsList;
