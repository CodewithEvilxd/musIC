import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import wavs from "../../public/wavs.gif";
import empty from "../../public/empty3.gif";
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
import JSZip from "jszip";
import CryptoJS from 'crypto-js';
// import { saveAs } from 'file-saver';
// import { ID3Writer } from 'browser-id3-writer';
// import AdmZip from 'adm-zip';
// import fs from 'fs';
// import mm from 'music-metadata';

function Likes() {
  const navigate = useNavigate();
  let location = useLocation();

  const [details, setdetails] = useState([]);
  const [songs, setSongs] = useState([]);

  const [songlink, setsonglink] = useState([]);
  var [index, setindex] = useState("");
  var [rerender, setrerender] = useState(false);
  const [like, setlike] = useState(false);
  const [download, setdownload] = useState(false);
  const audioRef = useRef();
  const [audiocheck, setaudiocheck] = useState(true);

  function audioseter(i) {
    if (songlink[0]?.id === details[i].id) {
      const audio = audioRef.current;
      if (!audio.paused) {
        audio.pause();
        setaudiocheck(false);
      } else {
        setaudiocheck(true);
        audio.play().catch((error) => {
          console.error("Playback failed:", error);
        });
      }
    } else {
      setindex(i);
      setsonglink([details[i]]);
    }
  }

//   const downloadSongsfile = () => {
//     if (details.length>0) {
      
//       toast(`Exporting...`, {
//         icon: "✅",
//         duration: 1500,
//         style: {
//           borderRadius: "10px",
//           background: "rgb(115 115 115)",
//           color: "#fff",
//         },
//       });
//     // Convert array to JSON string
//     const json = JSON.stringify(details);

//     // Create Blob object
//     const blob = new Blob([json], { type: 'application/json' });

//     // Create temporary URL for the Blob
//     const url = URL.createObjectURL(blob);

//     // Create a link element
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${details.length} songs.json`; // File name
//     document.body.appendChild(a);

//     // Click the link to initiate download
//     a.click();

//     // Remove the link element
//     document.body.removeChild(a);

//     // Revoke the temporary URL
//     URL.revokeObjectURL(url);
//     toast(`Exported successfully.`, {
//       icon: "✅",
//       duration: 1500,
//       style: {
//         borderRadius: "10px",
//         background: "rgb(115 115 115)",
//         color: "#fff",
//       },
//     });
//     }
//     else{
//       toast(`No songs available to Export`, {
//         icon: "❌",
//         duration: 1500,
//         style: {
//           borderRadius: "10px",
//           background: "rgb(115 115 115)",
//           color: "#fff",
//         },
//       });
//     }
// };

const downloadSongsfile = () => {
  if (details.length > 0) {
      const password = prompt(`Create A Password For Your File Protection 🔑 , Note : This Password Is Required At The Time Of Import Songs
      Please Enter Your Password 👇:`);
      if (!password) return; // Cancelled or empty password
      
      // Convert array to JSON string
      const json = JSON.stringify(details);

      // Encrypt the JSON data with the password
      const encryptedData = CryptoJS.AES.encrypt(json, password).toString();

      // Create Blob object
      const blob = new Blob([encryptedData], { type: 'text/plain' });

      // Create temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${details.length} songs.json`; // File name
      document.body.appendChild(a);

      // Click the link to initiate download
      a.click();

      // Remove the link element
      document.body.removeChild(a);

      // Revoke the temporary URL
      URL.revokeObjectURL(url);

      toast(`Exported successfully.`, {
          icon: "✅",
          duration: 1500,
          style: {
              borderRadius: "10px",
              background: "rgb(115 115 115)",
              color: "#fff",
          },
      });
  } else {
      toast(`No songs available to Export`, {
          icon: "❌",
          duration: 1500,
          style: {
              borderRadius: "10px",
              background: "rgb(115 115 115)",
              color: "#fff",
          },
      });
  }
};



  // function likeset(e) {
  //   // console.log(e);
  //   var tf =
  //     localStorage.getItem("likeData") &&
  //     JSON.parse(localStorage.getItem("likeData")).some(
  //       (item) => item.id == e?.id
  //     );
  //   // console.log(tf);
  //   // console.log(e?.id);
  //   setlike(tf);
  //   // console.log(like);
  // }
  // function indexset() {
  //   setindex(details.findIndex((item) => item.id === songlink[0]?.id))
  // }

  function likehandle(i) {
    // Retrieve existing data from localStorage
    let existingData = localStorage.getItem("likeData");

    // Initialize an array to hold the updated data
    let updatedData = [];

    // If existing data is found, parse it from JSON
    if (existingData) {
      updatedData = JSON.parse(existingData);
    }

    // Check if the new data already exists in the existing data
    let exists = updatedData.some((item) => item.id === i.id);

    if (!exists) {
      // If not, add the new data
      updatedData.push(i);
      // Store the updated data back into localStorage
      localStorage.setItem("likeData", JSON.stringify(updatedData));
      setlike(true);
      toast.success("Song added to Likes section ✅ ");
    } else {
      setlike(true);
      // Otherwise, inform the user that the song is already liked
      //   console.log("You've already liked this song.");
      toast.error("You've already liked this song. ❌");
    }
  }

  // function removehandle(id) {
  //   // Retrieve existing data from localStorage
  //   let existingData = localStorage.getItem("likeData");

  //   // If no data exists, there's nothing to remove
  //   if (!existingData) {
  //     console.log("No data found in localStorage.");
  //     return;
  //   }
  //   // Parse the existing data from JSON
  //   let updatedData = JSON.parse(existingData);

  //   // Find the index of the song with the given ID in the existing data
  //   const indexToRemove = updatedData.findIndex((item) => item.id === id);

  //   // If the song is found, remove it from the array
  //   if (indexToRemove !== -1) {
  //     updatedData.splice(indexToRemove, 1);

  //     // Store the updated data back into localStorage
  //     localStorage.setItem("likeData", JSON.stringify(updatedData));
  //   //   console.log("Song removed successfully.");
  //     toast.success("Song removed successfully.🚮");
  //       setrerender(!rerender);
  //       setsonglink([]);

  //     // if (index>0 && details.length>=0) {
  //     //     setrerender(!rerender)
  //     //     var index2 = index-1
  //     //     setindex(index2);
  //     //     setsonglink([details[index2]]);
  //     // }
  //     // else{
  //     //     setrerender(!rerender)
  //     // }
  //   } else {
  //       toast.error("Song not found in localStorage.")
  //   //   console.log("Song not found in localStorage.");
  //     setsonglink([]);
  //    setrerender(!rerender);
  //   }
  // }

  function removehandle(i, ind) {
    setlike(false);
    let existingData = localStorage.getItem("likeData");

    // If no data exists, there's nothing to remove
    if (!existingData) {
      console.log("No data found in localStorage.");
      return;
    }
    // Parse the existing data from JSON
    let updatedData = JSON.parse(existingData);

    // Find the index of the song with the given ID in the existing data
    const indexToRemove = updatedData.findIndex((item) => item.id === i);

    // If the song is found, remove it from the array
    if (indexToRemove !== -1) {
      updatedData.splice(indexToRemove, 1);

      // Store the updated data back into localStorage
      localStorage.setItem("likeData", JSON.stringify(updatedData));
      //   console.log("Song removed successfully.");
      // toast.success("Song removed successfully. 🚮");
      toast(`Song removed successfully.`, {
        icon: "✅",
        duration: 1500,
        style: {
          borderRadius: "10px",
          background: "rgb(115 115 115)",
          color: "#fff",
        },
      });
      setrerender(!rerender);
      if (songlink[0].id != i) {
        setrerender(!rerender);
        if (index > ind) {
          setindex(index - 1);
        }
        // else{
        //   setindex(details.findIndex((item) => item.id === songlink[0].id)+1)
        // }
      } else {
        setrerender(!rerender);
        setsonglink([]);
      }
      // setsonglink([]);

      // if (index>0 && details.length>=0) {
      //     setrerender(!rerender)
      //     var index2 = index-1
      //     setindex(index2);
      //     setsonglink([details[index2]]);
      // }
      // else{
      //     setrerender(!rerender)
      // }
    } else {
      toast.error("Song not found in localStorage.");
      setsonglink([]);
      setrerender(!rerender);

      //   console.log("Song not found in localStorage.");
    }
  }

  function emptyfile() {
    toast.error("it's empty, liked songs will be shown in this page 👇");
  }

  // const initializeMediaSession = () => {
  //   if ("mediaSession" in navigator) {
  //     navigator.mediaSession.metadata = new MediaMetadata({
  //       title: songlink[0]?.name || "",
  //       artist: songlink[0]?.album?.name || "",
  //       artwork: [
  //         {
  //           src: songlink[0]?.image[2]?.url || "",
  //           sizes: "512x512",
  //           type: "image/jpeg",
  //         },
  //       ],
  //     });

  //     navigator.mediaSession.setActionHandler("play", function () {
  //       // Handle play action
  //       if (audioRef.current) {
  //         audioRef.current.play().catch((error) => {
  //           console.error("Play error:", error);
  //         });
  //       }
  //     });

  //     navigator.mediaSession.setActionHandler("pause", function () {
  //       // Handle pause action
  //       if (audioRef.current) {
  //         audioRef.current.pause().catch((error) => {
  //           console.error("Pause error:", error);
  //         });
  //       }
  //     });

  //     navigator.mediaSession.setActionHandler("previoustrack", function () {
  //       pre();
  //     });

  //     navigator.mediaSession.setActionHandler("nexttrack", function () {
  //       next();
  //     });
  //   } else {
  //     console.warn("MediaSession API is not supported.");
  //   }
  // };

  const initializeMediaSession = () => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songlink[0]?.name || "",
        artist: songlink[0]?.album?.name || "",
        artwork: [
          {
            src: songlink[0]?.image[2]?.url || "",
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", function () {
        // Handle play action
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error("Play error:", error);
          });
        }
      });

      navigator.mediaSession.setActionHandler("pause", function () {
        // Handle pause action
        if (audioRef.current) {
          audioRef.current.pause().catch((error) => {
            console.error("Pause error:", error);
          });
        }
      });

      navigator.mediaSession.setActionHandler("previoustrack", function () {
        pre();
      });

      navigator.mediaSession.setActionHandler("nexttrack", function () {
        next();
      });
    } else {
      console.warn("MediaSession API is not supported or the device is iOS.");
    }
  };

  function next() {
    if (index < details.length - 1) {
      setindex(index++);
      audioseter(index);
    } else {
      setindex(0);
      setsonglink([details[0]]);
    }
  }
  function pre() {
    if (index > 0) {
      setindex(index--);
      audioseter(index);
    } else {
      setindex(details.length - 1);
      setsonglink([details[details.length - 1]]);
    }
  }

  // const handleDownloadSong = async (url, name, img) => {
  //   try {
  //     toast.success(`Song ${name} Downloading...`);
  //     const res = await fetch(url);
  //     const blob = await res.blob();
  //     const link = document.createElement("a");
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `${name}.mp3`;

  //     document.body.appendChild(link);
  //     link.click();

  //     document.body.removeChild(link);
  //     toast.success("Song Downloaded ✅");
  //   } catch (error) {
  //     console.log("Error fetching or downloading files", error);
  //   }
  // };

  const handleDownloadSong = (url, name, poster) => {
    return toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          // Display loading message
          // toast.loading(`Song ${name} Downloading...`, {
          //   id: 'loading-toast' // Set a unique ID for the loading toast
          // });

          // Perform the download
          const res = await fetch(url);
          const blob = await res.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${name}.mp3`;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);

          resolve(); // Resolve the promise once the download is complete
        } catch (error) {
          console.log("Error fetching or downloading files", error);
          reject("Error downloading song");
        }
      }),
      {
        loading: `Song ${name} Downloading...`, // Loading message
        success: <b>Song Downloaded ✅</b>, // Success message
        error: <b>Error downloading song.</b>, // Error message
      }
    );
  };

  useEffect(() => {
    // Retrieve all data from localStorage
    const allData = localStorage.getItem("likeData");

    // Check if data exists in localStorage
    if (allData) {
      // Parse the JSON string to convert it into a JavaScript object
      const parsedData = JSON.parse(allData);
      // Now you can use the parsedData object
      setdetails(parsedData.reverse());
      // setSongs(parsedData.reverse());
      const extractedSongs = parsedData.map((song) => ({
        title: song.name,
        url: song.downloadUrl[4].url,
        image: song.image[2].url,
        artist: song.artists.primary.map((artist) => artist.name).join(" , "),
        album: song.album.name,
        year: song.year,
      }));
      setSongs(extractedSongs);
      // console.log((details.findIndex((item) => item.id === songlink[0].id)))
    } else {
      console.log("No data found in localStorage.");
    }
  }, [rerender, songlink]);

  useEffect(() => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && songlink.length > 0) {
      audioRef.current.play();
      initializeMediaSession();
    }
  }, [songlink]);

  // const downloadSongs = () => {
  //   if (songs.length > 0) {
  //     setdownload(true);
  //     toast.success("Downloading songs");
  //     // Create a zip file
  //     const zip = new JSZip();
  //     const promises = [];

  //     // Add each song to the zip file
  //     songs.forEach((song) => {
  //       const { title, url } = song;
  //       // toast.success(`Song ${title} Downloading...`);
  //       const promise = fetch(url)
  //         .then((response) => response.blob())
  //         .then((blob) => {
  //           zip.file(`${title} (320kbps).mp3`, blob, { binary: true });
  //         })
  //         .catch((error) => toast.error("Error downloading song:", error));
  //       promises.push(promise);
  //       // toast.success(`Song ${title} Downloaded ✅`);
  //     });

  //     // Wait for all promises to resolve before generating the zip file
  //     Promise.all(promises).then(() => {
  //       // Generate the zip file and initiate download
  //       zip.generateAsync({ type: "blob" }).then((content) => {
  //         const zipUrl = window.URL.createObjectURL(content);
  //         const link = document.createElement("a");
  //         link.href = zipUrl;
  //         link.download = "songs.zip";
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         setdownload(false);
  //         toast.success("Download songs completed successfully");
  //       });
  //     });
  //   } else {
  //     toast.error("No songs available to download");
  //   }
  // };

  const downloadSongs = () => {
    if (songs.length > 0) {
      return toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            // Display initial message

            // Create a zip file
            const zip = new JSZip();
            const promises = [];

            // Add each song to the zip file
            songs.forEach((song) => {
              const { title, url } = song;
              const promise = fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                  zip.file(`${title} (320kbps).mp3`, blob, { binary: true });
                })
                .catch((error) => {
                  // Display error message for individual song download
                  toast.error(`Error downloading ${title}: ${error}`);
                });
              promises.push(promise);
            });

            // Wait for all promises to resolve before generating the zip file
            await Promise.all(promises);

            // Generate the zip file and initiate download
            const content = await zip.generateAsync({ type: "blob" });
            const zipUrl = window.URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = zipUrl;
            link.download = "songs.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Resolve the promise after successful download
            resolve();
          } catch (error) {
            // Reject the promise if any error occurs
            reject("Error downloading songs");
          }
        }),
        {
          loading: `Downloading songs`, // Loading message
          success: "Download songs completed successfully ✅", // Success message
          error: "Error downloading songs", // Error message
        }
      );
    } else {
      // Display error message if no songs available
      return toast.error("No songs available to download");
    }
  };

  var title = songlink[0]?.name;
  document.title = `${title ? title : "THE ULTIMATE SONGS"}`;
  //   console.log(details);
  //   console.log(rerender);
  // console.log(index);
  // console.log(download);
  // console.log(songlink);

  // console.log(songlink[0]?.id);
  return (
    <div className="w-full h-screen bg-slate-700">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full justify-between px-3 fixed z-[99] backdrop-blur-xl flex items-center gap-3 sm:h-[7vh]  h-[10vh]">
        <div className="flex items-center gap-3">
          <i
            onClick={() => navigate("/")}
            className="text-3xl cursor-pointer  bg-green-500 rounded-full ri-arrow-left-line"
          ></i>
          <h1 className="text-xl text-zinc-300 sm:text-xs font-black">
            THE ULTIMATE SONGS
          </h1>
        </div>
        <div className="w-fit flex gap-3">
        
          <button
            className=" hover:scale-90 sm:hover:scale-100 duration-300 inline-block w-fit h-fit sm:text-sm  rounded-md p-2 sm:p-0.5 font-semibold bg-slate-400 "
            onClick={downloadSongs}
            disabled={download}
          >
            {download ? "downloading..." : "Download All Songs"}
          </button>
          <button
            className=" hover:scale-90 sm:hover:scale-100 duration-300 inline-block w-fit h-fit sm:text-sm  rounded-md p-2 sm:p-0.5 font-semibold bg-slate-400 "
            onClick={()=>navigate("/import")}
            // disabled={download}
          >
            Import songs 
            {/* {download ? "downloading..." : "Download All Songs"} */}
          </button>
          <button
            className=" hover:scale-90 sm:hover:scale-100 duration-300 inline-block w-fit h-fit sm:text-sm  rounded-md p-2 sm:p-0.5 font-semibold bg-slate-400 "
            onClick={downloadSongsfile}
            // disabled={download}
          >
            Export songs 
            {/* {download ? "downloading..." : "Download All Songs"} */}
          </button>
        </div>
      </div>

      {details.length > 0 ? (
        <div className="flex w-full text-white p-10 pt-[15vh] pb-[30vh] sm:pt-[10vh] sm:pb-[35vh] sm:p-3 sm:gap-3 bg-slate-700 min-h-[60vh] overflow-y-auto  sm:block flex-wrap gap-5 justify-center ">
          {details?.map((d, i) => (
            <div
              title="click on song image or name to play the song"
              key={i}
              className="items-center justify-center relative hover:scale-95 sm:hover:scale-100 duration-150 w-[40%] flex mb-3 sm:mb-3 sm:w-full sm:flex sm:items-center sm:gap-3  rounded-md h-[10vw] sm:h-[15vh] cursor-pointer bg-slate-600  "
            >
              <div
                onClick={() => audioseter(i)}
                className="flex w-[80%] items-center"
              >
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 }}
                  viewport={{ once: true }}
                  className="w-[10vw] h-[10vw] sm:h-[15vh] sm:w-[15vh] rounded-md"
                  src={d.image[2].url}
                  alt=""
                />
                 <p className="pl-1 text-green-400">{i + 1}</p>
                <img
                  className={`absolute top-0 w-[8%] sm:w-[10%] rounded-md ${
                    d.id === songlink[0]?.id ? "block" : "hidden"
                  } `}
                  src={wavs}
                  alt=""
                />
                {songlink.length > 0 && (
                  <i
                    className={`absolute top-0 sm:h-[15vh] w-[10vw] h-full flex items-center justify-center text-5xl sm:w-[15vh]  opacity-90  duration-300 rounded-md ${
                      d.id === songlink[0]?.id ? "block" : "hidden"
                    } ${
                      audiocheck
                        ? "ri-pause-circle-fill"
                        : "ri-play-circle-fill"
                    }`}
                  ></i>
                )}
                <div className="ml-3 sm:ml-3 flex justify-center items-center gap-5 mt-2">
                  <div className="flex flex-col">
                    <h3
                      className={`text-sm sm:text-xs leading-none  font-bold ${
                        d.id === songlink[0]?.id && "text-green-300"
                      }`}
                    >
                      {d.name}
                    </h3>
                    <h4 className="text-xs sm:text-[2.5vw] text-zinc-300 ">
                      {d.album.name}
                    </h4>
                  </div>
                </div>
              </div>

              <i
                title="Remove Song "
                onClick={() => removehandle(d.id, i)}
                className="m-auto flex w-[3vw] sm:w-[9vw] rounded-full justify-center items-center h-[3vw] sm:h-[9vw] text-xl bg-red-500  duration-300 cursor-pointer text-zinc-300 ri-dislike-fill"
              ></i>
            </div>
          ))}

          {/* <div className="flex gap-3 text-2xl  ">
          <h1>MADE BY ❤️ NISHANT GAURAV</h1>
          <a
            target="_blank"
            href="https://www.instagram.com/game_changer.09/"
          >
            <i className=" ri-instagram-fill"></i>
          </a>
        </div> */}
        </div>
      ) : (
        <div 
        onClick={() => emptyfile()}
        className="absolute w-[25%] sm:w-[60%] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2  cursor-pointer">
          <img
            className="rounded-md "
            src={empty}
          />
          <p className=" text-base font-bold text-zinc-300">it's empty , liked songs will be shown in this page</p>
        </div>
      )}
      {songlink !== null ? (
        <motion.div
          className={
            songlink.length > 0
              ? `duration-700 flex fixed z-[99] bottom-0    gap-3 items-center  w-full py-2 sm:h-[30vh] max-h-[30vh] backdrop-blur-xl `
              : "block"
          }
        >
          {songlink?.map((e, i) => (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              key={i}
              className="flex sm:block w-full sm:w-full sm:h-full items-center justify-center gap-3"
            >
              <motion.div
                initial={{ x: -50, opacity: 0, scale: 0 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                className="w-[25vw] sm:w-full  flex gap-3 items-center sm:justify-center rounded-md  h-[7vw] sm:h-[30vw]"
              >
                <p className=" text-green-400">{index+1}</p>
                <motion.img
                  initial={{ x: -50, opacity: 0, scale: 0 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  className="rounded-md h-[7vw] sm:h-[25vw]"
                  src={e?.image[2]?.url}
                  alt=""
                />
               
                <h3 className=" sm:w-[30%] text-white text-xs font-semibold">
                  {e?.name}
                </h3>
                <i
                  onClick={() =>
                    handleDownloadSong(e?.downloadUrl[4].url, e?.name)
                  }
                  className="hidden sm:flex  cursor-pointer  items-center justify-center bg-green-700 sm:w-[9vw] sm:h-[9vw] w-[3vw] h-[3vw]   rounded-full text-2xl ri-download-line"
                ></i>

                {/* {like ? (
                  <i
                    title="You Liked This Song"
                    onClick={() => likehandle(e)}
                    className="text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer text-red-500 ri-heart-3-fill"
                  ></i>
                ) : (
                  <i
                    title="Like Song"
                    onClick={() => likehandle(e)}
                    className="text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer text-zinc-300  ri-heart-3-fill"
                  ></i>
                )} */}
                <i
                  title="Remove Song "
                  onClick={() => removehandle(e.id)}
                  className="text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer text-zinc-300 ri-dislike-fill"
                ></i>
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="w-[35%]  sm:w-full h-[10vh] flex gap-3 sm:gap-1 items-center justify-center"
              >
                <i
                  onClick={pre}
                  className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full ri-skip-back-mini-fill"
                ></i>
                <audio
                  className="w-[80%] "
                  ref={audioRef}
                  onPause={() => setaudiocheck(false)}
                  onPlay={() => setaudiocheck(true)}
                  controls
                  autoPlay
                  onEnded={next}
                  src={e?.downloadUrl[4]?.url}
                ></audio>
                <i
                  onClick={next}
                  className=" text-3xl text-white bg-zinc-800 cursor-pointer rounded-full ri-skip-right-fill"
                ></i>
              </motion.div>
              <div className="sm:hidden flex flex-col text-[1vw] items-center  gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-400">
                    Download Options
                  </h3>
                </div>
                <div className="flex flex-row-reverse gap-2 ">
                  <p
                    onClick={() =>
                      handleDownloadSong(
                        e.downloadUrl[0].url,
                        e.name + " (12kbps)"
                      )
                    }
                    className="duration-300 cursor-pointer hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                  >
                    12kbps <br />
                    <p className="text-xs">Very low quality</p>
                  </p>
                  <p
                    onClick={() =>
                      handleDownloadSong(
                        e.downloadUrl[1].url,
                        e.name + " (48kbps)"
                      )
                    }
                    className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                  >
                    48kbps <br />
                    <p className="text-xs">Low quality</p>
                  </p>
                  <p
                    onClick={() =>
                      handleDownloadSong(
                        e.downloadUrl[2].url,
                        e.name + " (96kbps)"
                      )
                    }
                    className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                  >
                    96kbps <br />
                    <p className="text-xs">Fair quality</p>
                  </p>
                  <p
                    onClick={() =>
                      handleDownloadSong(
                        e.downloadUrl[3].url,
                        e.name + " (160kbps)"
                      )
                    }
                    className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                  >
                    160kbps <br />
                    <p className="text-xs">Good quality</p>
                  </p>
                  <p
                    onClick={() =>
                      handleDownloadSong(
                        e.downloadUrl[4].url,
                        e.name + " (320kbps)"
                      )
                    }
                    className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                  >
                    320kbps <br />
                    <p className="text-xs"> High quality</p>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <h1>NO DATA</h1>
      )}
    </div>
  );
}

export default Likes;
