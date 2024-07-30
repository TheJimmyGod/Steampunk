import React from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginContextProvider from './contexts/LoginContextProvider';

const SteamJwt = () => {
    return (
        <BrowserRouter>
            <LoginContextProvider>
                 <Routes>
                   <Route path="/steam" element={<Home/>}/>
                    <Route path="/steam/login" element={<Login/>}/>
                    <Route path="/steam/register" element={<Register/>}/>
                </Routes>
            </LoginContextProvider>

        </BrowserRouter>
    );
};


export default SteamJwt;