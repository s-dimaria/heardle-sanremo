import { useModalData } from "./modals/ModalContext";
import { useState, useEffect } from "react";

function Header() {

    const { dispatch } = useModalData();
    const [uid, setUid] = useState("");

    useEffect(() => {
        
        setUid(localStorage.getItem("uid"));
        
        return () => {
            setUid("");
        }
        
      });

    const openAbout = () => {
        dispatch({ type: 'About' })
    }

    const openHearth = () => {
        dispatch({ type: 'Hearth' })
    }

    const openStats = () => {
        dispatch({ type: 'Stats' })
    }

    const openHowToPlay = () => {
        dispatch({ type: 'HowToPlay' })
    }

    const openVersion = () => {
        dispatch({ type: 'Versions' })
    }

    return (
        <div className="flex-none">
            <header className="border-b border-gray-500" role="banner">
                <div className="max-w-screen-md mx-auto ">
                    <div className="flex justify-evenly text-custom-fgcolor p-3 items-center">
                        <div className="flex flex-1">
                            <button className="px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm"
                                onClick={openAbout} type="button" aria-label="Informazioni" title="Informazioni">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                            </button>
            
                            <button
                                className="px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm"
                                onClick={openHearth} type="button" aria-label="Informazioni" title="Informazioni">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold flex-grow text-center flex-1 cursor-pointer text-white relative" alt="Heardle Italia Indie">
                                Heardle Italia
                                <span className="absolute rotate-45 text-red-500 text-sm -right-10 top-1.5">
                                    <div className="col">
                                        <div className="row">
                                            <span className="shadow-text">Sanremo</span>
                                        </div>
                                        <div className="row">
                                            <span className="shadow-text">74ª</span>
                                        </div>
                                    </div>
                                </span>
                            </h1>

                        </div>
                        <div className="flex flex-1 justify-end">
                            <button className="px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm"
                                onClick={openStats}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20v-6M6 20V10M18 20V4"></path>
                                </svg>
                            </button>
                            {uid? 
                            <button
                                className="px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm"
                                onClick={openVersion} type="button" aria-label="Nuove Modalità" title="Nuove modalità">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                                    <animate attributeName="opacity" from="1" to="0.5" dur="1s" repeatCount="indefinite" />
                                </svg>
                            </button>:
                            <button
                                className="px-2 py-2 uppercase tracking-widest border-none flex items-center font-semibold text-sm"
                                onClick={openHowToPlay} type="button" aria-label="Come giocare" title="Come giocare">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </button>}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;