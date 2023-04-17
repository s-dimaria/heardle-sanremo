import { useEffect, useState } from "react";
import { getUsers } from "../utils/firebaseRealtime";



// evidenziare riga se UID corrisponde a quello dell'utente
const myUID = localStorage.getItem("uid");
// ordinare per punteggio
function findElementInArray(array, uid) {
    return array.indexOf(uid); // prendi lo score
  }



const orderClassifier = () => {

    var map = new Map()
    getUsers().then((value) => {

        value.forEach((key) => {
            map.set(key.key, key.val())
        //console.log(key.key)
        //console.log(key.val().name);
        //console.log(key.val().score);
    })});
    
    console.log(map)

}

function Table() {

    useEffect(() => {
        orderClassifier();
    },[])

    return (
    <div>
      <table className="center border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-0"></th>
            <th className="border border-gray-400 px-4 py-0">Nome</th>
            <th className="border border-gray-400 px-4 py-0">Punti</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-1">🥇</td>
            <td className="border border-gray-400 px-4 py-1">Row 1, Column 2</td>
            <td className="border border-gray-400 px-4 py-1">123</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-1">🥈</td>
            <td className="border border-gray-400 px-4 py-1">Row 2, Column 2</td>
            <td className="border border-gray-400 px-4 py-1">123</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-1">🥉</td>
            <td className="border border-gray-400 px-4 py-1">Row 3, Column 2</td>
            <td className="border border-gray-400 px-4 py-1">123</td>
          </tr>
        </tbody>
      </table>

      
      <p className="text-center">Ti trovi in X posizione!</p>
    </div>

    );
  }
  
  export default Table;