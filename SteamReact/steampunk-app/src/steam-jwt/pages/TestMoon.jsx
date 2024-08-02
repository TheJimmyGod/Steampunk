import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import "./TestMoon.css"
import { Button, Card, Carousel, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TestMoon = () => {

    const [youtube, setYoutube] = useState({ items: []});
    const [games, setGames] = useState([]);
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // const key = "AIzaSyCOaXfLbU-uxGuK4UXWVGO80QuhzOXQ7Ds";

    // 게임 정보 가져오기 (뉴스로 바뀔 예정)
    useEffect(()=>{
        axios({
            method: "get",
            url: "http://localhost:8080/game/testGames"
        })
        .then((response) => {
            setGames(response.data);
            console.log("games ======== ",games);
        })

    },[]);

    useEffect(()=>{
        axios({
            method: "get",
            url: "http://localhost:8080/news/findAllNews"
        })
        .then((response) => {
            setNews(response.data);
            console.log("news ======== ",news);
        })

    },[]);

    // 유튜브 정보 가져오기
    // useEffect(()=>{
    //     axios({
    //         method: "get",
    //         url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=%EC%8A%A4%ED%8C%80&type=video&key="+key,
    //     })
    //     .then((response) => {
            
    //         setYoutube(response.data);
    //     })
    // },[])

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
                    <Col md={3}>
                        <h4>Categories</h4>
                        <Nav className="flex-column">
                            <Nav.Link href="#">Action</Nav.Link>
                            <Nav.Link href="#">Adventure</Nav.Link>
                            <Nav.Link href="#">RPG</Nav.Link>
                            <Nav.Link href="#">Shooter</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={9}>
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
            {news.length === 0 ? (
                <p className="text-center">로딩 중...</p>
            ) : (
                <div className="news-list">
                    {news.map((item) => (
                        <Card className="news-card mb-4" key={item.id}>
                            <Row noGutters>
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
                                        <Card.Text className="news-content">
                                            {item.content.length > 100
                                                ? `${item.content.substring(0, 170)}...`
                                                : item.content}
                                        </Card.Text>
                                    </Card.Body>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            )}
        </div>
            </Container>
            {/* 유튜브  */}
            {/* {hasData ? (<iframe 
            width="482" 
            height="270" 
            src={`https://www.youtube.com/embed/${youtube.items[0].id.videoId}`}
            title={`https://www.youtube.com/embed/${youtube.items[0].snippet.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>) : (<p>로딩중</p>)} */}

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