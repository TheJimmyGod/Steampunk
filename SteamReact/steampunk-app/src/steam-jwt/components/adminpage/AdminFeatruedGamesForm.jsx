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
const MAXIMUM_COUNT = 5;
const AdminFeatruedGamesForm = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [newGames, setNewGames] = useState([]);
    const [sGames, setSGames] = useState([]);
    const {loginCheck} = useContext(LoginContext);
    
    useEffect(()=>{loadFeatureGames();}, [loginCheck]);

    async function loadFeatureGames(){
        setGames([]);
        setNewGames([]);
        const response = await axios.get(`${NORMAL_SERVER_HOST}/getFeatured`);
        const {data, status} = response;
        if(status === 200)
            data !== undefined && setGames(data);
    }

    const onRemove = (id) =>{
        setGames(games.filter(x => x.appId !== id));
    }

    const onSearch = async () => {
        setSGames([]);
        let input = document.getElementById("search");
        console.log(`${NORMAL_SERVER_HOST}/game/find/${input.value}`);
        const response = await axios.get(`${NORMAL_SERVER_HOST}/game/find/${input.value}`);
        const {data, status} = response;
        if(status === 200)
        {
            data !== undefined && setSGames(data);
        }

    }

    const onSave = () =>{
        newGames.forEach(x =>{
            games.push(x);
        });
        axios({
            url: `${NORMAL_SERVER_HOST}/updateFeatured`,
            method:"put",
            headers:{
                "Content-Type":"application/json"
            },
            data: JSON.stringify(games)
        }).then(response=>{
            const {data, status} = response;
            if(status === 200)
            {
                alert(data);
            }
        }).catch(err=>{
            console.log(err);
        });
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
                <Table  responsive striped="columns" variant="dark">
                    <thead>
                        <tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}}>
                            <th style={{width: "100px"}}>APP ID</th>
                            <th>게임이름</th>
                            <th style={{width: "100px"}}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            games.map(x =><tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.appId}>
                                <td>{x.appId}</td>
                                <td>{x.gameName}</td>
                                <td><Button variant='danger' style={{marginTop: "15px"}} onClick={()=>onRemove(x.id)}>NAGA</Button></td>
                            </tr>)
                        }
                    </tbody>
                </Table>
                <div style={{float:"right"}}>
                <Popup trigger={<Button className='btn-form' style={{marginRight: "5px"}}>추가</Button>} modal nested>
                {
                    close => (
                        <>
                        <main className='mypage' style={{width: "1500px", height: "800px", border: "white 10px solid", maxHeight: "80vh", overflowY: "auto"}}>
                            <header className="main-header"></header>
                                <div className="banner">
                                <h1>Add Featured Games</h1>
                               </div>
                            <div>
                                <div>
                                    <Table responsive striped="columns" variant='dark'>
                                        <thead>
                                            <tr>
                                                <th>AppID</th>
                                                <th>게임이름</th>
                                                <th>추가</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                sGames.map(x =><tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.appId}>
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
                                                        disabled={(Array.isArray(newGames) && newGames.filter(y=>y.appId === x.appId).length > 0) || games.filter(z => z.appId === x.appId).length > 0}
                                                        >추가</Button></td>
                                                    </tr>)
                                            }
                                        </tbody>
                                    </Table>
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
                               />
                            }
                               <Button className='btn-form' style={{marginRight: "5px", width:"100px"}} onClick={()=>{onSearch();}}>검색</Button>
                            </div>
                            <div>
                                <Button className='btn-form' style={{marginRight: "5px"}} onClick={()=>{onSave();}}>저장</Button>
                                <Button className='btn-form' onClick={() => { setSGames([]); close();}}>닫기</Button>
                            </div>
                        </main>
                        </>
    
                    )
                }
            </Popup>
             
                    <Button className='btn-form' onClick={null}>저장</Button>
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