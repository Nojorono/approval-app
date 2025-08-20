import React, { use, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export default function ApprovalStatus(){
    const location = useLocation();
    const data = location.state;

    useEffect(() => {
        console.log("Data:", data);
    }, []);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Approval Status</h2>
        </div>

        {/* Status Section */}
        <div className={`p-4 rounded-lg mb-6 ${data?.status === 'rejected' ? 'bg-red-50' : 'bg-green-50'}`}>
          <span className={`text-xl font-semibold ${data?.status === 'rejected' ? 'text-red-500' : 'text-green-500'}`}>
            {data?.status === 'rejected' ? 'Request Reject!' : 'Request Approved!'}
          </span>
          <p className="text-gray-600">
            {data?.status === 'rejected'
              ? 'Request has been rejected'
              : 'Request has been successfully approved'}
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-4 text-left">
            <div>
            <strong className="text-gray-700">Approval Request ID</strong>
            <p className="text-gray-600">{data?.data.approvalRequestId}</p>
            </div>
            <div>
            <strong className="text-gray-700">Approver ID</strong>
            <p className="text-gray-600">{data?.data.approverId}</p>
            </div>
            <div>
            <strong className="text-gray-700">Date & Time</strong>
            <p className="text-gray-600">
              {data?.data.createdAt
              ? new Date(data.data.createdAt).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                })
              : '-'}
            </p>
            </div>
            {data?.data.status === 'rejected' && data?.data.reasonRejected && (
            <div>
              <strong className="text-gray-700">Reason Rejected</strong>
              <p className="text-gray-600">{data.data.reasonRejected}</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};


