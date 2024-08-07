import React from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginContextProvider from './contexts/LoginContextProvider';

import FindPW from './pages/FindPW';
import FindID from './pages/FindID';
import ResetPW from './pages/ResetPW';
import TestMoon from './pages/TestMoon';
import NewsList from './pages/NewsList';
import ChartTest from './pages/ChartTest';
import MyPage from './pages/MyPage';
import EditPersonalForm from './pages/EditPersonalInfo'
import AddressContextProvider from './contexts/AddressContextProvider';
import AdminPage from './pages/AdminPage';
import AdminAccountManager from './pages/AdminAccountManager';
import AdminFeaturedGames from './pages/AdminFeaturedGames';
import NewsDetail from './pages/NewsDetail';
import BookmarkManager from './pages/BookmarkManager';

const SteamJwt = () => {
    return (
        <BrowserRouter>
            <LoginContextProvider>
                <AddressContextProvider>
                <Routes>
                   <Route path="/steam" element={<Home/>}/>
                    <Route path="/steam/login" element={<Login/>}/>
                    <Route path="/steam/register" element={<Register/>}/>
                    <Route path='/steam/findId' element={<FindID/>}/>
                    <Route path='/steam/findPw' element={<FindPW/>}/>
                    <Route path='/steam/resetPw' element={<ResetPW/>}/>
                    <Route path="/TestMoon" element={<TestMoon/>}/>
                    <Route path="/steam/newsList" element={<NewsList />}/>
                    <Route path="/steam/chart" element={<ChartTest />}/>
                    <Route path='/steam/mypage' element={<MyPage/>}/>
                    <Route path='/steam/adminpage' element={<AdminPage/>}/>
                    <Route path='/steam/accounts' element={<AdminAccountManager/>}/>
                    <Route path='/steam/features' element={<AdminFeaturedGames/>}/>
                    <Route path='/steam/edit/:id' element={<EditPersonalForm/>}/>
                    <Route path='/steam/bookmarkmanager' element={<BookmarkManager/>}/>
                    <Route path='/steam/newsDetail/:id' element={<NewsDetail/>}/>
                </Routes>
                </AddressContextProvider>
            </LoginContextProvider>
        </BrowserRouter>
    );
};


export default SteamJwt;