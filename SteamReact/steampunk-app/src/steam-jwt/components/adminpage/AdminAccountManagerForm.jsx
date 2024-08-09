import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import '../../../HTML/SteamNewsCss.css';
import SideBar from '../sidebar/SideBar';
import axios from 'axios';
import { SERVER_HOST } from '../../apis/api';
import { LoginContext } from '../../contexts/LoginContextProvider';
import * as Swal from '../../apis/alert'
import Pagination from 'react-js-pagination';

const ITEM_PER_PAGE = 5;

const AdminAccountManagerForm = () => {
    const [page, setPage] = useState(1);

    const [currentItems, setCurrentItems] = useState([]);
    const navigate = useNavigate();
    const {userInfo} = useContext(LoginContext);
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState('IdASC');
    useEffect(()=>{
        axios({
            url: `${SERVER_HOST}/accounts`,
            method:"get"
        }).then(response=>{
            const {data, status, statusText} = response;
            setAccounts([]);
            if(status === 200)
            {
                setAccounts(data);
                setPage(1);
            }
            else
                console.log(status, statusText);

        }).catch(err=>{
            console.log(err);
        });
    }, []);

    useEffect(()=>{
        const IndexOfLast = page * ITEM_PER_PAGE;
        const IndexOfFirst = IndexOfLast - ITEM_PER_PAGE;
        setCurrentItems(accounts.slice(IndexOfFirst, IndexOfLast));
    },[page, accounts, ITEM_PER_PAGE]);

    useEffect(()=>{
        console.log("실행 완료 ", accounts);
        sort(selected);
    }, [accounts]);

    const handlePageChange = (page) => {
        setPage(page);
      };

    const onGetOut = async (id, name) => {
        try
        {
            const response = await axios.get(`${SERVER_HOST}/findId/${name}`);
            const {data, status} = response;
            if(data === null || data === undefined || status !== 200)
            {
                Swal.alert("존재하지 않는 회원입니다!","", "error", ()=>navigate((userInfo === undefined || userInfo.id === undefined ) ? `/steam/login` : "/steam/accounts")); 
                return;
            }
        }catch(err)
        {
            console.log(err);
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
                            sort(selected);
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
    const handleChangeSelect = (e) => {
        setSelected(e.target.value);
        sort(e.target.value);
      };

      const sort = (e = "IdASC") =>{
        if(accounts !== undefined && Array.isArray(accounts) && accounts.length !== 0)
            {
                switch(e)
                {
                    case "IdASC":
                        accounts.sort((a,b) => a.id - b.id);
                        currentItems.sort((a,b) => a.id - b.id);
                        break;
                    case "IdDESC":
                        accounts.sort((a,b) => b.id - a.id);
                        currentItems.sort((a,b) => b.id - a.id);
                        break;
                    case "nameASC":
                        accounts.sort((a,b) => String(a.username).localeCompare(b.username));
                        currentItems.sort((a,b) => String(a.username).localeCompare(b.username));
                        break;
                    case "nameDESC":
                        accounts.sort((a,b) => String(b.username).localeCompare(a.username));
                        currentItems.sort((a,b) => String(b.username).localeCompare(a.username));
                        break;
                    case "regDateASC":
                        accounts.sort((a,b) => new Date(a.regDate) - new Date(b.regDate));
                        currentItems.sort((a,b) => new Date(a.regDate) - new Date(b.regDate));
                        break;
                    case "regDateDESC":
                        accounts.sort((a,b) => new Date(b.regDate) - new Date(a.regDate));
                        currentItems.sort((a,b) => new Date(b.regDate) - new Date(a.regDate));
                        break;
                    default:
                        accounts.sort((a,b) => a.id - b.id);
                        currentItems.sort((a,b) => a.id - b.id);
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
                <h1>Manage Account</h1>
                <p>회원 관리를 할 수 있는 페이지입니다</p>
            </div>
    
            <div className='bg'>
                <Form.Select onChange={handleChangeSelect} style={{width:"300px", maxWidth:"300px", marginLeft:"2.5em"}}>
                    <option value={"IdASC"} key={`IdASC`}> ID 오름차순 </option>
                    <option value={"IdDESC"} key={`IdDESC`}> ID 내림차순 </option>
                    <option value={"nameASC"} key={`nameASC`}> 이름 오름차순 </option>
                    <option value={"nameDESC"} key={`nameDESC`}> 이름 내림차순 </option>
                    <option value={"regDateASC"} key={`regDateASC`}> 마지막으로 가입한 오름차순 </option>
                    <option value={"regDateDESC"} key={`regDateDESC`}> 마지막으로 가입한 내림차순 </option>
                </Form.Select>
                <br/>
                <hr/>
                <br/>
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
                            currentItems.map(x =><tr style={{textAlign: "center", justifyItems:"center", verticalAlign: "middle"}} key={x.id}>
                                <td>{x.id}</td>
                                <td>{x.username}</td>
                                <td>{x.regDate}</td>
                                <td><Button variant='danger' style={{marginTop: "15px"}} onClick={()=>onGetOut(x.id, x.username)} disabled={x.id === userInfo.id ? true : false}>NAGA</Button></td>
                            </tr>)
                        }
                    </tbody>
                </Table>
                <Pagination
                            activePage={page}
                            itemsCountPerPage={ITEM_PER_PAGE}
                            totalItemsCount={accounts.length}
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
                <Button className='btn-form' onClick={()=>{navigate((userInfo === undefined || userInfo.id === undefined ) ? `/steam/login` :-1)}}>이전</Button>
            </div>
            </main>
        </>
    );
};

export default AdminAccountManagerForm;