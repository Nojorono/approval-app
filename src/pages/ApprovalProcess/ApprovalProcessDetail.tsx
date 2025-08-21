import { useEffect, useState } from 'react'

import { useStoreApprovalProcess, useStoreApprovalRequest } from "../../DynamicAPI/stores/Store/MasterStore";
import { useLocation, useNavigate } from "react-router-dom";
import { ApprovalProcess } from '../../DynamicAPI/types/ApprovalProcessTypes';
import { showSuccessToast } from '../../components/toast';
import ActIndicator from '../../components/ui/activityIndicator';

export default function ApprovalProcessDetail() {
  const navigate = useNavigate();
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const { fetchById, detail } = useStoreApprovalRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const data = location.state;
  const {
    createData: approvalProcessService,
  } = useStoreApprovalProcess();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      throw new Error("Error: Access token not found");
    }

    fetchById(data.id);
    console.log("Data :", detail);
  }, [data.id, fetchById]);

  const handleSubmit = async (data: ApprovalProcess) => {
    try {
      setIsLoading(true);
      setError(null);
      let submitData = { ...data };
      if (data.status === "approved") {
        delete submitData.reasonRejected;
      } else if (data.status === "rejected") {
        submitData.reasonRejected = rejectNotes;
      }
      await approvalProcessService(submitData);
      // Delay the success toast by 1 second
      setTimeout(() => {
        showSuccessToast("Your submit is successfully!");
      }, 1000);
    } catch (err: any) {
      console.error("submit failed:", err);
      setError(err.message || "Submit failed!");
    } finally {
      setIsLoading(false);
      navigate("/Approval-Process/result", { state: { data: { ...data, createdAt: Date.now() } } });
    }
  };

  // Render form with dynamic data from detail
  if (isLoading) return <ActIndicator />;
  return (
    <div style={{ maxWidth: 600, margin: '24px auto', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0, fontWeight: 600 }}>Decision Panel</h1>
        <span style={{ background: '#f5c542', color: '#fff', borderRadius: 16, padding: '4px 16px', fontWeight: 500, fontSize: 14 }}>
          Status: {detail?.status ? detail.status.charAt(0).toUpperCase() + detail.status.slice(1) : 'Pending'}
        </span>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <span style={{ color: '#888', fontSize: 13 }}>Request Code</span>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{detail?.code || '-'}</div>
        </div>
        <div>
          <span style={{ color: '#888', fontSize: 13 }}>Requestor</span>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{detail?.createdBy || '-'}</div>
        </div>
        <div>
          <span style={{ color: '#888', fontSize: 13 }}>Subject</span>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{detail?.subject || '-'}</div>
        </div>
        <div>
          <span style={{ color: '#888', fontSize: 13 }}>Description</span>
          <div style={{ fontSize: 15 }}>{detail?.description || '-'}</div>
        </div>

        <div>
          <span style={{ color: '#888', fontSize: 13 }}>Attachments</span>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {(detail?.attachments || []).map((url: string, idx: number) => {
              const fileName = url.split('/').pop();
              return (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: 15 }}>
                    {fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setShowApproveConfirm(true)}
          >
            Approve
          </button>
          <button
            style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setShowRejectModal(true)}
          >
            Reject
          </button>
        </div>
      </div>

      {/* Approve Confirmation Popup */}
      {showApproveConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 32,
              minWidth: 320,
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: '#4caf50',
                marginBottom: 6,
                textAlign: 'center',
              }}
            >
              Approve Request
            </div>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{ marginBottom: 4 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="24" fill="#E8F5E9" />
              <path
                d="M34 18L21.5 30.5L14 23"
                stroke="#4caf50"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                color: '#4caf50',
                fontWeight: 500,
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              Are you sure you want to approve this request?
            </div>
            <div
              style={{
                color: '#888',
                fontSize: 13,
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              This action cannot be undone!
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'center' }}>
              <button
                style={{
                  background: '#eee',
                  color: '#333',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 15,
                  transition: 'background 0.2s',
                }}
                onClick={() => setShowApproveConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  background: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 15,
                  transition: 'background 0.2s',
                }}
                onClick={() => {
                  setShowApproveConfirm(false);
                  // handle approve logic here
                  handleSubmit({
                    approverId: data.approverId,
                    approvalRequestId: data.id,
                    status: 'approved',
                  })
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 32,
              minWidth: 340,
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: '#f44336',
                marginBottom: 6,
                textAlign: 'center',
              }}
            >
              Reject Request
            </div>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{ marginBottom: 4 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="24" fill="#FFEBEE" />
              <path
                d="M16 16L32 32M32 16L16 32"
                stroke="#f44336"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                color: '#f44336',
                fontWeight: 500,
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              Are you sure you want to reject this request?
            </div>
            <div
              style={{
                color: '#888',
                fontSize: 13,
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              This action cannot be undone!
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 6,
                marginBottom: 10,
              }}
            >
              <span style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>
                Reason for Rejection
              </span>
              <textarea
                value={rejectNotes}
                onChange={e => setRejectNotes(e.target.value)}
                style={{
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  padding: 8,
                  fontSize: 15,
                  minHeight: 60,
                  resize: 'vertical',
                  width: '100%',
                }}
                placeholder="Enter reason for rejection"
              />
            </div>
            <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'center' }}>
              <button
                style={{
                  background: '#eee',
                  color: '#333',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 15,
                  transition: 'background 0.2s',
                }}
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectNotes('');
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 15,
                  transition: 'background 0.2s',
                }}
                onClick={() => {
                  setShowRejectModal(false);
                  handleSubmit({
                    approverId: data.approverId,
                    approvalRequestId: data.id,
                    status: 'rejected',
                    reasonRejected: rejectNotes,
                  })
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
              @media (max-width: 600px) {
                div[style*="max-width: 600px"] {
                  padding: 8px !important;
                }
                h1 {
                  font-size: 18px !important;
                }
                div[style*="background: #fff"] {
                  padding: 12px !important;
                }
              }
            `}
      </style>
    </div>

  );
}
