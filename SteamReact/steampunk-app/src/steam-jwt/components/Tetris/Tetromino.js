// src/Tetromino.js
import React from 'react';
import '/DCON326/Steampunk/SteamReact/steampunk-app/src/HTML/Tetromino.css';

const Tetromino = ({ shape, position }) => {
  return (
    <div className='tetromino' style={{ top: position.y * 30, left: position.x * 30 }}>
      {shape.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className={`cell ${cell ? 'filled' : ''}`}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Tetromino;
