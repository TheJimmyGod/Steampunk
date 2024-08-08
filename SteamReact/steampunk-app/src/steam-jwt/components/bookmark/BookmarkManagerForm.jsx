import React, { useContext, useEffect, useState } from 'react';
import '../../../HTML/SteamNewsCss.css';
import SideBar from '../sidebar/SideBar';
import { LoginContext } from '../../contexts/LoginContextProvider';
import axios from 'axios';
import { SERVER_HOST } from '../../apis/api';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as Swal from '../../apis/alert'
import Popup from 'reactjs-popup';
import Table from 'react-bootstrap/Table';
const BookmarkManagerForm = () => {

    const {userInfo,loginCheck } = useContext(LoginContext);
    const [bookmarks, setBookmarks] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        loadBookmarks();
    },[loginCheck]);

    const loadBookmarks = async () => {
        setBookmarks([]);
        if(userInfo === undefined || userInfo.id === undefined)
            return;
        const response = await axios.get(`${SERVER_HOST}/bookmark/list/${userInfo.id}`);
        const {data, status, statusText} = response;
        if(status === 200)
            data !== undefined && setBookmarks(data);
        console.log(`ID:${userInfo.id}, Bookmark loaded`);
    }

    const onRemoval = (bookmark)=>{
        Swal.confirm(`${bookmark.news.gameName} 북마크를 해제하시겠습니까?`, "", "question",
           async (result)=>{ 
                if(result.isConfirmed){
                    if(bookmark.id !== undefined)
                        {
                            const response = await axios.delete(`${SERVER_HOST}/bookmark/remove/${bookmark.id}`);
                            const {status} = response;
                            if(status === 200)
                            {
                                console.log(`${bookmark.id}가 북마크 해제했습니다.`);
                                loadBookmarks();
                            }
                        }
                }
            }
        );
    }
    const onSearch = () =>{}

    return (
        <>
          <SideBar/>
          <main className='mypage'>
          <header className="main-header"></header>
            <div className="banner">
                <h1>Bookmark Manager</h1>
                <p>뉴스 즐겨찾기를 관리할 수 있는 페이지입니다</p>
            </div>
            <div className='bg'>
               <Table  responsive striped="columns" variant="dark">
                    <thead>
                        <tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}}>
                            <th style={{width:"100px"}}>ID</th>
                            <th style={{width:"100px"}}>APP ID</th>
                            <th>게임이름</th>
                            <th>뉴스 기사 제목</th>
                            <th style={{width:"200px"}}>마지막으로 추가한 날짜</th>
                            <th style={{width:"150px"}}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookmarks === undefined ?
                            <></>
                            :
                            bookmarks.map(x =><tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.id}>
                                <td>{x.id}</td>
                                <td>{x.news.appId}</td>
                                <td>{x.news.gameName}</td>
                                <td><Link to={`/steam/newsDetail/${x.news.appId}`}>{x.news.title}</Link></td>
                                <td>{x.regDate ? x.regDate : "갱신중..."}</td>
                                <td><Button variant='danger' style={{marginTop: "15px"}} onClick={()=>{onRemoval(x)}}>NAGA</Button></td>
                            </tr>)
                        }
                    </tbody>
                </Table>
            </div>
            <div style={{marginTop: "20px"}}>
                <Button className='btn-form' onClick={()=>{navigate(-1)}}>이전</Button>
            </div>
          </main>  
        </>
    );
};

export default BookmarkManagerForm;