import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { faFlag as farFlag } from '@fortawesome/free-regular-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import SideBar from '../components/sidebar/SideBar';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Form } from 'react-bootstrap';
import { NORMAL_SERVER_HOST, SERVER_HOST } from '../apis/api';
import * as Swal from '../apis/alert'
const MAXIMUM_COUNT = 10;
const NewsList = () => {
    const defaultImage = "https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";
    const { userInfo, isLogin, logout, loginCheck } = useContext(LoginContext);
    const navigate = useNavigate();

    const [news, setNews] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [checkBoxValue, setCheckBoxValue] = useState("all");
    const [selectedValue, setSelectedValue] = useState("");

    const [bookmarks, setBookmarks] = useState([]);
    const [features, setFeatures] = useState([]);
    const admin = useRef(false);

    useEffect(() => {
        if (userInfo === undefined || userInfo.id === undefined)
            return;
        loadBookmarks();
        loadFeatures();
        loadAdmin();
    }, [loginCheck]) // 로그인이 제대로 확인시 발동

    const loadBookmarks = () => {
        axios({
            url: `${SERVER_HOST}/bookmark/list/${userInfo.id}`,
            method: 'get'
        }).then(response => {
            const { data, status, statusText } = response;
            if (status === 200) {
                console.log("북마크 데이터 전송 완료!", data.length);
                setBookmarks(data);
            }
        }).catch(err => {
            console.log("북마크 전송중 에러 발생");
        })
    }

    const loadFeatures = () => {
        axios({
            url: `${NORMAL_SERVER_HOST}/getFeatured`,
            method: 'get'
        }).then(response => {
            const { data, status } = response;
            if (status === 200) {
                console.log("추천게임 데이터 전송 완료!", data.length);
                setFeatures(data);
            }
        }).catch(err => {
            console.log("추천게임 전송중 에러 발생");
        });
    }

    const loadAdmin = () =>{
        for(let a in userInfo.authorities)
            {
                if(userInfo.authorities[a].name.includes("ADMIN"))
                {
                    admin.current = true;
                    break;
                }
                else
                    admin.current = false;
            }
            console.log("ADMIN: ", admin.current);
    }

    const handleBookmarks = async (insert = true, id) => {
        if (id === undefined || userInfo.id === undefined)
            return;
        if (insert) {
            const response = await axios.post(`${SERVER_HOST}/bookmark/insert/${userInfo.id}/${id}`);
            const { status } = response;
            if (status === 201) {
                console.log(`${id}가 북마크되었습니다.`);
                loadBookmarks();
            }
        }
        else {
            let bookmark;
            for (let item of bookmarks) {
                if (item.news.appId === id) {
                    bookmark = item;
                    break;
                }
            }
            if (bookmark !== undefined && bookmark !== null) {
                const response = await axios.delete(`${SERVER_HOST}/bookmark/remove/${bookmark.id}`);
                const { status } = response;
                if (status === 200) {
                    console.log(`${id}가 북마크 해제했습니다.`);
                    loadBookmarks();
                }
            }
        }
    }

    const handleFeatures = async (insert = true, id) => {
        if (id === undefined || userInfo.id === undefined)
            return;
        if (insert) {
            if (Array.isArray(features) && features.length >= MAXIMUM_COUNT) {
                Swal.alert("추천게임 한도 초과입니다!", "10개까지", "error");
                return;
            }

            axios({
                url: `${NORMAL_SERVER_HOST}/updateFeature/${id}`,
                method: "post"
            }).then(response => {
                const { data, status, statusText } = response;
                if (status === 201) {
                    console.log(data.game.gameName);
                    Swal.alert("추천게임 저장했습니다.", `${data.game.gameName}`, "success");
                    loadFeatures();
                }
                else
                    Swal.alert("추천게임 저장 실패했습니다.", `${status}: ${statusText}`, "error");
            }).catch(err => {
                console.log(err);
                Swal.alert("추천게임 저장 실패했습니다.", "", "error");
            });
        }
        else {
            axios({
                url: `${NORMAL_SERVER_HOST}/removeFeatured/${id}`,
                method: "delete"
            }).then(response => {
                const { data, status, statusText } = response;
                if (status === 200) {
                    Swal.alert("추천게임 삭제했습니다.", `${data}`, "success");
                    loadFeatures();
                }
                else
                    Swal.alert("추천게임 삭제 실패했습니다.", `${status}: ${statusText}`, "error");
            }).catch(err => {
                console.log(err);
                Swal.alert("추천게임 삭제 실패했습니다.", "", "error");
            });
        }
    }

    // 뉴스 데이터 요청 함수
    const fetchNews = async () => {
        if (loading) return; // 이미 로딩 중이면 무시

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/news/findNews/' + checkBoxValue, {
                params: {
                    page: page,
                    size: 5,
                    gameName: selectedValue,
                }
            });
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
                } else {
                    setHasMore(true);
                }
            }
            console.log("fetchNews : ", page);
            setPage(prev => prev + 1); // 페이지 번호 증가
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNews = async () => {
        setPage(0); // 페이지 번호를 초기화
        setNews([]); // 기존 뉴스 데이터를 제거
        setHasMore(true); // 더 많은 뉴스가 있는 상태로 초기화
        await fetchNews(); // 뉴스 데이터 요청
    };

    useEffect(() => {
        loadNews(); // 뉴스 데이터 로드 함수 호출
    }, [checkBoxValue]); // checkBoxValue와 selectedValue 변경 시마다 fetchNews 호출

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
        setCheckBoxValue(e.target.value); // 선택된 필터 값으로 상태 업데이트
        setPage(0); // 페이지 번호 초기화
    };

    const onSubmitString = (e) => {
        e.preventDefault();
        setPage(0);
        if (page === 0) {
            console.log("page 드디어 0 ==", page)
            loadNews();
        }
    };

    // 페이지 번호 초기화 함수
    // const setPageAsync = (pageNumber) => {
    //     return new Promise((resolve) => {
    //         setPage(pageNumber);
    //         resolve();
    //     });
    // };

    // const onSubmitString = async (e) => {
    //     e.preventDefault();
    //     await setPageAsync(0); // 페이지 번호 초기화 후
    //     await loadNews(); // 뉴스 로드
    // };

    const onChangeValue = (e) => {
        setSelectedValue(e.target.value); // 선택된 값 업데이트
        setPage(0); // 페이지 번호 초기화
    };

    return (
        <>
            <SideBar />
            <main>
                <header className="main-header"></header>
                <section className="banner">
                    <h1>STEAM NEWS</h1>
                    <p>최신 스팀 뉴스를 알려드립니다</p>
                    <Form className="search-bar" onSubmit={onSubmitString}>
                        <input className="search-news" placeholder="Search..." onChange={onChangeValue} />
                        <button type='submit' style={{ width: "50px", height: "50px", backgroundColor: "#00BFFF", marginLeft: "5px" }}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                    </Form>
                    <div className="filter-menu">
                        <label>
                            <input type="radio" name="filter" value="all" checked={checkBoxValue === "all"} onChange={handleFilterChange} />
                            전체
                        </label>
                        <label>
                            <input type="radio" name="filter" value="free" checked={checkBoxValue === "free"} onChange={handleFilterChange} />
                            무료게임
                        </label>
                        <label>
                            <input type="radio" name="filter" value="paid" checked={checkBoxValue === "paid"} onChange={handleFilterChange} />
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
                            <div className="news-item" key={item.id}>
                                <img
                                    src={item.capsuleImage || defaultImage}
                                    alt="뉴스 이미지"
                                    className="news-image"
                                />
                                <div className="news-content">
                                    <h2 className="news-title" onClick={() => { navigate(`/steam/newsDetail/${item.appId}`) }}>
                                        <Link>{item.title}</Link>
                                    </h2>
                                    <p className="game-name">{item.gameName}</p>
                                    <p className="author">{item.author}</p>
                                    <p className="date">{formatDateToKorean(item.date)}</p>
                                </div>
                                <div className='bookmark-and-features'>
                                    <div className="bookmark">
                                        {
                                            bookmarks.some(x => x.news.appId === item.appId) ?
                                                <FontAwesomeIcon icon={faBookmark} onClick={() => { handleBookmarks(false, item.appId) }} /> :
                                                <FontAwesomeIcon icon={farBookmark} onClick={() => { handleBookmarks(true, item.appId) }} />
                                        }
                                    </div>
                                    {
                                        admin.current ? 
                                        <div className="features">
                                        {
                                            features.some(x => x.game.appId === item.appId) ?
                                                <FontAwesomeIcon icon={faFlag} onClick={() => { handleFeatures(false, item.appId) }} /> :
                                                <FontAwesomeIcon icon={farFlag} onClick={() => { handleFeatures(true, item.appId) }} />
                                        }
                                    </div>
                                    :<></>
                                    }

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
