import { useModalData } from "./ModalContext";
import { useState } from "react";
import { setUser } from "../utils/firebaseRealtime";


function HowToPlay() {

    const { dispatch, state: { currentModal } } = useModalData();
    const [username, setUsername] = useState("");
    const [isValid, setIsValid] = useState(false);

    const onStart = async () => {
        dispatch({ type: 'Reset' })
        localStorage.setItem("played", 'true')
        setUsername(username.replaceAll(" ",""))
        const infoUser = {
            name: username,
            score : 0
        };
        await setUser(username, infoUser);

    }

    if (currentModal !== "HowToPlay") {
        return <></>
    }

    const onChanged = (event) => {
        const name = event.target.value;

        const regex = /^(?!\s*$)[a-zA-Z0-9\s!?\-_$@&]{0,24}$/;
        if (regex.test(name) || name === '') {
            setUsername(name.slice(0, 24));
        }

        if(name.length >= 3)
            setIsValid(true)
        else
            setIsValid(false)
    }

    return (
            <div className="user-select-none modal-background p-3">
                <div className="pointer-events-auto modal max-w-screen-xs w-full mx-auto top-20 relative rounded-sm" role="dialog" aria-modal="true">
                    <div className="bg-custom-bg border border-custom-mg p-6 rounded">
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex-1 pl-7">
                                <h2 className="text-sm text-center uppercase text-custom-line font-semibold tracking-widest">Come giocare</h2>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="mr-4 w-8 text-custom-line">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                                        <circle cx="5.5" cy="17.5" r="2.5"></circle>
                                        <circle cx="17.5" cy="15.5" r="2.5"></circle>
                                        <path d="M8 17V5l12-2v12"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p>
                                        Indovina la canzone ascoltando solo una piccola parte.
                                    </p>
                                </div>
                            </div>
                            {/* <div className="flex items-center mb-6">
                                <div className="mr-4 w-8 text-custom-line">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="4 7 4 4 20 4 20 7"></polyline>
                                        <line x1="9" y1="20" x2="15" y2="20"></line>
                                        <line x1="12" y1="4" x2="12" y2="20"></line>
                                    </svg>
                                </div>
                                <div>
                                    <p>
                                        Dopo aver digitato le canzone nella casella di ricerca e aver scelto uno dei risultati, premi il pulsante di invio.
                                    </p>
                                </div>
                            </div> */}
                            <div className="flex items-center mb-6">
                                <div className="mr-4 w-8 text-custom-line">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p>I tentativi sbagliati o saltati sbloccano la parte successiva del brano.</p>
                                </div>
                            </div>
                            <div className="flex items-center mb-6">
                                <div className="mr-4 w-8 text-custom-line">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-7">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                    </svg>
                                </div> 
                                <div>
                                    <p>Indovina correttamente nel minor numero di tentativi possibili e condividi il tuo punteggio.</p>
                                </div>
                            </div>
                            <div className="text-center">
                            <p>Inserisci il tuo Nome e scala la calssifica!</p>
                            </div>
                            <div className="justify-center flex py-2 mt-2">
                                    <input className="username text-center" type="text" name="username" placeholder="Nickname" value = {username} onChange={(event) => {onChanged(event)}}/>
                                <button className={ !isValid ? "px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm bg-custom-positive opacity-50"
                                : "px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm bg-custom-positive" }
                                    type="button" aria-label="inizia" title="Inzia"
                                    onClick={() => onStart()}
                                     disabled = {!isValid}> 
                                    Inizia
                                </button>
                            </div>
                        </div>
                        <p className="text-xs mt-3 text-center text-custom-line">
                            Il nome non è modificabile <i>per ora</i>, quindi sceglilo bene! 
                            {/* <a href="https://policies.google.com/technologies/partner-sites" target="_blank"> Google</a>, <a href="https://developer.spotify.com/policy/" target="_blank"> Spotify</a> e
                            <a href="https://soundcloud.com/pages/privacy" target="_blank"> Soundcloud</a> */}
                        </p>
                    </div>
                </div>
            </div>
    );
}

export default HowToPlay;