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
import LoadingSpinner from "./components/LoadingSpinner";

const APP_VERSION = process.env.REACT_APP_VERSION || "0";
console.debug("v" + APP_VERSION);

const currentVersion = localStorage.getItem("version");
if (currentVersion !== APP_VERSION) {
  console.log(`version upgrated from ${currentVersion} to ${APP_VERSION}`);
  localStorage.setItem("version", APP_VERSION);
}

const EMPTY_SONG_CONFIG: SongConfig = {
  trackName: "",
  breaks: [],
  others: [],
};

function App() {
  const [loading, setLoading] = useState(true);
  const [currentSongConfig, setCurrentSongConfig] =
    useState<SongConfig>(EMPTY_SONG_CONFIG);

  const [accessToken, setAccessToken] = useState("");

  const [serverDate, setServerDate] = useState("");

  useEffect(() => {
    getAccessToken().then((value: any) => {
      setAccessToken(value);

      console.debug("===== SERVER DATE CONTROL ====");

      fetch("https://worldtimeapi.org/api/timezone/Europe/Rome")
      .then((response) => response.json())
        .then((data) => {
            let day: string = data.datetime.replaceAll("-", "/").substring(0, 10)
            setServerDate(day);

            console.debug(
                " - Server: " +
                day
            );
          
      getDailySong(value, day).then((songConfig) => {
        setCurrentSongConfig(songConfig);
        setLoading(false);
      });
    });
    });
  },[serverDate])

  return (
    <div className="bg-custom-bg text-custom-fg overflow-auto flex flex-col mobile-h">
      <ModalContextProvider>
        <Header />
        <AllModals />
      </ModalContextProvider>
      {loading ? (
        <LoadingSpinner></LoadingSpinner>
      )  : serverDate == "" ? (
        <Error></Error> 
      ) : (
        <GameContextProvider date={serverDate}>
          <PlayerContainer
            songConfig={currentSongConfig}
            accessToken={accessToken}
            date={serverDate}
          />
        </GameContextProvider>
      )}
    </div>
  );
}

export default App;
