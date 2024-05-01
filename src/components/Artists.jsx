import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  animate,
  circIn,
  circInOut,
  circOut,
  easeIn,
  easeInOut,
  easeOut,
  motion,
} from "framer-motion";
import { useAnimate, stagger } from "framer-motion";
import { Bounce, Expo, Power4, Sine } from "gsap/all";
import { Circ } from "gsap/all";
import toast, { Toaster } from "react-hot-toast";

const Artists = () => {
  const navigate = useNavigate();
  const [query, setquery] = useState("");
  const [requery, setrequery] = useState("");
  const [artists, setartists] = useState([]);
  const [search, setsearch] = useState(false)

  const Getartists = async () => {
    try {
      const { data } = await axios.get(
        // `https://saavn.dev/api/search/artists?query=${query}&limit=10`
        // `https://jiosaavan-harsh-patel.vercel.app/search/artists?query=${query}&limit=10`
        `https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/artists?query=${query}&limit=100`
      );
      setartists(data?.data?.results);
      localStorage.setItem("artists", JSON.stringify(data?.data?.results));
    } catch (error) {
      console.log("error", error);
    }
  };

  function searchClick() {
    if (query !== requery){
      toast.success(`Searching ${query} , Wait For Results`);
      setrequery(query);
      setartists([])
      setsearch(!search)
    }
    else{
      toast.error(`Please Check Your Search Query , Its Same As Before `);
    }
  }

  function seccall() {
    const intervalId = setInterval(() => {
      if (artists.length === 0 || query.length !== requery.length) {
        Getartists();
      }
    }, 1000);
    return intervalId;
  }

  useEffect(() => {
    if (query.length > 0) {
      var interval = seccall();
    }

    return () => clearInterval(interval);
  }, [search, artists]);

  useEffect(() => {
    const allData = localStorage.getItem("artists");

    // Check if data exists in localStorage
    if (allData) {
      // Parse the JSON string to convert it into a JavaScript object
      const parsedData = JSON.parse(allData);

      // Now you can use the parsedData object
      setartists(parsedData);
    } else {
      console.log("No data found in localStorage.");
    }
  }, []);

  // console.log(artists);
  return (
    <motion.div 
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7 }}
    className="w-full   bg-slate-700">
    <Toaster position="top-center" reverseOrder={false} />
      <motion.div className="w-full h-[100vh]  ">
        <motion.div
        initial={{ y: -50, scale: 0 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ ease: Circ.easeIn, duration: 0.7, delay: 1 }}
         className="search gap-3 w-full    sm:w-full h-[15vh] flex items-center justify-center ">
          <i
            onClick={() => navigate(-1)}
            className="ml-5 cursor-pointer text-3xl bg-green-500 rounded-full ri-arrow-left-line"
          ></i>
          {/* <i className=" text-2xl ri-search-2-line"></i> */}

          <input
            className=" bg-black rounded-md p-3 sm:text-sm text-white border-none outline-none w-[50%] sm:h-[7vh] sm:w-[50%] h-[10vh]"
            onChange={(e) => setquery(e.target.value)}
            placeholder="Search Artists by Name Like Arijit Singh , Shreya Ghoshal..."
            type="search"
            name=""
            id=""
          />
           <h3 onClick={()=>searchClick()} className="duration-300 cursor-pointer hover:text-slate-400 text-xl  bg-slate-400 p-2 rounded-md hover:bg-slate-600 hover:scale-90">Search <i  
          className="  ri-search-2-line"></i></h3>
        </motion.div>
        <motion.div 
        className="w-full overflow-hidden overflow-y-auto h-[85vh]  sm:min-h-[85vh]   flex flex-wrap px-5    gap-5 sm:gap-5  justify-center   bg-slate-700">
          {artists?.map((e, i) => (
            <motion.div
            initial={{  scale: 0 }}
            animate={{  scale: 1 }}
            transition={{delay:i*0.1 }}
            viewport={{ once: true }}
              key={i}
              onClick={()=>navigate(`/artists/details/${e.id}`)}
              className="w-[15vw] h-[30vh] sm:w-[40vw] mb-5  sm:h-[20vh] sm:mb-12 rounded-md bg-red-200 cursor-pointer"
            >
              <img
                className="w-full h-full object-fill rounded-md"
                src={e?.image[2]?.url}
                alt=""
              />
              <h3 className="text-white text-sm">{e.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Artists;
