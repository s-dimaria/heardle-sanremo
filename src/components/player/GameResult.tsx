import { useGameData } from "./GameContext";
import copy from 'copy-to-clipboard';
import NextTimer from "./NextTimer";
import NextTimerScore from "./NextTimerScore";
import { useState, useEffect } from "react";
import { GAME_RESULT_FAILED_MESSAGE, GAME_RESULT_MESSAGES, HEARDLE_SPOTIFY_LIST_URL, HEARDLE_IT_WEB_URL } from "../game/Constants";
import { buildScore, getDayFormattedText } from "../utils";
import { getUserByUid, updateUserByUid } from "../utils/firebaseRealtime";
import Table from "./Scoreboard";


const buildBoxIcons = (guessList: any[]) => {
  let icons = guessList.map(function (item, i) {
    if (item.isSkipped) {
      return "⬛️"
    }
    if (item.isCorrect) {
      return "🟩"
    }
    if (item.isSkipped === false && item.isCorrect === false && item.answer) {
      return "🟥"
    }
    return "⬜"
  }).join("");

  return icons;
}

const buildResultIcons = (guessList: any[]) => {
  let icons = guessList.map(function (item, i) {
    if (item.isSkipped) {
      return <p className="w-4 h-1 mx-0.5 bg-custom-mg"></p>
    }
    if (item.isCorrect) {
      return <p className="w-4 h-1 mx-0.5 bg-custom-positive"></p>
    }
    if (item.isSkipped === false && item.isCorrect === false && item.answer) {
      return <p className="w-4 h-1 mx-0.5 bg-custom-negative"></p>
    }
    return <p className="w-4 h-1 mx-0.5 bg-custom-fg"></p>
  });

  return icons;
}


const getSpeakerIcon = (score: number) => {
  if (score === 100) {
    return "🔊";
  } else if (score === 0) {
    return "🔇";
  } else if (score < 50) {
    return "🔈";
  } else {
    return "🔉";
  }
}

const getResultIcons = (guessList: any[]) => {
  let score = buildScore(guessList);
  console.log("score:", score)
  return buildResultIcons(guessList);
}

const getBoxIcons = (guessList: any[]) => {
  let score = buildScore(guessList);
  console.log("score:", score)
  return getSpeakerIcon(score) + buildBoxIcons(guessList);
}

const buildShareText = (guessList: any[]) => {
  let score = buildScore(guessList);
  console.debug(score)

  let icons = getBoxIcons(guessList);
  let todayStr = getDayFormattedText();

  return `${icons} \n #HeardleItalia ${todayStr} \n \n ${HEARDLE_IT_WEB_URL}`;
}



function GameResult({ songConfig }: { songConfig: any }) {

  const [weeks, setWeeks] = useState(0);

  const { state: { guessList } } = useGameData();
  const guessScore = guessList.findIndex((guess: any) => guess.isCorrect);

  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 4, 1); // 1° maggio dell'anno corrente
      const diffTime = today.getTime() - startOfYear.getTime();
      const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
      setWeeks(diffWeeks);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onCopyClicked = () => {
    const text = buildShareText(guessList);
    setShowCopied(true);
    setTimeout(() => {
      setShowCopied(false);
    }, 2000)

    copy(text, {
      debug: true,
      message: 'Press #{key} to copy',
    });
  }

  const onTwitterShareClicked = () => {
    const text = buildShareText(guessList);
    const url = `https://twitter.com/intent/tweet?original_referer=${HEARDLE_IT_WEB_URL}&text=${encodeURIComponent(text)}`;

    const winProxy = window.open(url, '_blank');
    if (winProxy) {
      winProxy.focus();
    }
  }

  return (

    <div id="result" className="w-full flex flex-col flex-grow relative">
      <div className="max-w-screen-sm w-full mx-auto h-full flex flex-col justify-between overflow-auto">
        <div className="p-3 pb-0 flex-col items-evenly">
          {
            songConfig.soundSpotifyLink &&
            <div className="mt-2">
              <iframe id="spotify" src={songConfig.soundSpotifyLink + "?utm_source=heardle.it"}
                title={"Ascolta su Spotify " + songConfig.trackName}
                className="song-link"
                width="100%" height="80" frameBorder="0" allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
          }
        </div>


        <div className="text-center px-3">
          <div className="flex justify-center my-2">
            {
              getResultIcons(guessList)
            }
          </div>
          {
            guessScore > -1 && guessScore < 6 &&
            <>
              <p className="text-lg text-custom-line">{GAME_RESULT_MESSAGES[guessScore]}</p>
            </>
          }
          {
            guessScore < 0 &&
            <p className="text-lg text-custom-line">{GAME_RESULT_FAILED_MESSAGE}</p>
          }

          <div className="flex justify-center items-center pt-2">
            <button className="px-2 py-2 uppercase tracking-widest border-none rounded-full flex items-center font-semibold text-sm bg-custom-positive mr-2"
              onClick={onCopyClicked}>
              {showCopied ? "Copiato" : "Condividi il risultato"}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="16" fill="currentColor" viewBox="0 0 16 16"><title>Condividi</title><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" /> </svg>
            </button>
            <button className="px-2 py-2 uppercase tracking-widest border-none rounded-full flex items-center font-semibold text-sm bg-sky-500"
              onClick={onTwitterShareClicked}>

              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="16" fill="currentColor" viewBox="0 0 16 16"><title>Twitter</title><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" fill="white"></path> </svg>
            </button>
          </div>
        </div>
        <div>

          <div className="flex flex-col justify-center items-center">
            <p className="text-custom-line text-lg mb-2">Settimana #{weeks}</p>
          </div>
          <div className="flex justify-center text-custom-line mb-5">
            <Table />
          </div>
          <NextTimer />
          <NextTimerScore />
          {/* <Banner/> */}


        </div>

      </div>
    </div>
  );
}

export default GameResult;