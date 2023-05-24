import { useEffect, useState } from "react";
import { resetAllScoreOfUsers } from "../utils/firebaseRealtime";

function NextTimerScore() {
  const [serverDate, setServerDate] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      let responseDay = null;
      while(isMounted && responseDay === null) {
        try {
          responseDay = await fetch(
            "https://worldtimeapi.org/api/timezone/Europe/Rome"
          );
        } catch (error) {
          console.error("Errore CORS:", error);
        }
        if (responseDay !== null && responseDay.ok) {
          const dataResponse = await responseDay.json();
          const day = dataResponse.datetime;
          setServerDate(day);

        } else {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
    
  }, []);

  useEffect(() => {
    const today = new Date(serverDate);
    const nextMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + ((7 - today.getDay()) % 7) + 1
    );

    let interval = setInterval(function () {
      console.debug("");
      console.debug("===== SERVER TIMER SCORE ====");

      let timeUntilMonday = nextMonday.getTime() - today.getTime();

      let days = Math.floor(timeUntilMonday / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (timeUntilMonday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor(
        (timeUntilMonday % (1000 * 60 * 60)) / (1000 * 60)
      );
      let seconds = Math.floor((timeUntilMonday % (1000 * 60)) / 1000);

      console.debug(
        today.toLocaleDateString("it-IT") +
          " -> " +
          nextMonday.toLocaleDateString("it-IT") +
          " mancano:"
      );
      console.debug(
        days +
          " giorni " +
          hours +
          " ore " +
          minutes +
          " min " +
          seconds +
          " sec"
      );

      if (timeUntilMonday < 0) {
        clearInterval(interval);
        //setTimeout(async() => {
        console.debug("---- RESET SCORE ----");
        resetAllScoreOfUsers();
        //}, 1500);
      }

      today.setSeconds(today.getSeconds() + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  return <></>;
}

export default NextTimerScore;
