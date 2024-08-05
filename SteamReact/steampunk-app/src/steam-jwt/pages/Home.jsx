import React, { useContext,  useState, useEffect } from 'react';
import '../pages/SteamNewsCss.css';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import axios from 'axios';
import { Carousel, Col } from 'react-bootstrap';
import SideBar from '../components/sidebar/SideBar';


const Home = () => {

    const [youtube, setYoutube] = useState({ items: [] });
    const [games, setGames] = useState([]);
    const [news, setNews] = useState([]);
    const [chart, setChart] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const key = "AIzaSyCOaXfLbU-uxGuK4UXWVGO80QuhzOXQ7Ds";
    

    useEffect(() => {
        axios({
            method: "get",
            url: "http://localhost:8080/game/testGames"
        })
            .then((response) => {
                setGames(response.data);
                console.log("games ======== ", games);
            })

    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
        }, 4000); // 슬라이드 변경 주기 (4초)

        return () => clearInterval(interval);
    }, [games.length]); // games.length가 변경될 때만 실행됨


    // 유튜브 정보 가져오기
    // useEffect(() => {
    //     axios({
    //         method: "get",
    //         url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=%EC%8A%A4%ED%8C%80&type=video&key=" + key,
    //     })
    //         .then((response) => {

    //             setYoutube(response.data);
    //         })
    // }, [])

    // useEffect(() => {
    //     axios({
    //         method: "get",
    //         url: "https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/?key=2E0DEAF02393FA04974AFB40ADFAABD1"
    //     })
    //     .then((response) => {
    //         setChart(response.data);
    //     })
    // }, [])

    const hasData = youtube.items.length > 0;

    return (
        <>
            <SideBar/>
            <main>
                <header className="main-header"></header>
                <section className="banner">
                    <h1>STEAM NEWS</h1>
                    <p>다양한 Steam 소식을 알려드립니다</p>
                </section>
                <section className="slider">
                    <div className="grid-item recommended">
                        <Col md={6}>
                            <Carousel activeIndex={currentIndex} onSelect={(selectedIndex) => setCurrentIndex(selectedIndex)}>
                                {/* {games.map((game) => (
                                    <Carousel.Item key={game.id}>
                                        <img
                                            className="d-block w-100"
                                            src={game.headerImage}
                                            alt={game.gameName}
                                        />
                                    </Carousel.Item>
                                ))} */}
                            </Carousel>
                        </Col>
                    </div>
                </section>
                <section className="content-grid">
                    <div className="grid-item chart">
                        차트 자리
                    </div>
                    <div className="grid-item video">
                        {hasData ? (<iframe
                            width="482"
                            height="270"
                            src={`https://www.youtube.com/embed/${youtube.items[0].id.videoId}`}
                            title={`https://www.youtube.com/embed/${youtube.items[0].snippet.title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>) : (<p>로딩중</p>)}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
