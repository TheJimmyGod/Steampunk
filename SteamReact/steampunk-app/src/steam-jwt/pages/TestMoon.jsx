import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
// import "./TestMoon.css"  
import { Button, Card, Carousel, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

const TestMoon = () => {

    const [youtube, setYoutube] = useState({ items: []});
    const [games, setGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    
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
                    size: 5
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

    // 게임 정보 가져오기 (뉴스로 바뀔 예정)
    useEffect(()=>{
        axios({
            method: "get",
            url: "http://localhost:8080/game/testGames"
        })
        .then((response) => {
            setGames(response.data);
        })

    },[]);

    // useEffect(()=>{
    //     axios({
    //         method: "get",
    //         url: "http://localhost:8080/news/findAllNews"
    //     })
    //     .then((response) => {
    //         console.log(response);
    //         setNews(response.data);
    //         console.log("news ======== ",news);
    //     })

    // },[]);

    // 슬라이드 변경 타이머
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
        }, 4000); // 슬라이드 변경 주기 (4초)

        return () => clearInterval(interval);
    }, [games.length]); // games.length가 변경될 때만 실행됨

    const hasData = youtube.items.length > 0;

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
        <div className='app'>
            <h1>Test</h1>
            {/* 헤더 */}
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Game Store</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* 메인 콘텐츠 */}
            <Container fluid="md" className="my-4">
                <Row>
                    <Col md={12}>
                        <h4>Featured Games</h4>
                        <Carousel activeIndex={currentIndex} onSelect={(selectedIndex) => setCurrentIndex(selectedIndex)}>
                            {games.map((game) => (
                                <Carousel.Item key={game.id}>
                                    <img
                                        className="d-block w-100"
                                        src={game.headerImage}
                                        alt={game.gameName}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                </Row>
                <div className="news-container">
                <h1 className="text-center my-4">최신 뉴스</h1>
                {/* {news.length === 0 ? (
                    <p className="text-center">로딩 중...</p>
                ) : (
                    <div className="news-list">
                        {news.map((item) => (
                            <Card className="news-card mb-4" key={item.id}>
                                <Row>
                                    <Col xs={12} md={5} className="news-card-image-col">
                                        <Card.Img
                                            src={item.capsuleImage}
                                            alt={item.title}
                                            className="news-card-image"
                                        />
                                    </Col>
                                    <Col xs={12} md={7} className="news-textbox">
                                        <div>
                                        <Card.Body>
                                            <Card.Title className="news-title">{item.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted news-date">
                                                {item.gameName}
                                            </Card.Subtitle>
                                            <Card.Subtitle className="mb-2 text-muted news-author">
                                                {item.author}
                                            </Card.Subtitle>
                                        </Card.Body>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </div>
                )} */}
                <InfiniteScroll
                        dataLength={news.length}
                        next={fetchNews}
                        hasMore={hasMore}
                        loader={<h4 className="text-center">Loading...</h4>}
                        endMessage={<p className="text-center">No more news!</p>}
                    >
                        <Row>
                            {news.map((item) => (
                            <Card className="news-card mb-4" key={item.id}>
                                <Row>
                                    <Col xs={12} md={5} className="news-card-image-col">
                                        <Card.Img
                                            src={item.capsuleImage}
                                            alt={item.title}
                                            className="news-card-image"
                                        />
                                    </Col>
                                    <Col xs={12} md={7} className="news-textbox" style={{display: "flex", alignItems: "center"}}>
                                        <div>
                                        <Card.Body>
                                            <Card.Title className="news-title"><Link>{item.title}</Link></Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted news-gameName">
                                                {item.gameName}
                                            </Card.Subtitle>
                                            <Card.Subtitle className="mb-2 text-muted news-author">
                                                {item.author}
                                            </Card.Subtitle>
                                            <Card.Subtitle className="mb-2 text-muted news-date">
                                                {formatDateToKorean(item.date)}
                                                
                                            </Card.Subtitle>
                                        </Card.Body>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                        </Row>
                    </InfiniteScroll>
                </div>
            </Container>

            {/* 푸터 */}
            <Navbar bg="dark" variant="dark" className="mt-4">
                <Container className="text-center">
                    <Navbar.Text>
                        © 2024 Game Store. All rights reserved.
                    </Navbar.Text>
                </Container>
            </Navbar>
            
        </div>
    );
};



export default TestMoon;