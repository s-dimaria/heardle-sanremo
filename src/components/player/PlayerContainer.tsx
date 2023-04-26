import { useState } from "react";
import AsyncSelect from "react-select/async";
import GamePlayground from "./GamePlayground";
import GameResult from "./GameResult";
import { useGameData } from "./GameContext";
import MusicPlayer from "../music/MusicPlayer";
import { checkAnswer } from "../game/Utils";
import { OnChangeValue } from "react-select";
import { SongConfig } from "../game/SongConfig";
import { getList } from "../utils/spotifyService";
import { getUserByUid, updateUserByUid } from "../utils/firebaseRealtime";
import { buildScore } from "../utils";

function PlayerContainer({
  songConfig,
  accessToken,
}: {
  songConfig: SongConfig;
  accessToken: string;
}) {
  const [answer, setAnswer] = useState("");
  const [selectedSong, setSelectedSong] = useState("");

  const {
    dispatch,
    state: { openedStep, finished, guessList },
  } = useGameData();

  const onSkipClicked = () => {
    dispatch({ type: "SKIP", payload: { step: openedStep } });
  };

  const onSendClicked = () => {
    if (!answer) {
      return;
    }

    let win = checkAnswer(songConfig, answer);
    console.debug("checkAnswer ", win);

    if (win) {
      dispatch({
        type: "SUBMIT-CORRRECT",
        payload: { step: openedStep, answer: answer },
      });
      updateScore();
    } else {
      dispatch({
        type: "SUBMIT-WRONG",
        payload: { step: openedStep, answer: answer },
      });
    }

    setAnswer("");
    setSelectedSong("");
  };

  const onFinishClicked = () => {
    dispatch({ type: "FINISH" });
  };

  const loadList = (inputValue: string, callback: (res: any[]) => void) => {
    if (!inputValue || inputValue.trim().length < 1) {
      callback([]);
      return;
    }

    getList(accessToken, inputValue, callback);
  };

  const handleInputChange = (newValue: OnChangeValue<any, any>) => {
    if (newValue) {
      setSelectedSong(newValue);
      console.debug("value:", newValue.value);
      setAnswer(newValue.value);
    }
  };

  const updateScore = async () => {
    const uid = localStorage.getItem("uid");
    let points = buildScore(guessList);
    let user = (await getUserByUid(uid)).val();
    user.score = user.score + points;
    if (uid != null) updateUserByUid(uid, user);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: state.isFocused ? "1px solid #1E9102" : "1px solid black",
      boxShadow: state.isFocused ? "0 0 0 1px #1E9102" : "none",
      "&:hover": {
        border: "0 0 0 2px solid #1E9102",
      },
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "white",
      color: "black",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#1E9102"
        : state.isFocused
        ? "lightgreen"
        : "white",
      color: "black",
      border: "1px solid #4F4F4F" 
    }),
    placeholder: (provided: any, state: any) => ({
      ...provided,
      color: "black",
    }),
    noOptionsMessage: (provided: any, state: any) => ({
      ...provided,
      color: "red",
    }),
    loadingMessage: (provided: any, state: any) => ({
      ...provided,
      color: "black",
    }),
    menuList: (provided: any, state: any) => ({
        ...provided,
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#4F4F4F"
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "black"
        },
        "&::-webkit-scrollbar-corner": {
          backgroundColor: "black"
        },
        scrollbarColor: "#4F4F4F black",
        scrollbarWidth: "thin"
      })
  };

  return (
    <>
      {finished ? <GameResult songConfig={songConfig} /> : <GamePlayground />}
      <MusicPlayer songConfig={songConfig} />
      {finished === false && (
        <div className="max-w-screen-sm w-full mx-auto flex-col">
          <div className="m-3 mt-0">
            <div>
              <div className="">
                <div className="autoComplete_wrapper" role="form">
                  <AsyncSelect
                    defaultOptions
                    menuPlacement="top"
                    cacheOptions
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    noOptionsMessage={({ inputValue }) =>
                      !inputValue.trim()
                        ? "Inserisci almeno 1 carattere per cercare"
                        : "Nessuna Corrispondenza"
                    }
                    placeholder={"La conosci? Cerca per artista / titolo"}
                    loadOptions={loadList}
                    value={selectedSong}
                    blurInputOnSelect={true}
                    //input={{ 'aria-labelledby': 'react-select-2-placeholder' }}
                    menuPortalTarget={document.body}
                    /* styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      placeholder: (base) => ({ ...base, color: "#4F4F4F" }),
                      noOptionsMessage: (base) => ({ ...base, color: "red" }),
                      loadingMessage: (base) => ({ ...base, color: "black" }),
                    }} */
                    styles={customStyles}
                    onChange={handleInputChange}
                    maxMenuHeight={200}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-3">
                {openedStep < songConfig.breaks.length - 1 && (
                  <button
                    className="px-2 py-2 uppercase tracking-widest bg-custom-mg border-none flex items-center font-semibold text-sm rounded"
                    type="submit"
                    onClick={onSkipClicked}
                  >
                    Salta
                  </button>
                )}
                {openedStep === songConfig.breaks.length - 1 && (
                  <button
                    className="px-2 py-2 uppercase tracking-widest bg-custom-mg border-none flex items-center font-semibold text-sm rounded"
                    type="submit"
                    onClick={onFinishClicked}
                  >
                    Non la so
                  </button>
                )}
                {openedStep < songConfig.breaks.length && (
                  <button
                    className="px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm rounded bg-custom-positive"
                    type="submit"
                    onClick={onSendClicked}
                  >
                    Conferma
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlayerContainer;
