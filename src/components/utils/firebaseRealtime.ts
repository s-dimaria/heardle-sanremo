import { getDatabase, ref, onValue, set, get, update} from "firebase/database";
import { uid } from "uid";
import './firebase';

const db = getDatabase();

async function setUser (user: string, score: any) {

    var u = uid(16);
    localStorage.setItem("uid", u);
    localStorage.setItem("user", user);
    
    await set(ref(db, "users/" + u), score);
}

async function getUsers() {

    return await get(ref(db,"users/"));

}

async function updateUserByUid(uid: any, score: any) {
    await update(ref(db, "users/" + uid), score);
}

export {setUser, getUsers, updateUserByUid};