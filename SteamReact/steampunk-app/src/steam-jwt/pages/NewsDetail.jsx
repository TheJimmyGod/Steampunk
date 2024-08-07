import React, { useEffect, useState } from 'react';
import SideBar from '../components/sidebar/SideBar';
import { useNavigate, useParams } from 'react-router-dom';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import '../../HTML/SteamNewsCss.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';

const NewsDetail = () => {
    const navigate = useNavigate();
    const { appId } = useParams();

    const [news, setNews] = useState({
        appId: "",
        gameName: "",
        capsuleImage: "",
        title: "",
        author: "",
        content: "",
        date: "",
    });

    const [gameInfo, setGameInfo] = useState({
        appId: "",
        gameName: "",
        developers: "",
        isFree: "",
        capsuleImage: "",
        shortDescription: "",
        minimum: "",
        price: "",
        discount: "",
        genres: "",
        website: "",
        releaseDate: ""
    });

    useEffect(() => {
        axios({
            method: "GET",
            url: `http://localhost:8080/news/findNews/${appId}`
        })
            .then(response => {
                const { data, status } = response;
                if (status === 200) {
                    console.log("뉴스정보", data);
                    setNews(data);
                } else {
                    window.alert("조회 실패!");
                }
            });
    }, []);

    useEffect(() => {
        axios({
            method: "GET",
            url: `http://localhost:8080/game/findGame/${appId}`
        })
            .then(response => {
                const { data, status } = response;
                if (status === 200) {
                    setGameInfo(data);
                    console.log("게임정보", data);
                } else {
                    window.alert("조회 실패!");
                }
            });
    }, []);

    // 문자열을 변환하는 함수
    const formatContent = (content) => {
        return content
            .split('. ')
            .map((str, index) => (
                <React.Fragment key={index}>
                    {parse(str)}
                    .<br />
                </React.Fragment>
            ));
    };

    return (
        <>
            <SideBar />
            <main className="main-content">
                <div className="capsule-image">
                    <img src={news.capsuleImage} alt="Capsule" />
                </div>
                <div className="title-author">
                    <h1>{news.title}</h1>
                    <h2>author: {news.author}</h2>
                </div>
                <div className="bookmark">
                    <FontAwesomeIcon icon={farBookmark} />
                    <FontAwesomeIcon icon={faBookmark} />
                </div>
                <div className="game-news-content">
                    {formatContent(news.content)}
                </div>
                <hr></hr>
                <div className="game-info">
                    <h2>Game Information</h2>
                    <p>Game Name: {gameInfo.gameName}</p>
                    <p>개발자: {gameInfo.developers}</p>
                    <p>무료 여부: {gameInfo.isFree ? '무료' : '유료'}</p>
                    <p>설명: {formatContent(gameInfo.shortDescription)}</p>
                    <p>최소 요구사항: {formatContent(gameInfo.minimum)}</p>
                    <ul>
                        <ol>가격: {gameInfo.price} </ol>
                        <ol>할인: {gameInfo.discount}</ol>
                        <ol>장르: {gameInfo.genres}</ol>
                        <ol>웹사이트: <a href={gameInfo.website}>{gameInfo.website}</a></ol>
                        <ol>출시일: {gameInfo.releaseDate}</ol>
                    </ul>
                </div>
            </main>
        </>
    );
};

export default NewsDetail;
