import React, { useContext, useEffect, useState } from 'react';
import SideBar from '../sidebar/SideBar';
import '../../../HTML/SteamNewsCss.css';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { Button, Form } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { NORMAL_SERVER_HOST } from '../../apis/api';
import * as Swal from '../../apis/alert'
import Pagination from 'react-js-pagination';

const MAXIMUM_COUNT = 10;
const ITEM_PER_PAGE = 5;
const AdminFeatruedGamesForm = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState('appIdASC');
    const [games, setGames] = useState([]); // 기존에 있던 것들
    const [newGames, setNewGames] = useState([]); // 새로운 게임 넣었다면 쓰는 용도
    const [sGames, setSGames] = useState([]); // 검색 용도
    const {userInfo, loginCheck} = useContext(LoginContext);
    const [page, setPage] = useState(1);

    const [currentItems, setCurrentItems] = useState([]);

    useEffect(()=>{loadFeatureGames();}, [loginCheck]);

    useEffect(()=>{
        window.addEventListener("keydown",enter);
        return ()=>{
            window.removeEventListener("keydown", enter);
        }
    }, []);

    const enter = (e) =>  {
        if(e.key === "Enter"){onSearch();}
    }

    async function loadFeatureGames(){
        setGames([]);
        setNewGames([]);
        try
        {
            const response = await axios.get(`${NORMAL_SERVER_HOST}/getFeatured`);
            const {data, status} = response;
            if(status === 200)
            {
                data !== undefined && setGames(data);
                sortGames(selected);
            }
        }
        catch(err)
        {
            console.log(err);
        }

    }

    const handlePageChange = (page) => {
        setPage(page);
      };

    const onRemove = (app) =>{
        if((userInfo === undefined || userInfo.id === undefined ))
            {
                navigate("/steam/login");
                return;
            }
        Swal.confirm(`${app.game.gameName}을 제거하시겠습니까?`, "", "question",
            (result)=>{ 
                if(result.isConfirmed){
                    setGames(games.filter(x => x.game.appId !== app.game.appId));
                    axios({
                        url: `${NORMAL_SERVER_HOST}/removeFeatured/${app.game.appId}`,
                        method:"delete"
                    }).then(response=>{
                        const {data, status, statusText} = response;
                        if(status === 200)
                        {
                            Swal.alert("삭제 성공했습니다!", `${data}`, "success"); 
                        }
                        else
                            Swal.alert("삭제 실패했습니다!", `${status}: ${statusText}`, "error"); 
                    }).catch(err=>{
                        console.log(err);
                        Swal.alert("삭제 실패했습니다!", "", "error"); 
                    });
                }
            }
        );

    }

    const onSearch = async () => {
        if((userInfo === undefined || userInfo.id === undefined ))
            {
                navigate("/steam/login");
                return;
            }

        setSGames([]);
        let input = document.getElementById("search").value.trim();
        if(input === "")
        {
            Swal.alert("검색 창이 비어있습니다!", ``, "error"); 
            return;
        }
        try
        {
            const response = await axios.get(`${NORMAL_SERVER_HOST}/game/find/${input}`);
            const {data, status} = response;
            if(status === 200)
            {
                data !== undefined && setSGames(data);
                setPage(1);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    useEffect(()=>{
        const IndexOfLast = page * ITEM_PER_PAGE;
        const IndexOfFirst = IndexOfLast - ITEM_PER_PAGE;
        setCurrentItems(sGames.slice(IndexOfFirst, IndexOfLast));
    },[page, sGames, ITEM_PER_PAGE]);

    const onSave = () =>{
        if((userInfo === undefined || userInfo.id === undefined ))
            {
                navigate("/steam/login");
                return;
            }
        setSGames([]);
        setNewGames([]);
        axios({
            url: `${NORMAL_SERVER_HOST}/updateFeatures`,
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            data: JSON.stringify(newGames)
        }).then(response=>{
            const {data, status, statusText} = response;
            if(status === 201)
            {
                Swal.alert("저장 성공했습니다!", `${data}`, "success"); 
                loadFeatureGames();
            }
            else
                Swal.alert("저장 실패했습니다!", `${status}: ${statusText}`, "error"); 
        }).catch(err=>{
            console.log(err);
            Swal.alert("저장 실패했습니다!", "", "error"); 
        });
    }

    const onReset = () =>
    {
        if((userInfo === undefined || userInfo.id === undefined ))
            {
                navigate("/steam/login");
                return;
            }
        Swal.confirm(`모두 제거하시겠습니까?`, "", "question",
            async (result)=>{ 
                if(result.isConfirmed){
                    let err = false;
                    for(let c of games)
                        {
                            const response = await axios.delete(`${NORMAL_SERVER_HOST}/removeFeatured/${c.game.appId}`);
                            const {status} = response;
                            if(status !== 200)
                            {
                                err = true;
                                break;
                            }
                        }
                        if(!err)
                        {
                            Swal.alert("전체 삭제 성공했습니다!", ``, "success"); 
                            setGames([]);
                        }
                        else
                            Swal.alert("전체 삭제 실패했습니다!", ``, "error"); 
                }
            }
        );


    }

    const handleChangeSelect = (e) => {
        setSelected(e.target.value);
        sortGames(e.target.value);
      };


    const sortGames = (e = "appIdASC") =>{
        if(games !== undefined && Array.isArray(games) && games.length !== 0)
            {
                switch(e)
                {
                    case "IdASC":
                        games.sort((a,b) => a.id - b.id);
                        break;
                    case "IdDESC":
                        games.sort((a,b) => b.id - a.id);
                        break;
                    case "appIdASC":
                        games.sort((a,b) => a.game.appId - b.game.appId);
                        break;
                    case "appIdDESC":
                        games.sort((a,b) => b.game.appId - a.game.appId);
                        break;
                    case "gameNameASC":
                        games.sort((a,b) => String(a.game.gameName).localeCompare(b.game.gameName));
                        break;
                    case "gameNameDESC":
                        games.sort((a,b) => String(b.game.gameName).localeCompare(a.game.gameName));
                        break;
                    case "lastInsertASC":
                        games.sort((a,b) => new Date(a.regDate) - new Date(b.regDate));
                        break;
                    case "lastInsertDESC":
                        games.sort((a,b) => new Date(b.regDate) - new Date(a.regDate));
                        break;
                    default:
                        games.sort((a,b) => a.game.appId - b.game.appId);
                        break;    
                }
                setSelected(e);
            }
    }

    return (
        <>
          <SideBar/>
            <main className='mypage'>
            <header className="main-header"></header>
            <div className="banner">
                <h1>Manage Featured Games</h1>
                <p>추천 게임 관리하는 페이지입니다</p>
            </div>
            <div className='bg'>
                <div>
                <Form.Select onChange={handleChangeSelect} style={{width:"300px", maxWidth:"300px", marginLeft:"2.5em"}}>
                    <option value={"IdASC"} key={`IdASC`}> ID 오름차순 </option>
                    <option value={"IdDESC"} key={`IdDESC`}> ID 내림차순 </option>
                    <option value={"appIdASC"} key={`appIdASC`}> APPID 오름차순 </option>
                    <option value={"appIdDESC"} key={`appIdDESC`}> APPID 내림차순 </option>
                    <option value={"gameNameASC"} key={`gameNameASC`}> 게임이름 오름차순 </option>
                    <option value={"gameNameDESC"} key={`gameNameDESC`}> 게임이름 내림차순 </option>
                    <option value={"lastInsertASC"} key={`lastInsertASC`}> 마지막으로 추가한 오름차순 </option>
                    <option value={"lastInsertDESC"} key={`lastInsertDESC`}> 마지막으로 추가한 내림차순 </option>
                </Form.Select>
                <br/><hr/><br/>
                </div>
                <Table  responsive striped="columns" variant="dark">
                    <thead>
                        <tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}}>
                            <th>ID</th>
                            <th style={{width: "100px"}}>APP ID</th>
                            <th>게임이름</th>
                            <th>마지막으로 추가한 날짜</th>
                            <th style={{width: "100px"}}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            games.map(x =><tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.game.appId}>
                                <td>{x.id}</td>
                                <td>{x.game.appId}</td>
                                <td>{x.game.gameName}</td>
                                <td>{x.regDate ? x.regDate : "갱신중..."}</td>
                                <td><Button variant='danger' style={{marginTop: "15px"}} onClick={()=>onRemove(x)}>NAGA</Button></td>
                            </tr>)
                        }
                    </tbody>
                </Table>
                <div style={{float:"right"}}>
                <Popup trigger={<Button className='btn-form' style={{width: "120px", marginRight: "5px"}}>추가</Button>} modal nested closeOnDocumentClick={false}>
                {
                    close => (
                        <>
                        <main className='mypage popup-content'>
                            <header className="main-header"></header>
                                <div className="banner">
                                <h1>Add Featured Games</h1>
                                <p>추천 게임을 추가할 수 있습니다</p>
                               </div>
                            <div>
                                <div>
                                    <Table responsive striped="columns" variant='dark'>
                                        <thead>
                                            <tr>
                                                <th style={{width: "10%"}}>AppID</th>
                                                <th style={{width: "50%"}}>게임이름</th>
                                                <th>추가</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                currentItems.map(x =><tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.appId}>
                                                    <td>{x.appId}</td>
                                                    <td>{x.gameName}</td>
                                                    <td><Button variant='success' style={{marginTop: "15px"}} onClick={()=>{
                                                        if(newGames !== undefined && newGames.length > 0)
                                                        {
                                                            newGames.forEach(v => {
                                                                if(v.appId === x.appId)
                                                                {
                                                                    Swal.alert("이미 존재하는 게임입니다!", ``, "error"); 
                                                                    return;
                                                                }
                                                            });
                                                            if(newGames.length + games.length >= MAXIMUM_COUNT)
                                                            {
                                                                Swal.alert("더이상 추가할 수가 없습니다!", ``, "error"); 
                                                                return;
                                                            }
                                                        }
                                                        else
                                                        {
                                                            if(games.length >= MAXIMUM_COUNT)
                                                            {
                                                                Swal.alert("더이상 추가할 수가 없습니다!", ``, "error"); 
                                                                return;
                                                            }
                                                        }
                                                        setNewGames(prev =>[...prev,{"appId": x.appId, "gameName": x.gameName, "Id": -1}]);
                                                    }
                                                }   
                                                        disabled={(Array.isArray(newGames) && newGames.filter(y=>y.appId === x.appId).length > 0) || games.filter(z => z.game.appId === x.appId).length > 0}
                                                        >추가</Button></td>
                                                    </tr>)
                                            }
                                        </tbody>
                                    </Table>
                                        <Pagination
                                            activePage={page}
                                            itemsCountPerPage={ITEM_PER_PAGE}
                                            totalItemsCount={sGames.length}
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
                                    <p>추가한 게임들</p>
                                    {
                                        newGames.length > 0 ?
                                        <Table responsive striped="columns" variant='dark'>
                                        <thead>
                                            <tr>
                                                <th>AppID</th>
                                                <th>게임이름</th>
                                                <th>삭제</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                newGames.map(x =>{
                                                    if(x.appId === "" || x.gameName === "")
                                                        return <></>
                                                    return(<tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.appId}>
                                                    <td>{x.appId}</td>
                                                    <td>{x.gameName}</td>
                                                    <td><Button variant='danger' style={{marginTop: "15px"}} onClick={()=>{setNewGames(newGames.filter(a => a.appId !== x.appId));}}>제거</Button></td>
                                                    </tr>)})
                                            }
                                        </tbody>
                                    </Table>
                                        :
                                        <></>
                                    }
                                </div>
                            <Form.Label htmlFor="search">게임 검색</Form.Label>
                            {
                              <Form.Control
                              id="search"
                              type= {"text"}
                              placeholder= {"게임 이름을 입력해주세요"}
                              name={"gameName"}
                              autoComplete={"gameName"}
                              style={{width: "600px", maxWidth:"600px"}}
                               />
                            }
                               <Button className='btn-form' style={{marginRight: "5px", width:"100px"}} onClick={()=>{onSearch();}}>검색</Button>
                            </div>
                            <div>
                                <Button className='btn-form' style={{marginRight: "5px"}} onClick={()=>{onSave();  close();}}>저장</Button>
                                <Button className='btn-form' onClick={() => { setNewGames([]); setSGames([]); close();}}>닫기</Button>
                            </div>
                        </main>
                        </>
    
                    )
                }
            </Popup>
                <Button className='btn-form' style={{width:"120px"}} onClick={()=>{onReset()}}>초기화</Button>
                </div>
            </div>
            <br/><br/><hr/><br/>
            <div style={{marginTop: "20px"}}>
                <Button className='btn-form' onClick={()=>{navigate(-1)}}>이전</Button>
            </div>
            </main>  
        </>
    );
};

export default AdminFeatruedGamesForm;