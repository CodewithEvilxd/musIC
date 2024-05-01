import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Cards from "./Cards";
import logo from "./../../public/logo3.jpg";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

const Download = () => {
  const [query, setquery] = useState("");
  const [requery, setrequery] = useState("");
  const [searches, setsearches] = useState([]);
  
    // console.log(searches);

  const Getserches = async () => {
    try {
      const { data } = await axios.get(
        `https://saavn.dev/search/songs?query=${query}`
      );
      setsearches(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  function seccall() {
    const intervalId = setInterval(() => {
      if (searches.length === 0 || query.length !== requery.length) {
        Getserches();
        setrequery(query);
      }
    }, 3000);
    return intervalId;
  }

  useEffect(() => {
    if (query.length > 0) {
      var interval = seccall();
    }

    return () => clearInterval(interval);
  }, [query,searches]);

  useEffect(() => {
    if(query !== ""){
     Getserches();
    }
  }, [query]);

  return (
    <div className="w-full min-h-screen bg-slate-800">
      <div className="w-full h-[15vh] flex sm:block sm:mb-[15vh]  justify-between px-10 sm:px-5 bg-gray-500">
        <div className="logo h-[15vh] flex sm:block  items-center gap-3 ">
          <div className="flex items-center sm:justify-center sm:pt-2 gap-3">
          <img className="w-[5vw] sm:w-[15vw] rounded-full" src={logo} alt="" />
          <h1 className="text-2xl sm:text-xl  font-black">THE ULTIMATE SONGS</h1>
          </div>
         <div className="sm:flex sm:justify-center">
         <Link className=" text-xl ml-3 sm:font-bold text-blue-900 font-semibold " to={"/playlist"}>
            PlayLists
          </Link>
          <Link className=" text-xl ml-3 sm:font-bold text-blue-900 font-semibold " to={"/artists"}>
          Artists
          </Link>
         </div>
          
        </div>
        <div className="search gap-3 w-[30%]  sm:w-full h-[15vh] flex items-center justify-center ">
          <i className="  text-2xl ri-search-2-line"></i>
          <input
            className=" bg-black rounded-md p-3 sm:text-xl text-white border-none outline-none w-[80%] h-[10vh]"
            onChange={(e) => setquery(e.target.value)}
            value={query}
            placeholder="Search Song For Download"
            type="search"
            name=""
            id=""
          />
        </div>
      </div>
     
        <Cards searches={searches.data?.results} query={query} requery={requery} />
      
    </div>
  );
};

export default Download;
