import axios from 'axios';
import React, { useEffect, useState } from 'react';

const YoutubeVideos = () => {

    const [youtube, setYoutube] = useState({ items: [] });
    const [message, setMessage] = useState('');

    // const key = "AIzaSyCOaXfLbU-uxGuK4UXWVGO80QuhzOXQ7Ds";
    const key = "YOUR_KEY";

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
            {message === "" ? <></> : <p>{message}</p>}
        </div>
    );
};

export default YoutubeVideos;