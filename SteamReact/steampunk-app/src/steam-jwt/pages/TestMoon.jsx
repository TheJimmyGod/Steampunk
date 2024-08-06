import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import "./TestMoon.css"
import { Button, Card, Carousel, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

const TestMoon = () => {

    const [youtube, setYoutube] = useState({ items: []});
    const [games, setGames] = useState([]);
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 데이터 요청 함수
    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/news/findFiveNews', {
                params: {
                    page: page,
                    size: 5
                }
            });

            const fetchedNews = response.data.data;
            console.log("fetchNews  ::  ",fetchNews);
            if(Array.isArray(fetchedNews)){
                setNews(prevNews => [...prevNews, ...fetchedNews]);
                console.log("fetched News : ", news)
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
            console.log(response);
            setGames(response.data);
            console.log("games ======== ",games);
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
                    dataLength={news.length} // 현재 로드된 데이터 길이
                    next={fetchNews} // 스크롤이 끝에 도달했을 때 호출되는 함수
                    hasMore={hasMore} // 더 로드할 데이터가 있는지 여부
                    loader={<h4>Loading...</h4>} // 로딩 중 표시할 컴포넌트
                    endMessage={<p>No more news!</p>} // 데이터가 더 이상 없을 때 표시할 메시지
                >
                    <ul>
                        {news.map((item, index) => (
                            <li key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </li>
                        ))}
                    </ul>
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