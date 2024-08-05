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
import { useNavigate } from 'react-router-dom';
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
    // Sample data arrays

    const [chart, setChart] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios({
            method: "get",
            url: "https://localhost:8080/game/saveRank"
        })
            .then((response) => {
                setChart(response);
            }).catch(error => {
                console.error('There was an error!', error);
              });
    }, [])

    let data = {
        labels: ['1위', '2위', '3위', '4위', '5위', '6위', '7위', '8위', '9위', '10위'],
        datasets: [
            {
                type: 'bar',
                label: '게임순위',
                backgroundColor: 'rgb(255, 99, 132)',
                data: setChart,
                borderColor: 'red',
                borderWidth: 2,
            },
        ],
    };

    return (
        <div>
            <Bar data={data} />
        </div>
    );
}

export default ChartTest;
