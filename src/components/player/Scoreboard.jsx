import { useEffect, useState, useRef } from "react";
import { getDB, getUsers, getUserByUid} from "../utils/firebaseRealtime";
import LoadingSpinner from '../LoadingSpinner';
import {icon} from "../game/Constants";
import { buildScore } from "../utils";
import { onValue, ref} from "@firebase/database";

import { useGameData } from "./GameContext";
// evidenziare riga se UID corrisponde a quello dell'utente


function Table() {

  const myUID = localStorage.getItem("uid");

  const [usersTemp, setUsersTemp] = useState([])
  const [userTemp, setUserTemp] = useState([])

  const [pos, setPos] = useState(-1)
  const [loading, setLoading] = useState(false)

  const { dispatch, state: { guessList } } = useGameData();

  let todayScore = buildScore(guessList);

  const [bests, setBests] = useState([]);


  function getUsersRT () {

    console.debug('getUsersRT')

    onValue(ref(getDB(),"users/"), (snapshot) => {
        var users = [];
        let records = [];
        let bests = [];
        snapshot.forEach((u) => {
            let k = u.key;
            let data = u.val();
            users.push({"uid": k, "data": data})
        })

        let res = users.sort((a, b) => b.data.score-a.data.score);
        setUsersTemp(res)

        setPos(res.findIndex((d) => d.uid === myUID))

        let SCORE = 0;
        let LENGTH = 0;
        for(let i = 0; i < 3 && LENGTH < res.length; i++) {
          let SCORE = res[LENGTH].data.score;
          
          let allU = users.filter((a) => a.data.score == SCORE);
          
          LENGTH = LENGTH + allU.length;
          bests.push({"key": i, "value": allU})
        }

        bests.map((value, i) => {
          value.value.forEach((uid) => {
            uid.uid == myUID ? setPos(i) : pos;
          })
        })

        setBests(bests);

    });
    
  }

  
  function getUserRTByUid () {

    console.debug('getUserRTByUid')

    onValue(ref(getDB(),"users/" + myUID), (snapshot) => {
          setUserTemp(snapshot.val())
        });
    
  }

  const findPos = () => {
    console.log(bests)
    
  }


  useEffect(() => {
      
      getUsersRT();
      getUserRTByUid();

  },[])

  
  const ScrollingTableRow = () => { 

    /* 
    console.log("-----------NO RT-----------")
    console.log("USER: ")
    sconsole.log(user)
    console.log("USERS:")
    console.log(users)  */

    console.debug("---------- RT -----------")
    console.debug("USER RT: ")
    console.debug(userTemp)
    console.debug("USERS RT:")
    console.debug(usersTemp)


    console.debug("CLASSIFICA: ")
    let names = [];
    for(let i = 0; i < bests.length; i++) {
      let tmp = "";
      for(let j = 0; j < bests[i].value.length; j++) {
        tmp = bests[i].value.map(item => item.data.name).join(', ');
      }
      names.push(tmp);
      console.debug(names);
  }
 
  
    return (
      <>
      {bests.map((value, i) => {
        return (
          <tr>
            <td className="border border-gray-400 px-4 py-1">{icon[i]}</td>        
            <td className="border border-gray-400 py-1">
              <div className="overflow-x-auto whitespace-nowrap scrolling-cell">
                {       
                <span
                  className={`inline-block ${value.value.length > 1 ? 'animation' : ''}`}
                > 
                  {names[i]}
                </span>
              }
              </div>
            </td>
            <td className="border border-gray-400 px-4 py-1">{value.value[0].data.score}</td>
          </tr>
          )})}
      </>
    );
  };



    return (
      <>
      {loading ? 
        <LoadingSpinner /> :
        <div>
          <table className="center border-collapse border-gray-400 text-center">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-0"></th>
                <th className="border border-gray-400 px-4 py-0">Nome</th>
                <th className="border border-gray-400 px-4 py-0">Punti</th>
              </tr>
            </thead>
            <tbody>
           
            <ScrollingTableRow />
   
              <tr>
                <td></td>
                <td></td>
                <td></td>
                </tr>
                 <tr className="bg-white bg-opacity-10">
                  
                  <td className="border border-gray-400 px-4 py-1">{pos < 3 ? icon[pos] : pos+1+"°"}</td> 
                  {
                  <>
                    <td className="border border-gray-400 px-4 py-1">{userTemp.name}</td>
                    <td className="border border-gray-400 px-4 py-1">{userTemp.score}<a className="text-green-500">+{todayScore}</a></td>
                  </>
                  }
                </tr> 
            </tbody>
          </table>
        </div>
      }
      </>
    );
  }
  
  export default Table;