import React, { useState, useEffect } from 'react';
import '../pages/SteamNewsCss.css';

import axios from 'axios';
import ChartTest from './ChartTest';
import FeaturedGames from './FeaturedGames';
import SideBar from '../components/sidebar/SideBar';
import YoutubeVideos from './YoutubeVideos';


const Home = () => {

    const [games, setGames] = useState([]);



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
                       <YoutubeVideos />
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
