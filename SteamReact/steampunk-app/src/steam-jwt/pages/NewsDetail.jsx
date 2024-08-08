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

    const formatContent1 = (content) => {
        const steamImagePattern = /\{STEAM_CLAN_IMAGE\}\/[^\s]+\.png/g;
        return content.split('. ').map((str, index) => {
            if (steamImagePattern.test(str)) {
                const imageUrl = str.match(steamImagePattern)[0].replace('{STEAM_CLAN_IMAGE}', 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans');
                return (
                    <React.Fragment key={index}>
                        <img src={imageUrl} alt="Steam Clan" /><br />
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment key={index}>
                        {parse(str)}
                        .<br />
                    </React.Fragment>
                );
            }
        });
    };


    // 문자열을 변환하는 함수
    const formatContent2 = (content) => {
        return content
            .split('. ')
            .map((str, index) => (
                <React.Fragment key={index}>
                    {parse(str)}
                    .<br />
                </React.Fragment>
            ));
    };

    const priceIsFree = (price) => {
        if (price == null || price.trim() === "") {
            return "Free";
        } else {
            return price;
        }
    }


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
                    {formatContent1(news.content)}
                </div>
                <hr></hr>
                <div className="game-info">
                    <div className="game-info1">
                        <h2 className='game-information-title'>Game Information</h2>
                        <p><span className='highlight-text'>Game name:</span> {gameInfo.gameName}</p>
                        <p><span className='highlight-text'>Developer:</span> {gameInfo.developers}</p>
                        <p><span className='highlight-text'>Free or not:</span> {gameInfo.isFree ? 'Free' : 'Not Free'}</p>
                        <p><span className='highlight-text'>Introduction to the game:</span> {formatContent2(gameInfo.shortDescription)}</p>
                    </div>
                    <div className="game-info2">
                        <p className="game-info2-1"><p className='game-requirements'>System Requirements</p>{formatContent2(gameInfo.minimum)}</p>
                        <ul className="game-info2-2">
                            <li><span className='highlight-text'>Price:</span> {priceIsFree(gameInfo.price)}</li>
                            <li><span className='highlight-text'>Discount:</span> {gameInfo.discount}%</li>
                            <li><span className='highlight-text'>Genres:</span> {gameInfo.genres}</li>
                            <li><span className='highlight-text'>Website URL:</span> <a href={gameInfo.website}>{gameInfo.website}</a></li>
                            <li><span className='highlight-text'>ReleaseDate:</span> {gameInfo.releaseDate}</li>
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
};

export default NewsDetail;
