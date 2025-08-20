import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DataTable from "./Table/DataTable";

export default function MasterBin() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Approval Request" }]} />
      <DataTable />
    </div>
  );
}

// import React, { useMemo, useState } from "react";

// // --- Helper Types ---
// type Role = "REQUESTOR" | "APPROVER" | "ADMIN";

// type Status = "Pending" | "Approved" | "Rejected";

// interface HistoryItem {
//   action: string; // created | notified | opened | approved | rejected | resent | edited | resubmitted | viewed
//   by: string;
//   at: string; // ISO
//   note?: string;
// }

// interface Approval {
//   id: string;
//   subject: string;
//   approver: string; // approver user id or name
//   requester: string; // requester display name
//   createdBy: string; // requester user id
//   createdAt: string; // ISO
//   status: Status;
//   lastUpdate: string; // ISO
//   notes?: string; // rejection reason etc
//   attachmentName?: string;
//   token?: string; // simulated link token for approver
//   notified?: boolean;
//   history: HistoryItem[];
// }

// // --- Mock Users ---
// const USERS = {
//   requestor: { id: "rani", name: "Rani Requestor" },
//   approver: { id: "andi", name: "Andi Approver" },
//   admin: { id: "sri", name: "Sri Admin" },
// };

// // --- Utilities ---
// const nowISO = () => new Date().toISOString();
// const fmt = (iso: string) => new Date(iso).toLocaleString();
// const newId = () => Math.random().toString(36).slice(2, 9).toUpperCase();
// const newToken = () => Math.random().toString(36).slice(2, 10);

// // --- Initial Data ---
// const initialApprovals: Approval[] = [
//   {
//     id: "APR-0001",
//     subject: "Pembelian Laptop Tim Sales",
//     approver: USERS.approver.name,
//     requester: USERS.requestor.name,
//     createdBy: USERS.requestor.id,
//     createdAt: nowISO(),
//     status: "Pending",
//     lastUpdate: nowISO(),
//     attachmentName: "justifikasi-pembelian.pdf",
//     token: newToken(),
//     notified: true,
//     history: [
//       { action: "created", by: USERS.requestor.name, at: nowISO() },
//       { action: "notified", by: "system", at: nowISO(), note: "email/WA sent" },
//     ],
//   },
//   {
//     id: "APR-0002",
//     subject: "Perpanjangan Kontrak Vendor Kebersihan",
//     approver: USERS.approver.name,
//     requester: USERS.requestor.name,
//     createdBy: USERS.requestor.id,
//     createdAt: nowISO(),
//     status: "Rejected",
//     lastUpdate: nowISO(),
//     notes: "Dokumen kurang lengkap",
//     attachmentName: "draft-kontrak.docx",
//     token: newToken(),
//     notified: true,
//     history: [
//       { action: "created", by: USERS.requestor.name, at: nowISO() },
//       { action: "notified", by: "system", at: nowISO(), note: "email/WA sent" },
//       { action: "opened", by: USERS.approver.name, at: nowISO() },
//       { action: "rejected", by: USERS.approver.name, at: nowISO(), note: "Lengkapi lampiran" },
//     ],
//   },
// ];

// // --- UI Components ---
// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 border border-gray-200">{children}</span>
//   );
// }

// function StatusBadge({ status }: { status: Status }) {
//   const color =
//     status === "Approved"
//       ? "bg-green-100 text-green-700 border-green-200"
//       : status === "Rejected"
//       ? "bg-red-100 text-red-700 border-red-200"
//       : "bg-amber-100 text-amber-700 border-amber-200";
//   return (
//     <span className={`px-2 py-0.5 rounded-full text-xs border ${color}`}>{status}</span>
//   );
// }

// function Card({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border p-5">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="font-semibold text-gray-800">{title}</h3>
//         {right}
//       </div>
//       {children}
//     </div>
//   );
// }

// function Modal({ open, onClose, title, children, actions }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; actions?: React.ReactNode }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
//         <div className="p-4 border-b flex items-center justify-between">
//           <h4 className="font-semibold">{title}</h4>
//           <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
//         </div>
//         <div className="p-4">{children}</div>
//         {actions && <div className="p-4 border-t flex gap-2 justify-end">{actions}</div>}
//       </div>
//     </div>
//   );
// }

// // --- Main App ---
// export default function App() {
//   const [role, setRole] = useState<Role>("REQUESTOR");
//   const [currentUser, setCurrentUser] = useState(USERS.requestor);
//   const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
//   const [audit, setAudit] = useState<HistoryItem[]>([]);

//   // keep user in sync with role (demo only)
//   const switchRole = (r: Role) => {
//     setRole(r);
//     if (r === "REQUESTOR") setCurrentUser(USERS.requestor);
//     if (r === "APPROVER") setCurrentUser(USERS.approver);
//     if (r === "ADMIN") setCurrentUser(USERS.admin);
//   };

//   const pushAudit = (item: HistoryItem) => setAudit((a) => [{ ...item }, ...a]);

//   // Shared actions
//   const notifyApprover = (ap: Approval) => {
//     const updated: Approval = {
//       ...ap,
//       notified: true,
//       token: ap.token || newToken(),
//       history: [...ap.history, { action: "notified", by: "system", at: nowISO(), note: "email/WA sent" }],
//       lastUpdate: nowISO(),
//     };
//     setApprovals((prev) => prev.map((x) => (x.id === ap.id ? updated : x)));
//     pushAudit({ action: "resent", by: currentUser.name, at: nowISO(), note: `Resend ${ap.id}` });
//     return updated;
//   };

//   const updateStatus = (id: string, status: Status, note?: string, by?: string) => {
//     setApprovals((prev) =>
//       prev.map((ap) => {
//         if (ap.id !== id) return ap;
//         const item: HistoryItem = { action: status === "Approved" ? "approved" : "rejected", by: by || currentUser.name, at: nowISO(), note };
//         return {
//           ...ap,
//           status,
//           notes: status === "Rejected" ? note : undefined,
//           lastUpdate: nowISO(),
//           history: [...ap.history, item],
//         };
//       })
//     );
//     pushAudit({ action: status === "Approved" ? "approved" : "rejected", by: by || currentUser.name, at: nowISO(), note: `${id}` });
//   };

//   const openEvent = (id: string) => {
//     setApprovals((prev) =>
//       prev.map((ap) => (ap.id === id ? { ...ap, history: [...ap.history, { action: "opened", by: currentUser.name, at: nowISO() }], lastUpdate: nowISO() } : ap))
//     );
//     pushAudit({ action: "viewed", by: currentUser.name, at: nowISO(), note: id });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">A</div>
//             <div>
//               <div className="font-semibold">Approval App – UI Prototype</div>
//               <div className="text-xs text-gray-500">Role-based demo per user story</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <select
//               className="rounded-xl border px-3 py-2 text-sm"
//               value={role}
//               onChange={(e) => switchRole(e.target.value as Role)}
//             >
//               <option value="REQUESTOR">Requestor</option>
//               <option value="APPROVER">Approver</option>
//               <option value="ADMIN">Admin Approval</option>
//             </select>
//             <Pill>{currentUser.name}</Pill>
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
//         {role === "REQUESTOR" && (
//           <RequestorView
//             approvals={approvals}
//             setApprovals={setApprovals}
//             currentUser={currentUser}
//             notifyApprover={notifyApprover}
//             openEvent={openEvent}
//             pushAudit={pushAudit}
//           />
//         )}
//         {role === "APPROVER" && (
//           <ApproverView approvals={approvals} onOpen={openEvent} onDecide={updateStatus} />
//         )}
//         {role === "ADMIN" && (
//           <AdminView approvals={approvals} notifyApprover={notifyApprover} onOpen={openEvent} audit={audit} />
//         )}

//         <div className="text-xs text-gray-500 pt-4">
//           Catatan: Ini adalah prototipe UI front‑end untuk kebutuhan desain. Mekanisme otorisasi **wajib** ditegakkan di server/API sesuai aturan akses.
//         </div>
//       </main>
//     </div>
//   );
// }

// // --- REQUESTOR VIEW ---
// function RequestorView({
//   approvals,
//   setApprovals,
//   currentUser,
//   notifyApprover,
//   openEvent,
//   pushAudit,
// }: {
//   approvals: Approval[];
//   setApprovals: React.Dispatch<React.SetStateAction<Approval[]>>;
//   currentUser: { id: string; name: string };
//   notifyApprover: (ap: Approval) => void;
//   openEvent: (id: string) => void;
//   pushAudit: (i: HistoryItem) => void;
// }) {
//   const mine = approvals.filter((a) => a.createdBy === currentUser.id);

//   // form state
//   const [to, setTo] = useState(USERS.approver.name);
//   const [subject, setSubject] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [previewData, setPreviewData] = useState<{ to: string; subject: string; fileName?: string } | null>(null);

//   const valid = subject.trim().length > 3 && !!file && to.trim().length > 0;

//   const submit = () => {
//     if (!valid) return;
//     setPreviewData({ to, subject, fileName: file?.name });
//     setConfirmOpen(true);
//   };

//   const send = () => {
//     const id = `APR-${newId()}`;
//     const ap: Approval = {
//       id,
//       subject,
//       approver: to,
//       requester: currentUser.name,
//       createdBy: currentUser.id,
//       createdAt: nowISO(),
//       status: "Pending",
//       lastUpdate: nowISO(),
//       attachmentName: file?.name,
//       token: newToken(),
//       notified: true,
//       history: [
//         { action: "created", by: currentUser.name, at: nowISO() },
//         { action: "notified", by: "system", at: nowISO(), note: "email/WA sent" },
//       ],
//     };
//     setApprovals((prev) => [ap, ...prev]);
//     pushAudit({ action: "created", by: currentUser.name, at: nowISO(), note: ap.id });
//     setConfirmOpen(false);
//     setSubject("");
//     setFile(null);
//   };

//   const [detail, setDetail] = useState<Approval | null>(null);
//   const [editOpen, setEditOpen] = useState(false);
//   const [editSubject, setEditSubject] = useState("");

//   const startEditResubmit = (ap: Approval) => {
//     setDetail(ap);
//     setEditSubject(ap.subject);
//     setEditOpen(true);
//   };

//   const doResubmit = () => {
//     if (!detail) return;
//     const updated: Approval = {
//       ...detail,
//       subject: editSubject,
//       status: "Pending",
//       notes: undefined,
//       lastUpdate: nowISO(),
//       history: [...detail.history, { action: "edited", by: currentUser.name, at: nowISO() }, { action: "resubmitted", by: currentUser.name, at: nowISO() }],
//     };
//     setApprovals((prev) => prev.map((x) => (x.id === detail.id ? updated : x)));
//     notifyApprover(updated);
//     setEditOpen(false);
//   };

//   return (
//     <div className="grid md:grid-cols-2 gap-6">
//       <Card
//         title="Create Approval"
//         right={<Pill>Requestor</Pill>}
//       >
//         <div className="space-y-3">
//           <div className="grid gap-1">
//             <label className="text-sm text-gray-600">Approval To</label>
//             <input className="border rounded-xl px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Nama Approver" />
//           </div>
//           <div className="grid gap-1">
//             <label className="text-sm text-gray-600">Approval Subject</label>
//             <input className="border rounded-xl px-3 py-2" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Contoh: Pengadaan laptop" />
//           </div>
//           <div className="grid gap-1">
//             <label className="text-sm text-gray-600">File Attachment</label>
//             <input type="file" className="border rounded-xl px-3 py-2" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
//             {file && <span className="text-xs text-gray-500">{file.name}</span>}
//           </div>
//           <div className="pt-2 flex gap-2">
//             <button disabled={!valid} onClick={submit} className={`px-4 py-2 rounded-xl text-white ${valid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-300 cursor-not-allowed"}`}>Confirm</button>
//             <button onClick={() => { setSubject(""); setFile(null); }} className="px-4 py-2 rounded-xl border">Reset</button>
//           </div>
//           <div className="text-xs text-gray-500">Tombol Confirm akan menampilkan ringkasan sebelum dikirim.</div>
//         </div>
//       </Card>

//       <Card title="My Approval Tracking" right={<Pill>Read-only</Pill>}>
//         <RequestorTrackingTable data={mine} onView={(ap) => { setDetail(ap); openEvent(ap.id); }} onEditResubmit={startEditResubmit} />
//       </Card>

//       {/* Detail Modal */}
//       <Modal open={!!detail} onClose={() => setDetail(null)} title={`Detail ${detail?.id || ""}`}
//         actions={<button className="px-4 py-2 rounded-xl border" onClick={() => setDetail(null)}>Close</button>}
//       >
//         {detail && <ApprovalDetail ap={detail} />}
//       </Modal>

//       {/* Confirm Modal */}
//       <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm & Send"
//         actions={
//           <>
//             <button className="px-4 py-2 rounded-xl border" onClick={() => setConfirmOpen(false)}>No</button>
//             <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white" onClick={send}>Yes, Send</button>
//           </>
//         }
//       >
//         <div className="space-y-2 text-sm">
//           <div><span className="font-medium">Approval To:</span> {previewData?.to}</div>
//           <div><span className="font-medium">Subject:</span> {previewData?.subject}</div>
//           <div><span className="font-medium">Attachment:</span> {previewData?.fileName || "(none)"}</div>
//           <div className="text-amber-600">Setelah dikirim, sistem akan mengirim link via email/WA ke approver.</div>
//         </div>
//       </Modal>

//       {/* Edit & Resubmit Modal */}
//       <Modal open={editOpen} onClose={() => setEditOpen(false)} title={`Edit & Resubmit ${detail?.id}`}
//         actions={
//           <>
//             <button className="px-4 py-2 rounded-xl border" onClick={() => setEditOpen(false)}>Cancel</button>
//             <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white" onClick={doResubmit}>Resubmit</button>
//           </>
//         }
//       >
//         <div className="space-y-3">
//           <div className="grid gap-1">
//             <label className="text-sm text-gray-600">Subject</label>
//             <input className="border rounded-xl px-3 py-2" value={editSubject} onChange={(e) => setEditSubject(e.target.value)} />
//           </div>
//           <div className="text-xs text-gray-500">Pengiriman ulang akan mengubah status menjadi <b>Pending</b> dan mengirim notifikasi baru ke Approver.</div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// function RequestorTrackingTable({ data, onView, onEditResubmit }: { data: Approval[]; onView: (a: Approval) => void; onEditResubmit: (a: Approval) => void }) {
//   const [q, setQ] = useState("");
//   const filtered = useMemo(() => data.filter((d) => d.subject.toLowerCase().includes(q.toLowerCase())), [data, q]);
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-2">
//         <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari subject…" className="border rounded-xl px-3 py-2 w-full" />
//       </div>
//       <div className="overflow-auto rounded-xl border">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="text-left p-3">ID</th>
//               <th className="text-left p-3">Subject</th>
//               <th className="text-left p-3">Approver</th>
//               <th className="text-left p-3">Created</th>
//               <th className="text-left p-3">Status</th>
//               <th className="p-3"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((d) => (
//               <tr key={d.id} className="border-t">
//                 <td className="p-3 font-mono text-xs">{d.id}</td>
//                 <td className="p-3">{d.subject}</td>
//                 <td className="p-3">{d.approver}</td>
//                 <td className="p-3">{fmt(d.createdAt)}</td>
//                 <td className="p-3"><StatusBadge status={d.status} /></td>
//                 <td className="p-3 text-right space-x-2 whitespace-nowrap">
//                   <button onClick={() => onView(d)} className="px-3 py-1.5 rounded-lg border">View</button>
//                   {d.status === "Rejected" && (
//                     <button onClick={() => onEditResubmit(d)} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white">Edit & Resubmit</button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {filtered.length === 0 && (
//               <tr>
//                 <td className="p-6 text-center text-gray-500" colSpan={6}>Tidak ada data</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function ApprovalDetail({ ap }: { ap: Approval }) {
//   return (
//     <div className="space-y-3 text-sm">
//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <div className="text-gray-500">ID</div>
//           <div className="font-medium">{ap.id}</div>
//         </div>
//         <div>
//           <div className="text-gray-500">Subject</div>
//           <div className="font-medium">{ap.subject}</div>
//         </div>
//         <div>
//           <div className="text-gray-500">Requester</div>
//           <div className="font-medium">{ap.requester}</div>
//         </div>
//         <div>
//           <div className="text-gray-500">Approver</div>
//           <div className="font-medium">{ap.approver}</div>
//         </div>
//         <div>
//           <div className="text-gray-500">Attachment</div>
//           <div className="font-medium">{ap.attachmentName || "(none)"}</div>
//         </div>
//         <div>
//           <div className="text-gray-500">Status</div>
//           <div className="font-medium"><StatusBadge status={ap.status} /></div>
//         </div>
//       </div>
//       {ap.status === "Rejected" && (
//         <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
//           <div className="font-medium text-red-700">Alasan Penolakan</div>
//           <div className="text-red-700">{ap.notes}</div>
//         </div>
//       )}
//       <div>
//         <div className="text-gray-500 mb-1">Timeline</div>
//         <div className="space-y-2">
//           {ap.history.map((h, idx) => (
//             <div key={idx} className="flex items-start gap-3">
//               <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
//               <div>
//                 <div className="text-xs text-gray-500">{fmt(h.at)}</div>
//                 <div className="text-sm"><span className="font-medium">{h.action}</span> by {h.by} {h.note ? `– ${h.note}` : ""}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- APPROVER VIEW ---
// function ApproverView({ approvals, onOpen, onDecide }: { approvals: Approval[]; onOpen: (id: string) => void; onDecide: (id: string, s: Status, note?: string, by?: string) => void }) {
//   const [tokenInput, setTokenInput] = useState("");
//   const [current, setCurrent] = useState<Approval | null>(null);
//   const [confirm, setConfirm] = useState<{ action: Status; note?: string } | null>(null);

//   const mine = approvals.filter((a) => a.approver === USERS.approver.name);

//   const openByToken = () => {
//     const ap = approvals.find((a) => a.token === tokenInput.trim());
//     if (ap) {
//       setCurrent(ap);
//       onOpen(ap.id);
//     } else {
//       alert("Token tidak valid / kedaluwarsa");
//     }
//   };

//   return (
//     <div className="grid lg:grid-cols-2 gap-6">
//       <Card title="Open via Link (Token)" right={<Pill>Approver</Pill>}>
//         <div className="space-y-3">
//           <div className="grid gap-1">
//             <label className="text-sm text-gray-600">Tempel token dari email/WA</label>
//             <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="contoh: 9f3k1a2b" className="border rounded-xl px-3 py-2" />
//           </div>
//           <div className="flex gap-2">
//             <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white" onClick={openByToken}>Open Link</button>
//             <div className="text-xs text-gray-500 self-center">Simulasi link unik untuk keputusan approve/reject</div>
//           </div>
//         </div>
//       </Card>

//       <Card title="Pending Assigned to Me" right={<Pill>{mine.filter(m=>m.status==='Pending').length} pending</Pill>}>
//         <div className="overflow-auto rounded-xl border">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left p-3">ID</th>
//                 <th className="text-left p-3">Subject</th>
//                 <th className="text-left p-3">Requester</th>
//                 <th className="text-left p-3">Updated</th>
//                 <th className="p-3"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {mine.map((d) => (
//                 <tr key={d.id} className="border-t">
//                   <td className="p-3 font-mono text-xs">{d.id}</td>
//                   <td className="p-3">{d.subject}</td>
//                   <td className="p-3">{d.requester}</td>
//                   <td className="p-3">{fmt(d.lastUpdate)}</td>
//                   <td className="p-3 text-right whitespace-nowrap"><button className="px-3 py-1.5 rounded-lg border" onClick={() => { setCurrent(d); onOpen(d.id); }}>Open</button></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       <Card title="Decision Panel" right={current ? <StatusBadge status={current.status} /> : null}>
//         {current ? (
//           <div className="space-y-4">
//             <ApprovalDetail ap={current} />
//             <div className="flex gap-2 justify-end">
//               <button className="px-4 py-2 rounded-xl border" onClick={() => setCurrent(null)}>Close</button>
//               <button className="px-4 py-2 rounded-xl bg-red-600 text-white" onClick={() => setConfirm({ action: "Rejected" })}>Reject</button>
//               <button className="px-4 py-2 rounded-xl bg-green-600 text-white" onClick={() => setConfirm({ action: "Approved" })}>Approve</button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-gray-500 text-sm">Pilih request dari tabel atau buka via token.</div>
//         )}
//       </Card>

//       <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Confirm your decision"
//         actions={
//           <>
//             <button className="px-4 py-2 rounded-xl border" onClick={() => setConfirm(null)}>No</button>
//             <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => {
//               if (!current || !confirm) return;
//               onDecide(current.id, confirm.action, confirm.note, USERS.approver.name);
//               setCurrent(null);
//               setConfirm(null);
//             }}>Yes, Submit</button>
//           </>
//         }
//       >
//         <div className="space-y-3 text-sm">
//           <div>Anda akan menetapkan keputusan untuk <b>{current?.id}</b> menjadi <b>{confirm?.action}</b>.</div>
//           {confirm?.action === "Rejected" && (
//             <div className="grid gap-1">
//               <label className="text-sm text-gray-600">Alasan (optional/mandatory sesuai kebijakan)</label>
//               <textarea className="border rounded-xl px-3 py-2" rows={3} onChange={(e) => (confirm.note = e.target.value)} />
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// }

// // --- ADMIN VIEW ---
// function AdminView({ approvals, notifyApprover, onOpen, audit }: { approvals: Approval[]; notifyApprover: (a: Approval) => void; onOpen: (id: string) => void; audit: HistoryItem[] }) {
//   const [status, setStatus] = useState<"ALL" | Status>("ALL");
//   const [q, setQ] = useState("");
//   const [detail, setDetail] = useState<Approval | null>(null);

//   const filtered = useMemo(() =>
//     approvals.filter((a) => (status === "ALL" || a.status === status) && (a.subject.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase())))
//   , [approvals, status, q]);

//   const counts = useMemo(() => ({
//     total: approvals.length,
//     pending: approvals.filter(a => a.status === 'Pending').length,
//     approved: approvals.filter(a => a.status === 'Approved').length,
//     rejected: approvals.filter(a => a.status === 'Rejected').length,
//   }), [approvals]);

//   const exportCSV = () => {
//     const rows = [
//       ["ID","Subject","Requester","Approver","Status","Created At","Last Update"],
//       ...filtered.map(a => [a.id, a.subject, a.requester, a.approver, a.status, fmt(a.createdAt), fmt(a.lastUpdate)])
//     ];
//     const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url; a.download = `approvals_export_${Date.now()}.csv`; a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Summary Cards */}
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white rounded-2xl border p-5">
//           <div className="text-sm text-gray-500">Total</div>
//           <div className="text-2xl font-semibold">{counts.total}</div>
//         </div>
//         <div className="bg-white rounded-2xl border p-5">
//           <div className="text-sm text-gray-500">Pending</div>
//           <div className="text-2xl font-semibold">{counts.pending}</div>
//         </div>
//         <div className="bg-white rounded-2xl border p-5">
//           <div className="text-sm text-gray-500">Approved</div>
//           <div className="text-2xl font-semibold">{counts.approved}</div>
//         </div>
//         <div className="bg-white rounded-2xl border p-5">
//           <div className="text-sm text-gray-500">Rejected</div>
//           <div className="text-2xl font-semibold">{counts.rejected}</div>
//         </div>
//       </div>

//       <Card title="Approval Tracking (All)" right={<div className="flex items-center gap-2"><button onClick={exportCSV} className="px-3 py-1.5 rounded-lg border">Export CSV</button></div>}>
//         <div className="flex flex-col md:flex-row md:items-end gap-3 mb-3">
//           <div className="grid gap-1 md:w-64">
//             <label className="text-sm text-gray-600">Cari (ID/Subject)</label>
//             <input className="border rounded-xl px-3 py-2" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari…" />
//           </div>
//           <div className="grid gap-1 w-40">
//             <label className="text-sm text-gray-600">Status</label>
//             <select className="border rounded-xl px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
//               <option value="ALL">All</option>
//               <option value="Pending">Pending</option>
//               <option value="Approved">Approved</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         <div className="overflow-auto rounded-xl border">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left p-3">ID</th>
//                 <th className="text-left p-3">Subject</th>
//                 <th className="text-left p-3">Requester</th>
//                 <th className="text-left p-3">Approver</th>
//                 <th className="text-left p-3">Status</th>
//                 <th className="text-left p-3">Last Update</th>
//                 <th className="p-3"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((d) => (
//                 <tr key={d.id} className="border-t">
//                   <td className="p-3 font-mono text-xs">{d.id}</td>
//                   <td className="p-3">{d.subject}</td>
//                   <td className="p-3">{d.requester}</td>
//                   <td className="p-3">{d.approver}</td>
//                   <td className="p-3"><StatusBadge status={d.status} /></td>
//                   <td className="p-3">{fmt(d.lastUpdate)}</td>
//                   <td className="p-3 text-right whitespace-nowrap space-x-2">
//                     <button className="px-3 py-1.5 rounded-lg border" onClick={() => { setDetail(d); onOpen(d.id); }}>View</button>
//                     <button className="px-3 py-1.5 rounded-lg border" onClick={() => notifyApprover(d)}>Resend</button>
//                   </td>
//                 </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr>
//                   <td className="p-6 text-center text-gray-500" colSpan={7}>Tidak ada data</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       <Card title="Audit Log (Server-side access model – demo)">
//         <div className="overflow-auto rounded-xl border max-h-72">
//           <table className="min-w-full text-xs">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left p-2">Time</th>
//                 <th className="text-left p-2">Action</th>
//                 <th className="text-left p-2">By</th>
//                 <th className="text-left p-2">Note</th>
//               </tr>
//             </thead>
//             <tbody>
//               {audit.map((a, i) => (
//                 <tr key={i} className="border-t">
//                   <td className="p-2">{fmt(a.at)}</td>
//                   <td className="p-2">{a.action}</td>
//                   <td className="p-2">{a.by}</td>
//                   <td className="p-2">{a.note || ""}</td>
//                 </tr>
//               ))}
//               {audit.length === 0 && (
//                 <tr>
//                   <td className="p-6 text-center text-gray-500" colSpan={4}>Belum ada aktivitas</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Detail Modal */}
//       <Modal open={!!detail} onClose={() => setDetail(null)} title={`Detail ${detail?.id || ""}`}
//         actions={<button className="px-4 py-2 rounded-xl border" onClick={() => setDetail(null)}>Close</button>}
//       >
//         {detail && <ApprovalDetail ap={detail} />}
//       </Modal>
//     </div>
//   );
// }
