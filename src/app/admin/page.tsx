'use client';
// src/app/admin/page.tsx
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase';
import {
  getAllParents, getAllTutors, updateLeadStatus,
  getSiteConfig, saveSiteConfig,
  getAllFees, addFeeRecord, updateFeeRecord, deleteFeeRecord,
  getAllClasses, addClassRecord, updateClassRecord, deleteClassRecord,
  ParentLead, TutorLead, LeadStatus, SiteConfig,
  FeeRecord, ClassRecord, ClassStatus,
} from '@/lib/firestore';
import styles from './admin.module.css';

type AdminPage = 'dashboard' | 'parents' | 'tutors' | 'fees' | 'classes' | 'config';

const PAGE_TITLES: Record<AdminPage, string> = {
  dashboard: 'Dashboard',
  parents:   'Parent Registrations',
  tutors:    'Tutor Registrations',
  fees:      'Fees Management',
  classes:   'Class Assignments',
  config:    'Site Configuration',
};

const NAV_ITEMS: { key: AdminPage; icon: string }[] = [
  { key: 'dashboard', icon: '🏠' },
  { key: 'parents',   icon: '👨‍👩‍👧' },
  { key: 'tutors',    icon: '👩‍🏫' },
  { key: 'fees',      icon: '💰' },
  { key: 'classes',   icon: '📅' },
  { key: 'config',    icon: '⚙️' },
];

const LEAD_STATUSES: (LeadStatus | 'all')[] = ['all', 'new', 'contacted', 'converted', 'closed'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (item: { createdAt?: { seconds: number } }) =>
  item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-IN') : '—';

const currency = (n: number) =>
  '₹' + n.toLocaleString('en-IN');

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return <span className={`${styles.badge} ${styles['badge_' + status]}`}>{status}</span>;
}

function StatCard({ icon, num, label, sub, color }: { icon: string; num: string | number; label: string; sub: string; color: string }) {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statNum}>{num}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSub}>{sub}</div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signInWithEmailAndPassword(getAuthInstance(), email, password);
    } catch {
      setError('Invalid email or password.');
    }
    setLoading(false);
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>🔐</div>
        <h2>Admin Login</h2>
        <p>Jilani Home Tutor · Admin Panel</p>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input type="email" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
          {error && <p className={styles.loginErr}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

// ─── Fees Modal ───────────────────────────────────────────────────────────────

const EMPTY_FEE: Omit<FeeRecord, 'id' | 'createdAt'> = {
  tutorName: '', parentName: '', subject: '', classLevel: '',
  parentFee: 0, tutorFee: 0, profit: 0,
  month: '', paymentStatus: 'pending', notes: '',
};

function FeeModal({ initial, onSave, onClose }: {
  initial?: FeeRecord;
  onSave: (data: Omit<FeeRecord, 'id' | 'createdAt'>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<FeeRecord, 'id' | 'createdAt'>>(
    initial ? { ...initial } : { ...EMPTY_FEE }
  );
  const [saving, setSaving] = useState(false);
  const profit = form.parentFee - form.tutorFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, profit });
    setSaving(false);
    onClose();
  }

  const f = (field: keyof typeof form, val: string | number) =>
    setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{initial ? 'Edit Fee Record' : 'Add Fee Record'}</h3>
          <button onClick={onClose} className={styles.modalClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tutor Name *</label>
              <input value={form.tutorName} onChange={e => f('tutorName', e.target.value)} placeholder="Tutor name" required />
            </div>
            <div className={styles.formGroup}>
              <label>Parent Name *</label>
              <input value={form.parentName} onChange={e => f('parentName', e.target.value)} placeholder="Parent name" required />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Subject *</label>
              <input value={form.subject} onChange={e => f('subject', e.target.value)} placeholder="e.g. Maths, Science" required />
            </div>
            <div className={styles.formGroup}>
              <label>Class Level *</label>
              <select value={form.classLevel} onChange={e => f('classLevel', e.target.value)} required>
                <option value="">Select</option>
                {['Class 1–5','Class 6–8','Class 9–10','Class 11–12','Competitive Exam'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Month *</label>
              <input value={form.month} onChange={e => f('month', e.target.value)} placeholder="e.g. April 2025" required />
            </div>
            <div className={styles.formGroup}>
              <label>Payment Status</label>
              <select value={form.paymentStatus} onChange={e => f('paymentStatus', e.target.value as FeeRecord['paymentStatus'])}>
                <option value="pending">Pending</option>
                <option value="received">Received from Parent</option>
                <option value="paid">Paid to Tutor</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Parent Pays You (₹/month) *</label>
              <input type="number" min="0" value={form.parentFee || ''} onChange={e => f('parentFee', Number(e.target.value))} placeholder="e.g. 3000" required />
            </div>
            <div className={styles.formGroup}>
              <label>You Pay Tutor (₹/month) *</label>
              <input type="number" min="0" value={form.tutorFee || ''} onChange={e => f('tutorFee', Number(e.target.value))} placeholder="e.g. 2000" required />
            </div>
          </div>

          {/* Live profit display */}
          <div className={`${styles.profitBox} ${profit >= 0 ? styles.profitPos : styles.profitNeg}`}>
            <span>Your Profit this month:</span>
            <strong>{currency(profit)}</strong>
          </div>

          <div className={styles.formGroup} style={{ gridColumn: '1/-1' }}>
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => f('notes', e.target.value)} placeholder="Any additional notes…" rows={2} />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Saving…' : initial ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Class Modal ──────────────────────────────────────────────────────────────

const EMPTY_CLASS: Omit<ClassRecord, 'id' | 'createdAt'> = {
  tutorName: '', tutorPhone: '', parentName: '', parentPhone: '',
  subject: '', classLevel: '', classesPerWeek: 3,
  startDate: '', status: 'active', area: '', notes: '',
};

function ClassModal({ initial, onSave, onClose }: {
  initial?: ClassRecord;
  onSave: (data: Omit<ClassRecord, 'id' | 'createdAt'>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<ClassRecord, 'id' | 'createdAt'>>(
    initial ? { ...initial } : { ...EMPTY_CLASS }
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  const f = (field: keyof typeof form, val: string | number) =>
    setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{initial ? 'Edit Class Assignment' : 'Add Class Assignment'}</h3>
          <button onClick={onClose} className={styles.modalClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tutor Name *</label>
              <input value={form.tutorName} onChange={e => f('tutorName', e.target.value)} placeholder="Tutor name" required />
            </div>
            <div className={styles.formGroup}>
              <label>Tutor Phone</label>
              <input value={form.tutorPhone} onChange={e => f('tutorPhone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Parent Name *</label>
              <input value={form.parentName} onChange={e => f('parentName', e.target.value)} placeholder="Parent name" required />
            </div>
            <div className={styles.formGroup}>
              <label>Parent Phone</label>
              <input value={form.parentPhone} onChange={e => f('parentPhone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Subject *</label>
              <input value={form.subject} onChange={e => f('subject', e.target.value)} placeholder="e.g. Maths, Science" required />
            </div>
            <div className={styles.formGroup}>
              <label>Class Level *</label>
              <select value={form.classLevel} onChange={e => f('classLevel', e.target.value)} required>
                <option value="">Select</option>
                {['Class 1–5','Class 6–8','Class 9–10','Class 11–12','Competitive Exam','Summer Class','Drawing','Music','Dance'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Classes Per Week *</label>
              <select value={form.classesPerWeek} onChange={e => f('classesPerWeek', Number(e.target.value))}>
                {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} day{n > 1 ? 's' : ''}/week</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Start Date *</label>
              <input type="date" value={form.startDate} onChange={e => f('startDate', e.target.value)} required />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Area</label>
              <input value={form.area} onChange={e => f('area', e.target.value)} placeholder="e.g. Shankar Nagar" />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select value={form.status} onChange={e => f('status', e.target.value as ClassStatus)}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => f('notes', e.target.value)} placeholder="Any additional notes…" rows={2} />
          </div>
          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Saving…' : initial ? 'Update Assignment' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin App ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [user, setUser]           = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage]           = useState<AdminPage>('dashboard');

  // Data
  const [parents, setParents]     = useState<ParentLead[]>([]);
  const [tutors, setTutors]       = useState<TutorLead[]>([]);
  const [fees, setFees]           = useState<FeeRecord[]>([]);
  const [classes, setClasses]     = useState<ClassRecord[]>([]);
  const [config, setConfig]       = useState<SiteConfig>({ offerBanner: '', whatsappNumber: '', heroSubtext: '', address: '' });

  // UI state
  const [pSearch, setPSearch]     = useState('');
  const [pFilter, setPFilter]     = useState<LeadStatus | 'all'>('all');
  const [tSearch, setTSearch]     = useState('');
  const [tFilter, setTFilter]     = useState<LeadStatus | 'all'>('all');
  const [fSearch, setFSearch]     = useState('');
  const [cSearch, setCSearch]     = useState('');
  const [cFilter, setCFilter]     = useState<ClassStatus | 'all'>('all');
  const [cfgSaving, setCfgSaving] = useState(false);
  const [cfgSaved, setCfgSaved]   = useState(false);

  // Modals
  const [feeModal, setFeeModal]   = useState<{ open: boolean; record?: FeeRecord }>({ open: false });
  const [clsModal, setClsModal]   = useState<{ open: boolean; record?: ClassRecord }>({ open: false });

  // Auth
  useEffect(() => onAuthStateChanged(getAuthInstance(), u => { setUser(u); setAuthLoading(false); }), []);

  const loadAll = useCallback(async () => {
    const [p, t, f, c, cfg] = await Promise.all([
      getAllParents(), getAllTutors(), getAllFees(), getAllClasses(), getSiteConfig(),
    ]);
    setParents(p); setTutors(t); setFees(f); setClasses(c);
    if (cfg) setConfig(cfg);
  }, []);

  useEffect(() => { if (user) loadAll(); }, [user, loadAll]);

  // ── Filtered lists ──
  const filteredParents = parents
    .filter(p => pFilter === 'all' || p.status === pFilter)
    .filter(p => !pSearch || [p.name, p.phone, p.area].some(v => v.toLowerCase().includes(pSearch.toLowerCase())));

  const filteredTutors = tutors
    .filter(t => tFilter === 'all' || t.status === tFilter)
    .filter(t => !tSearch || [t.name, t.phone, t.area].some(v => v.toLowerCase().includes(tSearch.toLowerCase())));

  const filteredFees = fees
    .filter(f => !fSearch || [f.tutorName, f.parentName, f.subject, f.month].some(v => v.toLowerCase().includes(fSearch.toLowerCase())));

  const filteredClasses = classes
    .filter(c => cFilter === 'all' || c.status === cFilter)
    .filter(c => !cSearch || [c.tutorName, c.parentName, c.subject, c.area].some(v => v.toLowerCase().includes(cSearch.toLowerCase())));

  // ── Fee summary ──
  const totalFromParents = fees.filter(f => f.paymentStatus !== 'pending').reduce((s, f) => s + f.parentFee, 0);
  const totalToTutors    = fees.filter(f => f.paymentStatus !== 'pending').reduce((s, f) => s + f.tutorFee, 0);
  const totalPaidToTutors = fees.filter(f => f.paymentStatus === 'paid').reduce((s, f) => s + f.tutorFee, 0);
  const totalProfit      = totalFromParents - totalToTutors;

  // ── Class summary ──
  const activeClasses    = classes.filter(c => c.status === 'active').length;

  // ── Handlers ──
  async function handleStatusChange(col: 'parents' | 'tutors', id: string, status: LeadStatus) {
    await updateLeadStatus(col, id, status);
    if (col === 'parents') setParents(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    else setTutors(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  async function handleSaveFee(data: Omit<FeeRecord, 'id' | 'createdAt'>) {
    if (feeModal.record?.id) {
      await updateFeeRecord(feeModal.record.id, data);
      setFees(prev => prev.map(f => f.id === feeModal.record!.id ? { ...f, ...data } : f));
    } else {
      const ref = await addFeeRecord(data);
      setFees(prev => [{ id: ref.id, ...data, createdAt: { seconds: Date.now() / 1000 } }, ...prev]);
    }
  }

  async function handleDeleteFee(id: string) {
    if (!confirm('Delete this fee record?')) return;
    await deleteFeeRecord(id);
    setFees(prev => prev.filter(f => f.id !== id));
  }

  async function handleSaveClass(data: Omit<ClassRecord, 'id' | 'createdAt'>) {
    if (clsModal.record?.id) {
      await updateClassRecord(clsModal.record.id, data);
      setClasses(prev => prev.map(c => c.id === clsModal.record!.id ? { ...c, ...data } : c));
    } else {
      const ref = await addClassRecord(data);
      setClasses(prev => [{ id: ref.id, ...data, createdAt: { seconds: Date.now() / 1000 } }, ...prev]);
    }
  }

  async function handleDeleteClass(id: string) {
    if (!confirm('Delete this class assignment?')) return;
    await deleteClassRecord(id);
    setClasses(prev => prev.filter(c => c.id !== id));
  }

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    setCfgSaving(true);
    await saveSiteConfig(config);
    setCfgSaved(true); setCfgSaving(false);
    setTimeout(() => setCfgSaved(false), 3000);
  }

  async function handleClassStatusChange(id: string, status: ClassStatus) {
    await updateClassRecord(id, { status });
    setClasses(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  }

  // ── Counts ──
  const convertedCount = [...parents, ...tutors].filter(x => x.status === 'converted').length;
  const newParents     = parents.filter(p => p.status === 'new').length;
  const newTutors      = tutors.filter(t => t.status === 'new').length;
  const recentActivity = [...parents.map(p => ({ ...p, type: 'Parent' })), ...tutors.map(t => ({ ...t, type: 'Tutor' }))]
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)).slice(0, 10);

  if (authLoading) return <div className={styles.loadingScreen}>⏳ Loading…</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className={styles.app}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoText}>📚 Jilani Tutor</div>
          <div className={styles.sidebarLogoSub}>Admin Dashboard</div>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ key, icon }) => (
            <button
              key={key}
              className={`${styles.navItem} ${page === key ? styles.navActive : ''}`}
              onClick={() => setPage(key)}
            >
              <span className={styles.navIcon}>{icon}</span>
              {PAGE_TITLES[key]}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminEmail}>{user.email}</div>
          <button onClick={() => signOut(getAuthInstance())} className={styles.logoutBtn}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.main}>
        <div className={styles.topbar}>
          <h1>{PAGE_TITLES[page]}</h1>
          <button onClick={loadAll} className={styles.refreshBtn}>🔄 Refresh</button>
        </div>

        <div className={styles.content}>

          {/* ══ DASHBOARD ══ */}
          {page === 'dashboard' && (
            <>
              <div className={styles.statsRow}>
                <StatCard icon="👨‍👩‍👧" num={parents.length} label="Total Parents"  sub={`${newParents} new`}       color="blue"  />
                <StatCard icon="👩‍🏫" num={tutors.length}   label="Total Tutors"   sub={`${newTutors} new`}        color="gold"  />
                <StatCard icon="📅"   num={activeClasses}   label="Active Classes" sub={`${classes.length} total`} color="green" />
                <StatCard icon="💰"   num={currency(totalProfit)} label="Total Profit" sub="all time"             color="red"   />
              </div>

              {/* Finance summary strip */}
              <div className={styles.financeStrip}>
                <div className={styles.finItem}>
                  <span>💳 Received from Parents</span>
                  <strong className={styles.finPos}>{currency(totalFromParents)}</strong>
                </div>
                <div className={styles.finDivider} />
                <div className={styles.finItem}>
                  <span>📤 Tutor Fee (Due)</span>
                  <strong className={styles.finNeg}>{currency(totalToTutors)}</strong>
                  <small style={{color:'#aaa',fontSize:11}}>Actually paid: {currency(totalPaidToTutors)}</small>
                </div>
                <div className={styles.finDivider} />
                <div className={styles.finItem}>
                  <span>🏦 Net Profit</span>
                  <strong className={styles.finPos}>{currency(totalProfit)}</strong>
                </div>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableHeader}><h3>📋 Recent Registrations</h3></div>
                <div className={styles.activityList}>
                  {recentActivity.length === 0 && <p className={styles.empty}>No registrations yet.</p>}
                  {recentActivity.map((r, i) => (
                    <div key={i} className={styles.activityRow}>
                      <span className={`${styles.badge} ${styles['badge_' + ('type' in r && r.type === 'Parent' ? 'parent' : 'tutor')]}`}>
                        {'type' in r ? r.type : ''}
                      </span>
                      <span className={styles.actName}>{r.name}</span>
                      <span className={styles.actPhone}>{r.phone}</span>
                      <span className={styles.actArea}>{r.area}</span>
                      <StatusBadge status={r.status} />
                      <span className={styles.actDate}>{fmt(r)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══ PARENTS ══ */}
          {page === 'parents' && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3>👨‍👩‍👧 Parent Registrations</h3>
                <input className={styles.searchInput} placeholder="🔍 Search name, phone, area…" value={pSearch} onChange={e => setPSearch(e.target.value)} />
              </div>
              <div className={styles.filterRow}>
                {LEAD_STATUSES.map(s => (
                  <button key={s} className={`${styles.filterBtn} ${pFilter === s ? styles.filterActive : ''}`} onClick={() => setPFilter(s)}>
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className={styles.tableOverflow}>
                <table>
                  <thead><tr><th>Name</th><th>Phone</th><th>Area</th><th>Class</th><th>Subject</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
                  <tbody>
                    {filteredParents.length === 0 && <tr><td colSpan={8} className={styles.empty}>No records found.</td></tr>}
                    {filteredParents.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td><a href={`tel:${p.phone}`} className={styles.phoneLink}>{p.phone}</a></td>
                        <td>{p.area}</td><td>{p.class}</td><td>{p.subject}</td>
                        <td>{fmt(p)}</td>
                        <td><StatusBadge status={p.status} /></td>
                        <td>
                          <select className={styles.statusSel} value={p.status} onChange={e => handleStatusChange('parents', p.id!, e.target.value as LeadStatus)}>
                            {(['new','contacted','converted','closed'] as LeadStatus[]).map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ TUTORS ══ */}
          {page === 'tutors' && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3>👩‍🏫 Tutor Registrations</h3>
                <input className={styles.searchInput} placeholder="🔍 Search name, phone, area…" value={tSearch} onChange={e => setTSearch(e.target.value)} />
              </div>
              <div className={styles.filterRow}>
                {LEAD_STATUSES.map(s => (
                  <button key={s} className={`${styles.filterBtn} ${tFilter === s ? styles.filterActive : ''}`} onClick={() => setTFilter(s)}>
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className={styles.tableOverflow}>
                <table>
                  <thead><tr><th>Name</th><th>Gender</th><th>Phone</th><th>Area</th><th>Qualification</th><th>Subjects</th><th>Classes</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
                  <tbody>
                    {filteredTutors.length === 0 && <tr><td colSpan={10} className={styles.empty}>No records found.</td></tr>}
                    {filteredTutors.map(t => (
                      <tr key={t.id}>
                        <td><strong>{t.name}</strong></td>
                        <td>{t.gender || '—'}</td>
                        <td><a href={`tel:${t.phone}`} className={styles.phoneLink}>{t.phone}</a></td>
                        <td>{t.area}</td><td>{t.qualification}</td>
                        <td>{t.subjects}</td><td>{t.classes}</td>
                        <td>{fmt(t)}</td>
                        <td><StatusBadge status={t.status} /></td>
                        <td>
                          <select className={styles.statusSel} value={t.status} onChange={e => handleStatusChange('tutors', t.id!, e.target.value as LeadStatus)}>
                            {(['new','contacted','converted','closed'] as LeadStatus[]).map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ FEES ══ */}
          {page === 'fees' && (
            <>
              {/* Summary cards */}
              <div className={styles.statsRow}>
                <StatCard icon="💳" num={currency(totalFromParents)} label="Received from Parents" sub="confirmed payments" color="green" />
                <StatCard icon="📤" num={currency(totalPaidToTutors)} label="Actually Paid to Tutors" sub="status = paid" color="gold"  />
                <StatCard icon="🏦" num={currency(totalProfit)}      label="Net Profit"             sub="all records"        color="blue"  />
                <StatCard icon="📋" num={fees.length}                label="Fee Records"            sub="total entries"      color="red"   />
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h3>💰 Fee Management</h3>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className={styles.searchInput} placeholder="🔍 Search tutor, parent…" value={fSearch} onChange={e => setFSearch(e.target.value)} />
                    <button className={styles.btnPrimary} onClick={() => setFeeModal({ open: true })}>+ Add Record</button>
                  </div>
                </div>
                <div className={styles.tableOverflow}>
                  <table>
                    <thead>
                      <tr>
                        <th>Tutor</th><th>Parent</th><th>Subject</th><th>Class</th>
                        <th>Month</th><th>Parent Pays</th><th>Tutor Gets</th>
                        <th>Your Profit</th><th>Payment</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFees.length === 0 && <tr><td colSpan={10} className={styles.empty}>No fee records yet. Click "+ Add Record" to start.</td></tr>}
                      {filteredFees.map(f => (
                        <tr key={f.id}>
                          <td><strong>{f.tutorName}</strong></td>
                          <td>{f.parentName}</td>
                          <td>{f.subject}</td>
                          <td>{f.classLevel}</td>
                          <td>{f.month}</td>
                          <td className={styles.amtPos}>{currency(f.parentFee)}</td>
                          <td className={styles.amtNeg}>{currency(f.tutorFee)}</td>
                          <td className={f.profit >= 0 ? styles.amtPos : styles.amtNeg}>
                            <strong>{currency(f.profit)}</strong>
                          </td>
                          <td><StatusBadge status={f.paymentStatus} /></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className={styles.actionBtn} onClick={() => setFeeModal({ open: true, record: f })}>✏️</button>
                              <button className={styles.actionBtnDel} onClick={() => handleDeleteFee(f.id!)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ══ CLASSES ══ */}
          {page === 'classes' && (
            <>
              <div className={styles.statsRow}>
                <StatCard icon="✅" num={classes.filter(c => c.status === 'active').length}    label="Active Classes"    sub="currently running" color="green" />
                <StatCard icon="⏸️" num={classes.filter(c => c.status === 'paused').length}    label="Paused"            sub="on hold"           color="gold"  />
                <StatCard icon="🎓" num={classes.filter(c => c.status === 'completed').length} label="Completed"         sub="finished batches"  color="blue"  />
                <StatCard icon="📊" num={classes.reduce((s, c) => s + c.classesPerWeek, 0)}    label="Classes/Week Total" sub="across all tutors" color="red"   />
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h3>📅 Class Assignments</h3>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className={styles.searchInput} placeholder="🔍 Search tutor, parent, area…" value={cSearch} onChange={e => setCSearch(e.target.value)} />
                    <button className={styles.btnPrimary} onClick={() => setClsModal({ open: true })}>+ Assign Class</button>
                  </div>
                </div>
                <div className={styles.filterRow}>
                  {(['all','active','paused','completed'] as (ClassStatus | 'all')[]).map(s => (
                    <button key={s} className={`${styles.filterBtn} ${cFilter === s ? styles.filterActive : ''}`} onClick={() => setCFilter(s)}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
                <div className={styles.tableOverflow}>
                  <table>
                    <thead>
                      <tr>
                        <th>Tutor</th><th>Tutor Phone</th><th>Parent</th><th>Parent Phone</th>
                        <th>Subject</th><th>Class</th><th>Days/Week</th>
                        <th>Start Date</th><th>Area</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClasses.length === 0 && <tr><td colSpan={11} className={styles.empty}>No class assignments yet. Click "+ Assign Class" to start.</td></tr>}
                      {filteredClasses.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.tutorName}</strong></td>
                          <td><a href={`tel:${c.tutorPhone}`} className={styles.phoneLink}>{c.tutorPhone || '—'}</a></td>
                          <td>{c.parentName}</td>
                          <td><a href={`tel:${c.parentPhone}`} className={styles.phoneLink}>{c.parentPhone || '—'}</a></td>
                          <td>{c.subject}</td>
                          <td>{c.classLevel}</td>
                          <td style={{ textAlign: 'center' }}>{c.classesPerWeek}x</td>
                          <td>{c.startDate ? new Date(c.startDate).toLocaleDateString('en-IN') : '—'}</td>
                          <td>{c.area || '—'}</td>
                          <td>
                            <select
                              className={styles.statusSel}
                              value={c.status}
                              onChange={e => handleClassStatusChange(c.id!, e.target.value as ClassStatus)}
                            >
                              <option value="active">Active</option>
                              <option value="paused">Paused</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className={styles.actionBtn} onClick={() => setClsModal({ open: true, record: c })}>✏️</button>
                              <button className={styles.actionBtnDel} onClick={() => handleDeleteClass(c.id!)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ══ CONFIG ══ */}
          {page === 'config' && (
            <div className={styles.tableCard} style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 6 }}>⚙️ Site Configuration</h3>
              <p style={{ fontSize: 13, color: '#999', marginBottom: 24 }}>Changes here reflect live on the landing page immediately.</p>
              <form onSubmit={handleSaveConfig} className={styles.configGrid}>
                <div className={styles.cfgGroup} style={{ gridColumn: '1/-1' }}>
                  <label>🎉 Offer Banner Text</label>
                  <input value={config.offerBanner} onChange={e => setConfig({ ...config, offerBanner: e.target.value })} placeholder="e.g. 🎉 Special Offer: First 2 Demo Classes FREE this month!" />
                  <span className={styles.cfgHint}>Leave empty to hide the banner strip on the landing page.</span>
                </div>
                <div className={styles.cfgGroup}>
                  <label>📱 WhatsApp Number</label>
                  <input value={config.whatsappNumber} onChange={e => setConfig({ ...config, whatsappNumber: e.target.value })} placeholder="e.g. 917999854628" />
                  <span className={styles.cfgHint}>Include country code, no + sign.</span>
                </div>
                <div className={styles.cfgGroup}>
                  <label>📍 Business Address</label>
                  <input value={config.address} onChange={e => setConfig({ ...config, address: e.target.value })} placeholder="e.g. Shankar Nagar, Raipur, CG" />
                </div>
                <div className={styles.cfgGroup} style={{ gridColumn: '1/-1' }}>
                  <label>🏠 Hero Section Subtext</label>
                  <input value={config.heroSubtext} onChange={e => setConfig({ ...config, heroSubtext: e.target.value })} placeholder="Personalized 1-on-1 home tuition for Class 1–12 in Raipur." />
                  <span className={styles.cfgHint}>The subtitle shown in the hero section on the landing page.</span>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <button type="submit" className={styles.saveBtn} disabled={cfgSaving}>
                    {cfgSaving ? 'Saving…' : '💾 Save Configuration'}
                  </button>
                  {cfgSaved && <div className={styles.cfgSuccess}>✅ Configuration saved! Changes are live on the landing page.</div>}
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ══ MODALS ══ */}
      {feeModal.open && (
        <FeeModal
          initial={feeModal.record}
          onSave={handleSaveFee}
          onClose={() => setFeeModal({ open: false })}
        />
      )}
      {clsModal.open && (
        <ClassModal
          initial={clsModal.record}
          onSave={handleSaveClass}
          onClose={() => setClsModal({ open: false })}
        />
      )}

    </div>
  );
}
