import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, json, useNavigate } from "react-router-dom";
import logo from "./../../public/logo.jpg";
import axios from "axios";
import Loading from "./Loading";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import wavs from "../../public/wavs.gif";
import wait from "../../public/wait.gif";
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

const Home = () => {
  let navigate = useNavigate();
  const [home, sethome] = useState(null);
  const [language, setlanguage] = useState("hindi");
  const [details, setdetails] = useState([]);
  const [songlink, setsonglink] = useState([]);
  const [like, setlike] = useState(false);
  var [index, setindex] = useState("");
  var [page, setpage] = useState(1);
  var [page2, setpage2] = useState(Math.floor(Math.random() * 50));
  const audioRef = useRef();
  const [audiocheck, setaudiocheck] = useState(true);

  const options = [
    // "hindi",
    // "english",
    // "punjabi",
    // "tamil",
    // "telugu",
    // "marathi",
    // "gujarati",
    // "bengali",
    // "kannada",
    // "bhojpuri",
    // "malayalam",
    // "urdu",
    // "haryanvi",
    // "rajasthani",
    // "odia",
    // "assamese",

    "hindi",
    "english",
    "punjabi",
    // "tamil",
    // "telugu",
    // "marathi",
    "gujarati",
    // "bengali",
    // "kannada",
    // "bhojpuri",
    // "malayalam",
    // "urdu",
    // "haryanvi",
    "rajasthani",
    // "odia",
    // "assamese",
  ];

  const Gethome = async () => {
    detailsseter();
    try {
      const { data } = await axios.get(
        `https://jiosaavan-harsh-patel.vercel.app/modules?language=${language}`
      );
      sethome(data.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const Getdetails = async () => {
    try {
      // const { data } = await axios.get(
      //   `https://saavn.dev/search/songs?query=${language}&page=${page}&limit=20`
      // );
      const { data } = await axios.get(
        `https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/songs?query=${language}&page=${
          language === "english" ? page : page2
        }&limit=20`
        // `https://saavn.dev/api/search/songs?query=${language}&page=${page2}&limit=20`
        // `https://jiosaavan-harsh-patel.vercel.app/search/songs?query=${language}&page=${
        //   language === "hindi" || "punjabi" ? page2 : page
        // }&limit=10`
        // `https://jiosaavan-harsh-patel.vercel.app/search/songs?query=${language}&page=${page2}&limit=10`
      );
      // setdetails((prevState) => [...prevState, ...data.data.results]);
      const newData = data.data.results.filter(
        (newItem) => !details.some((prevItem) => prevItem.id === newItem.id)
      );

      setdetails((prevState) => [...prevState, ...newData]);
    } catch (error) {
      console.log("error", error);
    }
  };

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

  function likeset(e) {
    // console.log(e);
    var tf =
      localStorage.getItem("likeData") &&
      JSON.parse(localStorage.getItem("likeData")).some(
        (item) => item.id == e?.id
      );
    // console.log(tf);
    // console.log(e?.id);
    setlike(tf);
    // console.log(like);
  }

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
      // toast.success(`Song (${i?.name}) added to Likes section ✅`);
      toast(`Song (${i?.name}) added to Likes section`, {
        icon: "✅",
        duration: 1500,
        style: {
          borderRadius: "10px",
          background: "rgb(115 115 115)",
          color: "#fff",
        },
      });
    } else {
      // setlike(true);
      // Otherwise, inform the user that the song is already liked
      // console.log("You've already liked this song.");
      // toast.error("You've already liked this song.");

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
      const indexToRemove = updatedData.findIndex((item) => item.id === i.id);

      // If the song is found, remove it from the array
      if (indexToRemove !== -1) {
        updatedData.splice(indexToRemove, 1);

        // Store the updated data back into localStorage
        localStorage.setItem("likeData", JSON.stringify(updatedData));
        //   console.log("Song removed successfully.");
        // toast.success(`Song (${i?.name}) removed successfully. 🚮`);
        // toast(`Song (${i?.name}) removed successfully. 🚮`, {
        //   icon: '⚠️',
        // });

        toast(`Song (${i?.name}) removed successfully.`, {
          icon: "⚠️",
          duration: 1500,
          style: {
            borderRadius: "10px",
            background: "rgb(115 115 115)",
            color: "#fff",
          },
        });

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
        //   console.log("Song not found in localStorage.");
      }
    }
  }

  // function SongLike(e) {
  //   console.log(e);
  //   // Check if the song is already liked (exists in localStorage)
  //   const isLiked = localStorage.getItem('likeData') && JSON.parse(localStorage.getItem('likeData')).some(item => item.id === e.id);
  //   console.log(isLiked);
  // }

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
      // audioRef.current.play()
      // initializeMediaSession();
    } else {
      setindex(0);
      setsonglink([details[0]]);
      // audioRef.current.play()
      // initializeMediaSession();
    }
  }
  function pre() {
    if (index > 0) {
      setindex(index--);
      audioseter(index);
      // audioRef.current.play()
      // initializeMediaSession();
    } else {
      setindex(details.length - 1);
      setsonglink([details[details.length - 1]]);
      // audioRef.current.play()
      // initializeMediaSession();
    }
  }

  // const handleDownloadSong = async (url, name) => {
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
        success: `Song Downloaded ✅`, // Success message
        error: <b>Error downloading song.</b>, // Error message
      }
    );
  };

  function detailsseter() {
    setpage(1);
    setindex("");
    setsonglink([]);
    setdetails([]);
  }

  function seccall() {
    const intervalId = setInterval(() => {
      if (home === null) {
        // sethome([])
        Getartists();
      }
    }, 1000);
    return intervalId;
  }
  function seccall2() {
    const intervalId2 = setInterval(
      () => {
        if (details.length >= 0 && page < 20) {
          setpage2(Math.floor(Math.random() * 50));
          setpage(page + 1);
          Getdetails();
        }
      },
      page <= 2 ? 500 : 2000
    );
    return intervalId2;
  }

  useEffect(() => {
    var interval = seccall();
    //  Gethome();
    //  Gethome();
    return () => clearInterval(interval);
  }, [language, home]);

  useEffect(() => {
    Gethome();
  }, [language]);

  useEffect(() => {
    var interval2 = seccall2();

    return () => clearInterval(interval2);
  }, [details, page, language]);

  useEffect(() => {
    likeset(songlink[0]);
  }, [songlink]);

  useEffect(() => {
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.userAgent);

    if (!isIOS && songlink.length > 0) {
      audioRef.current.play();
      initializeMediaSession();
    }
  }, [songlink]);

  // useEffect(() => {
  //   initializeMediaSession();
  // }, [songlink]);

  // useEffect(() => {
  //   Getdetails();
  //   Getartists();
  // }, [language]);

  // useEffect(() => {
  //   var interval = seccall();

  //   return () => clearInterval(interval);
  // }, [details, page, language]);

  // useEffect(() => {
  //   var interval2 = seccall2();

  //   return () => clearInterval(interval2);
  // }, [details, page, language]);

  var title = songlink[0]?.name;
  document.title = `${title ? title : "THE ULTIMATE SONGS"}`;
  // console.log(details);
  // console.log(home);
  // console.log(page);
  // console.log(page2);
  // console.log(songlink);
  // console.log(index)
  return details.length > 0 ? (
    <div className="w-full h-screen  bg-slate-800">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: Circ.easeIn, duration: 0.5 }}
        className="logo fixed  z-[99] top-0 w-full  duration-700  max-h-[20vh]  flex sm:block backdrop-blur-xl py-3  px-10 sm:px-5  items-center gap-3 "
      >
        <div className="flex   items-center sm:justify-center sm:pt-2 gap-3">
          <img className="w-[5vw] sm:w-[10vw] rounded-full" src={logo} alt="" />
          <h1 className="text-2xl text-slate-900 p-2 rounded-full bg-neutral-500 sm:text-xl  font-black">
            THE ULTIMATE SONGS
          </h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: Circ.easeIn, duration: 1 }}
          className="sm:flex sm:pt-3 text-zinc-500   sm:justify-center"
        >
          <h3 className="inline text-xl sm:hidden">Search : </h3>
          <Link
            className=" text-xl sm:text-sm ml-3 sm:ml-0 sm:font-bold  p-1 rounded-md hover:text-black  hover:bg-neutral-500 duration-300 text-neutral-300  font-semibold "
            to={"/songs"}
          >
            Songs
          </Link>
          {/* <Link
            className=" text-xl sm:text-sm ml-3 sm:font-bold text-blue-900 font-semibold "
            to={"/download"}
          >
            Download Songs
          </Link> */}
          <Link
            className="  text-xl sm:text-sm ml-3 sm:ml-0 sm:font-bold  p-1 rounded-md hover:text-black  hover:bg-neutral-500 duration-300 text-neutral-300  font-semibold "
            to={"/playlist"}
          >
            PlayLists
          </Link>
          <Link
            className="  text-xl sm:text-sm ml-3 sm:ml-0 sm:font-bold  p-1 rounded-md hover:text-black  hover:bg-neutral-500 duration-300 text-neutral-300  font-semibold"
            to={"/artists"}
          >
            Artists
          </Link>
          <Link
            className="  text-xl sm:text-sm ml-3 sm:ml-0 sm:font-bold  p-1 rounded-md hover:text-black  hover:bg-neutral-500 duration-300 text-neutral-300  font-semibold "
            to={"/album"}
          >
            Album
          </Link>
          <Link
            className=" text-xl sm:text-sm ml-3 sm:ml-0 sm:font-bold  p-1 rounded-md hover:text-black  hover:bg-neutral-500 duration-300 text-neutral-300  font-semibold"
            to={"/likes"}
          >
            Likes
          </Link>
          <a
            target="_blank"
            href={
              "https://github.com/CodewithEvilxd/musIC"
            }
            className="ml-4 sm:ml-2 cursor-pointer  text-3xl  text-zinc-500   ri-github-fill"
          ></a>
        </motion.div>
      </motion.div>
      <div className="w-full  bg-slate-800  min-h-[63vh] pt-[20vh] pb-[30vh]   text-zinc-300 p-5 flex flex-col gap-5 overflow-auto ">
        <div className="w-full   flex justify-end ">
          <Dropdown
            className="w-[15%] text-sm sm:w-[50%]"
            options={options}
            onChange={(e) => setlanguage(e.value)}
            placeholder={language ? ` ${language}  ` : "Select language"}
          />
        </div>

        <div className="trending songs flex flex-col gap-3 w-full ">
          <h3 className="text-xl h-[5vh] font-semibold">{language} Songs</h3>
          <motion.div className="songs px-5 sm:px-3 flex flex-shrink  gap-5 overflow-x-auto overflow-hidden w-full ">
            {details?.map((t, i) => (
              <motion.div
                //  whileHover={{  y: 0,scale: 0.9 }}
                //  viewport={{ once: true }}
                initial={{ y: -100, scale: 0.5 }}
                whileInView={{ y: 0, scale: 1 }}
                transition={{ ease: Circ.easeIn, duration: 0.05 }}
                onClick={() => audioseter(i)}
                key={i}
                className="relative hover:scale-90 sm:hover:scale-100  duration-150 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md flex flex-col gap-1 py-4 cursor-pointer"
              >
                <motion.img
                  className="relative w-full  rounded-md"
                  // src={t.image[2].link}
                  src={t.image[2].url}
                  alt=""
                />
                <div className="flex  items-center ">
                  <p className=" text-green-400">{i + 1}</p>
                </div>

                <img
                  className={`absolute top-4 w-[20%] sm:w-[25%] rounded-md ${
                    i === index ? "block" : "hidden"
                  } `}
                  src={wavs}
                  alt=""
                />
                {songlink.length > 0 && (
                  <i
                    className={`absolute top-20 sm:top-16 w-full  flex items-center justify-center text-5xl  opacity-90  duration-300 rounded-md  ${
                      t.id === songlink[0]?.id ? "block" : "hidden"
                    } ${
                      audiocheck
                        ? "ri-pause-circle-fill"
                        : "ri-play-circle-fill"
                    }`}
                  ></i>
                )}

                <motion.div
                  //  initial={{ y: 50, scale:0}}
                  //  whileInView={{ y: 0,scale: 1 }}
                  //  transition={{ease:Circ.easeIn,duration:0.05}}
                  className="flex flex-col"
                >
                  <h3
                    className={`text-sm sm:text-xs leading-none  font-bold ${
                      i === index && "text-green-300"
                    }`}
                  >
                    {t.name}
                  </h3>
                  <h4 className="text-xs sm:text-[2.5vw] text-zinc-300 ">
                    {t.album.name}
                  </h4>
                </motion.div>
              </motion.div>
            ))}

            <img
              className={page >= 18 ? "hidden" : "w-[20%] h-[20%]"}
              src={wait}
            />
          </motion.div>
        </div>

        {/* <div className="trending flex flex-col gap-3 w-full ">
          <h3 className="text-xl h-[5vh] font-semibold">Trending Albums</h3>
          <div className="playlistsdata px-5 sm:px-3 flex flex-shrink  gap-5 overflow-x-auto overflow-hidden w-full ">
            {home?.trending?.albums.map((t, i) => (
              <Link
                to={`/albums/details/${t.id}`}
                key={i}
                className="hover:scale-110 sm:hover:scale-100  duration-150 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md flex flex-col gap-2 py-4"
              >
                <img
                  className="w-full  rounded-md"
                  src={t.image[2].link}
                  alt=""
                />
                
                <h3 className="leading-none ">{t.name}</h3>
              
              </Link>
            ))}
          </div>
        </div>  */}
        <div className="charts w-full flex flex-col gap-3   ">
          <h3 className="text-xl h-[5vh] font-semibold">Charts</h3>
          <div className="chartsdata px-5 sm:px-3 flex flex-shrink  gap-5 overflow-x-auto overflow-hidden w-full ">
            {home?.charts?.map((c, i) => (
              <motion.div
                initial={{ y: -100, scale: 0.5 }}
                whileInView={{ y: 0, scale: 1 }}
                transition={{ ease: Circ.easeIn, duration: 0.05 }}
                // onClick={`/playlist/details/${c.id}`}
                onClick={() => navigate(`/playlist/details/${c.id}`)}
                key={i}
                className="hover:scale-110 sm:hover:scale-100  duration-150 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md flex flex-col gap-2 py-4 cursor-pointer"
              >
                <img
                  className="w-full  rounded-md"
                  src={c.image[2].link}
                  alt=""
                />
                <motion.h3
                  // initial={{ y: 50, opacity: 0 }}
                  // whileInView={{ y: 0, opacity: 1 }}
                  // transition={{ease:Circ.easeIn,duration:0.05}}
                  className="leading-none"
                >
                  {c.title}
                </motion.h3>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="playlists w-full  flex flex-col gap-3 ">
          <h3 className="text-xl h-[5vh] font-semibold">Playlists</h3>
          <div className="playlistsdata px-5 sm:px-3 flex flex-shrink  gap-5 overflow-x-auto overflow-hidden w-full ">
            {home?.playlists?.map((p, i) => (
              <motion.div
                initial={{ y: -100, scale: 0.5 }}
                whileInView={{ y: 0, scale: 1 }}
                transition={{ ease: Circ.easeIn, duration: 0.05 }}
                // to={`/playlist/details/${p.id}`}
                onClick={() => navigate(`/playlist/details/${p.id}`)}
                key={i}
                className="hover:scale-110  sm:hover:scale-100  duration-150 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md  flex flex-col gap-2 py-4 cursor-pointer"
              >
                <img
                  className="w-full  rounded-md"
                  src={p.image[2].link}
                  alt=""
                />
                <motion.h3
                  // initial={{ y: 50, opacity: 0 }}
                  // whileInView={{ y: 0, opacity: 1 }}
                  // transition={{ease:Circ.easeIn,duration:0.05}}
                  className="leading-none"
                >
                  {p.title}
                </motion.h3>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="albums w-full flex flex-col gap-3 ">
          <h3 className="text-xl h-[5vh] font-semibold">Albums</h3>
          <div className="albumsdata  px-5 sm:px-3 flex flex-shrink  gap-5 overflow-x-auto overflow-hidden w-full ">
            {home?.albums?.map((a, i) => (
              <motion.div
                initial={{ y: -100, scale: 0.5 }}
                whileInView={{ y: 0, scale: 1 }}
                transition={{ ease: Circ.easeIn, duration: 0.05 }}
                // to={`/albums/details/${a.id}`}
                onClick={() => navigate(`/albums/details/${a.id}`)}
                key={i}
                className="hover:scale-110 sm:hover:scale-100  duration-150 flex-shrink-0 w-[15%] sm:w-[40%] rounded-md  flex flex-col gap-2 py-4 cursor-pointer"
              >
                <img
                  className="w-full  rounded-md"
                  src={a.image[2].link}
                  alt=""
                />
                <motion.h3
                  // initial={{ y: 50, opacity: 0 }}
                  // whileInView={{ y: 0, opacity: 1 }}
                  // transition={{ease:Circ.easeIn,duration:0.05}}
                  className="leading-none"
                >
                  {a.name}
                </motion.h3>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-neutral-400 sm:text-sm">
           <b>THE ULTIMATE SONGS</b> is not affiliated with JioSaavn. All trademarks and
            copyrights belong to their respective owners. All media, images, and
            songs are the property of their respective owners. This site is for
            educational purposes only.
          </p>
        </div>
      </div>
      <motion.div
        className={
          songlink.length > 0
            ? `duration-700 fixed  z-[99] bottom-0  flex  gap-3 items-center  w-full max-h-[30vh] py-3  backdrop-blur-xl `
            : "block"
        }
      >
        {songlink?.map((e, i) => (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ ease: Circ.easeIn, duration: 0.7 }}
            key={i}
            className=" flex sm:block w-full sm:w-full sm:h-full items-center justify-center gap-3"
          >
            <motion.div
              initial={{ x: -100, opacity: 0, scale: 0 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              // transition={{ease:Circ.easeIn,duration:1}}

              className="w-[25vw] sm:w-full  flex gap-3 items-center sm:justify-center rounded-md  h-[7vw] sm:h-[30vw]"
            >
              <p className=" text-green-400">{index + 1}</p>
              <motion.img
                initial={{ x: -100, opacity: 0, scale: 0 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                // transition={{ease:Circ.easeIn,duration:1}}

                className={`rounded-md h-[7vw] sm:h-[25vw]`}
                src={e?.image[2]?.url}
                alt=""
              />

              <h3 className=" sm:w-[30%] text-white text-xs font-semibold">
                {e?.name}
              </h3>
              <i
                onClick={() => handleDownloadSong(e.downloadUrl[4].url, e.name)}
                className="hidden sm:visible sm:flex cursor-pointer  items-center justify-center bg-green-700 sm:w-[9vw] sm:h-[9vw] w-[3vw] h-[3vw]   rounded-full text-2xl ri-download-line"
              ></i>
              <i
                onClick={() => likehandle(e)}
                className={`text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer ${
                  like ? "text-red-500" : "text-zinc-300"
                }  ri-heart-3-fill`}
              ></i>
              {/* <i onClick={()=>navigate(`songs/details/${e.id}`)} className="text-zinc-300 text-xl hover:scale-150 sm:hover:scale-100 duration-300 cursor-pointer ri-information-fill"></i> */}

              {/* {localStorage.getItem("likeData") &&
              JSON.parse(localStorage.getItem("likeData")).some(
                (item) => item.id === e.id
              ) ? (
                <i
                  onClick={() => likehandle(e)}
                  className={`text-xl cursor-pointer text-red-500 ri-heart-3-fill`}
                ></i>
              ) : (
                <i
                  onClick={() => likehandle(e)}
                  className={`text-xl cursor-pointer text-zinc-300 ri-heart-3-fill`}
                ></i>
              )} */}

              {/* {like ? (
                <i
                  onClick={() => likehandle(e)}
                  className="text-xl cursor-pointer text-red-500 ri-heart-3-fill"
                ></i>
              ) : (
                <i
                  onClick={() => likehandle(e)}
                  className="text-xl cursor-pointer text-zinc-300  ri-heart-3-fill"
                ></i>
              )} */}
            </motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              // transition={{ease:Circ.easeIn,duration:1}}
              className="w-[35%]  sm:w-full h-[10vh] flex gap-3 sm:gap-1 items-center justify-center"
            >
              <button
                onClick={pre}
                className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full"
              >
                <i className="ri-skip-back-mini-fill"></i>
              </button>
              <audio
                ref={audioRef}
                onPause={() => setaudiocheck(false)}
                onPlay={() => setaudiocheck(true)}
                className="w-[80%]"
                controls
                autoPlay
                onEnded={next}
                src={e?.downloadUrl[4]?.url}
              ></audio>
              <button
                onClick={next}
                className="text-3xl text-white bg-zinc-800 cursor-pointer rounded-full"
              >
                <i className="ri-skip-right-fill"></i>
              </button>
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
                    handleDownloadSong(e.downloadUrl[0].url, e.name + " 12kbps")
                  }
                  className="duration-300 cursor-pointer hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                >
                  12kbps <br />
                  <p className="text-xs">Very low quality</p>
                </p>
                <p
                  onClick={() =>
                    handleDownloadSong(e.downloadUrl[1].url, e.name + " 48kbps")
                  }
                  className="duration-300 cursor-pointer  hover:text-slate-400 hover:bg-slate-600 hover:scale-90 w-fit p-1 font-semibold rounded-md shadow-2xl bg-slate-400 flex flex-col items-center"
                >
                  48kbps <br />
                  <p className="text-xs">Low quality</p>
                </p>
                <p
                  onClick={() =>
                    handleDownloadSong(e.downloadUrl[2].url, e.name + " 96kbps")
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
                      e.name + " 160kbps"
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
                      e.name + " 320kbps"
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
    </div>
  ) : (
    <Loading />
  );
};

export default Home;
