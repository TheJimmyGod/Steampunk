import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';

// Chart.js에 필요한 스케일과 요소를 등록합니다.
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ChartTest = () => {
    const [chartData, setChartData] = useState([]);
    const [cocurrunt, setCocurrunt] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null); // 마우스가 올라간 막대의 인덱스를 추적
    useEffect(() => {
        axios({
            method: "get",
            url: "http://localhost:8080/rank/findByRank"
        })
        .then((response) => {
            const concurrentInGameData = response.data.map(item => item.concurrentInGame);
            const chartData = response.data.map(item => ({
                gameName: item.gameName,
                appid: item.appid,
                rank: item.rank,
                concurrentInGame: item.concurrentInGame,
                lastUpdate: item.lastUpdate,
            }));

            setCocurrunt(concurrentInGameData);
            setChartData(chartData);
         
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }, []);


    const formattedDate = chartData.length > 0 ? new Date(chartData[0].lastUpdate * 1000).toLocaleString() : '';
    const createGradient = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 102, 204, 1)');  // 진한 파란색
        gradient.addColorStop(1, 'rgba(102, 204, 255, 1)'); // 연한 파란색
        return gradient;
    };
    const data = {
        labels: chartData.map(item => `${item.rank}위`),
        datasets: [
            {
                type: 'bar',
                label: '동시접속자 수',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx } = chart;
                    return createGradient(ctx);
                },
                data: cocurrunt,
                borderColor: 'none',
                borderWidth: 0,
                barPercentage: 0.5,
                categoryPercentage: 1,
                hoverBackgroundColor: '#08ffb9'
                
                
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: 'white',
                    callback: function(value, index) {
                        // 마우스가 막대에 올라갔을 때 레이블 변경
                        const label = this.getLabelForValue(value);
                        if (index === hoveredIndex) {
                            const gameName = chartData[index].gameName;
                            return `${gameName}`;
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
                text: ["STEAM GAME TOP 10",
                `(${formattedDate} 기준)`],
                color: 'white',
                font: {
                    size: 24
                }
            },
            tooltip: {
                
                callbacks: {
                    label: function(context) {
                        const { dataset, dataIndex } = context;
                        const rank = chartData[dataIndex].rank;
                        const gameName = chartData[dataIndex].gameName;
                        const concurrentInGame = dataset.data[dataIndex];
                    
                        return [
                            `순위: ${rank}`,
                            `게임 명: ${gameName}`,
                            `동시접속자 수: ${concurrentInGame} 명`
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

    return (
        <div style={{ width: '92%', height: '530px', margin: '0 auto'}}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ChartTest;
