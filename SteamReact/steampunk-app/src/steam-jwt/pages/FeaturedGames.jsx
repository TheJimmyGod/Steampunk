import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import './SteamNewsCss.css';

const TestMoon = () => {


    const [games, setGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 게임 정보 가져오기 (뉴스로 바뀔 예정)
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

    // 슬라이드 변경 타이머
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
        }, 4000); // 슬라이드 변경 주기 (4초)

        return () => clearInterval(interval);
    }, [games.length]); // games.length가 변경될 때만 실행됨



    return (
        <>
            <Container fluid="md">  
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
            </Container>
        </>
    );
};



export default TestMoon;