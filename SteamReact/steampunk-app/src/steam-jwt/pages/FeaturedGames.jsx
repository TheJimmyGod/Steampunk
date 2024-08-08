import axios from 'axios';
import React, { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import '../../HTML/SteamNewsCss.css';
import { NORMAL_SERVER_HOST } from '../apis/api';
import { LoginContext } from '../contexts/LoginContextProvider';
import { Link } from 'react-router-dom';

const TestMoon = () => {
    const {userInfo, loginCheck} = useContext(LoginContext);
    const [games, setGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 게임 정보 가져오기 (뉴스로 바뀔 예정)
    useEffect(() => {
        axios({
            method: "get",
            url: `${NORMAL_SERVER_HOST}/getFeatured`
        })
            .then((response) => {
                const {data, status, statusText} = response;
                if(status === 200)
                {
                    setGames(response.data);
                    console.log("games ======== ", games);
                }
            }).catch(err=>{
                console.log(err);
            })

    }, [loginCheck]);

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
                    {games.map((g) => (
                        <Carousel.Item key={g.id}>
                            <Link to={`newsDetail/${g.game.appId}`}>
                            <img
                                className="d-block w-100"
                                src={g.game.headerImage === null ? "" : g.game.headerImage}
                                alt={g.game.gameName}
                            />
                            </Link>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </>
    );
};



export default TestMoon;