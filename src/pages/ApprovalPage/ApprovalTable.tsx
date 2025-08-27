import React, { useEffect, useState } from 'react';
import ApprovalModal from './ApprovalModal';
import { ApprovalProcessResponse } from '../../DynamicAPI/types/ApprovalProcessTypes';
import axiosInstance from '../../DynamicAPI/AxiosInstance';
import { EnPoint } from '../../utils/EndPoint';
import { useStoreApprovalProcess } from '../../DynamicAPI/stores/Store/MasterStore';
import { FaEye } from 'react-icons/fa';

const ApprovalTable: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<ApprovalProcessResponse | null>(null);
    const userDataString = localStorage.getItem("user_login_data");

    const [approvalDataByApprover, setApprovalDataByApprover] = useState<ApprovalProcessResponse[]>([]);
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
    // Adjust approvalDataByApprover to use response.data.data
    useEffect(() => {
        console.log("User Role:", userRole);
        if (userRole === 'admin' || userRole === 'AUDITOR') {
            fetchApprovalAll()
        } else {
            if (userId) {
                fetchApprovalProcessByApprover(userId);
            }
        }

    }, []);

    const fetchApprovalProcessByApprover = async (userId: string): Promise<void> => {
        const token = localStorage.getItem("token");
        try {
            const response = await axiosInstance.get(
                `${EnPoint}approval-process/by-approver/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (Array.isArray(response.data.data)) {
                setApprovalDataByApprover(response.data.data);
            } else {
                setApprovalDataByApprover([]);
            }
        } catch (error) {
            setApprovalDataByApprover([]);
            console.error("Failed to fetch approval process:", error);
        }
    };

    const fetchApprovalAll = async (): Promise<void> => {
        const token = localStorage.getItem("token");
        try {
            const response = await axiosInstance.get(
                `${EnPoint}approval-process`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (Array.isArray(response.data.data)) {
                setApprovalDataByApprover(response.data.data);
            } else {
                setApprovalDataByApprover([]);
            }
        } catch (error) {
            setApprovalDataByApprover([]);
            console.error("Failed to fetch approval process:", error);
        }
    };

    const filtered = approvalDataByApprover.filter((item) => {
        const { approvalRequest } = item;
        const keyword = search.toLowerCase();
        return (
            approvalRequest.code.toLowerCase().includes(keyword) ||
            approvalRequest.subject.toLowerCase().includes(keyword) ||
            approvalRequest.creator?.username?.toLowerCase().includes(keyword)
        );
    });


    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const paginatedData = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <input
                type="text"
                placeholder="Search by ID, subject or requestor..."
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                }}
            />
            <div>
                <table className="min-w-full table-auto border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 border-b">Code</th>
                            <th className="px-4 py-2 border-b">Subject</th>
                            <th className="px-4 py-2 border-b">Requestor</th>
                            <th className="px-4 py-2 border-b">Status</th>
                            <th className="px-4 py-2 border-b">Last Update</th>
                            <th className="px-4 py-2 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{item.approvalRequest.code}</td>
                                <td className="px-4 py-2 border-b">{item.approvalRequest.subject}</td>
                                <td className="px-4 py-2 border-b">{item.approvalRequest.creator?.username ?? '-'}</td>
                                <td
                                    className={`px-4 py-2 border-b font-semibold`}
                                >
                                    <span
                                        className={`px-2 py-1 rounded-full border font-semibold
                                            ${
                                                item.status === 'approved'
                                                    ? 'text-green-600 border-green-600'
                                                    : item.status === 'rejected'
                                                        ? 'text-red-600 border-red-600'
                                                        : 'text-orange-500 border-orange-500'
                                            }
                                        `}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border-b">{item.approvalRequest.updatedAt}</td>
                                <td className="px-4 py-2 border-b text-center">
                                    <button
                                        className="text-blue-600 hover:underline inline-flex items-center justify-center"
                                        onClick={() => setSelected(item)}
                                    >
                                        <FaEye style={{ color: 'green' }} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <p className="mt-4">No matching results.</p>}
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <div />
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <ApprovalModal data={selected} onClose={() => setSelected(null)} />
        </div>
    );
};

export default ApprovalTable;
