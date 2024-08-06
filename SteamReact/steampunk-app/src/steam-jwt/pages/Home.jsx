import React, { useContext, useState, useEffect } from 'react';
import '../pages/SteamNewsCss.css';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import axios from 'axios';
import { Carousel, Col } from 'react-bootstrap';
import ChartTest from './ChartTest';
import FeaturedGames from './FeaturedGames';
import SideBar from '../components/sidebar/SideBar';


const Home = () => {

    const [youtube, setYoutube] = useState({ items: [] });
    const [games, setGames] = useState([]);
    const [news, setNews] = useState([]);
    const [chart, setChart] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { isLogin } = useContext(LoginContext);
    const { logout } = useContext(LoginContext);
    // const key = "AIzaSyCOaXfLbU-uxGuK4UXWVGO80QuhzOXQ7Ds";
    const key = "YOUR_KEY";


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

    // 유튜브 정보 가져오기
    useEffect(() => {

        if (!key) {
            setMessage('키 없음');
            return;
        }

        axios({
            method: "get",
            url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=Steam+game+trailertype=video&key=" + key,
        })
            .then((response) => {

                setYoutube(response.data);
            })
            .catch((error) => {
                console.error('유튜브 데이터 요청 중 오류 발생!', error);
                setMessage('유튜브 데이터 요청 중 오류 발생');
            });
    }, [key]);

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
                    <div className="recommended">
                        <FeaturedGames />

                    </div>
                </section>
                <section className="content-grid">
                    <div className="grid-item chart">
                        <ChartTest />
                    </div>
                    <div className="grid-item video">
                        {hasData ? (<iframe
                            width="482"
                            height="270"
                            src={`https://www.youtube.com/embed/${youtube.items[0].id.videoId}`}
                            title={`https://www.youtube.com/embed/${youtube.items[0].snippet.title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>) : (<p>로딩중</p>)}

                        {hasData ? (<iframe
                            width="482"
                            height="270"
                            src={`https://www.youtube.com/embed/${youtube.items[1].id.videoId}`}
                            title={`https://www.youtube.com/embed/${youtube.items[1].snippet.title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>) : (<p>로딩중</p>)}

                    </div>

                </section>
            </main>
        </>
    );
};

export default Home;
