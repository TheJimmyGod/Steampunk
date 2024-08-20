import React, { useContext, useEffect, useRef, useState } from 'react';
import SideBar from '../components/sidebar/SideBar';
import { useNavigate, useParams } from 'react-router-dom';
import { faBookmark, faFlag } from '@fortawesome/free-solid-svg-icons';
import { faFlag as farFlag } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import '../../HTML/SteamNewsCss.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import { LoginContext } from '../contexts/LoginContextProvider';
import { NORMAL_SERVER_HOST, SERVER_HOST } from '../apis/api';
import * as Swal from '../apis/alert'
const MAXIMUM_COUNT = 10;
const defaultImage = "https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016";
const NewsDetail = () => {
    const navigate = useNavigate();
    const [bookmark, setBookmark] = useState({});
    const { userInfo, loginCheck } = useContext(LoginContext);
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

    const [features, setFeatures] = useState([]);
    const admin = useRef(false);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${NORMAL_SERVER_HOST}/news/findNews/${appId}`
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
            url: `${NORMAL_SERVER_HOST}/game/findGame/${appId}`
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

    useEffect(()=>{
        if(userInfo === undefined || userInfo.id === undefined)
            return;
        loadBookmark();
        loadFeatures();
        loadAdmin();
    }, [loginCheck])
    const loadBookmark = () =>{
        axios({
            url: `${SERVER_HOST}/bookmark/find/${userInfo.id}/${appId}`,
            method: 'get'
        }).then(response =>{
            const {data, status} = response;
            if(status === 200)
            {
                console.log("북마크 데이터 전송 완료!");
                setBookmark(data);
            }
        }).catch(err=>{
            console.log("북마크 전송중 에러 발생: ",err);
            setBookmark({});
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

        if (!content) {
            console.error('Invalid content:', content);
            return null; 
        }

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

    const handleBookmarks = async (insert = true, id) =>{
        if(id === undefined || userInfo.id === undefined)
            return;
        if(insert)
        {
            const response = await axios.post(`${SERVER_HOST}/bookmark/insert/${userInfo.id}/${id}`);
            const {status} = response;
            if(status === 201)
            {
                console.log(`${id}가 북마크되었습니다.`);
                loadBookmark();
            }
        }
        else
        {
            if(bookmark !== undefined && bookmark !== null)
            {
                const response = await axios.delete(`${SERVER_HOST}/bookmark/remove/${bookmark.id}`);
                const {status} = response;
                if(status === 200)
                {
                    console.log(`${id}가 북마크 해제했습니다.`);
                    loadBookmark();
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

    return (
        <>
            <SideBar />
            <main className="main-content">
                <div className="capsule-image">
                    <img src={news.capsuleImage || defaultImage} alt="Capsule" />
                </div>
                <div className="title-author">
                    <h1>{news.title}</h1>
                    <h2>author: {news.author}</h2>
                </div>
                <div className="bookmark">
                    {
                        bookmark ?
                            <FontAwesomeIcon icon={faBookmark} size='10x' onClick={() => { handleBookmarks(false, gameInfo.appId) }} /> :
                            <FontAwesomeIcon icon={farBookmark} size='10x' onClick={() => { handleBookmarks(true, gameInfo.appId) }} />
                    }
                </div>
                {
                    admin.current ?
                        <div className="features-detail">
                            {
                                features.some(x => x.game.appId === gameInfo.appId) ?
                                    <FontAwesomeIcon icon={faFlag} onClick={() => { handleFeatures(false, gameInfo.appId) }} /> :
                                    <FontAwesomeIcon icon={farFlag} onClick={() => { handleFeatures(true, gameInfo.appId) }} />
                            }
                        </div>
                        : <></>
                }
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
