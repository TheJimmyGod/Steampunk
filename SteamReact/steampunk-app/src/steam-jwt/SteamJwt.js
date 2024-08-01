import React from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginContextProvider from './contexts/LoginContextProvider';
import FindPW from './pages/FindPW';
import FindID from './pages/FindID';
import ResetPW from './pages/ResetPW';

const SteamJwt = () => {
    return (
        <BrowserRouter>
            <LoginContextProvider>
                 <Routes>
                   <Route path="/steam" element={<Home/>}/>
                    <Route path="/steam/login" element={<Login/>}/>
                    <Route path="/steam/register" element={<Register/>}/>
                    <Route path='/steam/findId' element={<FindID/>}/>
                    <Route path='/steam/findPw' element={<FindPW/>}/>
                    <Route path='/steam/resetPw' element={<ResetPW/>}/>
                </Routes>
            </LoginContextProvider>

        </BrowserRouter>
    );
};


export default SteamJwt;