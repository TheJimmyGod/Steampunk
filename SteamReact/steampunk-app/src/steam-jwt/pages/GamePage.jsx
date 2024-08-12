import React, { useContext, useEffect, useRef } from 'react';
import { PhaserGame } from '../components/game/PhaserGame'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';

const GamePage = () => {
    const navigate = useNavigate();
    const {userInfo, loginCheck} = useContext(LoginContext);
    useEffect(()=>{
       if(userInfo === null)
       {
           navigate("/steam/login");
           return;
       }
    },[loginCheck]);
 // The sprite can only be moved in the MainMenu Scene
    
 //  References to the PhaserGame component (game and scene are exposed)
 const phaserRef = useRef();
 window.gameGlobalState = {
    userInfo
};
 // Event emitted from the PhaserGame component
 const currentScene = (scene) => {

 }

 return (
     <div id="app" style={{marginLeft: "10%", marginTop: "5%"}}>
         <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
     </div>
 );
};

export default GamePage;