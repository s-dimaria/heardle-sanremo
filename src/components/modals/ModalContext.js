import * as React from 'react'
import { getUserByUid } from '../utils/firebaseRealtime';

const ModalContext = React.createContext();

function modalReducer(state, action) {
    switch (action.type) {
        case 'HowToPlay': {
            return { currentModal: "HowToPlay" }
        }
        case 'Versions': {
            return { currentModal: "Versions" }
        }
        case 'Stats': {
            return { currentModal: "Stats" }
        }
        case 'About': {
            return { currentModal: "About" }
        }
        case 'Hearth': {
            return { currentModal: "Hearth" }
        }
        case 'Reset': {
            return { currentModal: "" }
        }
        default: {
            console.error(`Unhandled action type: ${action.type}`)
            return { currentModal: "" }
        }
    }
}


function ModalContextProvider({ children }) {
    let currentModal = "Reset";

    const [state, dispatch] = React.useReducer(modalReducer, { currentModal: currentModal })
    const [loading, setLoading] = React.useState(true);
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = { state, dispatch }

    React.useEffect(() => {

        const getUser = async () => {

            const uid = localStorage.getItem("uid")
            if(uid)
                getUserByUid(uid).then((val) => {
                    if(val.val() == null) {
                        localStorage.setItem("firstTime", "false");
                        localStorage.removeItem("Game");
                        dispatch({ type: "HowToPlay" });
                    }
                })
            else {
                localStorage.removeItem("Game");
                dispatch({ type: "HowToPlay" });
            }

            if(localStorage.getItem("firstTime") === "true") {
                dispatch({ type: "Reset" });
            }

            setLoading(false);
        };

        getUser();

    },[])

    return ( <> { loading ? <></> : <ModalContext.Provider value={value}>{children}</ModalContext.Provider>}</>)
}

function useModalData() {
    const context = React.useContext(ModalContext)
    if (context === undefined) {
        throw new Error('usModalData must be used within a ModalContextProvider')
    }
    return context
}


export { ModalContextProvider, useModalData }