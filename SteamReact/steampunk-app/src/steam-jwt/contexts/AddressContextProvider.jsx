import axios from 'axios';
import React, { createContext, useEffect, useRef, useState } from 'react';
export const AddressContext = createContext();
const AddressContextProvider = ({children}) => {
    const [addrData, setAddrData] = useState([]);
    const [keyword, setKeyword] = useState("");
    const prev = useRef("");
    const interval = useRef(null);
    const COUNT_PER_PAGE = 1000;
    const new_regex = /^[가-힣0-9\s]*$/;
    const findPath = () => {
        if (new_regex.test(keyword)) {
          // 	devU01TX0FVVEgyMDI0MDczMDE1NTM1MDExNDk3NTU=
          let encodedKeyword = encodeURIComponent(keyword);
          let apiKey = "devU01TX0FVVEgyMDI0MDczMDE1NTM1MDExNDk3NTU=";
          axios({
            method: "get",
            url: `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${apiKey}&currentPage=1&countPerPage=${COUNT_PER_PAGE}&keyword=${encodedKeyword}`,
            headers: {
              "Content-Type": "application/json"
            }
          }).then(response => {
            const { data, status } = response;
            if (status === 200) {
              setAddrData([]);
              if (!Array.isArray(data.results.juso))
                return;
              for (let item of data.results.juso) {
                let road = item.rn + " " + item.buldMnnm;
    
                if (item.rn.includes(keyword) === false) {
                  continue;
                }
                if (!addrData.some(entry => entry.key.includes(road))) {
                  addrData.push({ key: road, value: item.jibunAddr });
                }
              }
              setAddrData(sortArr(addrData).filter(x => x.key.includes(keyword)));
              console.log(prev.current);
            }
          }).catch(err => {
            console.log(err);
            return;
          });
        }
      }

      function sortArr() {
        const entries = [];
        for (const item of addrData) {
          entries.push(item);
        }
        setAddrData(entries.sort());
        return addrData;
      }

    const updateKeyword = (ms) =>{
      if (prev.current !== keyword)
      {
          findPath();
          prev.current = keyword;
      }
      interval.current = setTimeout(()=>{
        if(keyword.trim() !== "")
          updateKeyword(ms);
      })
    }

    const insertKeyword = (e) =>{
        setKeyword(e.target.value.trim());      
    }

    useEffect(()=>{ // 기존의 new Promise와 setTimeOut을 섞는 전략에서 useEffect와 setTimeOut을 섞는 전략으로
      updateKeyword(1000);
      return () => {
        if(interval.current)
          clearTimeout(interval.current);
      }
    },[keyword]);
    return (
        <AddressContext.Provider value={{addrData, insertKeyword}}>
            {children}
        </AddressContext.Provider>
    );
};

export default AddressContextProvider;