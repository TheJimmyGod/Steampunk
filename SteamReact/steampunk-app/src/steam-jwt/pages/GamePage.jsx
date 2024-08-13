import React, { useContext, useEffect, useRef, useState } from 'react';
import { PhaserGame } from '../components/game/PhaserGame'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import { Bar } from 'react-chartjs-2';
import SideBar from '../components/sidebar/SideBar'
import axios from 'axios';
import { SERVER_HOST } from '../apis/api';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const GamePage = () => {
    const navigate = useNavigate();
    const {userInfo, loginCheck} = useContext(LoginContext);
    const [hoveredIndex, setHoveredIndex] = useState(null); // 마우스가 올라간 막대의 인덱스를 추적
    const [ranks, setRanks] = useState([]);
    const [scores, setScores] = useState([]);
    const [time, setTime] = useState();
    useEffect(()=>{
       if(userInfo === null)
       {
           navigate("/steam/login");
           return;
       }
       chart();
    },[loginCheck]);

    const chart = async () =>{
        const response = await axios.get(`${SERVER_HOST}/minigame_rank`);
        const {data, status} = response;
        if(status === 200){
            setScores(data.map(item=> item.miniGame_Score));
            setRanks(data.map(item=>({
                username: item.username,
                score: item.miniGame_Score
            })));
            setTime(Date.now());
        }
    }

    const createGradient = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 102, 204, 1)');  // 진한 파란색
        gradient.addColorStop(1, 'rgba(102, 204, 255, 1)'); // 연한 파란색
        return gradient;
    };
    const data = {
        labels: ranks.map(item => `${item.username}`),
        datasets: [
            {
                type: 'bar',
                label: '미니게임 랭킹',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx } = chart;
                    return createGradient(ctx);
                },
                data: scores,
                borderColor: 'none',
                borderWidth: 0,
                barPercentage: 0.5,
                categoryPercentage: 1,
                hoverBackgroundColor: '#aad2ff'
            },
        ],
    };
    const formattedDate = ranks.length > 0 ? new Date(time).toLocaleString() : '';
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: 'white',
                    callback: function(value, index) {
                        const label = this.getLabelForValue(value);
                        if (index === hoveredIndex) {
                            const username = ranks[index].username;
                            return `${username}`;
                        }
                        return label;
                    },
                    
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: false,
                    
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'white',
                }
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                
                    color: 'white',
                }
                
            },
            title: {
                
                display: true,
                text: ["STEAM NEWS MINI GAME TOP 10",
                `(${formattedDate} 기준)`],
                color: 'white',
                font: {
                    size: 24
                }
            },
            tooltip: {
                
                callbacks: {
                    label: function(context) {
                        const {  dataIndex } = context;
                        const score = ranks[dataIndex].score;
                        const username = ranks[dataIndex].username;
                        return [
                            `유저이름: ${username}`,
                            `점수: ${score}`,
                        ];
                    }
                }
            }
        },
        onHover: (event, chartElement) => {
            if (chartElement.length > 0) {
                const index = chartElement[0].index;
                setHoveredIndex(index);
            } else {
                setHoveredIndex(null);
            }
        },
    };

 // The sprite can only be moved in the MainMenu Scene
    
 //  References to the PhaserGame component (game and scene are exposed)
 const phaserRef = useRef();
 window.gameGlobalState = {
    userInfo
};
 // Event emitted from the PhaserGame component
 const currentScene = (scene) => {

 }

 return (
    <>
         <SideBar />
         <header className="main-header"></header>
         <div className="banner">
             <h1>Steam News Mini Game</h1>
             <p>{userInfo != null && userInfo.username ? userInfo.username : "Anonymous"}님 환영합니다</p>
         </div>
         <div className='bg'>
             <div id="app" style={{ marginLeft: "22.5%", marginTop: "5%", paddingBottom: "5%" }}>
                 <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
             </div>
             <div style={{textAlign:"center"}}>
                <strong>플레이 방법</strong>
                <p><strong>이동</strong>: 화살표 ← → || <strong>점프</strong>: 스페이스 </p>
             </div>
             <div style={{ marginLeft:"25%", width: '50%', height: '530px', margin: '0 auto'}}>
             <Bar data={data} options={options}/>
             </div>
         </div>
         <div style={{paddingBottom:"10%"}}/>
    </>
 );
};

export default GamePage;