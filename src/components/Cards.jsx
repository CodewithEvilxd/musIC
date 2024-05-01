import React, { useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";


const Cards = ({ searches , query,requery }) => {
  //   console.log(searches);

  const handleDownloadSong = async (url, name, img) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name}.mp3`;

      const image = document.createElement("img");
      image.src = `${img}`;
      link.appendChild(image);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.log("Error fetching or downloading files", error);
    }
  };






  return (
    searches?.length > 0 ? (
      <div className="w-full min-h-[85vh] p-10 sm:p-5  text-white flex   gap-10 flex-wrap justify-center">
        
          {searches.map((d, i) => (
            <div
              key={i}
              className="w-[20%] sm:w-full sm:flex sm:flex-col  h-[50vh] sm:h-[25vh] rounded-md overflow-hidden bg-slate-200"
            >
              <div className="sm:flex sm:w-full sm:h-[15vh] ">
                <div className="img w-full sm:w-[35%] h-[30vh] sm:h-[15vh] bg-slate-500">
                  <img
                    className="w-full h-full object-fill"
                    src={d.image[2].link}
                    alt=""
                  />
                </div>
                <div className="w-full sm:w-[75%]  flex justify-between px-5 sm:px-3  items-center h-[10vh] sm:h-[15vh]  bg-slate-700">
                  <h3 className="text-sm sm:text-lg ">{d.name}</h3>
                  <i
                    onClick={() =>
                      handleDownloadSong(
                        d.downloadUrl[4].link,
                        d.name,
                        d.image[2].link
                      )
                    }
                    className=" cursor-pointer flex items-center justify-center bg-green-700 sm:w-[9vw] sm:h-[9vw] w-[3vw] h-[3vw]   rounded-full text-2xl ri-download-line"
                  ></i>
                </div>
              </div>
              <div className="song w-full h-full sm:h-[5vh] sm:flex  sm:items-center sm:justify-center  ">
                <audio
                  className="w-full  sm:h-[10vh]  "
                  controls
                  src={d.downloadUrl[4].link}
                ></audio>
              </div>
            </div>
          ))}
          {/* <div className="flex gap-3 text-2xl  ">
            <h1>MADE BY ❤️ Nishant gaurav</h1>
            <a
              target="_blank"
              href="https://www.instagram.com/game_changer.09/"
            >
              <i className=" ri-instagram-fill"></i>
            </a>
          </div> */}
      </div>
    ):<h1 className={`${query==requery? "hidden" : "block"}`}>Loading</h1>
  );
};

export default Cards;
