import { useEffect, useState } from "react";
import { getUsers, getUserByUid } from "../utils/firebaseRealtime";
import LoadingSpinner from '../LoadingSpinner';
import {icon} from "../game/Constants";
// evidenziare riga se UID corrisponde a quello dell'utente


function Table() {

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
          setPos(res.findIndex((d) => d.uid === myUID))
          setUser(res.find((u) => u.uid === myUID))
          return res;
        }));

        //await getUserByUid(myUID).then((value) => {
        //  setUser(value.val())
        //});
        setLoading(false);
    }

    fetchData();

  },[myUID, user])
  

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
            {users.slice(0,3).map((row, i) => {
              return(
                <tr>
                  <td className="border border-gray-400 px-4 py-1">{icon[i]}</td>
                  <td className="border border-gray-400 px-4 py-1">{row.data.name}</td>
                  <td className="border border-gray-400 px-4 py-1">{row.data.score}</td>
                </tr>
              )
            })}
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="bg-white bg-opacity-10">
                <td className="border border-gray-400 px-4 py-1">{pos+1 <= 3 ? icon[pos] : pos+1}</td> 
                {
                <>
                  <td className="border border-gray-400 px-4 py-1">{user.data.name}</td>
                  <td className="border border-gray-400 px-4 py-1">{user.data.score}<a className="text-green-500">+23</a></td>
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