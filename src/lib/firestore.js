import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  addDoc,          // ✅ ADD
  setDoc,          // ✅ ADD
  serverTimestamp
} from "firebase/firestore";

// Example: get all parents
export async function getAllParents() {
  const snapshot = await getDocs(collection(db, "parents"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Example: get all tutors
export async function getAllTutors() {
  const snapshot = await getDocs(collection(db, "tutors"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Example: update status
export async function updateLeadStatus(col, id, status) {
  const ref = doc(db, col, id);
  await updateDoc(ref, { status });
}

// Example: config
export async function getSiteConfig() {
  const ref = doc(db, "config", "main");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveSiteConfig(data) {
  const ref = doc(db, "config", "main");
  await setDoc(ref, data, { merge: true });
}

// ✅ Add parent lead (from form)
export async function addParentLead(data) {
  await addDoc(collection(db, "parents"), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

// ✅ Add tutor lead (from form)
export async function addTutorLead(data) {
  await addDoc(collection(db, "tutors"), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
}