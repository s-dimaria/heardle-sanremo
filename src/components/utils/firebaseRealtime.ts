import { getDatabase, ref, onValue, set, get, update} from "firebase/database";
import { uid } from "uid";
import './firebase';

const db = getDatabase();

function getDB() {
    return db;
}

async function setUser(user: string, score: any) {

    var u = uid(16);
    localStorage.setItem("uid", u);
    localStorage.setItem("user", user);
    
    await set(ref(db, "users/" + u), score);

    return u;
}

const getUsers = async () => {

    return await get(ref(db,"users/"));

}

const getUserByUid = async (uid: any) => {

    return await get(ref(db,"users/" + uid));

}

async function updateUserByUid(uid: any, score: any) {
    await update(ref(db, "users/" + uid), score);
}

export {getDB, setUser, getUsers, getUserByUid, updateUserByUid};