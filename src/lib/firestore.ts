import { db } from "./firebase";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  setDoc,
  serverTimestamp,
  DocumentData
} from "firebase/firestore";

// ✅ Types
export type LeadStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface ParentLead {
  id?: string;
  name: string;
  phone: string;
  area: string;
  class: string;
  subject: string;
  status: LeadStatus;
  createdAt?: any;
}

export interface TutorLead {
  id?: string;
  name: string;
  phone: string;
  area: string;
  qualification: string;
  subjects: string;
  classes: string;
  status: LeadStatus;
  createdAt?: any;
}

export interface SiteConfig {
  offerBanner: string;
  whatsappNumber: string;
  heroSubtext: string;
  address: string;
}

// ✅ Get all parents
export async function getAllParents(): Promise<ParentLead[]> {
  const snapshot = await getDocs(collection(db, "parents"));
  return snapshot.docs.map(d => ({
    id: d.id,
    ...(d.data() as ParentLead)
  }));
}

// ✅ Get all tutors
export async function getAllTutors(): Promise<TutorLead[]> {
  const snapshot = await getDocs(collection(db, "tutors"));
  return snapshot.docs.map(d => ({
    id: d.id,
    ...(d.data() as TutorLead)
  }));
}

// ✅ Update status
export async function updateLeadStatus(
  col: "parents" | "tutors",
  id: string,
  status: LeadStatus
): Promise<void> {
  const ref = doc(db, col, id);
  await updateDoc(ref, { status });
}

// ✅ Get config
export async function getSiteConfig(): Promise<SiteConfig | null> {
  const ref = doc(db, "config", "main");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as SiteConfig) : null;
}

// ✅ Save config
export async function saveSiteConfig(data: SiteConfig): Promise<void> {
  const ref = doc(db, "config", "main");
  await setDoc(ref, data, { merge: true });
}

// ✅ Add parent lead
export async function addParentLead(
  data: Omit<ParentLead, "status" | "createdAt" | "id">
): Promise<void> {
  await addDoc(collection(db, "parents"), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

// ✅ Add tutor lead
export async function addTutorLead(
  data: Omit<TutorLead, "status" | "createdAt" | "id">
): Promise<void> {
  await addDoc(collection(db, "tutors"), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
}