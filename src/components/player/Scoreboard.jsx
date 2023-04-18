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

      <table className="center border-collapse border-gray-400 text-center">
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
            <td className="border border-gray-400 px-4 py-1">Rhon</td>
            <td className="border border-gray-400 px-4 py-1">123</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-1">🥈</td>
            <td className="border border-gray-400 px-4 py-1">Sexy</td>
            <td className="border border-gray-400 px-4 py-1">123</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-1">🥉</td>
            <td className="border border-gray-400 px-4 py-1">Porco il Papa</td>
            <td className="border border-gray-400 px-4 py-1">123</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
         <tr className="bg-white bg-opacity-10">
            <td className="border border-gray-400 px-4 py-1">45</td>
            <td className="border border-gray-400 px-4 py-1">aa</td>
            <td className="border border-gray-400 px-4 py-1">23<a className="text-green-500">+23</a></td>
          </tr>
        </tbody>
      </table>

    );
  }
  
  export default Table;