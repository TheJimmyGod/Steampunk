import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import SideBar from '../components/sidebar/SideBar';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Form } from 'react-bootstrap';

const NewsList = () => {
    const defaultImage = "https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";
    const { isLogin, logout } = useContext(LoginContext);

    const navigate = useNavigate();

    const [news, setNews] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectValue, setSelectValue] = useState("all");

    // 뉴스 데이터 요청 함수
    const fetchNews = async () => {
        if (loading) return; // 이미 로딩 중이면 무시

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/news/findNews/'+selectValue, {
                params: {
                    page: page,
                    size: 5,
                }
            });
            console.log("정렬확인용 : ",response.data.content); // 서버 응답 데이터 확인
            console.log('News:', news);
            console.log('Page:', page);
            console.log('Has more:', hasMore);
            const fetchedNews = response.data.content;
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

            setPage(page + 1); // 페이지 번호 증가
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadNews = async () => {
            setPage(0); // 페이지 번호를 초기화
            setNews([]); // 기존 뉴스 데이터를 제거
            setHasMore(true); // 더 많은 뉴스가 있는 상태로 초기화
            setLoading(false);
            await fetchNews(); // 뉴스 데이터 요청
        };

        loadNews(); // 뉴스 데이터 로드 함수 호출
    }, [selectValue]); // selectValue 변경 시마다 fetchNews 호출

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

    const handleFilterChange = (e) => {
        setSelectValue(e.target.value); // 선택된 필터 값으로 상태 업데이트
        setPage(0);
    };

    const onSubmitString = (e) => {
        e.preventDefault();

        console.log(e.target.value);

    }

    return (
        <>
            <SideBar />
            <main>
                <header className="main-header"></header>
                <section className="banner">
                    <h1>STEAM NEWS</h1>
                    <p>최신 스팀 뉴스를 알려드립니다</p>
                    <Form onClick={onSubmitString} className="search-bar">
                        <FontAwesomeIcon icon={faBars} className="filter-toggle" />
                        <input className="search-news" placeholder="Search..."/>
                        <button type='submit'><FontAwesomeIcon icon={faMagnifyingGlass} /></button> 
                    </Form>
                    <div className="filter-menu">
                        <label>
                            <input type="radio" name="filter" value="all" checked={selectValue === "all"} onChange={handleFilterChange} />
                            전체
                        </label>
                        <label>
                            <input type="radio" name="filter" value="free" checked={selectValue === "free"} onChange={handleFilterChange} />
                            무료게임
                        </label>
                        <label>
                            <input type="radio" name="filter" value="paid" checked={selectValue === "paid"} onChange={handleFilterChange} />
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
                        ))}
                    </InfiniteScroll>
                </section>
            </main>
        </>
    );
};

export default NewsList;
