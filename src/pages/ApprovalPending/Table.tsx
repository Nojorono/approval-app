import React, { useEffect, useState } from 'react';
import axiosInstance from '../../DynamicAPI/AxiosInstance';
import { EnPoint } from '../../utils/EndPoint';
import HistoryTable from './HistoryTable';
import Modal from './Modal';

type ApprovalData = {
    id: string;
    code: string;
    subject: string;
    description: string;
    attachments: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    approverIds: string[];
    frontendUrl: string;
    creator: {
        username: string;
    };
    deletedAt: string | null;
};

const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 16,
    width: 300,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: 16,
    background: '#fff',
};

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
    background: '#fff',
    padding: 24,
    borderRadius: 8,
    minWidth: 320,
    maxWidth: 400,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
};

const ApprovalPendingTable: React.FC = () => {
    const [selected, setSelected] = useState<ApprovalData | null>(null);
    const [approvalDataPending, setApprovalDataPending] = useState<ApprovalData[]>([]);
    const userDataString = localStorage.getItem("user_login_data");
    const [showHistory, setShowHistory] = useState(false);
    let userId: string | undefined = undefined;
    let userRole: string | undefined = undefined;
    if (userDataString) {
        try {
            const userData = JSON.parse(userDataString);
            userId = userData?.user?.id;
            userRole = userData?.user?.role?.name;
        } catch (e) {
            console.error("Failed to parse user_login_data:", e);
        }
    }

    const fetchApprovalPendingByApprover = async (userId: string): Promise<void> => {
        const token = localStorage.getItem("token");
        try {
            const response = await axiosInstance.get(
                `${EnPoint}approval-requests/pending-by-approver/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (Array.isArray(response.data.data)) {
                const mappedData: ApprovalData[] = response.data.data.map((item: any) => ({
                    id: item.id ?? "",
                    code: item.code ?? "",
                    subject: item.subject ?? "",
                    description: item.description ?? "",
                    attachments: Array.isArray(item.attachments)
                        ? item.attachments.map((att: any) => att.url ?? att)
                        : [],
                    status: item.status ?? "",
                    createdAt: item.createdAt ?? "",
                    updatedAt: item.updatedAt ?? "",
                    createdBy: item.createdBy ?? "",
                    approverIds: Array.isArray(item.approverIds) ? item.approverIds : [],
                    frontendUrl: item.frontendUrl ?? "",
                    creator: {
                        username: item.creator.username ?? "",
                    },
                }));
                setApprovalDataPending(mappedData);
            } else {
                setApprovalDataPending([]);
            }
        } catch (error) {
            setApprovalDataPending([]);
            console.error("Failed to fetch approval process:", error);
        }
    };

    useEffect(() => {
        if (userRole === 'admin') {
            // fetchApprovalAll()
            if (userId) {
                fetchApprovalPendingByApprover(userId);
            }
        } else {
            if (userId) {
                fetchApprovalPendingByApprover(userId);
            }
        }
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                position: 'relative',
                width: '100%',
                maxWidth: '100vw',
                boxSizing: 'border-box',
            }}
        >
            {showHistory && (
                <Modal onClose={() => setShowHistory(false)}>
                    <HistoryTable />
                </Modal>
            )}
            {/* History Button */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <button
                    style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '8px 18px',
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(37,99,235,0.12)',
                        zIndex: 10,
                    }}
                    onClick={() => {
                        setShowHistory(true);
                    }}
                >
                    History
                </button>
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: 16,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                {approvalDataPending.map((item) => (
                    <div
                        key={item.code}
                        style={{
                            ...cardStyle,
                            background: '#16a34a',
                            color: '#fff',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 180,
                            justifyContent: 'space-between',
                            flex: '1 1 300px',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{item.subject}</h3>
                            <p style={{ margin: '8px 0 0 0', fontSize: 14 }}>
                                <b>Code:</b> {item.code}
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: 13 }}>
                                <b>Last Update:</b> {item.updatedAt}
                            </p>
                            <p style={{ margin: '4px 0 0 0', fontSize: 13 }}>
                                <b>Requestor:</b> {item.creator.username ?? "Unknown"}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelected(item)}
                            style={{
                                position: 'absolute',
                                right: 16,
                                bottom: 16,
                                background: '#fff',
                                color: '#16a34a',
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 18px',
                                fontWeight: 500,
                                fontSize: 14,
                                cursor: 'pointer',
                                boxShadow: '0 1px 4px rgba(22,163,74,0.12)',
                                transition: 'background 0.2s',
                            }}
                        >
                            Open
                        </button>
                    </div>
                ))}
            </div>

            {selected && (
                <>
                    <div
                        style={{
                            ...modalOverlayStyle,
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                        }}
                        onClick={() => setSelected(null)}
                    >
                        <div
                            style={{
                                ...modalStyle,
                                width: '95vw',
                                maxWidth: 420,
                                boxSizing: 'border-box',
                                fontFamily: 'Segoe UI, Arial, sans-serif',
                                fontSize: 18,
                                color: '#222',
                                background: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{
                                fontSize: 22,
                                marginBottom: 18,
                                fontWeight: 600,
                                borderBottom: '1px solid #e5e7eb',
                                paddingBottom: 10,
                                color: '#1a202c',
                                letterSpacing: 0.5,
                            }}>
                                Approval Detail
                            </h2>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ marginBottom: 8 }}>
                                    <span style={{ fontWeight: 500 }}>Code:</span> <span>{selected.code}</span>
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <span style={{ fontWeight: 500 }}>Subject:</span> <span>{selected.subject}</span>
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <span style={{ fontWeight: 500 }}>Description:</span> <span>{selected.description}</span>
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <span style={{ fontWeight: 500 }}>Requestor:</span> <span>{selected.creator.username ?? "-"}</span>
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <span style={{ fontWeight: 500 }}>Attachments:</span>
                                    <ul style={{ wordBreak: 'break-all', paddingLeft: 18, marginTop: 6 }}>
                                        {selected.attachments.length === 0 ? (
                                            <li style={{ color: '#888', fontSize: 16 }}>No attachments</li>
                                        ) : (
                                            selected.attachments.map((att, idx) => (
                                                <li key={att} style={{ marginBottom: 4 }}>
                                                    <a
                                                        href={att}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: '#2563eb',
                                                            textDecoration: 'underline',
                                                            fontWeight: 500,
                                                            fontSize: 17,
                                                        }}
                                                    >
                                                        {att}
                                                    </a>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
                                <button
                                    onClick={() => setSelected(null)}
                                    style={{
                                        background: '#1a202c', // bg-gray-900
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: '12px 36px',
                                        fontWeight: 600,
                                        fontSize: 18,
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 6px rgba(37,99,235,0.10)',
                                        letterSpacing: 0.5,
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseOver={e => (e.currentTarget.style.background = '#374151')} // hover:bg-gray-700
                                    onMouseOut={e => (e.currentTarget.style.background = '#1a202c')}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <style>
                {`
            @media (max-width: 600px) {
                .approval-card {
                width: 100% !important;
                min-width: 0 !important;
                padding: 12px !important;
                }
            }
            `}
            </style>
        </div>
    )
}

export default ApprovalPendingTable;
