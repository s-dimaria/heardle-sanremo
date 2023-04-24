import Header from "./components/Header";
import PlayerContainer from "./components/player/PlayerContainer";
import AllModals from "./components/modals/AllModals";
import { ModalContextProvider } from "./components/modals/ModalContext";
import { GameContextProvider } from "./components/player/GameContext";
import { useEffect, useState } from "react";
import { getDailySong } from "./components/utils/dataService";
import { getAccessToken } from "./components/utils/spotifyService";
import { SongConfig } from "./components/game/SongConfig";
import Error from "./components/Error";

const APP_VERSION = process.env.REACT_APP_VERSION || "0"
console.debug("v" + APP_VERSION);

const currentVersion = localStorage.getItem("version");
if (currentVersion !== APP_VERSION) {
  console.log(`version upgrated from ${currentVersion} to ${APP_VERSION}`)
  localStorage.setItem("version", APP_VERSION);
}

const EMPTY_SONG_CONFIG: SongConfig = {
  trackName: "",
  breaks: [],
  others: []
}


function App() {

  const [loading, setLoading] = useState(true);
  const [currentSongConfig, setCurrentSongConfig] = useState<SongConfig>(EMPTY_SONG_CONFIG);

  const [accessToken, setAccessToken] = useState("");

  const [verify, setVerify] = useState(false);

  useEffect(() => {
    getAccessToken().then((value: any) => {
      setAccessToken(value);
      getDailySong(value).then(songConfig => {
        setCurrentSongConfig(songConfig);
        setLoading(false)          
      })
    }); 
     
  }, [])

  useEffect(() => {
    console.debug("===== SERVER DATE CONTROL ====");
    fetch("https://worldtimeapi.org/api/timezone/Europe/Rome").then(
      (response) => {
        response.json().then((data) => {

          const today = new Date();
          const serverTmpDate = new Date(data.datetime);

          console.debug("Client: " + today.toDateString() + " - Server: " + serverTmpDate.toDateString())
          if (today.toDateString() !== serverTmpDate.toDateString()) {
              setVerify(true)
          } 
          else {
            setVerify(false)
          }
        });
      }
    );
  }, []);

 /*  useEffect(() => {
    const today = new Date();

    console.log("");
    console.log("===== SERVER DATE CONTROL ====");
    const serverTmpDate = new Date(serverDate);

    console.log("Client: " + today.toDateString() + " - Server: " + serverTmpDate.toDateString())
    if (today.toDateString() === serverTmpDate.toDateString()) {

        console.log("UGUALI")
    } 

  }); */

  return (
    <div className="bg-custom-bg text-custom-fg overflow-auto flex flex-col mobile-h">
      <ModalContextProvider>
        <Header />
        <AllModals />
      </ModalContextProvider>
      { verify ? <Error></Error> :
      <GameContextProvider verify={verify}>
        {
          loading ?
            <>
              <div className="max-w-screen-sm w-full mx-auto flex-col" >
                <div className="text-center m-3 mt-6">
                  Caricamento...
                </div>
              </div>
              .</>
            : (
              <PlayerContainer songConfig={currentSongConfig} 
              accessToken = {accessToken}/>
            )
        }
      </GameContextProvider>
  }
    </div>
  );
}

export default App;
