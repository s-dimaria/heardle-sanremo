import { useEffect, useState } from "react";
import { getUsers, getUserByUid } from "../utils/firebaseRealtime";
import LoadingSpinner from '../LoadingSpinner';
import {icon} from "../game/Constants";
import { buildScore } from "../utils";
// evidenziare riga se UID corrisponde a quello dell'utente


function GlobalTable() {

  const myUID = localStorage.getItem("uid");
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [pos, setPos] = useState(-1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

      setLoading(true)

      async function fetchData() {

        setUsers(await getUsers().then((value) => {
          let records = [];
          value.forEach((key) => {
              let k = key.key;
              let data = key.val();
              records.push({"uid": k, "data": data})
          });

          // UNICO PROBLEMA CHE NON CARICA CORRETTAMENTE USER E INDEX 
          let res = records.sort((a, b) => b.data.score-a.data.score);
          return res;
        }));

        //await getUserByUid(myUID).then((value) => {
        //  setUser(value.val())
        //});
        setLoading(false);
    }

    fetchData();

  },[])
  

    return (
      <>
      {loading ? 
        <LoadingSpinner /> :
        <div>
          <table className="center border-collapse border-gray-400 text-center w-full max-h-20 y-overflow">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-0">Pos</th>
                <th className="border border-gray-400 px-4 py-0">Nome</th>
                <th className="border border-gray-400 px-4 py-0">Punti</th>
              </tr>
            </thead>
            <tbody className="overflow-y-scroll h-10">
            {users.map((row, i) => {
              return(
                <tr>
                  <td className="border border-gray-400 px-4 py-1">{i< 3 ? icon[i] : i+1+"°"}</td>
                  <td className="border border-gray-400 px-4 py-1">{row.data.name}</td>
                  <td className="border border-gray-400 px-4 py-1">{row.data.score}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      }
      </>
    );
  }
  
  export default GlobalTable;