import React, { useEffect, useState } from 'react';
import SideBar from '../components/sidebar/SideBar';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
            url: "http://localhost:8080/news/findNews/10"
        })
            .then(response => {
                const { data, status } = response;
                if (status === 200) {
                    console.log("뉴스정보" + data);
                    setNews(data);
                } else {
                    window.alert("조회 실패!");
                }
            });
    }, []);

    useEffect(() => {
        axios({
            method: "GET",
            url: "http://localhost:8080/game/findGame/10"
        })
            .then(response => {
                const { data, status } = response;
                if (status === 200) {
                    setGameInfo(data);
                    console.log("게임정보" + data);
                } else {
                    window.alert("조회 실패!");
                }
            });
    }, []);

    return (
        <>
            <SideBar />
            <main style={{ display: 'flex', flexDirection: 'column', padding: '20px', border: '1px solid #ccc' }}>
                {/* Capsule Image */}
                <div style={{ marginBottom: '10px' }}>
                    <img src={news.capsuleImage} alt="Capsule" style={{ width: '100%', height: 'auto' }} />
                </div>
                {/* Title and Author */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h1>{news.title}</h1>
                    <span>{news.author}</span>
                </div>
                {/* Bookmark Icon */}
                <div style={{ alignSelf: 'flex-end', marginBottom: '10px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <img src="/path/to/bookmark/icon" alt="Bookmark" />
                    </button>
                </div>
                {/* Game News Content */}
                <div style={{ marginBottom: '10px', whiteSpace: 'pre-line' }}>
                    {parse(news.content)}
                </div>
                {/* Game Info */}
                <div>
                    <h2>게임 정보</h2>
                    <p>게임 이름: {gameInfo.gameName}</p>
                    <p>개발자: {gameInfo.developers}</p>
                    <p>무료 여부: {gameInfo.isFree ? '무료' : '유료'}</p>
                    <p>설명: {gameInfo.shortDescription}</p>
                    <p>최소 요구사항: {gameInfo.minimum}</p>
                    <p>가격: {gameInfo.price}</p>
                    <p>할인: {gameInfo.discount}</p>
                    <p>장르: {gameInfo.genres}</p>
                    <p>웹사이트: <a href={gameInfo.website}>{gameInfo.website}</a></p>
                    <p>출시일: {gameInfo.releaseDate}</p>
                </div>
            </main>
        </>
    );
};

export default NewsDetail;
