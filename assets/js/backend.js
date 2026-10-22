// Firebase backend: accounts (Auth) and saved bookings, consultations, messages and vendor applications (Firestore).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, signOut, updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, updateDoc, query, where, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// resolves once Firebase knows whether someone is signed in
export const ready = new Promise((resolve) => {
  const off = onAuthStateChanged(auth, (u) => { off(); resolve(u); });
});

let adminCache = null;
export const isAdmin = async (u) => {
  if (!u) return false;
  if (adminCache === null) {
    try { adminCache = (await getDoc(doc(db, "admins", u.uid))).exists(); } catch (e) { adminCache = false; }
  }
  return adminCache;
};

// keep the header (rendered by main.js from localStorage) in step with the real sign-in state
onAuthStateChanged(auth, async (u) => {
  const user = u ? { name: u.displayName || u.email.split("@")[0], email: u.email, admin: await isAdmin(u) } : null;
  try { user ? localStorage.setItem("ayojok-user", JSON.stringify(user)) : localStorage.removeItem("ayojok-user"); } catch (e) {}
  window.setHeaderUser?.(user);
});
window.ayojokSignOut = () => signOut(auth);

// send visitors to log in first, then bring them back here
export const requireUser = async () => {
  const u = await ready;
  if (!u) {
    location.href = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search);
    throw new Error("not signed in");
  }
  return u;
};

export const signUp = async (email, password, profile) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: profile.first || email.split("@")[0] });
  await setDoc(doc(db, "users", user.uid), { ...profile, email, created: serverTimestamp() });
  return user;
};
export const logIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// save a document; signed-in users are tagged with their uid so they can see it later
export const save = async (name, data) => {
  const u = auth.currentUser;
  return addDoc(collection(db, name), {
    ...data, ...(u ? { uid: u.uid, userEmail: u.email } : {}), status: "pending", created: serverTimestamp(),
  });
};

const newestFirst = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  .sort((a, b) => (b.created?.seconds || 0) - (a.created?.seconds || 0));
export const mine = async (name) => newestFirst(await getDocs(query(collection(db, name), where("uid", "==", auth.currentUser.uid))));
export const all = async (name) => newestFirst(await getDocs(collection(db, name)));
export const setStatus = (name, id, status) => updateDoc(doc(db, name, id), { status });
export const profile = async () => (await getDoc(doc(db, "users", auth.currentUser.uid))).data() || {};

// readable messages for common Firebase errors
export const errorText = (e) => ({
  "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a minute and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
}[e.code] || "Something went wrong. Please try again.");
