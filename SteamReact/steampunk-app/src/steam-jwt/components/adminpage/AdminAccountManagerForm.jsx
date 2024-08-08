import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import '../../../HTML/SteamNewsCss.css';
import SideBar from '../sidebar/SideBar';
import axios from 'axios';
import { SERVER_HOST } from '../../apis/api';
import { LoginContext } from '../../contexts/LoginContextProvider';
import * as Swal from '../../apis/alert'
const AdminAccountManagerForm = () => {
    const navigate = useNavigate();
    const {userInfo} = useContext(LoginContext);
    const [accounts, setAccounts] = useState([]);
    useEffect(()=>{
        axios({
            url: `${SERVER_HOST}/accounts`,
            method:"get"
        }).then(response=>{
            const {data, status, statusText} = response;
            setAccounts([]);
            if(status === 200)
                setAccounts(data);
            else
                console.log(status, statusText);

        }).catch(err=>{
            console.log(err);
        });
        console.log("실행 완료 ", accounts);
    }, []);

    const onGetOut = async (id, name) => {
        const response = await axios.get(`${SERVER_HOST}/findId/${name}`);
        const {data, status} = response;
        if(data === null || data === undefined || status !== 200)
        {
            Swal.alert("존재하지 않는 회원입니다!","", "error", ()=>navigate((userInfo === undefined || userInfo.id === undefined ) ? `/steam/login` : "/steam/accounts")); 
            return;
        }

        Swal.confirm(`${name}를 추방하겠습니까?`, "", "question",
            (result)=>{ 
                if(result.isConfirmed){
                    axios({
                        url: `${SERVER_HOST}/remove/${id}`,
                        method: "delete"
                    }).then(response=> {
                        const {data, status} = response;
                        if(status === 200)
                        {
                            Swal.alert("삭제 성공했습니다!", `${data}`, "success"); 
                            setAccounts(accounts.filter(a => a.id !== id));
                        }
                        else
                            Swal.alert("삭제 실패했습니다!","", "error"); 
                    }).catch(err=>{
                        Swal.alert("삭제 실패했습니다!",`${err}`, "error"); 
                    });
                }
            }
        );
    };

    return (
        <>
        <SideBar/>
            <main className='mypage'>
            <header className="main-header"></header>
            <div className="banner">
                <h1>Manage Account</h1>
                <p>회원 관리를 할 수 있는 페이지입니다</p>
            </div>
    
            <div className='bg'>
                <Table responsive striped="columns" variant="dark">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>회원이름</th>
                            <th>가입일자</th>
                            <th>추방</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accounts.map(x =><tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.id}>
                                <td>{x.id}</td>
                                <td>{x.username}</td>
                                <td>{x.regDate}</td>
                                <td><Button variant='danger' style={{marginTop: "15px"}} onClick={()=>onGetOut(x.id, x.username)} disabled={x.id === userInfo.id ? true : false}>NAGA</Button></td>
                            </tr>)
                        }
                    </tbody>
                </Table>
            </div>
            <div style={{marginTop: "20px"}}>
                <Button className='btn-form' onClick={()=>{navigate((userInfo === undefined || userInfo.id === undefined ) ? `/steam/login` :-1)}}>이전</Button>
            </div>
            </main>
        </>
    );
};

export default AdminAccountManagerForm;