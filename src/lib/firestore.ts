// src/lib/firestore.ts
import {
  collection, addDoc, getDocs, doc,
  updateDoc, setDoc, getDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface ParentLead {
  id?: string;
  name: string;
  phone: string;
  area: string;
  class: string;
  subject: string;
  status: LeadStatus;
  createdAt?: { seconds: number };
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
  createdAt?: { seconds: number };
}

export interface SiteConfig {
  offerBanner: string;
  whatsappNumber: string;
  heroSubtext: string;
  address: string;
}

// ─── Parents ──────────────────────────────────────────────────────────────────

export async function registerParent(data: Omit<ParentLead, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(db, 'parents'), {
    ...data,
    status: 'new' as LeadStatus,
    createdAt: serverTimestamp(),
  });
}

export async function getAllParents(): Promise<ParentLead[]> {
  const snap = await getDocs(query(collection(db, 'parents'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ParentLead));
}

// ─── Tutors ───────────────────────────────────────────────────────────────────

export async function registerTutor(data: Omit<TutorLead, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(db, 'tutors'), {
    ...data,
    status: 'new' as LeadStatus,
    createdAt: serverTimestamp(),
  });
}

export async function getAllTutors(): Promise<TutorLead[]> {
  const snap = await getDocs(query(collection(db, 'tutors'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TutorLead));
}

// ─── Status Update ────────────────────────────────────────────────────────────

export async function updateLeadStatus(
  collectionName: 'parents' | 'tutors',
  id: string,
  status: LeadStatus
) {
  return updateDoc(doc(db, collectionName, id), { status });
}

// ─── Site Config ──────────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const snap = await getDoc(doc(db, 'config', 'site'));
  return snap.exists() ? (snap.data() as SiteConfig) : null;
}

export async function saveSiteConfig(config: SiteConfig) {
  return setDoc(doc(db, 'config', 'site'), {
    ...config,
    updatedAt: serverTimestamp(),
  });
}
