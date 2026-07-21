import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import UploadButton from '../UploadButton';
import { useToast } from '../Toast';
import {
  appointments as apptApi,
  clients as clientsApi,
  services as servicesApi,
  availability as availApi,
  payments as paymentsApi,
  products as productsApi,
  posts as postsApi,
  media as mediaApi,
  stylists as stylistsApi,
  clearAuth,
  getUserId,
} from '../../lib/api';
import { isLoggedIn } from '../../lib/api';
import styles from './stylesheets/Admin.module.css';

// ─── Nav config ───────────────────────────────────────────
const NAV = [
  { key: 'overview',      label: 'Overview',      icon: '◈' },
  { key: 'appointments',  label: 'Appointments',  icon: '📅' },
  { key: 'availability',  label: 'Availability',  icon: '🕐' },
  { key: 'services',      label: 'Services',      icon: '✂' },
  { key: 'clients',       label: 'Clients',       icon: '👤' },
  { key: 'payments',      label: 'Payments',      icon: '💳' },
  { key: 'products',      label: 'Products',      icon: '🧴' },
  { key: 'posts',         label: 'Gallery Posts', icon: '🖼' },
  { key: 'stylists',      label: 'Stylists',      icon: '💇' },
];

// ─── Helpers ──────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';

function StatusBadge({ status }) {
  return <span className={`${styles.badge} ${styles[status?.toLowerCase()]}`}>{status}</span>;
}

// ─── Modal wrapper ─────────────────────────────────────────
function Modal({ title, onClose, children, footer }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  SECTIONS
// ════════════════════════════════════════════════════════════

// ─── Overview ─────────────────────────────────────────────
function Overview() {
  const [data, setData] = useState({ appointments: [], payments: [], clients: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apptApi.getAll(), paymentsApi.getAll(), clientsApi.getAll()])
      .then(([appointments, payments, clients]) => setData({ appointments, payments, clients }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.loading}>Loading...</p>;

  const totalRevenue = data.payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pending = data.appointments.filter(a => a.status === 'PENDING').length;
  const today = data.appointments.filter(a =>
    new Date(a.scheduledAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Appointments</p>
          <p className={styles.statValue}>{data.appointments.length}</p>
          <p className={styles.statSub}>{pending} pending</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Today</p>
          <p className={styles.statValue}>{today}</p>
          <p className={styles.statSub}>appointments today</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Clients</p>
          <p className={styles.statValue}>{data.clients.length}</p>
          <p className={styles.statSub}>registered</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Revenue</p>
          <p className={styles.statValue}>${totalRevenue.toFixed(2)}</p>
          <p className={styles.statSub}>from paid invoices</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Recent Appointments</h3>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client</th><th>Stylist</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.appointments.slice(0, 5).map(a => (
                <tr key={a.id}>
                  <td>{a.client?.user?.name || '—'}</td>
                  <td>{a.stylist?.user?.name || '—'}</td>
                  <td>{fmt(a.scheduledAt)}</td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Appointments ──────────────────────────────────────────
function Appointments() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    apptApi.getAll().then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await apptApi.update(id, { status });

      // Send email notification for meaningful status changes
      if (['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(status)) {
        const appointment = list.find(a => a.id === id);
        if (appointment?.client?.user?.email) {
          await fetch('/api/email/status-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientName: appointment.client.user.name,
              clientEmail: appointment.client.user.email,
              stylistName: appointment.stylist?.user?.name,
              serviceName: appointment.services?.[0]?.service?.name,
              date: new Date(appointment.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              time: new Date(appointment.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              status,
            }),
          });
        }
      }

      load();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try { await apptApi.delete(id); load(); toast.success('Appointment deleted.'); } catch (e) { console.error(e); toast.error('Failed to delete appointment.'); }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarTitle}>Appointments</h2>
      </div>
      <div className={styles.card}>
        {loading && <p className={styles.loading}>Loading...</p>}
        {!loading && list.length === 0 && <p className={styles.empty}>No appointments yet.</p>}
        {!loading && list.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th><th>Stylist</th><th>Date</th><th>Services</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(a => (
                  <tr key={a.id}>
                    <td>{a.client?.user?.name || '—'}</td>
                    <td>{a.stylist?.user?.name || '—'}</td>
                    <td>{fmt(a.scheduledAt)} {fmtTime(a.scheduledAt)}</td>
                    <td>{a.services?.map(s => s.service?.name).join(', ') || '—'}</td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={a.status}
                        onChange={(e) => updateStatus(a.id, e.target.value)}
                      >
                        {['PENDING','CONFIRMED','CANCELLED','COMPLETED','NO_SHOW'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={`${styles.btnDanger} ${styles.btnSm}`} onClick={() => handleDelete(a.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Availability ──────────────────────────────────────────
function Availability() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ stylistId: '', date: '', startTime: '', endTime: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([availApi.getAll(), stylistsApi.getAll()])
      .then(([a, s]) => { setList(a); setStylists(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await availApi.create({ ...form, stylistId: Number(form.stylistId) });
      setShowModal(false);
      setForm({ stylistId: '', date: '', startTime: '', endTime: '' });
      load();
      toast.success('Availability slot added.');
    } catch (e) { setError(e.message); toast.error('Failed to add slot.'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this slot?')) return;
    try { await availApi.delete(id); load(); toast.success('Slot deleted.'); } catch (e) { console.error(e); toast.error('Failed to delete slot.'); }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarTitle}>Availability</h2>
        <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>+ Add Slot</button>
      </div>

      <div className={styles.card}>
        {loading && <p className={styles.loading}>Loading...</p>}
        {!loading && list.length === 0 && <p className={styles.empty}>No availability slots posted.</p>}
        {!loading && list.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Stylist</th><th>Date</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {list.map(s => (
                  <tr key={s.id}>
                    <td>{s.stylist?.user?.name || '—'}</td>
                    <td>{fmt(s.date)}</td>
                    <td>{fmtTime(s.startTime)}</td>
                    <td>{fmtTime(s.endTime)}</td>
                    <td><span className={`${styles.badge} ${s.isBooked ? styles.confirmed : styles.pending}`}>{s.isBooked ? 'Booked' : 'Open'}</span></td>
                    <td>
                      <button className={`${styles.btnDanger} ${styles.btnSm}`} onClick={() => handleDelete(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title="Add Availability Slot"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className={styles.btnOutline} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Stylist</label>
              <select className={styles.select} value={form.stylistId} onChange={e => setForm({ ...form, stylistId: e.target.value })}>
                <option value="">Select stylist</option>
                {stylists.map(s => <option key={s.id} value={s.id}>{s.user?.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input className={styles.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Start Time</label>
                <input className={styles.input} type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>End Time</label>
                <input className={styles.input} type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
              </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Services ──────────────────────────────────────────────
function Services() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', durationMin: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    servicesApi.getAll().then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', price: '', durationMin: '', isActive: true }); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, description: s.description || '', price: s.price, durationMin: s.durationMin, isActive: s.isActive }); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), durationMin: Number(form.durationMin) };
      if (editing) await servicesApi.update(editing.id, payload);
      else await servicesApi.create(payload);
      setShowModal(false); load();
      toast.success(editing ? 'Service updated.' : 'Service created.');
    } catch (e) { setError(e.message); toast.error('Failed to save service.'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try { await servicesApi.delete(id); load(); toast.success('Service deleted.'); } catch (e) { console.error(e); toast.error('Failed to delete service.'); }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarTitle}>Services</h2>
        <button className={styles.btnPrimary} onClick={openCreate}>+ Add Service</button>
      </div>

      <div className={styles.card}>
        {loading && <p className={styles.loading}>Loading...</p>}
        {!loading && list.length === 0 && <p className={styles.empty}>No services yet.</p>}
        {!loading && list.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Name</th><th>Price</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {list.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>${Number(s.price).toFixed(2)}</td>
                    <td>{s.durationMin} min</td>
                    <td><span className={`${styles.badge} ${s.isActive ? styles.confirmed : styles.cancelled}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className={`${styles.btnOutline} ${styles.btnSm}`} onClick={() => openEdit(s)}>Edit</button>
                        <button className={`${styles.btnDanger} ${styles.btnSm}`} onClick={() => handleDelete(s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Service' : 'New Service'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className={styles.btnOutline} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input className={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Balayage" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the service..." />
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Price ($)</label>
                <input className={styles.input} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Duration (min)</label>
                <input className={styles.input} type="number" value={form.durationMin} onChange={e => setForm({ ...form, durationMin: e.target.value })} placeholder="60" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Clients ───────────────────────────────────────────────
function Clients() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientsApi.getAll().then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarTitle}>Clients</h2>
      </div>
      <div className={styles.card}>
        {loading && <p className={styles.loading}>Loading...</p>}
        {!loading && list.length === 0 && <p className={styles.empty}>No clients yet.</p>}
        {!loading && list.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Notes</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.id}>
                    <td>{c.user?.name || '—'}</td>
                    <td>{c.user?.email || '—'}</td>
                    <td>{c.user?.phone || '—'}</td>
                    <td>{c.notes || '—'}</td>
                    <td>{fmt(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Payments ──────────────────────────────────────────────
function Payments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsApi.getAll().then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarTitle}>Payments</h2>
      </div>
      <div className={styles.card}>
        {loading && <p className={styles.loading}>Loading...</p>}
        {!loading && list.length === 0 && <p className={styles.empty}>No payments yet.</p>}
        {!loading && list.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Client</th><th>Amount</th><th>Method</th><th>Status</th><th>Paid At</th></tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id}>
                    <td>{p.client?.user?.name || '—'}</td>
                    <td>${Number(p.amount).toFixed(2)}</td>
                    <td>{p.method}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>{p.paidAt ? fmt(p.paidAt) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Products ──────────────────────────────────────────────
function Products() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '0', isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    productsApi.getAll().then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', price: '', stock: '0', isActive: true }); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, isActive: p.isActive }); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) await productsApi.update(editing.id, payload);
      else await productsApi.create(payload);
      setShowModal(false); load();
      toast.success(editing ? 'Product updated.' : 'Product created.');
    } catch (e) { setError(e.message); toast.error('Failed to save product.'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await productsApi.delete(id); load(); toast.success('Product deleted.'); } catch (e) { console.error(e); toast.error('Failed to delete product.'); }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarTitle}>Products</h2>
        <button className={styles.btnPrimary} onClick={openCreate}>+ Add Product</button>
      </div>

      <div className={styles.card}>
        {loading && <p className={styles.loading}>Loading...</p>}
        {!loading && list.length === 0 && <p className={styles.empty}>No products yet.</p>}
        {!loading && list.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td><span className={`${styles.badge} ${p.isActive ? styles.confirmed : styles.cancelled}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className={`${styles.btnOutline} ${styles.btnSm}`} onClick={() => openEdit(p)}>Edit</button>
                        <button className={`${styles.btnDanger} ${styles.btnSm}`} onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Product' : 'New Product'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className={styles.btnOutline} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input className={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Price ($)</label>
                <input className={styles.input} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Stock</label>
                <input className={styles.input} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Posts / Gallery ───────────────────────────────────────
function Posts() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [form, setForm] = useState({ title: '', caption: '', isPublished: true, category: 'GALLERY' });
  const [mediaForm, setMediaForm] = useState({ url: '', type: 'IMAGE', altText: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const load = useCallback(() => {
    setLoading(true);
    postsApi.getAll(false, filterCategory === 'ALL' ? null : filterCategory)
      .then(setList).catch(console.error).finally(() => setLoading(false));
  }, [filterCategory]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    setSaving(true); setError('');
    try {
      const authorId = Number(getUserId());
      await postsApi.create({ ...form, authorId });
      setShowModal(false);
      setForm({ title: '', caption: '', isPublished: true, category: 'GALLERY' });
      load();
      toast.success('Post created.');
    } catch (e) { setError(e.message); toast.error('Failed to create post.'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await postsApi.delete(id); load(); toast.success('Post deleted.'); } catch (e) { console.error(e); toast.error('Failed to delete post.'); }
  };

  const handleAddMedia = async () => {
    setSaving(true); setError('');
    try {
      await mediaApi.create({ ...mediaForm, postId: selectedPost.id });
      setShowMediaModal(false);
      setMediaForm({ url: '', type: 'IMAGE', altText: '' });
      load();
      toast.success('Media added to post.');
    } catch (e) { setError(e.message); toast.error('Failed to add media.'); } finally { setSaving(false); }
  };

  const handleDeleteMedia = async (id) => {
    try { await mediaApi.delete(id); load(); } catch (e) { console.error(e); }
  };

  const togglePublished = async (post) => {
    try { await postsApi.update(post.id, { isPublished: !post.isPublished }); load(); } catch (e) { console.error(e); }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarTitle}>Gallery Posts</h2>
        <div className={styles.actions}>
          <select className={styles.statusSelect} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="ALL">All Categories</option>
            <option value="GALLERY">Gallery</option>
            <option value="BEFORE_AFTER">Before & After</option>
          </select>
          <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>+ New Post</button>
        </div>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}
      {!loading && list.length === 0 && <p className={styles.empty}>No posts yet.</p>}

      {!loading && list.map(post => (
        <div key={post.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>{post.title || 'Untitled Post'}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', alignItems: 'center' }}>
                <span className={`${styles.badge} ${post.category === 'BEFORE_AFTER' ? styles.pending : styles.completed}`}>
                  {post.category === 'BEFORE_AFTER' ? 'Before & After' : 'Gallery'}
                </span>
                <span className={`${styles.badge} ${post.isPublished ? styles.confirmed : styles.cancelled}`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              {post.caption && <p style={{ fontSize: 13, color: 'var(--text-dim)', margin: '0.4rem 0 0' }}>{post.caption}</p>}
            </div>
            <div className={styles.actions}>
              <button className={`${styles.btnOutline} ${styles.btnSm}`} onClick={() => togglePublished(post)}>
                {post.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button className={`${styles.btnOutline} ${styles.btnSm}`} onClick={() => { setSelectedPost(post); setShowMediaModal(true); }}>
                + Media
              </button>
              <button className={`${styles.btnDanger} ${styles.btnSm}`} onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </div>

          {post.media?.length > 0 && (
            <div className={styles.mediaGrid}>
              {post.media.map(m => (
                <div key={m.id} className={styles.mediaThumb}>
                  {m.type === 'VIDEO'
                    ? <video src={m.url} />
                    : <img src={m.url} alt={m.altText || ''} />
                  }
                  <button
                    onClick={() => handleDeleteMedia(m.id)}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* New Post Modal */}
      {showModal && (
        <Modal
          title="New Post"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className={styles.btnOutline} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Create Post'}</button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="GALLERY">Gallery / Latest from Salon</option>
                <option value="BEFORE_AFTER">Before &amp; After</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input className={styles.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={form.category === 'BEFORE_AFTER' ? 'e.g. Balayage Transformation' : 'e.g. Fresh Highlights'} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Caption</label>
              <textarea className={styles.textarea} value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Describe the work..." />
            </div>
            {form.category === 'BEFORE_AFTER' && (
              <p style={{ fontSize: 12, color: 'var(--text-dim)', background: 'var(--surface2)', padding: '0.6rem 0.85rem', borderRadius: 3, lineHeight: 1.5 }}>
                ✦ After creating, add <strong>2 media items</strong> — the first will be the Before photo, the second the After photo.
              </p>
            )}
            <div className={styles.field}>
              <label className={styles.label}>Visibility</label>
              <select className={styles.select} value={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.value === 'true' })}>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </Modal>
      )}

      {/* Add Media Modal */}
      {showMediaModal && (
        <Modal
          title={`Add Media to "${selectedPost?.title || 'Post'}"`}
          onClose={() => setShowMediaModal(false)}
          footer={
            <>
              <button className={styles.btnOutline} onClick={() => setShowMediaModal(false)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={handleAddMedia} disabled={saving}>{saving ? 'Saving...' : 'Add Media'}</button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Upload File</label>
              <UploadButton
                label="Choose Image or Video"
                onUpload={(result) => setMediaForm({ ...mediaForm, url: result.url, type: result.type })}
              />
              {mediaForm.url && (
                <p style={{ fontSize: 12, color: 'var(--green)', marginTop: '0.5rem' }}>
                  ✓ File uploaded successfully
                </p>
              )}
            </div>
            {mediaForm.url && mediaForm.type === 'IMAGE' && (
              <div className={styles.field}>
                <img src={mediaForm.url} alt="preview" style={{ width: '100%', borderRadius: 3, border: '1px solid var(--border)' }} />
              </div>
            )}
            <div className={styles.field}>
              <label className={styles.label}>Alt Text</label>
              <input className={styles.input} value={mediaForm.altText} onChange={e => setMediaForm({ ...mediaForm, altText: e.target.value })} placeholder="Describe the image..." />
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Stylists Management ───────────────────────────────────
function StylistsAdmin() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ bio: '', specialties: '', avatarUrl: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    stylistsApi.getAll().then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (s) => {
    setEditing(s);
    setForm({ bio: s.bio || '', specialties: s.specialties || '', avatarUrl: s.user?.avatarUrl || '' });
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await stylistsApi.update(editing.id, form);
      setEditing(null);
      load();
      toast.success('Stylist updated.');
    } catch (e) { setError(e.message); toast.error('Failed to update stylist.'); } finally { setSaving(false); }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <h2 className={styles.toolbarTitle}>Stylists</h2>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}
      {!loading && list.length === 0 && <p className={styles.empty}>No stylists yet.</p>}

      {!loading && list.map(s => (
        <div key={s.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {s.user?.avatarUrl ? (
                <img src={s.user.avatarUrl} alt={s.user?.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--gold)' }}>
                  {s.user?.name?.charAt(0)}
                </div>
              )}
              <div>
                <h3 className={styles.cardTitle}>{s.user?.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--gold)', margin: '0.2rem 0 0', letterSpacing: '0.08em' }}>{s.specialties || 'No specialties listed'}</p>
              </div>
            </div>
            <button className={`${styles.btnOutline} ${styles.btnSm}`} onClick={() => openEdit(s)}>Edit Profile</button>
          </div>
          {s.bio && <p style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: '0.5rem', lineHeight: 1.6 }}>{s.bio}</p>}
        </div>
      ))}

      {editing && (
        <Modal
          title={`Edit — ${editing.user?.name}`}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className={styles.btnOutline} onClick={() => setEditing(null)}>Cancel</button>
              <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </>
          }
        >
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Profile Photo</label>
              <UploadButton
                label="Upload Photo"
                onUpload={(result) => setForm({ ...form, avatarUrl: result.url })}
              />
              {form.avatarUrl && (
                <img src={form.avatarUrl} alt="Preview" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginTop: '0.75rem', border: '1px solid var(--border)' }} />
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Specialties</label>
              <input className={styles.input} value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })} placeholder="e.g. Balayage, Color Correction" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Bio</label>
              <textarea className={styles.textarea} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell clients about this stylist..." />
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </Modal>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════
//  MAIN ADMIN COMPONENT
// ════════════════════════════════════════════════════════════

const SECTION_MAP = {
  overview:     <Overview />,
  appointments: <Appointments />,
  availability: <Availability />,
  services:     <Services />,
  clients:      <Clients />,
  payments:     <Payments />,
  products:     <Products />,
  posts:        <Posts />,
  stylists:     <StylistsAdmin />,
};

export default function Admin() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/signin');
    } else {
      setAuthed(true);
    }
  }, [router]);

  if (!authed) return null;

  const handleSignout = () => {
    clearAuth();
    router.push('/signin');
  };

  const activeNav = NAV.find(n => n.key === section);

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogo}>✦</div>
          {!collapsed && (
            <div className={styles.sidebarBrand}>
              <p className={styles.sidebarName}>Davilas</p>
              <p className={styles.sidebarSub}>Admin</p>
            </div>
          )}
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV.map(item => (
            <div
              key={item.key}
              className={`${styles.navItem} ${section === item.key ? styles.active : ''}`}
              onClick={() => setSection(item.key)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && item.label}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <button className={styles.signoutBtn} onClick={handleSignout}>
            <span className={styles.navIcon}>↩</span>
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`${styles.main} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.topbar}>
          <h1 className={styles.topbarTitle}>{activeNav?.label}</h1>
          <span className={styles.topbarUser}>DHB Davilas Admin</span>
        </div>
        <div className={styles.content}>
          {SECTION_MAP[section]}
        </div>
      </main>

      {/* ── Bottom nav — mobile only ── */}
      <nav className={styles.bottomNav} style={{ display: 'none' }}>
        {NAV.map(item => (
          <button
            key={item.key}
            className={`${styles.bottomNavItem} ${section === item.key ? styles.active : ''}`}
            onClick={() => setSection(item.key)}
          >
            <span className={styles.bottomNavIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <button className={`${styles.bottomNavItem}`} onClick={handleSignout}>
          <span className={styles.bottomNavIcon}>↩</span>
          Sign Out
        </button>
      </nav>
    </div>
  );
}
