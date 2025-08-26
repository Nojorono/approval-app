import React, { useEffect, useState } from 'react';
import axiosInstance from '../../DynamicAPI/AxiosInstance';
import { EnPoint } from '../../utils/EndPoint';

type ApprovalData = {
    id: string;
    code: string;
    subject: string;
    description: string;
    attachments: string[]; // Array of attachment URLs
    status: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    approverIds: string[];
    frontendUrl: string;
};

// const mockData: ApprovalData[] = [
//     {
//         id: "3e7f7e4f-7172-4de2-9beb-2c477c343779",
//         code: "AR-250826145608",
//         subject: "DIMAS GANTENG",
//         description: "ada",
//         attachments: [
//             "https://nna-app-s3.s3.ap-southeast-3.amazonaws.com/approval-app/uploads/nna.png"
//         ],
//         status: "pending",
//         createdAt: "2025-08-26T00:56:08.658Z",
//         updatedAt: "2025-08-26T00:56:08.667Z",
//         createdBy: "b2c97c19-17c7-43d3-a351-527a190fbe6f",
//         approverIds: [
//             "f00a21ad-0811-473e-89d2-97b23cd29390"
//         ],
//         frontendUrl: "http://10.0.29.47:5173/approval-process/3e7f7e4f-7172-4de2-9beb-2c477c343779?$1?approverId="
//     }
// ];

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

    // Pagination state
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const totalPages = Math.ceil(approvalDataPending.length / pageSize);

    // Slice data for current page
    const pagedData = approvalDataPending.slice((page - 1) * pageSize, page * pageSize);

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
            // Map API response to ApprovalData interface
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
        console.log("User Role:", userRole);
        if (userRole === 'admin') {
            // fetchApprovalAll()
        } else {
            if (userId) {
                fetchApprovalPendingByApprover(userId);
            }
        }

    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {pagedData.map((item) => (
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
                                <b>Requestor:</b> {item.createdBy ?? "Unknown"}
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

            {/* Pagination controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 16 }}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    style={{
                        background: page === 1 ? '#e5e7eb' : '#16a34a',
                        color: page === 1 ? '#888' : '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '8px 18px',
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        boxShadow: '0 1px 4px rgba(22,163,74,0.12)',
                        transition: 'background 0.2s',
                    }}
                >
                    Prev
                </button>
                <span style={{ fontSize: 15, fontWeight: 500 }}>
                    Page {page} from {totalPages}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    style={{
                        background: page === totalPages ? '#e5e7eb' : '#16a34a',
                        color: page === totalPages ? '#888' : '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '8px 18px',
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: page === totalPages ? 'not-allowed' : 'pointer',
                        boxShadow: '0 1px 4px rgba(22,163,74,0.12)',
                        transition: 'background 0.2s',
                    }}
                >
                    Next
                </button>
            </div>

            {selected && (
                <>
                    <div
                        style={{
                            ...modalOverlayStyle,
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                        }}
                        onClick={() => setSelected(null)}
                    >
                        <div style={modalStyle} onClick={e => e.stopPropagation()}>
                            <h2>Approval Detail</h2>
                            <p><b>Code:</b> {selected.code}</p>
                            <p><b>Subject:</b> {selected.subject}</p>
                            <p><b>Description:</b> {selected.description}</p>
                            <p><b>Requestor:</b> {selected.createdBy}</p>
                            <p><b>Attachments:</b></p>
                            <ul>
                                {selected.attachments.map((att, idx) => (
                                    <li key={att}>
                                        <a
                                            href={att}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#2563eb',
                                                textDecoration: 'underline',
                                                fontWeight: 500,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {att}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                                <button
                                    onClick={() => setSelected(null)}
                                    style={{
                                        background: '#dc2626',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '10px 28px',
                                        fontWeight: 500,
                                        fontSize: 15,
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 4px rgba(220,38,38,0.12)',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ApprovalPendingTable;