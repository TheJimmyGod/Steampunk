import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHubspot, faSteam, faYoutube, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faHome, faNewspaper, faUser, faRightToBracket, faRightFromBracket, faBars, faMagnifyingGlass, faBookmark, faDownLong } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import SideBar from '../components/sidebar/SideBar';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Card, Col, Row } from 'react-bootstrap';

const NewsList = () => {
    const defaultImage = "https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";

    const navigate = useNavigate();
    console.log(LoginContext);
    const { isLogin } = useContext(LoginContext);
    const { logout } = useContext(LoginContext);

    console.log(isLogin);
    console.log(logout);

    const [news, setNews] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 뉴스 데이터 요청 함수
    const fetchNews = async () => {
        if (loading) return; // 이미 로딩 중이면 무시

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/news/findFiveNews', {
                params: {
                    page: page,
                    size: 5,
                }
            });

            const fetchedNews = response.data.content;
            console.log("fetchedNews  ::  ", fetchedNews);

            if (Array.isArray(fetchedNews)) {
                // 중복된 ID를 제거하여 고유한 뉴스 아이템만 유지
                const uniqueNews = Array.from(new Map(fetchedNews.map(item => [item.id, item])).values());

                setNews(prevNews => {
                    // 현재 뉴스와 새로운 뉴스를 병합하고 중복 제거
                    const allNews = [...prevNews, ...uniqueNews];
                    const uniqueAllNews = Array.from(new Map(allNews.map(item => [item.id, item])).values());
                    return uniqueAllNews;
                });

                // 페이지가 더 있는지 확인
                if (fetchedNews.length === 0 || fetchedNews.length < 5) {
                    setHasMore(false);
                }
            }

            setPage(prevPage => prevPage + 1); // 페이지 번호 증가
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(); // 컴포넌트가 처음 렌더링될 때 데이터 요청
    }, []);

    // Unix 타임스탬프를 한국 시간으로 변환하는 함수
    const formatDateToKorean = (timestamp) => {
        const date = new Date(timestamp * 1000); // 타임스탬프는 초 단위이므로 밀리초로 변환
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };

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
                    <InfiniteScroll
                        dataLength={news.length}
                        next={fetchNews}
                        hasMore={hasMore}
                        loader={<h4 className="text-center">Loading...</h4>}
                        endMessage={<p className="text-center">No more news!</p>}
                    >
                    {news.map((item) => (
                        <div>
                            <div className="news-item">
                            <img
                                    src={item.capsuleImage || defaultImage}
                                    alt="뉴스 이미지"
                                    className="news-image"
                                />
                                <div className="news-content">
                                    <h2 className="news-title" onClick={() =>{navigate(`/steam/newsDetail/${item.appId}`)}}><Link>{item.title}</Link></h2>
                                    <p className="game-name">{item.gameName}</p>
                                    <p className="author">{item.author}</p>
                                    <p className="date">{formatDateToKorean(item.date)}</p>
                                </div>
                                <div className="bookmark">
                                    <FontAwesomeIcon icon={farBookmark} />
                                    <FontAwesomeIcon icon={faBookmark} />
                                </div>
                            </div>
                        </div>
                        
                    ))}
                    </InfiniteScroll>
                </section>
            </main>
        </>
    );
};

export default NewsList;
