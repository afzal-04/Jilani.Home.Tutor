'use client';
// src/app/admin/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getAllParents, getAllTutors, updateLeadStatus,
  getSiteConfig, saveSiteConfig,
  ParentLead, TutorLead, LeadStatus, SiteConfig
} from '@/lib/firestore';
import styles from './admin.module.css';

type AdminPage = 'dashboard' | 'parents' | 'tutors' | 'config';

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`${styles.badge} ${styles[`badge_${status}`]}`}>{status}</span>;
}

// ─── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          {error && <p className={styles.loginErr}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
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

// ─── Main Admin App ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [user, setUser]         = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage]         = useState<AdminPage>('dashboard');

  const [parents, setParents]   = useState<ParentLead[]>([]);
  const [tutors, setTutors]     = useState<TutorLead[]>([]);
  const [config, setConfig]     = useState<SiteConfig>({ offerBanner: '', whatsappNumber: '', heroSubtext: '', address: '' });
  const [cfgSaving, setCfgSaving] = useState(false);
  const [cfgSaved, setCfgSaved]  = useState(false);

  const [pSearch, setPSearch]   = useState('');
  const [pFilter, setPFilter]   = useState<LeadStatus | 'all'>('all');
  const [tSearch, setTSearch]   = useState('');
  const [tFilter, setTFilter]   = useState<LeadStatus | 'all'>('all');

  // Auth
  useEffect(() => {
    return onAuthStateChanged(auth, u => { setUser(u); setAuthLoading(false); });
  }, []);

  const loadAll = useCallback(async () => {
    const [p, t, cfg] = await Promise.all([getAllParents(), getAllTutors(), getSiteConfig()]);
    setParents(p);
    setTutors(t);
    if (cfg) setConfig(cfg);
  }, []);

  useEffect(() => { if (user) loadAll(); }, [user, loadAll]);

  // Filtered data
  const filteredParents = parents
    .filter(p => pFilter === 'all' || p.status === pFilter)
    .filter(p => !pSearch || p.name.toLowerCase().includes(pSearch.toLowerCase()) || p.phone.includes(pSearch) || p.area.toLowerCase().includes(pSearch.toLowerCase()));

  const filteredTutors = tutors
    .filter(t => tFilter === 'all' || t.status === tFilter)
    .filter(t => !tSearch || t.name.toLowerCase().includes(tSearch.toLowerCase()) || t.phone.includes(tSearch) || t.area.toLowerCase().includes(tSearch.toLowerCase()));

  async function handleStatusChange(col: 'parents' | 'tutors', id: string, status: LeadStatus) {
    await updateLeadStatus(col, id, status);
    if (col === 'parents') setParents(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    else setTutors(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    setCfgSaving(true);
    await saveSiteConfig(config);
    setCfgSaved(true);
    setCfgSaving(false);
    setTimeout(() => setCfgSaved(false), 3000);
  }

  const convertedCount = [...parents, ...tutors].filter(x => x.status === 'converted').length;
  const newParents = parents.filter(p => p.status === 'new').length;
  const newTutors  = tutors.filter(t => t.status === 'new').length;

  const recentActivity = [...parents.map(p => ({ ...p, type: 'Parent' })), ...tutors.map(t => ({ ...t, type: 'Tutor' }))]
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    .slice(0, 10);

  const formatDate = (item: { createdAt?: { seconds: number } }) =>
    item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-IN') : '—';

  const pageTitles: Record<AdminPage, string> = {
    dashboard: 'Dashboard',
    parents:   'Parent Registrations',
    tutors:    'Tutor Registrations',
    config:    'Site Configuration',
  };

  const STATUSES: (LeadStatus | 'all')[] = ['all', 'new', 'contacted', 'converted', 'closed'];

  if (authLoading) return <div className={styles.loadingScreen}>Loading...</div>;
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
          {(['dashboard', 'parents', 'tutors', 'config'] as AdminPage[]).map(p => (
            <button
              key={p}
              className={`${styles.navItem} ${page === p ? styles.navActive : ''}`}
              onClick={() => setPage(p)}
            >
              <span>{{ dashboard: '🏠', parents: '👨‍👩‍👧', tutors: '👩‍🏫', config: '⚙️' }[p]}</span>
              {pageTitles[p]}
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminEmail}>{user.email}</div>
          <button onClick={() => signOut(auth)} className={styles.logoutBtn}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.main}>
        <div className={styles.topbar}>
          <h1>{pageTitles[page]}</h1>
          <button onClick={loadAll} className={styles.refreshBtn}>🔄 Refresh</button>
        </div>

        <div className={styles.content}>

          {/* ── Dashboard ── */}
          {page === 'dashboard' && (
            <>
              <div className={styles.statsRow}>
                <StatCard icon="👨‍👩‍👧" num={parents.length} label="Total Parents" sub={`${newParents} new`} color="blue" />
                <StatCard icon="👩‍🏫" num={tutors.length}  label="Total Tutors"  sub={`${newTutors} new`}  color="gold" />
                <StatCard icon="✅" num={convertedCount}   label="Converted"     sub="Total conversions"  color="green" />
                <StatCard icon="🆓" num="FREE"             label="Demo Offer"    sub="Always active"      color="red"  />
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h3>📋 Recent Registrations</h3>
                </div>
                <div className={styles.activityList}>
                  {recentActivity.length === 0 && <p className={styles.empty}>No registrations yet.</p>}
                  {recentActivity.map((r, i) => (
                    <div key={i} className={styles.activityRow}>
                      <span className={`${styles.badge} ${'type' in r && r.type === 'Parent' ? styles.badge_parent : styles.badge_tutor}`}>
                        {'type' in r ? r.type : ''}
                      </span>
                      <span className={styles.actName}>{r.name}</span>
                      <span className={styles.actPhone}>{r.phone}</span>
                      <span className={styles.actArea}>{r.area}</span>
                      <StatusBadge status={r.status} />
                      <span className={styles.actDate}>{formatDate(r)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Parents ── */}
          {page === 'parents' && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3>👨‍👩‍👧 Parent Registrations</h3>
                <input className={styles.searchInput} placeholder="🔍 Search name, phone, area..." value={pSearch} onChange={e => setPSearch(e.target.value)} />
              </div>
              <div className={styles.filterRow}>
                {STATUSES.map(s => (
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
                        <td>{p.area}</td>
                        <td>{p.class}</td>
                        <td>{p.subject}</td>
                        <td>{formatDate(p)}</td>
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

          {/* ── Tutors ── */}
          {page === 'tutors' && (
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3>👩‍🏫 Tutor Registrations</h3>
                <input className={styles.searchInput} placeholder="🔍 Search name, phone, area..." value={tSearch} onChange={e => setTSearch(e.target.value)} />
              </div>
              <div className={styles.filterRow}>
                {STATUSES.map(s => (
                  <button key={s} className={`${styles.filterBtn} ${tFilter === s ? styles.filterActive : ''}`} onClick={() => setTFilter(s)}>
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className={styles.tableOverflow}>
                <table>
                  <thead><tr><th>Name</th><th>Phone</th><th>Area</th><th>Qualification</th><th>Subjects</th><th>Classes</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
                  <tbody>
                    {filteredTutors.length === 0 && <tr><td colSpan={9} className={styles.empty}>No records found.</td></tr>}
                    {filteredTutors.map(t => (
                      <tr key={t.id}>
                        <td><strong>{t.name}</strong></td>
                        <td><a href={`tel:${t.phone}`} className={styles.phoneLink}>{t.phone}</a></td>
                        <td>{t.area}</td>
                        <td>{t.qualification}</td>
                        <td>{t.subjects}</td>
                        <td>{t.classes}</td>
                        <td>{formatDate(t)}</td>
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

          {/* ── Config ── */}
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
                  <span className={styles.cfgHint}>The subtitle text shown in the hero section of the landing page.</span>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <button type="submit" className={styles.saveBtn} disabled={cfgSaving}>
                    {cfgSaving ? 'Saving...' : '💾 Save Configuration'}
                  </button>
                  {cfgSaved && <div className={styles.cfgSuccess}>✅ Configuration saved! Changes are now live on the landing page.</div>}
                </div>
              </form>

              <div className={styles.setupGuide}>
                <h3>🔧 Firebase Setup Guide</h3>
                <ol>
                  <li>Go to <strong>console.firebase.google.com</strong> and create a project</li>
                  <li>Add a <strong>Web App</strong> and copy the Firebase config</li>
                  <li>Create a <code>.env.local</code> file in your project root and add all <code>NEXT_PUBLIC_FIREBASE_*</code> variables</li>
                  <li>Enable <strong>Firestore Database</strong> in Firebase Console</li>
                  <li>Enable <strong>Authentication → Email/Password</strong> and create your admin user</li>
                  <li>Deploy to GitHub Pages or Vercel</li>
                </ol>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
