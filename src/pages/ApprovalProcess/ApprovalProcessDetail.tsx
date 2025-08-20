import { Component, useEffect, useState } from 'react'

import { useStoreApprovalRequest, useStoreUser } from "../../DynamicAPI/stores/Store/MasterStore";
import { useLocation } from "react-router-dom";
import { useAuthStore } from '../../API/store/AuthStore/authStore';

export default function ApprovalProcessDetail() {

  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const { fetchById, detail } = useStoreApprovalRequest();
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    console.log("token",localStorage.getItem("token"))
    if (!localStorage.getItem("token")) {
      throw new Error("Error: Access token not found");
    }
  
    fetchById(data.id);
    console.log("Data fetched:", detail);
  }, [data.id, fetchById]);

  // Render form with dynamic data from detail
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
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 300, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <div style={{ marginBottom: 20, fontWeight: 500, fontSize: 16 }}>Are you sure you want to approve?</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setShowApproveConfirm(false); /* handle approve logic here */ }}
              >
                Yes
              </button>
              <button
                style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setShowApproveConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, minWidth: 320, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 16 }}>Reject Notes:</div>
            <textarea
              value={rejectNotes}
              onChange={e => setRejectNotes(e.target.value)}
              rows={4}
              style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, marginBottom: 20, fontSize: 15 }}
              placeholder="Enter notes for rejection"
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setShowRejectModal(false); setRejectNotes(''); /* handle reject logic here */ }}
              >
                Submit
              </button>
              <button
                style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setShowRejectModal(false); setRejectNotes(''); }}
              >
                Cancel
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
  )
}
