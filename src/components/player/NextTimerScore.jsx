import { useEffect, useState } from "react";
import { resetAllScoreOfUsers } from "../utils/firebaseRealtime";

function NextTimerScore() {
  const [serverDate, setServerDate] = useState("");

  useEffect(() => {
    fetch("https://worldtimeapi.org/api/timezone/Europe/Rome").then(
      (response) => {
        response.json().then((data) => {
          setServerDate(data.datetime);
        });
      }
    );
  }, []);

  useEffect(() => {
    const today = new Date(serverDate);
    const nextMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + ((7 - today.getDay()) % 7)
    );

    let interval = setInterval(function() {
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
        setTimeout(() => {
           console.debug("---- RESET SCORE ----")
           resetAllScoreOfUsers();
        }, 1500);
      } 
      
      today.setSeconds(today.getSeconds() + 1);
      
    } , 1000);

    return () => clearInterval(interval);
  });

  return <></>;
}

export default NextTimerScore;
