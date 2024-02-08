import { getDatabase, ref, set, get, update, remove } from "firebase/database";
import { db } from "./firebase";
import { uid } from "uid";

function getDB() {
  return db;
}

async function setUser(username: string, user: any) {
  var u = uid(16);
  localStorage.setItem("uid", u);
  localStorage.setItem("user", username);

  await set(ref(db, "sanremo/users/" + u), user);

  return u;
}

const getUsers = async () => {
  return await get(ref(db, "sanremo/users/"));
};

const getUserByUid = async (uid: any) => {
  return await get(ref(db, "sanremo/users/" + uid));
};

async function updateUserByUid(uid: any, score: any) {
  await update(ref(db, "sanremo/users/" + uid), {
    score: score,
    timestamp: new Date().getTime(),
  });
}

export {
  getDB,
  setUser,
  getUsers,
  getUserByUid,
  updateUserByUid
};
