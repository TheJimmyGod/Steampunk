import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../../../HTML/SteamNewsCss.css';
import SideBar from '../sidebar/SideBar';
import { LoginContext } from '../../contexts/LoginContextProvider';
import axios from 'axios';
import { SERVER_HOST } from '../../apis/api';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as Swal from '../../apis/alert'
import Table from 'react-bootstrap/Table';
import Pagination from 'react-js-pagination';
const ITEM_PER_PAGE = 5;
const BookmarkManagerForm = () => {
    const {userInfo,loginCheck } = useContext(LoginContext);
    const [bookmarks, setBookmarks] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [selected, setSelected] = useState('IdASC');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const [currentItems, setCurrentItems] = useState([]);
    const NEW_REGEX = /^[a-zA-Z가-힣0-9!@#$%^&*()_+-=~`\s]*$/;

    const navigate = useNavigate();
    useEffect(()=>{
        if(userInfo === undefined || userInfo.id === undefined)
            return;
        setSearch('');
        loadBookmarks();
        setCurrentDate(new Date().toISOString().split('T')[0]);
    },[loginCheck]);

    useEffect(()=>{
        let start = document.getElementById('start');
        let end = document.getElementById('end');

        start.value = currentDate;
        end.value = currentDate;
    }, [currentDate]);

    useEffect(()=>{
        window.addEventListener("keydown",enter);
        return ()=>{
            window.removeEventListener("keydown", enter);
        }
    }, []);
    
    const handlePageChange = (page) => {
        setPage(page);
      };

    const enter = (e) =>  {
        if(e.key === "Enter"){handleTimeCheck();}
    }

    const loadBookmarks = async (timeSelected = false) => {
        setBookmarks([]);
        if(userInfo === undefined || userInfo.id === undefined)
            return;
        if(timeSelected)
        {
            let start = new Date(document.getElementById('start').value);
            let end = new Date(document.getElementById('end').value);

            if(start === undefined || end === undefined || start === null || end === null || isNaN(start.getTime()) || isNaN(end.getTime()))
                load();
            else{
                start = start.toLocaleDateString('en-CA');
                end = end.toLocaleDateString('en-CA');
                try{
                    const response = await axios.get(`${SERVER_HOST}/bookmark/list/${userInfo.id}/${start}/${end}/${(search === "") ? "null" : search}`);
                    destructure(response);
                    console.log(`ID:${userInfo.id}, Bookmark loaded`);
                }catch(err)
                {
                    console.log(err);
                }
            }

        }
        else
            load();
     
    }

    const load = async () =>{
        try
        {
            const response = await axios.get(`${SERVER_HOST}/bookmark/list/${userInfo.id}`);
            destructure(response);
            console.log(`ID:${userInfo.id}, Bookmark loaded`);
        }
        catch(err)
        {
            console.log(err);
        }

    }

    const destructure = (response) =>
    {
        const {data, status} = response;
        if(status === 200)
        {
            data !== undefined && setBookmarks(data);
            setPage(1);
        }
    }

    const onRemoval = (bookmark)=>{
        Swal.confirm(`${bookmark.news.gameName} 북마크를 해제하시겠습니까?`, "", "question",
           async (result)=>{ 
                if(result.isConfirmed){
                    if(bookmark.id !== undefined)
                        {
                            try
                            {
                                const response = await axios.delete(`${SERVER_HOST}/bookmark/remove/${bookmark.id}`);
                                const {status} = response;
                                if(status === 200)
                                {
                                    console.log(`${bookmark.id}가 북마크 해제했습니다.`);
                                    loadBookmarks();
                                }
                            }
                            catch(err)
                            {   
                                console.log(err);
                            }
                        }
                }
            }
        );
    }
    const onSearch = async (text) =>{
        if(userInfo === undefined || userInfo.id === undefined)
            return;
        if(text === "")
        {
            loadBookmarks();
            sortGames(selected);
            return;
        }
        try
        {
            const response = await axios.get(`${SERVER_HOST}/bookmark/finds/${userInfo.id}/${text}`);
            const {data, status} = response;
            if(status === 200)
            {
                if(data !== undefined && Array.isArray(data))
                {
                    setBookmarks(data);
                    sortGames(selected);
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    const onReset = () =>{
        Swal.confirm(`모든 북마크를 해제하시겠습니까?`, "", "question",
            async (result)=>{ 
                 if(result.isConfirmed){
                    for(let item of bookmarks)
                    {
                        const response = await axios.delete(`${SERVER_HOST}/bookmark/remove/${item.id}`);
                             const {status} = response;
                             if(status === 200)
                             {
                                 console.log(`${item.id}가 북마크 해제했습니다.`);
                             }
                    }
                    loadBookmarks();
                    setSearch('');
                 }
             }
         );
    }

    const handleSearch = useCallback((e) =>{
        setSearch(e.target.value);
    }, [search])

    const handleTimeCheck = (e) =>{
        loadBookmarks(true);
    }

    useEffect(()=>{
        if(NEW_REGEX.test(search.trim()))
            onSearch(search.trim());
        else
            onSearch();
    },[search]);

    useEffect(()=>{
        const IndexOfLast = page * ITEM_PER_PAGE;
        const IndexOfFirst = IndexOfLast - ITEM_PER_PAGE;
        setCurrentItems(bookmarks.slice(IndexOfFirst, IndexOfLast));
    },[page, bookmarks, ITEM_PER_PAGE]);

    const handleChangeSelect = (e) => {
        setSelected(e.target.value);
        sortGames(e.target.value);
      };


    const sortGames = (e = "IdASC") =>{
        if(bookmarks !== undefined && Array.isArray(bookmarks) && bookmarks.length !== 0)
            {
                switch(e)
                {
                    case "IdASC":
                        bookmarks.sort((a,b) => a.id - b.id);
                        currentItems.sort((a,b) => a.id - b.id);
                        break;
                    case "IdDESC":
                        bookmarks.sort((a,b) => b.id - a.id);
                        currentItems.sort((a,b) => b.id - a.id);
                        break;
                    case "appIdASC":
                        bookmarks.sort((a,b) => a.news.appId - b.news.appId);
                        currentItems.sort((a,b) => a.news.appId - b.news.appId);
                        break;
                    case "appIdDESC":
                        bookmarks.sort((a,b) => b.news.appId - a.news.appId);
                        currentItems.sort((a,b) => b.news.appId - a.news.appId);
                        break;
                    case "gameNameASC":
                        bookmarks.sort((a,b) => String(a.news.gameName).localeCompare(b.news.gameName));
                        currentItems.sort((a,b) => String(a.news.gameName).localeCompare(b.news.gameName));
                        break;
                    case "gameNameDESC":
                        bookmarks.sort((a,b) => String(b.news.gameName).localeCompare(a.news.gameName));
                        currentItems.sort((a,b) => String(b.news.gameName).localeCompare(a.news.gameName));
                        break;
                    case "lastInsertASC":
                        bookmarks.sort((a,b) => new Date(a.regDate) - new Date(b.regDate));
                        currentItems.sort((a,b) => new Date(a.regDate) - new Date(b.regDate));
                        break;
                    case "lastInsertDESC":
                        bookmarks.sort((a,b) => new Date(b.regDate) - new Date(a.regDate));
                        currentItems.sort((a,b) => new Date(b.regDate) - new Date(a.regDate));
                        break;
                    case "titleASC":
                        bookmarks.sort((a,b) => String(a.news.title).localeCompare(b.news.title));
                        currentItems.sort((a,b) => String(a.news.title).localeCompare(b.news.title));
                        break;
                    case "titleDESC":
                        bookmarks.sort((a,b) => String(b.news.title).localeCompare(a.news.title));
                        currentItems.sort((a,b) => String(b.news.title).localeCompare(a.news.title));
                        break;
                    default:
                        bookmarks.sort((a,b) => a.id - b.id);
                        currentItems.sort((a,b) => a.id - b.id);
                        break;    
                }
                setSelected(e);
            }
    }

    const UnixConvertor= (t)=> new Date(t * 1000).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

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
                <div style={{marginLeft: "2%"}}>
                    {
                        <Form.Control
                            id="search"
                            type={"text"}
                            placeholder={"특정 북마크를 검색할 수 있습니다."}
                            name={"search"}
                            onChange={handleSearch}
                            style={{ width: "600px", maxWidth: "600px" }}
                        />
                    }
                </div>
                <br/>
                    <span style={{ marginLeft: "2%", display:"flex", height:"50px" }}>
                    <Form.Select onChange={handleChangeSelect} style={{width:"300px", maxWidth:"300px"}}>
                    <option value={"IdASC"} key={`IdASC`}> ID 오름차순 </option>
                    <option value={"IdDESC"} key={`IdDESC`}> ID 내림차순 </option>
                    <option value={"appIdASC"} key={`appIdASC`}> APPID 오름차순 </option>
                    <option value={"appIdDESC"} key={`appIdDESC`}> APPID 내림차순 </option>
                    <option value={"gameNameASC"} key={`gameNameASC`}> 게임이름 오름차순 </option>
                    <option value={"gameNameDESC"} key={`gameNameDESC`}> 게임이름 내림차순 </option>
                    <option value={"lastInsertASC"} key={`lastInsertASC`}> 마지막으로 추가한 오름차순 </option>
                    <option value={"lastInsertDESC"} key={`lastInsertDESC`}> 마지막으로 추가한 내림차순 </option>
                    <option value={"titleASC"} key={`titleASC`}> 기사제목 오름차순 </option>
                    <option value={"titleDESC"} key={`titleDESC`}> 기사제목 내림차순 </option>
                     </Form.Select>
                     <Form.Label htmlFor="start" style={{marginLeft: "5%", marginRight: "2%"}}>시작</Form.Label>
                            <Form.Control
                                type="date"
                                id="start"
                                name="start"
                                max={currentDate}
                                min="1980-08-29"
                                style={{width:"200px"}}
                            />
                            <Form.Label htmlFor="end" style={{marginLeft: "2%", marginRight: "2%"}}>종료</Form.Label>
                            <Form.Control
                                type="date"
                                id="end"
                                name="end"
                                max={currentDate}
                                min="1980-08-29"
                                style={{width:"200px"}}
                            />
                            <Button className='btn-form' style={{width:"100px", height:"50px", marginLeft:"5%"}} onClick={() => { handleTimeCheck() }}>조회</Button>
                    </span>
                    <div>
                    <br/>
                    </div>
                <hr/><br/>
               <Table  responsive striped="columns" variant="dark">
                    <thead>
                        <tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}}>
                            <th style={{width:"100px"}}>ID</th>
                            <th style={{width:"100px"}}>APP ID</th>
                            <th>게임이름</th>
                            <th>뉴스 기사 제목</th>
                            <th>발행일자</th>
                            <th style={{width:"200px"}}>마지막으로 추가한 날짜</th>
                            <th style={{width:"150px"}}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentItems === undefined || Array.isArray(currentItems) === false  ?
                            <></>
                            :
                            currentItems.map(x =><tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.id}>
                                <td>{x.id}</td>
                                <td>{x.news.appId}</td>
                                <td>{x.news.gameName}</td>
                                <td><Link to={`/steam/newsDetail/${x.news.appId}`}>{x.news.title}</Link></td>
                                <td>{UnixConvertor(x.news.date)}</td>
                                <td>{x.regDate ? x.regDate : "갱신중..."}</td>
                                <td><Button variant='danger' style={{marginTop: "15px"}} onClick={()=>{onRemoval(x)}}>NAGA</Button></td>
                            </tr>)
                        }
                    </tbody>
                </Table>
                    <Pagination
                        activePage={page}
                        itemsCountPerPage={ITEM_PER_PAGE}
                        totalItemsCount={bookmarks.length}
                        pageRangeDisplayed={5}
                        prevPageText={"◁"}
                        nextPageText={"▷"}
                        firstPageText={"◀◀"}
                        lastPageText={"▶▶"}
                        onChange={handlePageChange}
                        className="pagination"
                        itemClass="page-item"
                        linkClass="page-link"
                    />
            </div>
            <div style={{marginTop: "20px"}}>
                <Button className='btn-form' style={{marginRight:"2%"}} onClick={()=>{navigate(-1)}}>이전</Button>
                <Button className='btn-form' onClick={()=>{onReset()}}>초기화</Button>
            </div>
          </main>  
        </>
    );
};

export default BookmarkManagerForm;